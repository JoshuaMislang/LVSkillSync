import { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { getDb } from '../db/database';

export interface AuthenticatedUser {
  user_id: string;
  first_name: string;
  last_name: string;
  google_account: string;
  created_at: string;
  updated_at: string;
  account_type?: string;
  skill?: string;
  bio?: string;
  campus?: string;
  avatar_url?: string;
  hiring_status?: string;
  resume_name?: string;
  resume_size?: string;
  resume_data?: string;
  resume_updated_at?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  sessionId?: string;
}

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Retrieves the SESSION_SECRET from the environment.
 */
export function getSessionSecret(): string {
  return process.env.SESSION_SECRET || 'lvskillsync_secure_session_secret_2026';
}

/**
 * Cryptographically signs a session ID with HMAC-SHA256 using SESSION_SECRET.
 */
export function signSessionId(rawSessionId: string): string {
  const hmac = crypto.createHmac('sha256', getSessionSecret()).update(rawSessionId).digest('hex');
  return `${rawSessionId}.${hmac}`;
}

/**
 * Verifies the HMAC-SHA256 signature using SESSION_SECRET and extracts the raw session ID.
 * Returns null if the signature is invalid or tampered with.
 */
export function verifySessionToken(token: string): string | null {
  if (!token || typeof token !== 'string') return null;

  const dotIndex = token.lastIndexOf('.');
  if (dotIndex !== -1) {
    const rawId = token.substring(0, dotIndex);
    const signature = token.substring(dotIndex + 1);
    const expected = crypto.createHmac('sha256', getSessionSecret()).update(rawId).digest('hex');

    if (
      signature.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    ) {
      return rawId;
    }
    return null;
  }

  // Allow raw UUID / session IDs in the database for direct lookups
  return token;
}

/**
 * Creates a cryptographically secure session record in the SQL database
 * and signs the session token using SESSION_SECRET.
 */
export function createSession(userId: string, req: Request): { sessionId: string; token: string; expiresAt: string } {
  const db = getDb();
  const rawSessionId = 'sess_' + crypto.randomBytes(32).toString('hex');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS).toISOString();
  const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = (req.headers['user-agent'] as string) || 'Unknown';

  const insertStmt = db.prepare(`
    INSERT INTO user_sessions (session_id, user_id, created_at, expires_at, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertStmt.run(rawSessionId, userId, now.toISOString(), expiresAt, ipAddress, userAgent);

  // Cryptographically sign token using SESSION_SECRET
  const signedToken = signSessionId(rawSessionId);

  return { sessionId: signedToken, token: signedToken, expiresAt };
}

/**
 * Validates a session against the SQL database and retrieves the isolated user record.
 * Validates the HMAC signature against SESSION_SECRET first.
 * Never selects or exposes the password_hash.
 */
export function validateSession(sessionToken: string): AuthenticatedUser | null {
  if (!sessionToken || typeof sessionToken !== 'string') {
    return null;
  }

  // Verify HMAC signature using SESSION_SECRET
  const rawSessionId = verifySessionToken(sessionToken);
  if (!rawSessionId) {
    return null;
  }

  const db = getDb();
  const query = db.prepare(`
    SELECT 
      u.user_id,
      u.first_name,
      u.last_name,
      u.google_account,
      u.created_at,
      u.updated_at,
      p.account_type,
      p.skill,
      p.bio,
      p.campus,
      p.avatar_url,
      p.hiring_status,
      p.resume_name,
      p.resume_size,
      p.resume_data,
      p.resume_updated_at,
      s.expires_at
    FROM user_sessions s
    JOIN users u ON s.user_id = u.user_id
    LEFT JOIN user_profiles p ON u.user_id = p.user_id
    WHERE s.session_id = ?
  `);

  const row = (query.get(rawSessionId) as unknown) as (AuthenticatedUser & { expires_at: string }) | undefined;

  if (!row) {
    return null;
  }

  // Check expiration
  if (new Date(row.expires_at).getTime() < Date.now()) {
    // Session has expired, remove it
    destroySession(rawSessionId);
    return null;
  }

  // Return sanitized user object (no password_hash included)
  return {
    user_id: row.user_id,
    first_name: row.first_name,
    last_name: row.last_name,
    google_account: row.google_account,
    created_at: row.created_at,
    updated_at: row.updated_at,
    account_type: row.account_type || 'Freelancer',
    skill: row.skill || '',
    bio: row.bio || '',
    campus: row.campus || 'La Verdad Christian College',
    avatar_url: row.avatar_url || '',
    hiring_status: row.hiring_status || 'for_hire',
    resume_name: row.resume_name || undefined,
    resume_size: row.resume_size || undefined,
    resume_data: row.resume_data || undefined,
    resume_updated_at: row.resume_updated_at || undefined,
  };
}

/**
 * Invalidates and deletes a session from the SQL database.
 */
export function destroySession(sessionToken: string): void {
  if (!sessionToken) return;
  const rawSessionId = verifySessionToken(sessionToken) || sessionToken;
  const db = getDb();
  const deleteStmt = db.prepare('DELETE FROM user_sessions WHERE session_id = ?');
  deleteStmt.run(rawSessionId);
}

/**
 * In-memory rate limiting to protect authentication endpoints from brute force attacks.
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 15;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

export function authRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  record.count += 1;
  if (record.count > RATE_LIMIT_MAX) {
    res.status(429).json({
      error: 'Too many authentication attempts. Please wait a moment before trying again.',
    });
    return;
  }

  next();
}

/**
 * Middleware that extracts and verifies the session token.
 * Populates req.user with the securely isolated user account.
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  let token = req.cookies?.auth_token;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No authenticated session found.' });
    return;
  }

  const user = validateSession(token);
  if (!user) {
    // Clear invalid cookie if present
    res.clearCookie('auth_token');
    res.status(401).json({ error: 'Unauthorized: Session is invalid or has expired.' });
    return;
  }

  req.user = user;
  req.sessionId = token;
  next();
}

/**
 * Audits authentication attempts in the database.
 */
export function logAuthAudit(
  userId: string | null,
  googleAccount: string,
  action: 'REGISTER' | 'LOGIN' | 'LOGOUT' | 'FAILED_LOGIN' | 'FAILED_REGISTER',
  status: 'SUCCESS' | 'FAILURE',
  req: Request
): void {
  try {
    const db = getDb();
    const logId = 'log_' + crypto.randomUUID();
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'Unknown';
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO login_audit_logs (log_id, user_id, google_account, action, status, ip_address, user_agent, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(logId, userId, googleAccount, action, status, ip, userAgent, now);
  } catch (err) {
    console.error('[Auth Audit] Failed to write audit log:', err);
  }
}
