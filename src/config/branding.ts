/**
 * BRANDING & LOGO SOURCE CONFIGURATION
 * 
 * You can modify or replace the logo/icon/image from here in the source code:
 * 
 * 1. Place ANY image file (PNG, JPG, SVG, WebP, GIF, etc.) into the `/public/` directory
 *    (for example: `/public/my-logo.png` or replace `/public/brand-logo.png`).
 * 2. Update `logoImagePath` below with your filename path (e.g. '/my-logo.png').
 * 3. Or provide any direct external image URL if you prefer.
 * 4. To revert to the vector geometry emblem, set `useCustomLogoImage: false`.
 */

export const BRAND_CONFIG = {
  // Brand name displayed across the system
  brandName: 'LVSkillSync',

  // Brand tagline
  brandSubtitle: 'Connecting Skills with Opportunities',

  // Path to your logo image file located in /public or an imported image path / URL.
  // Drop any image file into /public/ and set the path here:
  logoImagePath: '/main_logo.png',

  // Set to true to use your image file above, or false to use the default vector emblem
  useCustomLogoImage: true,
};
