// src/features/admin/pages/meets/components/dashboardTabs/flightsTab/utils/flightAlgorithms.ts

import { AdminRegistrationView } from '../../../../../../../../services/admin/registrations';
import { 
  Flight, 
  FlightConfiguration, 
  FlightValidationIssue,
  WeightClassGroup
} from '../types/flight-types';

/**
 * Main function to auto-generate flights from registrations
 */
export function generateFlights(
  registrations: AdminRegistrationView[],
  config: FlightConfiguration
): Flight[] {
  const flights: Flight[] = [];
  let flightIndex = 0;

  // Separate by gender if configured
  const genderGroups = config.separateByGender 
    ? groupByGender(registrations)
    : { 'mixed': registrations };

  // Process each gender group
  Object.entries(genderGroups).forEach(([gender, athletes]) => {
    if (athletes.length === 0) return;

    // Sort by weight class to keep similar weights together
    const sorted = sortByWeightClass(athletes);

    // Calculate optimal number of flights for this group
    const flightCount = calculateOptimalFlightCount(
      sorted.length, 
      config.athletesPerFlight
    );

    // Distribute athletes into flights
    const genderFlights = distributeIntoFlights(
      sorted,
      flightCount,
      gender as 'male' | 'female',
      flightIndex
    );

    flights.push(...genderFlights);
    flightIndex += genderFlights.length;
  });

  return flights;
}

/**
 * Group registrations by gender
 */
export function groupByGender(
  registrations: AdminRegistrationView[]
): Record<'male' | 'female', AdminRegistrationView[]> {
  const groups: Record<'male' | 'female', AdminRegistrationView[]> = {
    male: [],
    female: []
  };

  registrations.forEach(reg => {
    groups[reg.athleteInfo.gender].push(reg);
  });

  return groups;
}

/**
 * Sort athletes by weight class (lightest to heaviest)
 */
export function sortByWeightClass(
  registrations: AdminRegistrationView[]
): AdminRegistrationView[] {
  return [...registrations].sort((a, b) => {
    const weightA = parseWeightClass(a.competitionInfo.weightClass);
    const weightB = parseWeightClass(b.competitionInfo.weightClass);
    return weightA - weightB;
  });
}

/**
 * Parse weight class string to numeric value for sorting
 * Handles formats like "74kg", "83kg", "120+kg"
 */
function parseWeightClass(weightClass: string): number {
  // Remove 'kg' and handle '+' for super heavyweight
  const cleaned = weightClass.toLowerCase().replace('kg', '').replace('+', '');
  const numeric = parseFloat(cleaned);
  
  // If it has a '+', add a large number to sort it last
  if (weightClass.includes('+')) {
    return numeric + 1000;
  }
  
  return numeric || 999; // Default to high number if can't parse
}

/**
 * Calculate optimal number of flights based on total athletes and target size
 */
export function calculateOptimalFlightCount(
  totalAthletes: number,
  targetSize: number
): number {
  if (totalAthletes === 0) return 0;
  if (totalAthletes <= targetSize) return 1;
  
  // Round up to ensure we don't exceed target size
  return Math.ceil(totalAthletes / targetSize);
}

/**
 * Distribute athletes evenly into flights
 */
export function distributeIntoFlights(
  registrations: AdminRegistrationView[],
  flightCount: number,
  gender: 'male' | 'female',
  startIndex: number
): Flight[] {
  const flights: Flight[] = [];
  const athletesPerFlight = Math.ceil(registrations.length / flightCount);

  for (let i = 0; i < flightCount; i++) {
    const start = i * athletesPerFlight;
    const end = start + athletesPerFlight;
    const athletesInFlight = registrations.slice(start, end);

    if (athletesInFlight.length === 0) continue;

    const flightLetter = String.fromCharCode(65 + startIndex + i); // A, B, C, etc.
    const flightId = `flight-${flightLetter.toLowerCase()}`;

    flights.push({
      id: flightId,
      name: `Flight ${flightLetter}`,
      gender,
      athleteIds: athletesInFlight.map(a => a.id),
      assignedAt: new Date(),
      order: startIndex + i
    });
  }

  return flights;
}

/**
 * Validate flights and return any issues found
 */
export function validateFlights(
  flights: Flight[],
  registrations: AdminRegistrationView[]
): FlightValidationIssue[] {
  const issues: FlightValidationIssue[] = [];

  // Check for unassigned athletes
  const assignedIds = new Set(flights.flatMap(f => f.athleteIds));
  const unassignedCount = registrations.filter(r => !assignedIds.has(r.id)).length;
  
  if (unassignedCount > 0) {
    issues.push({
      type: 'unassigned-athletes',
      message: `${unassignedCount} athlete(s) not assigned to any flight`,
      severity: 'warning'
    });
  }

  // Check each flight
  flights.forEach(flight => {
    // Empty flight check
    if (flight.athleteIds.length === 0) {
      issues.push({
        flightId: flight.id,
        type: 'empty-flight',
        message: `${flight.name} has no athletes assigned`,
        severity: 'warning'
      });
    }

    // Oversized flight check
    if (flight.athleteIds.length > 20) {
      issues.push({
        flightId: flight.id,
        type: 'size-warning',
        message: `${flight.name} has ${flight.athleteIds.length} athletes (recommended max: 20)`,
        severity: 'warning'
      });
    }

    // Gender mixing check
    const athletesInFlight = registrations.filter(r => flight.athleteIds.includes(r.id));
    const genders = new Set(athletesInFlight.map(a => a.athleteInfo.gender));
    
    if (genders.size > 1) {
      issues.push({
        flightId: flight.id,
        type: 'gender-mix',
        message: `${flight.name} contains mixed genders`,
        severity: 'error'
      });
    }
  });

  return issues;
}

/**
 * Group athletes by weight class for analysis
 */
export function groupByWeightClass(
  registrations: AdminRegistrationView[]
): WeightClassGroup[] {
  const groups: Record<string, AdminRegistrationView[]> = {};

  registrations.forEach(reg => {
    const wc = reg.competitionInfo.weightClass;
    if (!groups[wc]) {
      groups[wc] = [];
    }
    groups[wc].push(reg);
  });

  return Object.entries(groups)
    .map(([weightClass, athletes]) => ({
      weightClass,
      athletes,
      count: athletes.length
    }))
    .sort((a, b) => parseWeightClass(a.weightClass) - parseWeightClass(b.weightClass));
}

/**
 * Calculate statistics about current flight organization
 */
export function calculateFlightStats(
  flights: Flight[],
  totalRegistrations: number
): {
  totalFlights: number;
  assignedAthletes: number;
  unassignedAthletes: number;
  averageFlightSize: number;
  maleFlights: number;
  femaleFlights: number;
} {
  const assignedAthletes = flights.reduce((sum, f) => sum + f.athleteIds.length, 0);
  
  return {
    totalFlights: flights.length,
    assignedAthletes,
    unassignedAthletes: totalRegistrations - assignedAthletes,
    averageFlightSize: flights.length > 0 
      ? Math.round((assignedAthletes / flights.length) * 10) / 10 
      : 0,
    maleFlights: flights.filter(f => f.gender === 'male').length,
    femaleFlights: flights.filter(f => f.gender === 'female').length
  };
}