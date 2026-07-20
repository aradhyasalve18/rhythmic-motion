/**
 * Seed Script: Create Default Admin User
 *
 * Usage: node seeds/createAdmin.js
 *
 * Creates a default admin account if one doesn't already exist.
 * Credentials can be customized via environment variables:
 *   ADMIN_USERNAME (default: "admin")
 *   ADMIN_PASSWORD (default: "admin123")
 */

require('dotenv').config();
const mongoose = require('mongoose');
const AdminUser = require('../models/AdminUser');

const DEFAULT_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if an admin already exists
    const existingAdmin = await AdminUser.findOne({ username: DEFAULT_USERNAME });

    if (existingAdmin) {
      console.log(`⚠️  Admin user "${DEFAULT_USERNAME}" already exists. Skipping creation.`);
      process.exit(0);
    }

    // Create the admin user
    const admin = await AdminUser.create({
      username: DEFAULT_USERNAME,
      password: DEFAULT_PASSWORD,
    });

    console.log('✅ Default admin user created successfully:');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Password: ${DEFAULT_PASSWORD}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdmin();
