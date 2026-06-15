/**
 * seedDefaultUsers.js
 * Creates one default account per role for development/testing.
 * ⚠️  CHANGE ALL PASSWORDS BEFORE GOING TO PRODUCTION.
 */

const User = require('../models/User');
const Driver = require('../models/Driver');
const State = require('../models/State');
const config = require('../config/env');

// ── Default credentials (DEV ONLY) ──────────────────────────────────────────
const DEFAULT_USERS = [
  {
    name: 'Super Admin',
    email: config.ADMIN_EMAIL || 'admin@trucks.com',
    phone: config.ADMIN_PHONE || '9876543210',
    password: config.ADMIN_PASSWORD || 'admin123',
    role: 'SUPER_ADMIN',
  },
  {
    name: 'Maharashtra State Admin',
    email: 'stateadmin.mh@trucks.com',
    phone: '9876543211',
    password: 'StateAdmin@123',
    role: 'STATE_ADMIN',
    stateCode: 'MH',
  },
  {
    name: 'Mumbai Authority',
    email: 'authority.mumbai@trucks.com',
    phone: '9876543212',
    password: 'Authority@123',
    role: 'AUTHORITY',
    stateCode: 'MH',
  },
];

const DEFAULT_DRIVER = {
  name: 'Test Driver',
  email: 'driver@trucks.com',
  phone: '9876543213',
  truckNumber: 'MH12AB0001',
  password: 'Driver@123',
};

const seedDefaultUsers = async () => {
  try {
    console.log('\n📦 Seeding default users...');

    for (const userData of DEFAULT_USERS) {
      const existing = await User.findOne({
        $or: [{ email: userData.email }, { phone: userData.phone }],
      });

      if (existing) {
        console.log(`  ⏭  ${userData.role} already exists (${userData.email})`);
        continue;
      }

      // Resolve assignedState
      let assignedState = null;
      if (userData.stateCode) {
        const state = await State.findOne({ code: userData.stateCode });
        assignedState = state?._id || null;
      }

      await User.create({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,   // hashed by pre-save hook
        role: userData.role,
        assignedState,
        isVerified: true,
        isActive: true,
      });

      console.log(`  ✅ Created ${userData.role}: ${userData.email} / ${userData.password}`);
    }

    // Seed default driver
    const existingDriver = await Driver.findOne({
      $or: [{ email: DEFAULT_DRIVER.email }, { phone: DEFAULT_DRIVER.phone }],
    });

    if (existingDriver) {
      console.log(`  ⏭  DRIVER already exists (${DEFAULT_DRIVER.email})`);
    } else {
      await Driver.create({
        name: DEFAULT_DRIVER.name,
        email: DEFAULT_DRIVER.email,
        phone: DEFAULT_DRIVER.phone,
        truckNumber: DEFAULT_DRIVER.truckNumber,
        password: DEFAULT_DRIVER.password,  // hashed by pre-save hook
        isVerified: true,
        isActive: true,
      });
      console.log(`  ✅ Created DRIVER: ${DEFAULT_DRIVER.phone} / ${DEFAULT_DRIVER.password}`);
    }

    console.log('\n📋 Default Login Credentials (CHANGE IN PRODUCTION):');
    console.log('─────────────────────────────────────────────────────');
    console.log('  SUPER_ADMIN  │ admin@trucks.com          │ admin123');
    console.log('  STATE_ADMIN  │ stateadmin.mh@trucks.com  │ StateAdmin@123');
    console.log('  AUTHORITY    │ authority.mumbai@trucks.com│ Authority@123');
    console.log('  DRIVER       │ phone: 9876543213          │ Driver@123');
    console.log('─────────────────────────────────────────────────────\n');
  } catch (err) {
    console.error('❌ Error seeding default users:', err.message);
  }
};

// Keep backward-compatible export
const seedAdmin = seedDefaultUsers;

module.exports = { seedDefaultUsers, seedAdmin };
