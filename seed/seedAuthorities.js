const Authority = require('../models/Authority');
const State = require('../models/State');

const seedAuthorities = async () => {
  try {
    const existingCount = await Authority.countDocuments();
    if (existingCount > 0) {
      console.log('Authorities already exist. Skipping seed.');
      return;
    }

    // Get a sample state
    const maharashtra = await State.findOne({ code: 'MH' });
    const delhi = await State.findOne({ code: 'DL' });

    const authorities = [
      {
        name: 'Mumbai Police',
        type: 'POLICE',
        state: maharashtra?._id,
        area: 'Mumbai',
        phone: '100',
        email: 'mumbaipolice@police.gov.in',
        latitude: 19.0760,
        longitude: 72.8777,
        jurisdiction: [72.8777, 19.0760],
        radiusKm: 50
      },
      {
        name: 'Mumbai Emergency',
        type: 'EMERGENCY',
        state: maharashtra?._id,
        area: 'Mumbai',
        phone: '108',
        email: 'mumbaiemergency@gov.in',
        latitude: 19.0760,
        longitude: 72.8777,
        jurisdiction: [72.8777, 19.0760],
        radiusKm: 50
      }
    ];

    if (maharashtra) {
      await Authority.insertMany(authorities.filter(a => a.state));
      console.log('✅ Authorities seeded successfully');
    } else {
      console.warn('⚠️ States not found. Please seed states first.');
    }
  } catch (err) {
    console.error('❌ Error seeding authorities:', err.message);
  }
};

module.exports = { seedAuthorities };
