// Types related to coaches

import { Federation } from '../shared/common-types';

export interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  
  // Coaching Information
  teamName: string;
  position: CoachPosition;
  yearsExperience: ExperienceLevel;
  
  // Certifications
  certifications: CoachCertification[];
  
  // Social & Contact
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
  profileComplete: boolean;
  canPost: boolean; // Coaches can post to feed
}

export interface CoachCertification {
  id: string;
  federation?: Federation;
  certificationName: string;
  certificationNumber?: string;
  level?: string;
  issuedDate?: Date;
  expirationDate?: Date;
  isActive: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export type CoachPosition = 
  | 'head-coach'
  | 'assistant-coach'
  | 'strength-coach'
  | 'events-coach'
  | 'volunteer-coach'
  | 'personal-trainer'
  | 'team-captain';

export type ExperienceLevel = 
  | '0-2'
  | '3-5'
  | '6-10'
  | '11-15'
  | '16+';

// Team/Organization structure
export interface Team {
  id: string;
  name: string;
  type: TeamType;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  headCoachId: string;
  coachIds: string[];
  athleteIds: string[];
  description?: string;
  founded?: Date;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type TeamType = 
  | 'high-school'
  | 'college'
  | 'club'
  | 'professional'
  | 'community'
  | 'gym'
  | 'online';

// Coach-Athlete relationship
export interface CoachingRelationship {
  id: string;
  coachId: string;
  athleteId: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'inactive' | 'pending';
  monthlyFee?: number;
  paymentStatus?: 'current' | 'overdue' | 'suspended';
  specialization?: string[];
  notes?: string;
  createdAt: Date;
}

// Coach dashboard stats
export interface CoachStats {
  totalAthletes: number;
  activeAthletes: number;
  totalPosts: number;
  totalFollowers: number;
  monthlyRevenue: number;
  upcomingMeets: number;
  recentAchievements: CoachAchievement[];
}

export interface CoachAchievement {
  id: string;
  type: 'athlete-pr' | 'competition-win' | 'certification' | 'milestone';
  description: string;
  athleteId?: string;
  achievedAt: Date;
}

// Post types for coaches (since they can post to feed)
export interface CoachPost {
  id: string;
  coachId: string;
  type: 'achievement' | 'educational' | 'announcement' | 'program-share';
  title: string;
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    caption?: string;
  }[];
  tags?: string[];
  visibility: 'public' | 'followers' | 'team';
  createdAt: Date;
  updatedAt: Date;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}