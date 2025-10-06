const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const initData = require('./data');

const User = require('../model/user');
const Assignment = require('../model/assignment');
const bcrypt = require('bcryptjs');

const MONGO_URL = process.env.MONGO_URI || 'mongodb://localhost:27017/freelancer';

main()
  .then(() => initDB())
  .then(() => {
    console.log('Initialization complete');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Init error:', err);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('connected to DB');
}

async function initDB() {
  // create/find demo user
  let demoUser = await User.findOne({ username: 'demo_user' });
  if (!demoUser) {
    const hashed = await bcrypt.hash('demo_pass', 10);
    demoUser = new User({ username: 'demo_user', email: 'demo@local', password: hashed, role: 'user' });
    await demoUser.save();
    console.log('demo user created');
  } else {
    console.log('demo user exists');
  }

  // clear existing assignments (dev)
  await Assignment.deleteMany({});
  console.log('cleared assignments');

  // insert samples mapping deadline offsets
  const samples = initData.data.map((s) => ({
    title: s.title,
    description: s.description,
    startingPrice: s.startingPrice,
    image: s.image || '',
    subject: s.subject || '',
    deadline: new Date(Date.now() + (s.deadlineOffsetDays || 7) * 24 * 60 * 60 * 1000),
    status: s.status || 'open',
    postedBy: demoUser._id,
    category: s.category || ''
  }));

  await Assignment.insertMany(samples);
  console.log('inserted sample assignments:', samples.length);
}