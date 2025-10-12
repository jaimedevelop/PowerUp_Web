// src/features/admin/pages/meets/components/dashboardTabs/flightsTab/services/AdminFlightService.ts

import {
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../../../../../../../firebase/config';
import { handleFirebaseError } from '../../../../../../../../firebase/index';
import { AdminRegistrationView } from '../../../../../../../../services/admin/registrations';
import {
  Flight,
  FlightConfiguration,
  FlightAssignment,
  FlightStats,
  FlightGenerationResult,
} from '../types/flight-types';
import {
  generateFlights,
  validateFlights,
  calculateFlightStats,
} from '../utils/flightAlgorithms';

/**
 * Service for managing flight organization and assignments
 */
export class AdminFlightService {
  
  /**
   * Get flight configuration for a meet
   */
  static async getFlightConfiguration(meetId: string): Promise<FlightConfiguration> {
    try {
      const meetRef = doc(db, 'meets', meetId);
      const meetSnap = await getDoc(meetRef);
      
      if (!meetSnap.exists()) {
        throw new Error('Meet not found');
      }
      
      const data = meetSnap.data();
      const config = data.flightConfiguration;
      
      // Return default configuration if none exists
      if (!config) {
        return {
          athletesPerFlight: 15,
          separateByGender: true,
          priorityOrder: ['weightClass'],
          autoAssignmentEnabled: false,
          locked: false,
        };
      }
      
      // Convert Firestore timestamps to dates
      return {
        ...config,
        lastGeneratedAt: config.lastGeneratedAt?.toDate?.() || undefined,
      };
      
    } catch (error) {
      console.error('Error getting flight configuration:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Save flight configuration for a meet
   */
  static async saveFlightConfiguration(
    meetId: string,
    config: FlightConfiguration
  ): Promise<void> {
    try {
      const meetRef = doc(db, 'meets', meetId);
      
      await updateDoc(meetRef, {
        flightConfiguration: {
          ...config,
          lastGeneratedAt: config.lastGeneratedAt 
            ? Timestamp.fromDate(config.lastGeneratedAt)
            : null,
        },
        updatedAt: Timestamp.fromDate(new Date()),
      });
      
    } catch (error) {
      console.error('Error saving flight configuration:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Get all flights for a meet
   */
  static async getFlights(meetId: string): Promise<Flight[]> {
    try {
      const meetRef = doc(db, 'meets', meetId);
      const meetSnap = await getDoc(meetRef);
      
      if (!meetSnap.exists()) {
        throw new Error('Meet not found');
      }
      
      const data = meetSnap.data();
      const flightsData = data.flights || {};
      
      // Convert flights object to array and parse dates
      const flights: Flight[] = Object.values(flightsData).map((flight: any) => ({
        ...flight,
        assignedAt: flight.assignedAt?.toDate?.() || new Date(),
      }));
      
      // Sort by order
      return flights.sort((a, b) => a.order - b.order);
      
    } catch (error) {
      console.error('Error getting flights:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Get flight assignments for a meet
   */
  static async getFlightAssignments(meetId: string): Promise<Record<string, FlightAssignment>> {
    try {
      const meetRef = doc(db, 'meets', meetId);
      const meetSnap = await getDoc(meetRef);
      
      if (!meetSnap.exists()) {
        throw new Error('Meet not found');
      }
      
      const data = meetSnap.data();
      const assignmentsData = data.flightAssignments || {};
      
      // Convert assignments and parse dates
      const assignments: Record<string, FlightAssignment> = {};
      
      Object.entries(assignmentsData).forEach(([regId, assignment]: [string, any]) => {
        assignments[regId] = {
          ...assignment,
          assignedAt: assignment.assignedAt?.toDate?.() || new Date(),
        };
      });
      
      return assignments;
      
    } catch (error) {
      console.error('Error getting flight assignments:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Auto-generate flights based on approved registrations and configuration
   */
  static async autoGenerateFlights(
    meetId: string,
    registrations: AdminRegistrationView[],
    config: FlightConfiguration
  ): Promise<FlightGenerationResult> {
    try {
      // Filter to only approved registrations
      const approvedRegistrations = registrations.filter(
        r => r.status === 'approved' || r.status === 'confirmed'
      );
      
      if (approvedRegistrations.length === 0) {
        return {
          success: false,
          flights: [],
          assignments: {},
          stats: {
            totalFlights: 0,
            assignedAthletes: 0,
            unassignedAthletes: 0,
            averageFlightSize: 0,
            maleFlights: 0,
            femaleFlights: 0,
          },
          errors: ['No approved registrations to assign'],
        };
      }
      
      // Generate flights using algorithm
      const flights = generateFlights(approvedRegistrations, config);
      
      // Create assignments mapping
      const assignments: Record<string, FlightAssignment> = {};
      const now = new Date();
      
      flights.forEach(flight => {
        flight.athleteIds.forEach(regId => {
          assignments[regId] = {
            registrationId: regId,
            flightId: flight.id,
            assignedAt: now,
            assignedBy: 'auto',
          };
        });
      });
      
      // Save to Firebase
      await this.saveFlightsAndAssignments(meetId, flights, assignments);
      
      // Update configuration
      const updatedConfig: FlightConfiguration = {
        ...config,
        autoAssignmentEnabled: true,
        lastGeneratedAt: now,
      };
      await this.saveFlightConfiguration(meetId, updatedConfig);
      
      // Calculate stats
      const stats = calculateFlightStats(flights, approvedRegistrations.length);
      
      return {
        success: true,
        flights,
        assignments,
        stats,
      };
      
    } catch (error) {
      console.error('Error auto-generating flights:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Save flights and assignments to Firebase
   */
  private static async saveFlightsAndAssignments(
    meetId: string,
    flights: Flight[],
    assignments: Record<string, FlightAssignment>
  ): Promise<void> {
    try {
      const meetRef = doc(db, 'meets', meetId);
      
      // Convert flights array to object keyed by flight ID
      const flightsObject: Record<string, any> = {};
      flights.forEach(flight => {
        flightsObject[flight.id] = {
          ...flight,
          assignedAt: Timestamp.fromDate(flight.assignedAt),
        };
      });
      
      // Convert assignments dates to timestamps
      const assignmentsObject: Record<string, any> = {};
      Object.entries(assignments).forEach(([regId, assignment]) => {
        assignmentsObject[regId] = {
          ...assignment,
          assignedAt: Timestamp.fromDate(assignment.assignedAt),
        };
      });
      
      await updateDoc(meetRef, {
        flights: flightsObject,
        flightAssignments: assignmentsObject,
        updatedAt: Timestamp.fromDate(new Date()),
      });
      
    } catch (error) {
      console.error('Error saving flights and assignments:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Move athlete between flights
   */
  static async moveAthleteBetweenFlights(
    meetId: string,
    registrationId: string,
    fromFlightId: string,
    toFlightId: string
  ): Promise<void> {
    try {
      const meetRef = doc(db, 'meets', meetId);
      const meetSnap = await getDoc(meetRef);
      
      if (!meetSnap.exists()) {
        throw new Error('Meet not found');
      }
      
      const data = meetSnap.data();
      const flights = data.flights || {};
      const assignments = data.flightAssignments || {};
      
      // Remove from old flight
      if (flights[fromFlightId]) {
        flights[fromFlightId].athleteIds = flights[fromFlightId].athleteIds.filter(
          (id: string) => id !== registrationId
        );
        flights[fromFlightId].assignedAt = Timestamp.fromDate(new Date());
      }
      
      // Add to new flight
      if (flights[toFlightId]) {
        if (!flights[toFlightId].athleteIds.includes(registrationId)) {
          flights[toFlightId].athleteIds.push(registrationId);
        }
        flights[toFlightId].assignedAt = Timestamp.fromDate(new Date());
      }
      
      // Update assignment
      assignments[registrationId] = {
        registrationId,
        flightId: toFlightId,
        assignedAt: Timestamp.fromDate(new Date()),
        assignedBy: 'manual',
      };
      
      await updateDoc(meetRef, {
        flights,
        flightAssignments: assignments,
        updatedAt: Timestamp.fromDate(new Date()),
      });
      
    } catch (error) {
      console.error('Error moving athlete between flights:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Unassign athlete from flight
   */
  static async unassignAthlete(meetId: string, registrationId: string): Promise<void> {
    try {
      const meetRef = doc(db, 'meets', meetId);
      const meetSnap = await getDoc(meetRef);
      
      if (!meetSnap.exists()) {
        throw new Error('Meet not found');
      }
      
      const data = meetSnap.data();
      const flights = data.flights || {};
      const assignments = data.flightAssignments || {};
      
      // Find and remove from current flight
      Object.values(flights).forEach((flight: any) => {
        flight.athleteIds = flight.athleteIds.filter((id: string) => id !== registrationId);
        flight.assignedAt = Timestamp.fromDate(new Date());
      });
      
      // Remove assignment
      delete assignments[registrationId];
      
      await updateDoc(meetRef, {
        flights,
        flightAssignments: assignments,
        updatedAt: Timestamp.fromDate(new Date()),
      });
      
    } catch (error) {
      console.error('Error unassigning athlete:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Clear all flights and assignments
   */
  static async clearAllFlights(meetId: string): Promise<void> {
    try {
      const meetRef = doc(db, 'meets', meetId);
      
      await updateDoc(meetRef, {
        flights: {},
        flightAssignments: {},
        'flightConfiguration.autoAssignmentEnabled': false,
        'flightConfiguration.locked': false,
        updatedAt: Timestamp.fromDate(new Date()),
      });
      
    } catch (error) {
      console.error('Error clearing flights:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Get flight statistics
   */
  static async getFlightStats(
    meetId: string,
    totalRegistrations: number
  ): Promise<FlightStats> {
    try {
      const flights = await this.getFlights(meetId);
      return calculateFlightStats(flights, totalRegistrations);
      
    } catch (error) {
      console.error('Error getting flight stats:', error);
      throw handleFirebaseError(error);
    }
  }
  
  /**
   * Validate current flight organization
   */
  static async validateCurrentFlights(
    meetId: string,
    registrations: AdminRegistrationView[]
  ): Promise<any[]> {
    try {
      const flights = await this.getFlights(meetId);
      return validateFlights(flights, registrations);
      
    } catch (error) {
      console.error('Error validating flights:', error);
      throw handleFirebaseError(error);
    }
  }
}