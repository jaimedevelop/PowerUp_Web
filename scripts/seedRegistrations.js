// scripts/seedRegistrations.js
// Script to populate realistic meet registrations for testing

import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs,
  writeBatch, 
  Timestamp,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import readline from 'readline';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================================
// DATA POOLS FOR REALISTIC GENERATION
// ============================================================================

const FIRST_NAMES_MALE = [
  'James', 'Michael', 'Robert', 'John', 'David', 'William', 'Richard', 'Joseph',
  'Thomas', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald',
  'Steven', 'Andrew', 'Paul', 'Joshua', 'Kenneth', 'Kevin', 'Brian', 'George',
  'Timothy', 'Ryan', 'Jason', 'Jeffrey', 'Eric', 'Jacob', 'Nicholas', 'Tyler',
  'Brandon', 'Alexander', 'Jonathan', 'Marcus', 'Austin', 'Derek', 'Trevor'
];

const FIRST_NAMES_FEMALE = [
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan',
  'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra',
  'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Carol', 'Amanda', 'Melissa',
  'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia', 'Kathleen',
  'Amy', 'Angela', 'Samantha', 'Rachel', 'Anna', 'Nicole', 'Emma', 'Olivia'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White',
  'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Hall', 'Allen', 'Young',
  'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green'
];

const RELATIONSHIPS = ['spouse', 'parent', 'sibling', 'friend', 'partner'];

// Weight class distributions (percentages)
const MENS_WEIGHT_CLASSES = {
  '59': 0.08,
  '66': 0.15,
  '74': 0.20,
  '83': 0.25,
  '93': 0.18,
  '105': 0.10,
  '120': 0.04
};

const WOMENS_WEIGHT_CLASSES = {
  '47': 0.05,
  '52': 0.12,
  '57': 0.22,
  '63': 0.25,
  '69': 0.20,
  '76': 0.12,
  '84': 0.04
};

const DIVISIONS = ['Open', 'Junior', 'Sub-Junior', 'Master 1', 'Master 2'];

const EQUIPMENT_TYPES = {
  'Raw': 0.70,
  'Raw with Wraps': 0.20,
  'Single-ply': 0.08,
  'Multi-ply': 0.02
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function weightedRandomChoice(weightedObject) {
  const random = Math.random();
  let cumulative = 0;
  
  for (const [key, weight] of Object.entries(weightedObject)) {
    cumulative += weight;
    if (random <= cumulative) {
      return key;
    }
  }
  
  return Object.keys(weightedObject)[0];
}

function generateDateOfBirth(division) {
  const now = new Date();
  let minAge, maxAge;
  
  switch(division) {
    case 'Sub-Junior':
      minAge = 14;
      maxAge = 18;
      break;
    case 'Junior':
      minAge = 20;
      maxAge = 23;
      break;
    case 'Master 1':
      minAge = 40;
      maxAge = 49;
      break;
    case 'Master 2':
      minAge = 50;
      maxAge = 59;
      break;
    case 'Open':
    default:
      minAge = 24;
      maxAge = 39;
      break;
  }
  
  const age = minAge + Math.floor(Math.random() * (maxAge - minAge + 1));
  const birthYear = now.getFullYear() - age;
  const birthMonth = Math.floor(Math.random() * 12);
  const birthDay = Math.floor(Math.random() * 28) + 1; // Safe for all months
  
  return new Date(birthYear, birthMonth, birthDay);
}

function generateRegistrationDate(meetDate) {
  // Registration spread: Sept 1 - Nov 10, 2025
  const startDate = new Date('2025-09-01');
  const endDate = new Date('2025-11-10');
  
  const timeRange = endDate.getTime() - startDate.getTime();
  const randomTime = Math.random() * timeRange;
  
  return new Date(startDate.getTime() + randomTime);
}

function generatePhoneNumber() {
  const areaCode = 200 + Math.floor(Math.random() * 800);
  const prefix = 200 + Math.floor(Math.random() * 800);
  const lineNumber = 1000 + Math.floor(Math.random() * 9000);
  return `(${areaCode}) ${prefix}-${lineNumber}`;
}

function generateEmail(firstName, lastName) {
  const providers = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'];
  const provider = randomChoice(providers);
  const cleanFirst = firstName.toLowerCase();
  const cleanLast = lastName.toLowerCase();
  
  const formats = [
    `${cleanFirst}.${cleanLast}`,
    `${cleanFirst}${cleanLast}`,
    `${cleanFirst.charAt(0)}${cleanLast}`,
    `${cleanFirst}${Math.floor(Math.random() * 100)}`
  ];
  
  return `${randomChoice(formats)}@${provider}`;
}

function generateMembershipNumber() {
  const year = 2024;
  const number = 10000 + Math.floor(Math.random() * 90000);
  return `${year}-${number}`;
}

function generateExpirationDate() {
  // All memberships expire between Dec 2025 - Dec 2026
  const year = 2025 + Math.floor(Math.random() * 2);
  const month = Math.floor(Math.random() * 12);
  const day = 28; // Safe for all months
  
  return new Date(year, month, day);
}

function generateLotNumber(existingLotNumbers) {
  let lotNumber;
  do {
    lotNumber = Math.floor(Math.random() * 999) + 1;
  } while (existingLotNumbers.has(lotNumber));
  
  existingLotNumbers.add(lotNumber);
  return lotNumber;
}

function generateDivision(age) {
  if (age >= 50) return 'Master 2';
  if (age >= 40) return 'Master 1';
  if (age >= 20 && age <= 23) return 'Junior';
  if (age < 20) return 'Sub-Junior';
  return 'Open';
}

function determinePaymentAndApprovalStatus() {
  const random = Math.random();
  
  if (random < 0.85) {
    // 85% paid and approved
    return {
      paymentStatus: 'paid',
      registrationStatus: 'approved'
    };
  } else if (random < 0.90) {
    // 5% paid but pending approval
    return {
      paymentStatus: 'paid',
      registrationStatus: 'pending'
    };
  } else if (random < 0.95) {
    // 5% unpaid but approved (pay at door)
    return {
      paymentStatus: 'unpaid',
      registrationStatus: 'approved'
    };
  } else if (random < 0.97) {
    // 2% unpaid and pending
    return {
      paymentStatus: 'unpaid',
      registrationStatus: 'pending'
    };
  } else {
    // 3% other statuses
    const statuses = [
      { paymentStatus: 'paid', registrationStatus: 'waitlisted' },
      { paymentStatus: 'paid', registrationStatus: 'checked-in' },
    ];
    return randomChoice(statuses);
  }
}

// ============================================================================
// REGISTRATION GENERATION
// ============================================================================

function generateRegistration(index, meetId, meetData, existingLotNumbers) {
  // Determine gender (60% male, 40% female)
  const gender = Math.random() < 0.6 ? 'male' : 'female';
  
  // Generate name
  const firstName = gender === 'male' 
    ? randomChoice(FIRST_NAMES_MALE) 
    : randomChoice(FIRST_NAMES_FEMALE);
  const lastName = randomChoice(LAST_NAMES);
  
  // Select weight class based on gender
  const weightClass = gender === 'male'
    ? weightedRandomChoice(MENS_WEIGHT_CLASSES)
    : weightedRandomChoice(WOMENS_WEIGHT_CLASSES);
  
  // Generate date of birth first to determine appropriate division
  const tempDob = generateDateOfBirth('Open'); // Temp to get age
  const age = new Date().getFullYear() - tempDob.getFullYear();
  const division = generateDivision(age);
  
  // Regenerate DOB based on division
  const dateOfBirth = generateDateOfBirth(division);
  
  // Select equipment
  const equipment = weightedRandomChoice(EQUIPMENT_TYPES);
  
  // Generate registration date
  const registeredAt = generateRegistrationDate(new Date(meetData.date));
  
  // Generate emergency contact
  const emergencyContactFirstName = Math.random() < 0.5 
    ? randomChoice(FIRST_NAMES_MALE) 
    : randomChoice(FIRST_NAMES_FEMALE);
  const emergencyContactLastName = randomChoice(LAST_NAMES);
  
  const emergencyContact = {
    name: `${emergencyContactFirstName} ${emergencyContactLastName}`,
    phone: generatePhoneNumber(),
    relationship: randomChoice(RELATIONSHIPS),
    email: generateEmail(emergencyContactFirstName, emergencyContactLastName)
  };
  
  // Generate federation membership
  const federationMembership = {
    federation: meetData.federation,
    membershipNumber: generateMembershipNumber(),
    expirationDate: generateExpirationDate()
  };
  
  // Determine payment and approval status
  const { paymentStatus, registrationStatus } = determinePaymentAndApprovalStatus();
  
  // Generate lot number
  const lotNumber = generateLotNumber(existingLotNumbers);
  
  // Create user ID
  const userId = `test-athlete-${String(index).padStart(4, '0')}`;
  const registrationId = `${meetId}_${userId}`;
  
  return {
    id: registrationId,
    meetId,
    userId,
    weightClass,
    division,
    equipment,
    dateOfBirth,
    gender,
    emergencyContact,
    federationMembership,
    hasCoach: false, // No coaches for now
    registrationStatus,
    paymentStatus,
    registeredAt,
    updatedAt: registeredAt,
    lotNumber,
    // Meet director fields - not set yet
    // flight: undefined,
    // platform: undefined,
    // weightInStatus: undefined,
    // actualWeight: undefined,
    // notes: undefined
  };
}

// ============================================================================
// FIREBASE OPERATIONS
// ============================================================================

async function getMeet(meetId) {
  const meetRef = doc(db, 'meets', meetId);
  const meetSnap = await getDoc(meetRef);
  
  if (!meetSnap.exists()) {
    throw new Error(`Meet with ID "${meetId}" not found`);
  }
  
  const data = meetSnap.data();
  
  // Convert Firestore Timestamps to Date objects
  return {
    id: meetSnap.id,
    ...data,
    date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
  };
}

async function clearExistingRegistrations(meetId) {
  console.log('\n🗑️  Clearing existing registrations...');
  
  const registrationsRef = collection(db, 'meets', meetId, 'registrations');
  const snapshot = await getDocs(registrationsRef);
  
  if (snapshot.empty) {
    console.log('   No existing registrations to clear.');
    return 0;
  }
  
  const batchSize = 500;
  let deletedCount = 0;
  let batch = writeBatch(db);
  let operationCount = 0;
  
  for (const docSnapshot of snapshot.docs) {
    batch.delete(docSnapshot.ref);
    operationCount++;
    deletedCount++;
    
    if (operationCount === batchSize) {
      await batch.commit();
      batch = writeBatch(db);
      operationCount = 0;
      console.log(`   Deleted ${deletedCount} registrations...`);
    }
  }
  
  if (operationCount > 0) {
    await batch.commit();
  }
  
  console.log(`   ✅ Cleared ${deletedCount} registrations`);
  return deletedCount;
}

async function saveRegistrations(meetId, registrations, meetData) {
  console.log('\n💾 Saving registrations to Firebase...');
  
  const batchSize = 500;
  let savedCount = 0;
  let batch = writeBatch(db);
  let operationCount = 0;
  
  for (const registration of registrations) {
    const registrationRef = doc(db, 'meets', meetId, 'registrations', registration.id);
    
    // Convert dates to Firestore Timestamps
    const firestoreData = {
      ...registration,
      dateOfBirth: Timestamp.fromDate(registration.dateOfBirth),
      registeredAt: Timestamp.fromDate(registration.registeredAt),
      updatedAt: Timestamp.fromDate(registration.updatedAt),
      federationMembership: {
        ...registration.federationMembership,
        expirationDate: Timestamp.fromDate(registration.federationMembership.expirationDate)
      }
    };
    
    batch.set(registrationRef, firestoreData);
    operationCount++;
    savedCount++;
    
    if (operationCount === batchSize) {
      await batch.commit();
      batch = writeBatch(db);
      operationCount = 0;
      console.log(`   Saved ${savedCount}/${registrations.length} registrations...`);
    }
  }
  
  if (operationCount > 0) {
    await batch.commit();
  }
  
  // Update meet statistics
  console.log('\n📊 Updating meet statistics...');
  const paidCount = registrations.filter(r => r.paymentStatus === 'paid').length;
  const revenue = paidCount * meetData.registrationFee;
  
  const meetRef = doc(db, 'meets', meetId);
  await updateDoc(meetRef, {
    registrations: registrations.length,
    revenue: revenue,
    updatedAt: Timestamp.now()
  });
  
  console.log(`   ✅ Saved ${savedCount} registrations`);
  console.log(`   ✅ Updated meet: ${registrations.length} registrations, $${revenue.toFixed(2)} revenue`);
}

// ============================================================================
// REPORTING
// ============================================================================

function generateReport(registrations) {
  console.log('\n' + '='.repeat(70));
  console.log('📋 REGISTRATION SUMMARY');
  console.log('='.repeat(70));
  
  console.log(`\n📊 Total Registrations: ${registrations.length}`);
  
  // Gender breakdown
  const genderBreakdown = registrations.reduce((acc, r) => {
    acc[r.gender] = (acc[r.gender] || 0) + 1;
    return acc;
  }, {});
  console.log(`\n👥 Gender Distribution:`);
  Object.entries(genderBreakdown).forEach(([gender, count]) => {
    const percentage = ((count / registrations.length) * 100).toFixed(1);
    console.log(`   ${gender}: ${count} (${percentage}%)`);
  });
  
  // Weight class breakdown
  const weightClassBreakdown = registrations.reduce((acc, r) => {
    const key = `${r.gender === 'male' ? 'M' : 'W'}-${r.weightClass}kg`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  console.log(`\n🏋️ Weight Class Distribution:`);
  Object.entries(weightClassBreakdown)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([wc, count]) => {
      console.log(`   ${wc}: ${count}`);
    });
  
  // Division breakdown
  const divisionBreakdown = registrations.reduce((acc, r) => {
    acc[r.division] = (acc[r.division] || 0) + 1;
    return acc;
  }, {});
  console.log(`\n🏆 Division Distribution:`);
  Object.entries(divisionBreakdown).forEach(([division, count]) => {
    console.log(`   ${division}: ${count}`);
  });
  
  // Equipment breakdown
  const equipmentBreakdown = registrations.reduce((acc, r) => {
    acc[r.equipment] = (acc[r.equipment] || 0) + 1;
    return acc;
  }, {});
  console.log(`\n⚙️  Equipment Distribution:`);
  Object.entries(equipmentBreakdown).forEach(([equipment, count]) => {
    console.log(`   ${equipment}: ${count}`);
  });
  
  // Status breakdown
  const statusBreakdown = registrations.reduce((acc, r) => {
    const key = `${r.registrationStatus} / ${r.paymentStatus}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  console.log(`\n✅ Registration Status:`);
  Object.entries(statusBreakdown).forEach(([status, count]) => {
    console.log(`   ${status}: ${count}`);
  });
  
  console.log('\n' + '='.repeat(70));
}

// ============================================================================
// CLI INTERFACE
// ============================================================================

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    meetId: null,
    count: null,
    clear: false
  };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--meetId=')) {
      options.meetId = args[i].split('=')[1];
    } else if (args[i].startsWith('--count=')) {
      options.count = parseInt(args[i].split('=')[1]);
    } else if (args[i] === '--clear') {
      options.clear = true;
    }
  }
  
  return options;
}

function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function prompt(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function confirmAction(rl, message) {
  const answer = await prompt(rl, `${message} (y/n): `);
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log('\n🏋️  PowerLift Registration Seeding Tool');
  console.log('='.repeat(70));
  
  const options = parseArgs();
  const rl = createReadlineInterface();
  
  try {
    // Get meet ID
    let meetId = options.meetId;
    if (!meetId) {
      meetId = await prompt(rl, '\n📍 Enter Meet ID: ');
    }
    
    // Validate meet exists
    console.log(`\n🔍 Validating meet "${meetId}"...`);
    const meet = await getMeet(meetId);
    console.log(`   ✅ Found: "${meet.name}" on ${meet.date.toDateString()}`);
    console.log(`   Federation: ${meet.federation}`);
    console.log(`   Current registrations: ${meet.registrations || 0}`);
    console.log(`   Current revenue: $${(meet.revenue || 0).toFixed(2)}`);
    
    // Check if should clear existing registrations
    let shouldClear = options.clear;
    if (meet.registrations > 0 && !shouldClear) {
      shouldClear = await confirmAction(
        rl, 
        `\n⚠️  This meet has ${meet.registrations} existing registrations. Clear them first?`
      );
    }
    
    if (shouldClear) {
      await clearExistingRegistrations(meetId);
    }
    
    // Get count
    let count = options.count;
    if (!count) {
      const countInput = await prompt(rl, '\n🔢 How many registrations to generate? (default: 50): ');
      count = countInput ? parseInt(countInput) : 50;
    }
    
    if (isNaN(count) || count < 1 || count > 500) {
      throw new Error('Count must be between 1 and 500');
    }
    
    // Confirm generation
    const confirmed = await confirmAction(
      rl,
      `\n✨ Generate ${count} test registrations for "${meet.name}"?`
    );
    
    if (!confirmed) {
      console.log('\n❌ Operation cancelled');
      rl.close();
      process.exit(0);
    }
    
    // Generate registrations
    console.log(`\n🎲 Generating ${count} realistic registrations...`);
    const existingLotNumbers = new Set();
    const registrations = [];
    
    for (let i = 1; i <= count; i++) {
      const registration = generateRegistration(i, meetId, meet, existingLotNumbers);
      registrations.push(registration);
      
      if (i % 10 === 0) {
        process.stdout.write(`\r   Generated ${i}/${count} registrations...`);
      }
    }
    console.log(`\r   ✅ Generated ${count} registrations`);
    
    // Save to Firebase
    await saveRegistrations(meetId, registrations, meet);
    
    // Generate report
    generateReport(registrations);
    
    console.log('\n✅ Seeding complete!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
main();