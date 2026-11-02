export type Screen = 
  | 'Splash' 
  | 'Login' 
  | 'Register' 
  | 'Main' 
  | 'JobDetails' 
  | 'Chat' 
  | 'Calculator' 
  | 'Settings' 
  | 'FreelancerProfile';

export type Tab = 'Home' | 'Jobs' | 'Freelancers' | 'Messages' | 'Notifications' | 'Profile';

export type HiringStatus = 'for_hire' | 'hiring' | 'open_to_offers' | 'not_available';

export interface UserResume {
  name: string;
  size: string;
  data: string; // base64 or Data URI
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Freelancer' | 'Client';
  skill?: string;
  rating?: number;
  completedProjects?: number;
  responseRate?: string;
  followers?: number;
  reviews?: number;
  hiring_status?: HiringStatus;
  resume?: UserResume;
  bio?: string;
  campus?: string;
  avatar?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  budget: string;
  deadline: string;
  category: string;
  skills: string[];
  description: string;
  clientName: string;
  isMyPost?: boolean;
  createdAt?: string;
}

export interface FreelancerProject {
  id: string;
  title: string;
  category: string;
  description: string;
  clientRating?: number;
  previewUrl?: string;
}

export interface FreelancerReview {
  id: string;
  clientName: string;
  clientCompany: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Freelancer {
  id: string;
  name: string;
  email?: string;
  skill: string;
  rating: number;
  verified: boolean;
  avatar: string;
  hiring_status?: HiringStatus;
  bio?: string;
  degree?: string;
  campus?: string;
  hourlyRate?: string;
  completedProjects?: number;
  responseRate?: string;
  followers?: number;
  reviewsCount?: number;
  skillsList?: string[];
  projects?: FreelancerProject[];
  reviews?: FreelancerReview[];
}

export interface MessageThread {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'info' | 'warning' | 'promotion';
  is_read?: boolean;
}

export interface RegisteredAccount {
  user_id: string;
  first_name: string;
  last_name: string;
  google_account: string;
  password?: string;
  account_type: 'Freelancer' | 'Client';
  skill?: string;
  campus?: string;
  avatar_url?: string;
  created_at: string;
}
