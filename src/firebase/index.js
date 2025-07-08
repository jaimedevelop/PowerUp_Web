// src/firebase/index.js
// Main Firebase exports for the application

// Firebase configuration and app instance
export { app, db } from './config.js';

// Database operations
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
} from './database.js';

// Collection constants for use throughout the app
export const COLLECTIONS = {
  MEETS: 'meets',
  REGISTRATIONS: 'registrations',
  DIRECTORS: 'directors',
  COMMUNICATIONS: 'communications',
  PAYMENTS: 'payments',
};

// Firebase status constants
export const MEET_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  REGISTRATION_OPEN: 'registration-open',
  REGISTRATION_CLOSED: 'registration-closed',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded',
  FAILED: 'failed',
};

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// Error types for consistent error handling
export class FirebaseError extends Error {
  constructor(message, code = 'UNKNOWN', details = null) {
    super(message);
    this.name = 'FirebaseError';
    this.code = code;
    this.details = details;
  }
}

// Utility function to handle Firebase errors
export const handleFirebaseError = (error) => {
  console.error('Firebase Error:', error);
  
  // Map common Firebase errors to user-friendly messages
  const errorMessages = {
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
export const isDevelopment = () => import.meta.env.VITE_NODE_ENV === 'development';
export const isEmulatorEnabled = () => import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';

// Firebase initialization status
let initializationPromise = null;

export const ensureFirebaseInitialized = async () => {
  if (!initializationPromise) {
    initializationPromise = new Promise((resolve, reject) => {
      try {
        // Firebase is initialized in config.js when imported
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
  
  return initializationPromise;
};