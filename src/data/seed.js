import { seedClientsForMatchmaker } from '@/firebase/firestore'

/**
 * Seed data for the test matchmaker account.
 *
 * These 25 clients represent a realistic matchmaker's caseload:
 * - Mix of male and female
 * - Mix of cities, religions, ages
 * - Mix of status tags (Active, New, On Hold, Matched)
 * - Five clients have pre-existing notes
 * - Three clients have pre-populated sentMatches arrays
 * - Three clients are NRI
 *
 * To seed: open browser console on any authenticated page and run:
 *   import('@/data/seed.js').then(m => m.seedDatabase('YOUR_UID_HERE'))
 */

const SAMPLE_CLIENTS = [
  // Existing 12 clients from Phase 2
  {
    statusTag: 'Active',
    personal: {
      firstName: 'Arjun', lastName: 'Sharma', gender: 'Male',
      dob: '1993-04-15', country: 'India', city: 'Mumbai',
      heightCm: 178, email: 'arjun.sharma@example.com', phone: '+91 98765 43210',
      religion: 'Hindu', caste: 'Brahmin', motherTongue: 'Hindi',
      manglik: 'No', maritalStatus: 'Never Married', complexion: 'Wheatish',
      dietaryPref: 'Non-Vegetarian', smoking: 'Never', drinking: 'Occasionally',
      languagesKnown: ['English', 'Hindi', 'Marathi'], photoUrl: null,
    },
    professional: {
      college: 'IIT Bombay', degree: 'B.Tech Computer Science',
      company: 'Google', designation: 'Senior Software Engineer',
      annualIncomeLakh: 42, nriStatus: false, workCity: 'Mumbai',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'Maybe', openToPets: 'Yes',
      partnerAgeMin: 26, partnerAgeMax: 31,
      partnerHeightMinCm: 152, partnerIncomeMinLakh: 8,
    },
    family: {
      fatherOccupation: 'Government Service', motherOccupation: 'Homemaker',
      brothers: 1, sisters: 0,
      familyType: 'Nuclear', familyIncomeLakh: 60, familyValues: 'Moderate',
    },
    notes: [
      {
        id: 'note_001',
        text: 'Met on 15th March. Very focused on career alignment. Prefers someone based in Mumbai or open to shifting.',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'seed',
      },
    ],
    sentMatches: [],
  },
  {
    statusTag: 'Active',
    personal: {
      firstName: 'Priya', lastName: 'Mehta', gender: 'Female',
      dob: '1996-08-22', country: 'India', city: 'Delhi',
      heightCm: 163, email: 'priya.mehta@example.com', phone: '+91 87654 32109',
      religion: 'Hindu', caste: 'Vaishya', motherTongue: 'Gujarati',
      manglik: 'No', maritalStatus: 'Never Married', complexion: 'Fair',
      dietaryPref: 'Vegetarian', smoking: 'Never', drinking: 'Never',
      languagesKnown: ['English', 'Hindi', 'Gujarati'], photoUrl: null,
    },
    professional: {
      college: 'SRCC Delhi', degree: 'B.Com / CA',
      company: 'Deloitte', designation: 'Senior Consultant',
      annualIncomeLakh: 22, nriStatus: false, workCity: 'Delhi',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'Yes', openToPets: 'Maybe',
      partnerAgeMin: 27, partnerAgeMax: 34,
      partnerHeightMinCm: 170, partnerIncomeMinLakh: 20,
    },
    family: {
      fatherOccupation: 'Business', motherOccupation: 'Homemaker',
      brothers: 1, sisters: 1,
      familyType: 'Joint', familyIncomeLakh: 80, familyValues: 'Moderate',
    },
    notes: [
      {
        id: 'note_002',
        text: 'Very clear about wanting a match in Delhi or willing to go to Mumbai. Values family dinners and cultural festivals. Finance background preferred.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'seed',
      },
    ],
    sentMatches: ['pool_male_003', 'pool_male_007'],
  },
  {
    statusTag: 'New',
    personal: {
      firstName: 'Rohit', lastName: 'Verma', gender: 'Male',
      dob: '1991-12-03', country: 'India', city: 'Bangalore',
      heightCm: 174, email: 'rohit.verma@example.com', phone: '+91 76543 21098',
      religion: 'Hindu', caste: 'Kayastha', motherTongue: 'Hindi',
      manglik: 'Dont Know', maritalStatus: 'Never Married', complexion: 'Wheatish Brown',
      dietaryPref: 'Non-Vegetarian', smoking: 'Never', drinking: 'Occasionally',
      languagesKnown: ['English', 'Hindi', 'Kannada'], photoUrl: null,
    },
    professional: {
      college: 'IIM Bangalore', degree: 'MBA Finance',
      company: 'JP Morgan', designation: 'Vice President',
      annualIncomeLakh: 65, nriStatus: false, workCity: 'Bangalore',
    },
    preferences: {
      wantKids: 'Maybe', openToRelocate: 'No', openToPets: 'No',
      partnerAgeMin: 27, partnerAgeMax: 33,
      partnerHeightMinCm: 155, partnerIncomeMinLakh: 10,
    },
    family: {
      fatherOccupation: 'Government Service', motherOccupation: 'Teacher',
      brothers: 0, sisters: 1,
      familyType: 'Nuclear', familyIncomeLakh: 70, familyValues: 'Liberal',
    },
    notes: [],
    sentMatches: [],
  },
  {
    statusTag: 'Active',
    personal: {
      firstName: 'Ananya', lastName: 'Nair', gender: 'Female',
      dob: '1994-03-18', country: 'India', city: 'Bangalore',
      heightCm: 160, email: 'ananya.nair@example.com', phone: '+91 65432 10987',
      religion: 'Hindu', caste: 'Nair', motherTongue: 'Malayalam',
      manglik: 'No', maritalStatus: 'Never Married', complexion: 'Fair',
      dietaryPref: 'Non-Vegetarian', smoking: 'Never', drinking: 'Occasionally',
      languagesKnown: ['English', 'Malayalam', 'Hindi', 'Kannada'], photoUrl: null,
    },
    professional: {
      college: 'BITS Pilani', degree: 'B.Tech Computer Science',
      company: 'Amazon', designation: 'Product Manager',
      annualIncomeLakh: 38, nriStatus: false, workCity: 'Bangalore',
    },
    preferences: {
      wantKids: 'Maybe', openToRelocate: 'Yes', openToPets: 'Yes',
      partnerAgeMin: 28, partnerAgeMax: 36,
      partnerHeightMinCm: 168, partnerIncomeMinLakh: 25,
    },
    family: {
      fatherOccupation: 'Government Service', motherOccupation: 'Government Service',
      brothers: 1, sisters: 0,
      familyType: 'Nuclear', familyIncomeLakh: 55, familyValues: 'Moderate',
    },
    notes: [],
    sentMatches: [],
  },
  {
    statusTag: 'On Hold',
    personal: {
      firstName: 'Vikram', lastName: 'Singh', gender: 'Male',
      dob: '1989-07-10', country: 'USA', city: 'San Francisco',
      heightCm: 182, email: 'vikram.singh@example.com', phone: '+1 415 555 0123',
      religion: 'Sikh', caste: 'Jat', motherTongue: 'Punjabi',
      manglik: 'No', maritalStatus: 'Divorced', complexion: 'Wheatish',
      dietaryPref: 'Non-Vegetarian', smoking: 'Never', drinking: 'Occasionally',
      languagesKnown: ['English', 'Punjabi', 'Hindi'], photoUrl: null,
    },
    professional: {
      college: 'IIT Delhi', degree: 'B.Tech Electrical Engineering',
      company: 'Stripe', designation: 'Engineering Manager',
      annualIncomeLakh: 180, nriStatus: true, workCity: 'San Francisco',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'Yes', openToPets: 'Yes',
      partnerAgeMin: 28, partnerAgeMax: 36,
      partnerHeightMinCm: 155, partnerIncomeMinLakh: 15,
    },
    family: {
      fatherOccupation: 'Business', motherOccupation: 'Homemaker',
      brothers: 1, sisters: 1,
      familyType: 'Joint', familyIncomeLakh: 200, familyValues: 'Moderate',
    },
    notes: [
      {
        id: 'note_003',
        text: 'On hold per client request — visiting India in November. Resume search then.',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'seed',
      },
    ],
    sentMatches: [],
  },
  {
    statusTag: 'Matched',
    personal: {
      firstName: 'Sneha', lastName: 'Iyer', gender: 'Female',
      dob: '1995-11-28', country: 'India', city: 'Chennai',
      heightCm: 158, email: 'sneha.iyer@example.com', phone: '+91 54321 09876',
      religion: 'Hindu', caste: 'Brahmin', motherTongue: 'Tamil',
      manglik: 'No', maritalStatus: 'Never Married', complexion: 'Fair',
      dietaryPref: 'Vegetarian', smoking: 'Never', drinking: 'Never',
      languagesKnown: ['English', 'Tamil', 'Hindi'], photoUrl: null,
    },
    professional: {
      college: 'AIIMS Delhi', degree: 'MBBS',
      company: 'Apollo Hospitals', designation: 'Doctor (Resident)',
      annualIncomeLakh: 14, nriStatus: false, workCity: 'Chennai',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'Maybe', openToPets: 'No',
      partnerAgeMin: 28, partnerAgeMax: 35,
      partnerHeightMinCm: 165, partnerIncomeMinLakh: 12,
    },
    family: {
      fatherOccupation: 'Government Service', motherOccupation: 'Teacher',
      brothers: 0, sisters: 1,
      familyType: 'Nuclear', familyIncomeLakh: 40, familyValues: 'Traditional',
    },
    notes: [
      {
        id: 'note_004',
        text: 'Successfully matched with Karthik Rao on 10th Oct. Intro done. Follow up in 2 weeks.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'seed',
      },
    ],
    sentMatches: ['pool_male_012'],
  },
  {
    statusTag: 'Active',
    personal: {
      firstName: 'Kabir', lastName: 'Khan', gender: 'Male',
      dob: '1992-06-14', country: 'India', city: 'Mumbai',
      heightCm: 176, email: 'kabir.khan@example.com', phone: '+91 91234 56789',
      religion: 'Muslim', caste: 'Syed', motherTongue: 'Urdu',
      manglik: 'No', maritalStatus: 'Never Married', complexion: 'Wheatish',
      dietaryPref: 'Non-Vegetarian', smoking: 'Occasionally', drinking: 'Never',
      languagesKnown: ['English', 'Urdu', 'Hindi'], photoUrl: null,
    },
    professional: {
      college: 'Symbiosis Pune', degree: 'MBA Marketing',
      company: 'Hindustan Unilever', designation: 'Brand Manager',
      annualIncomeLakh: 28, nriStatus: false, workCity: 'Mumbai',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'No', openToPets: 'Maybe',
      partnerAgeMin: 25, partnerAgeMax: 30,
      partnerHeightMinCm: 153, partnerIncomeMinLakh: 5,
    },
    family: {
      fatherOccupation: 'Business', motherOccupation: 'Homemaker',
      brothers: 2, sisters: 1,
      familyType: 'Joint', familyIncomeLakh: 50, familyValues: 'Moderate',
    },
    notes: [],
    sentMatches: [],
  },
  {
    statusTag: 'New',
    personal: {
      firstName: 'Divya', lastName: 'Reddy', gender: 'Female',
      dob: '1997-02-07', country: 'India', city: 'Hyderabad',
      heightCm: 162, email: 'divya.reddy@example.com', phone: '+91 80123 45678',
      religion: 'Hindu', caste: 'Kshatriya', motherTongue: 'Telugu',
      manglik: 'Yes', maritalStatus: 'Never Married', complexion: 'Wheatish Brown',
      dietaryPref: 'Non-Vegetarian', smoking: 'Never', drinking: 'Never',
      languagesKnown: ['English', 'Telugu', 'Hindi'], photoUrl: null,
    },
    professional: {
      college: 'BITS Hyderabad', degree: 'B.Tech Information Technology',
      company: 'Microsoft', designation: 'Software Engineer II',
      annualIncomeLakh: 32, nriStatus: false, workCity: 'Hyderabad',
    },
    preferences: {
      wantKids: 'Maybe', openToRelocate: 'Yes', openToPets: 'Yes',
      partnerAgeMin: 28, partnerAgeMax: 35,
      partnerHeightMinCm: 168, partnerIncomeMinLakh: 25,
    },
    family: {
      fatherOccupation: 'Government Service', motherOccupation: 'Teacher',
      brothers: 1, sisters: 0,
      familyType: 'Nuclear', familyIncomeLakh: 45, familyValues: 'Moderate',
    },
    notes: [],
    sentMatches: [],
  },
  {
    statusTag: 'Active',
    personal: {
      firstName: 'Gaurav', lastName: 'Patel', gender: 'Male',
      dob: '1990-09-25', country: 'India', city: 'Ahmedabad',
      heightCm: 170, email: 'gaurav.patel@example.com', phone: '+91 70987 65432',
      religion: 'Jain', caste: 'Shvetambar', motherTongue: 'Gujarati',
      manglik: 'No', maritalStatus: 'Never Married', complexion: 'Fair',
      dietaryPref: 'Jain', smoking: 'Never', drinking: 'Never',
      languagesKnown: ['English', 'Gujarati', 'Hindi'], photoUrl: null,
    },
    professional: {
      college: 'NIT Surat', degree: 'B.Tech Mechanical Engineering',
      company: 'Self-employed', designation: 'Entrepreneur',
      annualIncomeLakh: 45, nriStatus: false, workCity: 'Ahmedabad',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'No', openToPets: 'No',
      partnerAgeMin: 24, partnerAgeMax: 29,
      partnerHeightMinCm: 152, partnerIncomeMinLakh: 0,
    },
    family: {
      fatherOccupation: 'Business', motherOccupation: 'Business',
      brothers: 1, sisters: 0,
      familyType: 'Joint', familyIncomeLakh: 200, familyValues: 'Traditional',
    },
    notes: [],
    sentMatches: [],
  },
  {
    statusTag: 'Paused',
    personal: {
      firstName: 'Meera', lastName: 'Kapoor', gender: 'Female',
      dob: '1993-05-30', country: 'India', city: 'Delhi',
      heightCm: 165, email: 'meera.kapoor@example.com', phone: '+91 99876 54321',
      religion: 'Hindu', caste: 'Kshatriya', motherTongue: 'Hindi',
      manglik: 'No', maritalStatus: 'Divorced', complexion: 'Very Fair',
      dietaryPref: 'Vegetarian', smoking: 'Never', drinking: 'Occasionally',
      languagesKnown: ['English', 'Hindi', 'Punjabi'], photoUrl: null,
    },
    professional: {
      college: 'LSR Delhi', degree: 'M.A. Psychology',
      company: 'Private Practice', designation: 'Clinical Psychologist',
      annualIncomeLakh: 18, nriStatus: false, workCity: 'Delhi',
    },
    preferences: {
      wantKids: 'Maybe', openToRelocate: 'Maybe', openToPets: 'Yes',
      partnerAgeMin: 30, partnerAgeMax: 42,
      partnerHeightMinCm: 168, partnerIncomeMinLakh: 20,
    },
    family: {
      fatherOccupation: 'Retired', motherOccupation: 'Homemaker',
      brothers: 0, sisters: 1,
      familyType: 'Nuclear', familyIncomeLakh: 35, familyValues: 'Liberal',
    },
    notes: [
      {
        id: 'note_005',
        text: 'Paused at client request — processing recent life changes. Will reconnect in January.',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'seed',
      },
    ],
    sentMatches: [],
  },
  {
    statusTag: 'Active',
    personal: {
      firstName: 'Yash', lastName: 'Malhotra', gender: 'Male',
      dob: '1994-01-19', country: 'India', city: 'Pune',
      heightCm: 180, email: 'yash.malhotra@example.com', phone: '+91 88765 43210',
      religion: 'Hindu', caste: 'Brahmin', motherTongue: 'Hindi',
      manglik: 'No', maritalStatus: 'Never Married', complexion: 'Fair',
      dietaryPref: 'Non-Vegetarian', smoking: 'Never', drinking: 'Occasionally',
      languagesKnown: ['English', 'Hindi', 'Marathi'], photoUrl: null,
    },
    professional: {
      college: 'COEP Pune', degree: 'B.Tech Computer Science',
      company: 'Persistent Systems', designation: 'Tech Lead',
      annualIncomeLakh: 24, nriStatus: false, workCity: 'Pune',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'Maybe', openToPets: 'Yes',
      partnerAgeMin: 24, partnerAgeMax: 30,
      partnerHeightMinCm: 152, partnerIncomeMinLakh: 5,
    },
    family: {
      fatherOccupation: 'Private Service', motherOccupation: 'Teacher',
      brothers: 1, sisters: 0,
      familyType: 'Nuclear', familyIncomeLakh: 40, familyValues: 'Moderate',
    },
    notes: [],
    sentMatches: [],
  },
  {
    statusTag: 'Active',
    personal: {
      firstName: 'Riya', lastName: 'Bose', gender: 'Female',
      dob: '1996-10-11', country: 'India', city: 'Kolkata',
      heightCm: 157, email: 'riya.bose@example.com', phone: '+91 77654 32109',
      religion: 'Hindu', caste: 'Kayastha', motherTongue: 'Bengali',
      manglik: 'Dont Know', maritalStatus: 'Never Married', complexion: 'Fair',
      dietaryPref: 'Non-Vegetarian', smoking: 'Never', drinking: 'Never',
      languagesKnown: ['English', 'Bengali', 'Hindi'], photoUrl: null,
    },
    professional: {
      college: 'Jadavpur University', degree: 'B.Tech Electronics',
      company: 'Tata Consultancy Services', designation: 'Senior Analyst',
      annualIncomeLakh: 16, nriStatus: false, workCity: 'Kolkata',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'Yes', openToPets: 'Yes',
      partnerAgeMin: 27, partnerAgeMax: 34,
      partnerHeightMinCm: 165, partnerIncomeMinLakh: 15,
    },
    family: {
      fatherOccupation: 'Government Service', motherOccupation: 'Homemaker',
      brothers: 1, sisters: 1,
      familyType: 'Joint', familyIncomeLakh: 30, familyValues: 'Moderate',
    },
    notes: [],
    sentMatches: [],
  },
  
  // 13 New Clients added in Phase 3
  // NRI UK Male
  {
    statusTag: 'New',
    personal: {
      firstName: 'Aditya', lastName: 'Mishra', gender: 'Male',
      dob: '1988-11-12', country: 'UK', city: 'London',
      heightCm: 181, email: 'aditya.mishra@example.com', phone: '+44 7911 123456',
      religion: 'Hindu', caste: 'Brahmin', motherTongue: 'Hindi',
      manglik: 'No', maritalStatus: 'Never Married', complexion: 'Fair',
      dietaryPref: 'Vegetarian', smoking: 'Never', drinking: 'Occasionally',
      languagesKnown: ['English', 'Hindi'], photoUrl: null,
    },
    professional: {
      college: 'Imperial College London', degree: 'MSc Data Science',
      company: 'Barclays', designation: 'Data Scientist',
      annualIncomeLakh: 120, nriStatus: true, workCity: 'London',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'Maybe', openToPets: 'Yes',
      partnerAgeMin: 27, partnerAgeMax: 33,
      partnerHeightMinCm: 158, partnerIncomeMinLakh: 0,
    },
    family: {
      fatherOccupation: 'Retired', motherOccupation: 'Homemaker',
      brothers: 0, sisters: 1,
      familyType: 'Nuclear', familyIncomeLakh: 80, familyValues: 'Liberal',
    },
    notes: [],
    sentMatches: [],
  },
  // NRI Canada Female
  {
    statusTag: 'Active',
    personal: {
      firstName: 'Simran', lastName: 'Kaur', gender: 'Female',
      dob: '1995-02-14', country: 'Canada', city: 'Toronto',
      heightCm: 168, email: 'simran.kaur@example.com', phone: '+1 416 555 0198',
      religion: 'Sikh', caste: 'Jat', motherTongue: 'Punjabi',
      manglik: 'No', maritalStatus: 'Never Married', complexion: 'Wheatish',
      dietaryPref: 'Non-Vegetarian', smoking: 'Never', drinking: 'Occasionally',
      languagesKnown: ['English', 'Punjabi'], photoUrl: null,
    },
    professional: {
      college: 'University of Toronto', degree: 'BCom',
      company: 'RBC', designation: 'Financial Analyst',
      annualIncomeLakh: 60, nriStatus: true, workCity: 'Toronto',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'Maybe', openToPets: 'Yes',
      partnerAgeMin: 29, partnerAgeMax: 35,
      partnerHeightMinCm: 175, partnerIncomeMinLakh: 80,
    },
    family: {
      fatherOccupation: 'Business', motherOccupation: 'Teacher',
      brothers: 1, sisters: 0,
      familyType: 'Nuclear', familyIncomeLakh: 150, familyValues: 'Moderate',
    },
    notes: [],
    sentMatches: [],
  },
  // Sikh Male
  {
    statusTag: 'Matched',
    personal: {
      firstName: 'Harpreet', lastName: 'Singh', gender: 'Male',
      dob: '1991-09-09', country: 'India', city: 'Chandigarh',
      heightCm: 175, email: 'harpreet.singh@example.com', phone: '+91 99999 88888',
      religion: 'Sikh', caste: 'Khatri', motherTongue: 'Punjabi',
      manglik: 'No', maritalStatus: 'Never Married', complexion: 'Fair',
      dietaryPref: 'Non-Vegetarian', smoking: 'Never', drinking: 'Never',
      languagesKnown: ['English', 'Punjabi', 'Hindi'], photoUrl: null,
    },
    professional: {
      college: 'Panjab University', degree: 'LLB',
      company: 'High Court', designation: 'Advocate',
      annualIncomeLakh: 25, nriStatus: false, workCity: 'Chandigarh',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'No', openToPets: 'Yes',
      partnerAgeMin: 25, partnerAgeMax: 31,
      partnerHeightMinCm: 160, partnerIncomeMinLakh: 10,
    },
    family: {
      fatherOccupation: 'Advocate', motherOccupation: 'Homemaker',
      brothers: 0, sisters: 1,
      familyType: 'Joint', familyIncomeLakh: 90, familyValues: 'Traditional',
    },
    notes: [],
    sentMatches: [],
  },
  // Sikh Female
  {
    statusTag: 'Active',
    personal: {
      firstName: 'Navjot', lastName: 'Dhillon', gender: 'Female',
      dob: '1994-12-05', country: 'India', city: 'Delhi',
      heightCm: 164, email: 'navjot.dhillon@example.com', phone: '+91 88888 77777',
      religion: 'Sikh', caste: 'Jat', motherTongue: 'Punjabi',
      manglik: 'No', maritalStatus: 'Never Married', complexion: 'Fair',
      dietaryPref: 'Vegetarian', smoking: 'Never', drinking: 'Never',
      languagesKnown: ['English', 'Punjabi', 'Hindi'], photoUrl: null,
    },
    professional: {
      college: 'NIFT Delhi', degree: 'B.Des',
      company: 'Self-employed', designation: 'Fashion Designer',
      annualIncomeLakh: 15, nriStatus: false, workCity: 'Delhi',
    },
    preferences: {
      wantKids: 'Maybe', openToRelocate: 'Yes', openToPets: 'Yes',
      partnerAgeMin: 29, partnerAgeMax: 34,
      partnerHeightMinCm: 173, partnerIncomeMinLakh: 20,
    },
    family: {
      fatherOccupation: 'Business', motherOccupation: 'Homemaker',
      brothers: 2, sisters: 0,
      familyType: 'Joint', familyIncomeLakh: 120, familyValues: 'Moderate',
    },
    notes: [],
    sentMatches: [],
  },
  // Christian Male
  {
    statusTag: 'Active',
    personal: {
      firstName: 'John', lastName: 'Mathew', gender: 'Male',
      dob: '1990-03-21', country: 'India', city: 'Kochi',
      heightCm: 177, email: 'john.mathew@example.com', phone: '+91 77777 66666',
      religion: 'Christian', caste: 'Orthodox', motherTongue: 'Malayalam',
      manglik: 'No', maritalStatus: 'Never Married', complexion: 'Wheatish',
      dietaryPref: 'Non-Vegetarian', smoking: 'Never', drinking: 'Occasionally',
      languagesKnown: ['English', 'Malayalam'], photoUrl: null,
    },
    professional: {
      college: 'NIT Calicut', degree: 'B.Tech Civil',
      company: 'L&T', designation: 'Project Manager',
      annualIncomeLakh: 18, nriStatus: false, workCity: 'Kochi',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'Yes', openToPets: 'Maybe',
      partnerAgeMin: 25, partnerAgeMax: 32,
      partnerHeightMinCm: 155, partnerIncomeMinLakh: 0,
    },
    family: {
      fatherOccupation: 'Retired', motherOccupation: 'Retired',
      brothers: 1, sisters: 1,
      familyType: 'Nuclear', familyIncomeLakh: 20, familyValues: 'Traditional',
    },
    notes: [],
    sentMatches: [],
  },
  // Christian Female
  {
    statusTag: 'On Hold',
    personal: {
      firstName: 'Sarah', lastName: 'Thomas', gender: 'Female',
      dob: '1995-07-30', country: 'India', city: 'Bangalore',
      heightCm: 161, email: 'sarah.thomas@example.com', phone: '+91 66666 55555',
      religion: 'Christian', caste: 'Catholic', motherTongue: 'Malayalam',
      manglik: 'No', maritalStatus: 'Never Married', complexion: 'Fair',
      dietaryPref: 'Non-Vegetarian', smoking: 'Never', drinking: 'Never',
      languagesKnown: ['English', 'Malayalam', 'Hindi'], photoUrl: null,
    },
    professional: {
      college: 'St. Josephs', degree: 'BSc Nursing',
      company: 'Manipal Hospital', designation: 'Registered Nurse',
      annualIncomeLakh: 8, nriStatus: false, workCity: 'Bangalore',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'Yes', openToPets: 'Yes',
      partnerAgeMin: 28, partnerAgeMax: 33,
      partnerHeightMinCm: 170, partnerIncomeMinLakh: 15,
    },
    family: {
      fatherOccupation: 'Business', motherOccupation: 'Homemaker',
      brothers: 0, sisters: 2,
      familyType: 'Nuclear', familyIncomeLakh: 30, familyValues: 'Moderate',
    },
    notes: [],
    sentMatches: [],
  },
  // Muslim Male
  {
    statusTag: 'New',
    personal: {
      firstName: 'Zayed', lastName: 'Ahmed', gender: 'Male',
      dob: '1989-05-18', country: 'India', city: 'Hyderabad',
      heightCm: 179, email: 'zayed.ahmed@example.com', phone: '+91 55555 44444',
      religion: 'Muslim', caste: 'Sunni', motherTongue: 'Urdu',
      manglik: 'No', maritalStatus: 'Never Married', complexion: 'Wheatish',
      dietaryPref: 'Non-Vegetarian', smoking: 'Occasionally', drinking: 'Never',
      languagesKnown: ['English', 'Urdu', 'Telugu', 'Hindi'], photoUrl: null,
    },
    professional: {
      college: 'Osmania University', degree: 'MCom',
      company: 'Self-employed', designation: 'Business Owner',
      annualIncomeLakh: 50, nriStatus: false, workCity: 'Hyderabad',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'No', openToPets: 'Maybe',
      partnerAgeMin: 23, partnerAgeMax: 30,
      partnerHeightMinCm: 158, partnerIncomeMinLakh: 0,
    },
    family: {
      fatherOccupation: 'Business', motherOccupation: 'Homemaker',
      brothers: 2, sisters: 1,
      familyType: 'Joint', familyIncomeLakh: 150, familyValues: 'Traditional',
    },
    notes: [],
    sentMatches: [],
  },
  // Muslim Female
  {
    statusTag: 'Active',
    personal: {
      firstName: 'Ayesha', lastName: 'Siddiqui', gender: 'Female',
      dob: '1994-08-11', country: 'India', city: 'Lucknow',
      heightCm: 165, email: 'ayesha.siddiqui@example.com', phone: '+91 44444 33333',
      religion: 'Muslim', caste: 'Sunni', motherTongue: 'Urdu',
      manglik: 'No', maritalStatus: 'Never Married', complexion: 'Fair',
      dietaryPref: 'Non-Vegetarian', smoking: 'Never', drinking: 'Never',
      languagesKnown: ['English', 'Urdu', 'Hindi'], photoUrl: null,
    },
    professional: {
      college: 'Lucknow University', degree: 'BA Literature',
      company: 'EdTech Startup', designation: 'Content Writer',
      annualIncomeLakh: 7, nriStatus: false, workCity: 'Lucknow',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'Yes', openToPets: 'No',
      partnerAgeMin: 28, partnerAgeMax: 35,
      partnerHeightMinCm: 172, partnerIncomeMinLakh: 15,
    },
    family: {
      fatherOccupation: 'Government Service', motherOccupation: 'Teacher',
      brothers: 1, sisters: 0,
      familyType: 'Nuclear', familyIncomeLakh: 35, familyValues: 'Moderate',
    },
    notes: [],
    sentMatches: [],
  },
  // Divorced Male
  {
    statusTag: 'Paused',
    personal: {
      firstName: 'Karan', lastName: 'Joshi', gender: 'Male',
      dob: '1985-02-28', country: 'India', city: 'Pune',
      heightCm: 172, email: 'karan.joshi@example.com', phone: '+91 33333 22222',
      religion: 'Hindu', caste: 'Brahmin', motherTongue: 'Marathi',
      manglik: 'No', maritalStatus: 'Divorced', complexion: 'Wheatish',
      dietaryPref: 'Vegetarian', smoking: 'Never', drinking: 'Occasionally',
      languagesKnown: ['English', 'Marathi', 'Hindi'], photoUrl: null,
    },
    professional: {
      college: 'Symbiosis Pune', degree: 'MBA',
      company: 'Infosys', designation: 'Delivery Manager',
      annualIncomeLakh: 40, nriStatus: false, workCity: 'Pune',
    },
    preferences: {
      wantKids: 'Maybe', openToRelocate: 'Maybe', openToPets: 'Yes',
      partnerAgeMin: 32, partnerAgeMax: 38,
      partnerHeightMinCm: 155, partnerIncomeMinLakh: 10,
    },
    family: {
      fatherOccupation: 'Retired', motherOccupation: 'Retired',
      brothers: 0, sisters: 1,
      familyType: 'Nuclear', familyIncomeLakh: 60, familyValues: 'Liberal',
    },
    notes: [],
    sentMatches: [],
  },
  // Divorced Female
  {
    statusTag: 'Active',
    personal: {
      firstName: 'Neha', lastName: 'Gupta', gender: 'Female',
      dob: '1987-10-15', country: 'India', city: 'Delhi',
      heightCm: 160, email: 'neha.gupta@example.com', phone: '+91 22222 11111',
      religion: 'Hindu', caste: 'Baniya', motherTongue: 'Hindi',
      manglik: 'No', maritalStatus: 'Divorced', complexion: 'Fair',
      dietaryPref: 'Vegetarian', smoking: 'Never', drinking: 'Never',
      languagesKnown: ['English', 'Hindi'], photoUrl: null,
    },
    professional: {
      college: 'Delhi University', degree: 'BCom',
      company: 'HDFC Bank', designation: 'Branch Manager',
      annualIncomeLakh: 25, nriStatus: false, workCity: 'Delhi',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'No', openToPets: 'No',
      partnerAgeMin: 35, partnerAgeMax: 42,
      partnerHeightMinCm: 170, partnerIncomeMinLakh: 30,
    },
    family: {
      fatherOccupation: 'Business', motherOccupation: 'Homemaker',
      brothers: 2, sisters: 0,
      familyType: 'Joint', familyIncomeLakh: 100, familyValues: 'Traditional',
    },
    notes: [],
    sentMatches: ['pool_male_001', 'pool_male_005'],
  },
  // Widowed Female
  {
    statusTag: 'Active',
    personal: {
      firstName: 'Aarti', lastName: 'Desai', gender: 'Female',
      dob: '1984-06-20', country: 'India', city: 'Ahmedabad',
      heightCm: 155, email: 'aarti.desai@example.com', phone: '+91 11111 00000',
      religion: 'Hindu', caste: 'Patel', motherTongue: 'Gujarati',
      manglik: 'No', maritalStatus: 'Widowed', complexion: 'Wheatish',
      dietaryPref: 'Vegetarian', smoking: 'Never', drinking: 'Never',
      languagesKnown: ['English', 'Gujarati', 'Hindi'], photoUrl: null,
    },
    professional: {
      college: 'Gujarat University', degree: 'BEd',
      company: 'DPS Ahmedabad', designation: 'Senior Teacher',
      annualIncomeLakh: 9, nriStatus: false, workCity: 'Ahmedabad',
    },
    preferences: {
      wantKids: 'Maybe', openToRelocate: 'Maybe', openToPets: 'Maybe',
      partnerAgeMin: 38, partnerAgeMax: 45,
      partnerHeightMinCm: 165, partnerIncomeMinLakh: 15,
    },
    family: {
      fatherOccupation: 'Retired', motherOccupation: 'Homemaker',
      brothers: 1, sisters: 1,
      familyType: 'Nuclear', familyIncomeLakh: 25, familyValues: 'Moderate',
    },
    notes: [
      {
        id: 'note_006',
        text: 'Looking for a companion. Open to moving to Mumbai if the match is right.',
        createdAt: new Date().toISOString(),
        createdBy: 'seed',
      }
    ],
    sentMatches: [],
  },
  // Jaipur Male
  {
    statusTag: 'On Hold',
    personal: {
      firstName: 'Manish', lastName: 'Rajput', gender: 'Male',
      dob: '1992-04-10', country: 'India', city: 'Jaipur',
      heightCm: 178, email: 'manish.rajput@example.com', phone: '+91 12312 31231',
      religion: 'Hindu', caste: 'Rajput', motherTongue: 'Hindi',
      manglik: 'Yes', maritalStatus: 'Never Married', complexion: 'Fair',
      dietaryPref: 'Non-Vegetarian', smoking: 'Occasionally', drinking: 'Occasionally',
      languagesKnown: ['English', 'Hindi', 'Marwari'], photoUrl: null,
    },
    professional: {
      college: 'MNIT Jaipur', degree: 'B.Tech',
      company: 'Family Business', designation: 'Director',
      annualIncomeLakh: 80, nriStatus: false, workCity: 'Jaipur',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'No', openToPets: 'Yes',
      partnerAgeMin: 24, partnerAgeMax: 29,
      partnerHeightMinCm: 160, partnerIncomeMinLakh: 0,
    },
    family: {
      fatherOccupation: 'Business', motherOccupation: 'Homemaker',
      brothers: 2, sisters: 1,
      familyType: 'Joint', familyIncomeLakh: 300, familyValues: 'Traditional',
    },
    notes: [],
    sentMatches: [],
  },
  // Pune Female
  {
    statusTag: 'Matched',
    personal: {
      firstName: 'Shruti', lastName: 'Kulkarni', gender: 'Female',
      dob: '1995-09-05', country: 'India', city: 'Pune',
      heightCm: 162, email: 'shruti.kulkarni@example.com', phone: '+91 32132 13213',
      religion: 'Hindu', caste: 'Brahmin', motherTongue: 'Marathi',
      manglik: 'No', maritalStatus: 'Never Married', complexion: 'Wheatish',
      dietaryPref: 'Vegetarian', smoking: 'Never', drinking: 'Never',
      languagesKnown: ['English', 'Marathi', 'Hindi'], photoUrl: null,
    },
    professional: {
      college: 'Fergusson College', degree: 'BSc IT',
      company: 'Tech Mahindra', designation: 'Software Engineer',
      annualIncomeLakh: 12, nriStatus: false, workCity: 'Pune',
    },
    preferences: {
      wantKids: 'Yes', openToRelocate: 'Maybe', openToPets: 'No',
      partnerAgeMin: 27, partnerAgeMax: 32,
      partnerHeightMinCm: 170, partnerIncomeMinLakh: 18,
    },
    family: {
      fatherOccupation: 'Banker', motherOccupation: 'Homemaker',
      brothers: 0, sisters: 1,
      familyType: 'Nuclear', familyIncomeLakh: 40, familyValues: 'Moderate',
    },
    notes: [],
    sentMatches: [],
  }
]

export async function seedDatabase(matchmakerUid) {
  if (!matchmakerUid) {
    throw new Error('seedDatabase requires a matchmakerUid string argument.')
  }
  await seedClientsForMatchmaker(matchmakerUid, SAMPLE_CLIENTS)
}