// First, define all the source arrays that the generator samples from

const MALE_FIRST_NAMES = [
  'Aarav', 'Arjun', 'Vikram', 'Rohit', 'Karan', 'Amit', 'Rahul', 'Nikhil',
  'Prateek', 'Siddharth', 'Aditya', 'Manish', 'Rajesh', 'Suresh', 'Deepak',
  'Harsh', 'Vivek', 'Gaurav', 'Ankit', 'Rishi', 'Kunal', 'Sameer', 'Tarun',
  'Yash', 'Dhruv', 'Kabir', 'Varun', 'Mohit', 'Parth', 'Shubham',
]

const FEMALE_FIRST_NAMES = [
  'Priya', 'Ananya', 'Shreya', 'Pooja', 'Kavya', 'Neha', 'Riya', 'Sneha',
  'Divya', 'Ishita', 'Nisha', 'Meera', 'Sanya', 'Tanya', 'Aisha', 'Kritika',
  'Simran', 'Aditi', 'Ruhi', 'Pallavi', 'Swati', 'Anjali', 'Shweta', 'Megha',
  'Komal', 'Nandini', 'Deepika', 'Ritika', 'Sonali', 'Garima',
]

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Shah', 'Mehta',
  'Joshi', 'Agarwal', 'Mishra', 'Pandey', 'Yadav', 'Nair', 'Menon', 'Iyer',
  'Reddy', 'Rao', 'Pillai', 'Bhat', 'Kapoor', 'Malhotra', 'Khanna', 'Bose',
  'Chatterjee', 'Banerjee', 'Mukherjee', 'Das', 'Sinha', 'Jain',
]

const CITIES = [
  { city: 'Mumbai',    state: 'Maharashtra' },
  { city: 'Delhi',     state: 'Delhi' },
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Pune',      state: 'Maharashtra' },
  { city: 'Chennai',   state: 'Tamil Nadu' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Kolkata',   state: 'West Bengal' },
  { city: 'Jaipur',    state: 'Rajasthan' },
  { city: 'Chandigarh',state: 'Punjab' },
]

// Profession archetypes — each has consistent degree, company type, income range
const PROFESSION_ARCHETYPES = [
  {
    designation:   'Software Engineer',
    degreeField:   'B.Tech Computer Science',
    colleges:      ['IIT Bombay', 'IIT Delhi', 'NIT Trichy', 'BITS Pilani', 'VIT Vellore'],
    companies:     ['Google', 'Microsoft', 'Flipkart', 'Infosys', 'TCS', 'Wipro', 'Razorpay'],
    incomeRange:   [8, 45],
  },
  {
    designation:   'Product Manager',
    degreeField:   'B.Tech / MBA',
    colleges:      ['IIM Ahmedabad', 'IIM Bangalore', 'ISB Hyderabad', 'IIT Kharagpur'],
    companies:     ['Amazon', 'Swiggy', 'Zomato', 'Meesho', 'PhonePe', 'Paytm'],
    incomeRange:   [20, 60],
  },
  {
    designation:   'Chartered Accountant',
    degreeField:   'B.Com / CA',
    colleges:      ['Shri Ram College of Commerce', 'St. Xavier\'s College', 'Loyola College'],
    companies:     ['Deloitte', 'KPMG', 'Ernst & Young', 'PWC', 'Self-employed'],
    incomeRange:   [10, 35],
  },
  {
    designation:   'Doctor (MBBS)',
    degreeField:   'MBBS',
    colleges:      ['AIIMS Delhi', 'JIPMER', 'KEM Hospital Mumbai', 'St. John\'s Bangalore'],
    companies:     ['Apollo Hospitals', 'Fortis Healthcare', 'Government Hospital', 'Private Practice'],
    incomeRange:   [8, 30],
  },
  {
    designation:   'Investment Banker',
    degreeField:   'MBA Finance',
    colleges:      ['IIM Calcutta', 'IIM Lucknow', 'XLRI Jamshedpur', 'MDI Gurgaon'],
    companies:     ['Goldman Sachs', 'JP Morgan', 'Morgan Stanley', 'Kotak', 'HDFC Bank'],
    incomeRange:   [25, 80],
  },
  {
    designation:   'Civil Engineer',
    degreeField:   'B.Tech Civil Engineering',
    colleges:      ['IIT Roorkee', 'NIT Warangal', 'SVNIT Surat', 'BIT Mesra'],
    companies:     ['L&T Construction', 'DLF', 'Shapoorji Pallonji', 'RITES'],
    incomeRange:   [6, 20],
  },
  {
    designation:   'Teacher / Professor',
    degreeField:   'M.A. / M.Sc / M.Ed',
    colleges:      ['Delhi University', 'Pune University', 'Jadavpur University', 'BHU'],
    companies:     ['Kendriya Vidyalaya', 'DPS', 'Private College', 'Government College'],
    incomeRange:   [4, 14],
  },
  {
    designation:   'Entrepreneur',
    degreeField:   'B.Tech / BBA / MBA',
    colleges:      ['IIT Madras', 'Symbiosis Pune', 'Christ University', 'Amity University'],
    companies:     ['Self-employed', 'Family Business', 'Own Startup'],
    incomeRange:   [5, 50],
  },
]

const RELIGIONS = [
  { religion: 'Hindu',     caste: 'Brahmin',   motherTongue: 'Hindi' },
  { religion: 'Hindu',     caste: 'Kshatriya', motherTongue: 'Hindi' },
  { religion: 'Hindu',     caste: 'Vaishya',   motherTongue: 'Gujarati' },
  { religion: 'Hindu',     caste: 'Kayastha',  motherTongue: 'Bengali' },
  { religion: 'Hindu',     caste: 'Nair',      motherTongue: 'Malayalam' },
  { religion: 'Muslim',    caste: 'Syed',      motherTongue: 'Urdu' },
  { religion: 'Muslim',    caste: 'Sheikh',    motherTongue: 'Urdu' },
  { religion: 'Christian', caste: 'Catholic',  motherTongue: 'English' },
  { religion: 'Sikh',      caste: 'Jat',       motherTongue: 'Punjabi' },
  { religion: 'Jain',      caste: 'Shvetambar',motherTongue: 'Gujarati' },
]

// Simple seeded pseudo-random number generator
// Produces deterministic results — same seed = same profiles every time
function createSeededRandom(seed) {
  let s = seed
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function pick(arr, rand) {
  return arr[Math.floor(rand() * arr.length)]
}

function inRange(min, max, rand) {
  return Math.floor(rand() * (max - min + 1)) + min
}

function generateDob(minAge, maxAge, rand) {
  const year  = new Date().getFullYear() - inRange(minAge, maxAge, rand)
  const month = inRange(1, 12, rand)
  const day   = inRange(1, 28, rand)
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function generateProfile(index, gender, rand) {
  const firstName = gender === 'Male'
    ? pick(MALE_FIRST_NAMES, rand)
    : pick(FEMALE_FIRST_NAMES, rand)

  const lastName   = pick(LAST_NAMES, rand)
  const location   = pick(CITIES, rand)
  const archetype  = pick(PROFESSION_ARCHETYPES, rand)
  const religion   = pick(RELIGIONS, rand)
  const age        = inRange(24, 40, rand)

  // Income must be consistent with profession archetype
  const income     = inRange(archetype.incomeRange[0], archetype.incomeRange[1], rand)

  // Height ranges realistic for Indian population
  const heightCm = gender === 'Male'
    ? inRange(162, 185, rand)
    : inRange(150, 172, rand)

  const maritalStatuses = ['Never Married', 'Never Married', 'Never Married', 'Divorced']
  const dietaryOptions  = ['Vegetarian', 'Vegetarian', 'Non-Vegetarian', 'Non-Vegetarian', 'Jain', 'Eggetarian']
  const smokingOptions  = ['Never', 'Never', 'Never', 'Occasionally']
  const drinkingOptions = ['Never', 'Never', 'Occasionally', 'Occasionally']
  const manglikOptions  = ['No', 'No', 'Yes', 'Dont Know']
  const kidsOptions     = ['Yes', 'Yes', 'Maybe', 'No']
  const relocateOpts    = ['Yes', 'Maybe', 'No']
  const petsOptions     = ['Yes', 'No', 'Maybe']
  const familyTypes     = ['Nuclear', 'Nuclear', 'Joint', 'Joint', 'Extended']
  const familyValues    = ['Traditional', 'Moderate', 'Moderate', 'Liberal']
  const complexions     = ['Very Fair', 'Fair', 'Wheatish', 'Wheatish Brown']

  return {
    id: `pool_${gender.toLowerCase()}_${String(index).padStart(3, '0')}`,
    personal: {
      firstName,
      lastName,
      gender,
      dob:           generateDob(age, age, rand),
      country:       'India',
      city:          location.city,
      state:         location.state,
      heightCm,
      email:         `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@example.com`,
      phone:         `+91 ${inRange(70000, 99999, rand)}${inRange(10000, 99999, rand)}`,
      religion:      religion.religion,
      caste:         religion.caste,
      motherTongue:  religion.motherTongue,
      manglik:       pick(manglikOptions, rand),
      maritalStatus: pick(maritalStatuses, rand),
      complexion:    pick(complexions, rand),
      dietaryPref:   pick(dietaryOptions, rand),
      smoking:       pick(smokingOptions, rand),
      drinking:      pick(drinkingOptions, rand),
      languagesKnown:['English', religion.motherTongue, 'Hindi'].filter(
        (v, i, a) => a.indexOf(v) === i
      ),
      photoUrl: null,
    },
    professional: {
      college:           pick(archetype.colleges, rand),
      degree:            archetype.degreeField,
      company:           pick(archetype.companies, rand),
      designation:       archetype.designation,
      annualIncomeLakh:  income,
      nriStatus:         rand() < 0.08, // ~8% NRI
      workCity:          location.city,
    },
    preferences: {
      wantKids:            pick(kidsOptions, rand),
      openToRelocate:      pick(relocateOpts, rand),
      openToPets:          pick(petsOptions, rand),
      partnerAgeMin:       age - inRange(2, 6, rand),
      partnerAgeMax:       age + inRange(2, 8, rand),
      partnerHeightMinCm:  gender === 'Male' ? inRange(148, 158, rand) : inRange(165, 175, rand),
      partnerIncomeMinLakh:Math.max(0, income - inRange(5, 15, rand)),
    },
    family: {
      fatherOccupation:  pick(['Business', 'Government Service', 'Private Service', 'Retired'], rand),
      motherOccupation:  pick(['Homemaker', 'Teacher', 'Government Service', 'Business'], rand),
      brothers:          inRange(0, 2, rand),
      sisters:           inRange(0, 2, rand),
      familyType:        pick(familyTypes, rand),
      familyIncomeLakh:  inRange(income - 5, income + 20, rand),
      familyValues:      pick(familyValues, rand),
    },
    notes:       [],
    sentMatches: [],
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  }
}

// Generate 60 male + 60 female profiles
// Each half uses a different seed so male/female names don't correlate
const maleRand   = createSeededRandom(42)
const femaleRand = createSeededRandom(137)

const maleProfiles   = Array.from({ length: 60 }, (_, i) => generateProfile(i, 'Male', maleRand))
const femaleProfiles = Array.from({ length: 60 }, (_, i) => generateProfile(i, 'Female', femaleRand))

const profiles = [...maleProfiles, ...femaleProfiles]

export default profiles