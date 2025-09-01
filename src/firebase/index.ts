// src/firebase/index.ts
// Main Firebase exports for the application

// Firebase configuration and app instance
export { app, db } from './config';
export type { FirebaseConfig } from './config';

// Database operations and types
export {
  // Meet CRUD operations
  createMeet,
  updateMeet,
  getMeetById,
  getMeets,
  deleteMeet,
  
  // Meet query operations
  getMeetsByStatus,
  getUpcomingMeets,
  searchMeets,
  
  // Meet stats operations
  updateMeetStats,
  getMeetStats,
  getAllMeetsStats,
  
  // Utility functions
  validateMeetData,
} from './database';

// Export types
export type {
  MeetLocation,
  BaseMeetData,
  FirestoreMeetData,
  MeetData,
  MeetQueryOptions,
  MeetStats,
  OverallStats,
  ValidationResult,
} from './database';

// Collection constants for use throughout the app
export const COLLECTIONS = {
  MEETS: 'meets',
  REGISTRATIONS: 'registrations',
  DIRECTORS: 'directors',
  COMMUNICATIONS: 'communications',
  PAYMENTS: 'payments',
} as const;

// Firebase status constants
export const MEET_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  REGISTRATION_OPEN: 'registration-open',
  REGISTRATION_CLOSED: 'registration-closed',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
  FAILED: 'failed',
} as const;

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

// Type definitions for status enums
export type MeetStatus = typeof MEET_STATUS[keyof typeof MEET_STATUS];
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
export type ApprovalStatus = typeof APPROVAL_STATUS[keyof typeof APPROVAL_STATUS];

// Error types for consistent error handling
export class FirebaseError extends Error {
  public readonly code: string;
  public readonly details: any;

  constructor(message: string, code: string = 'UNKNOWN', details: any = null) {
    super(message);
    this.name = 'FirebaseError';
    this.code = code;
    this.details = details;
    
    // Maintains proper stack trace for where error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FirebaseError);
    }
  }
}

// Firebase error mapping interface
interface FirebaseErrorMapping {
  [key: string]: string;
}

// Utility function to handle Firebase errors
export const handleFirebaseError = (error: any): FirebaseError => {
  console.error('Firebase Error:', error);
  
  // Map common Firebase errors to user-friendly messages
  const errorMessages: FirebaseErrorMapping = {
    'permission-denied': 'You do not have permission to perform this action.',
    'not-found': 'The requested document was not found.',
    'already-exists': 'A document with this ID already exists.',
    'resource-exhausted': 'Too many requests. Please try again later.',
    'cancelled': 'The operation was cancelled.',
    'unavailable': 'The service is currently unavailable. Please try again later.',
    'deadline-exceeded': 'The operation timed out. Please try again.',
    'invalid-argument': 'Invalid data provided.',
  };
  
  const userMessage = errorMessages[error.code] || error.message || 'An unknown error occurred.';
  
  return new FirebaseError(userMessage, error.code, error);
};

// Development helper functions
export const isDevelopment = (): boolean => import.meta.env.VITE_NODE_ENV === 'development';
export const isEmulatorEnabled = (): boolean => import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';

// Firebase initialization status
let initializationPromise: Promise<boolean> | null = null;

export const ensureFirebaseInitialized = async (): Promise<boolean> => {
  if (!initializationPromise) {
    initializationPromise = new Promise<boolean>((resolve, reject) => {
      try {
        // Firebase is initialized in config.ts when imported
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  return initializationPromise;
};

// Utility types for Firebase operations
export interface FirebaseOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: FirebaseError;
}

// Helper function to wrap Firebase operations with consistent error handling
export const withFirebaseErrorHandling = async <T>(
  operation: () => Promise<T>
): Promise<FirebaseOperationResult<T>> => {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const firebaseError = handleFirebaseError(error);
    return { success: false, error: firebaseError };
  }
};

// Type guard for checking if a value is a Firebase error
export const isFirebaseError = (error: any): error is FirebaseError => {
  return error instanceof FirebaseError;
};