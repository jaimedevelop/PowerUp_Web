// src/features/admin/pages/meets/components/dashboardTabs/flightsTab/types/flight-types.ts

import { AdminRegistrationView } from '../../../../../../../../services/admin/registrations';

/**
 * Flight configuration settings stored at meet level
 */
export interface FlightConfiguration {
  athletesPerFlight: number; // Target number of athletes per flight (default: 15)
  separateByGender: boolean; // Whether to separate men and women into different flights (default: true)
  priorityOrder: ['weightClass']; // Priority for grouping (FUTURE: add 'equipment', 'division')
  autoAssignmentEnabled: boolean; // Whether auto-generation has been used
  locked: boolean; // When true, prevents manual changes to flights
  lastGeneratedAt?: Date; // Timestamp of last auto-generation
}

/**
 * Individual flight data structure
 */
export interface Flight {
  id: string; // Unique identifier (e.g., 'flight-a', 'flight-b')
  name: string; // Display name (e.g., 'Flight A', 'Flight B')
  gender: 'male' | 'female'; // Gender restriction for this flight
  athleteIds: string[]; // Array of registration IDs assigned to this flight
  assignedAt: Date; // Timestamp of when flight was created/last modified
  order: number; // Display order (0, 1, 2, ...)
  platform?: number; // FUTURE: For multi-platform meets
}

/**
 * Individual athlete-to-flight assignment record
 */
export interface FlightAssignment {
  registrationId: string; // Reference to registration ID
  flightId: string; // Reference to flight ID
  assignedAt: Date; // When the assignment was made
  assignedBy: 'auto' | 'manual'; // Whether assigned by auto-generation or manually
}

/**
 * Validation issue found in flight organization
 */
export interface FlightValidationIssue {
  flightId?: string; // The flight with the issue (undefined for global issues)
  type: 'size-warning' | 'gender-mix' | 'empty-flight' | 'unassigned-athletes';
  message: string; // Human-readable description of the issue
  severity: 'warning' | 'error'; // How serious the issue is
}

/**
 * Statistics about flight organization
 */
export interface FlightStats {
  totalFlights: number; // Total number of flights created
  assignedAthletes: number; // Number of athletes assigned to flights
  unassignedAthletes: number; // Number of approved athletes not yet assigned
  averageFlightSize: number; // Average athletes per flight
  maleFlights: number; // Number of male flights
  femaleFlights: number; // Number of female flights
}

/**
 * Extended registration view with flight information
 */
export interface RegistrationWithFlight extends AdminRegistrationView {
  flightId?: string;
  flightName?: string;
  assignedToFlightAt?: Date;
}

/**
 * Result of auto-generation operation
 */
export interface FlightGenerationResult {
  success: boolean;
  flights: Flight[];
  assignments: Record<string, FlightAssignment>; // registrationId -> assignment
  stats: FlightStats;
  errors?: string[];
}

/**
 * Weight class group for flight organization
 */
export interface WeightClassGroup {
  weightClass: string;
  athletes: AdminRegistrationView[];
  count: number;
}