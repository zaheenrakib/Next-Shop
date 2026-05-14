const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seedAdmin() {
  const uri = process.env.MONGO_URL || 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'ecommerce_db');


    const existingAdmin = await db.collection('users').findOne({ phone: '+8801234567890' });

    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      console.log('Phone: +8801234567890');
      console.log('Password: admin123');
      return;
    }


    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = {
      id: uuidv4(),
      phone: '+01780566585',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    await db.collection('users').insertOne(admin);

    console.log('✓ Admin user created successfully!');
    console.log('----------------------------------');
    console.log('Phone: +8801234567890');
    console.log('Password: admin123');
    console.log('----------------------------------');
  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await client.close();
  }
}

seedAdmin();
