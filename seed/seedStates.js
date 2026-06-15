const State = require('../models/State');

const states = [
  { name: 'Maharashtra', code: 'MH' },
  { name: 'Gujarat', code: 'GJ' },
  { name: 'Rajasthan', code: 'RJ' },
  { name: 'Uttar Pradesh', code: 'UP' },
  { name: 'Karnataka', code: 'KA' },
  { name: 'Tamil Nadu', code: 'TN' },
  { name: 'Telangana', code: 'TG' },
  { name: 'Andhra Pradesh', code: 'AP' },
  { name: 'West Bengal', code: 'WB' },
  { name: 'Haryana', code: 'HR' },
  { name: 'Punjab', code: 'PB' },
  { name: 'Madhya Pradesh', code: 'MP' },
];

const seedStates = async () => {
  try {
    const existingCount = await State.countDocuments();
    if (existingCount > 0) {
      console.log('States already exist. Skipping seed.');
      return;
    }

    await State.insertMany(states);
    console.log('✅ States seeded successfully');
  } catch (err) {
    console.error('❌ Error seeding states:', err.message);
  }
};

module.exports = { seedStates };
