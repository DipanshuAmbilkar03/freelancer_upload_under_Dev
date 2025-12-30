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
  await mongoose.connect(MONGO_URL);
  console.log('Connected to DB');
}

async function initDB() {

  /* -------------------- USERS -------------------- */

  // Demo user (kept for testing/login)
  let demoUser = await User.findOne({ username: 'demo_user' });
  if (!demoUser) {
    const hashed = await bcrypt.hash('demo_pass', 10);
    demoUser = await User.create({
      username: 'demo_user',
      email: 'demo@local',
      password: hashed,
      role: 'user'
    });
    console.log('Demo user created');
  } else {
    console.log('Demo user exists');
  }

  // Indian users (11)
  const usersData = [
    { username: 'rahul_sharma', email: 'rahul.sharma@test.com', password: 'rahul123' },
    { username: 'amit_patel', email: 'amit.patel@test.com', password: 'amit123' },
    { username: 'priya_singh', email: 'priya.singh@test.com', password: 'priya123' },
    { username: 'neha_verma', email: 'neha.verma@test.com', password: 'neha123' },
    { username: 'rohit_kumar', email: 'rohit.kumar@test.com', password: 'rohit123' },
    { username: 'ankita_jain', email: 'ankita.jain@test.com', password: 'ankita123' },
    { username: 'suresh_yadav', email: 'suresh.yadav@test.com', password: 'suresh123' },
    { username: 'pooja_mehta', email: 'pooja.mehta@test.com', password: 'pooja123' },
    { username: 'vikram_malhotra', email: 'vikram.malhotra@test.com', password: 'vikram123' },
    { username: 'kiran_rao', email: 'kiran.rao@test.com', password: 'kiran123' },
    { username: 'deepak_chopra', email: 'deepak.chopra@test.com', password: 'deepak123' }
  ];

  let defaultAvatars = [
    '/assets/pfp.png',
    '/assets/pfp1.png',
    '/assets/pfp2.png',
    '/assets/pfp3.png',
    '/assets/pfp4.png',
    '/assets/pfp5.png',
  ]

  const users = [];

  for (let i = 0; i < usersData.length; i++) {
    const u = usersData[i];
  
    let user = await User.findOne({ username: u.username });
  
    if (!user) {
      const hashed = await bcrypt.hash(u.password, 10);
  
      user = await User.create({
        username: u.username,
        email: u.email,
        password: hashed,
        role: 'user',
        avatar: defaultAvatars[i % defaultAvatars.length] 
      });
    }
  
    users.push(user);
  }

  console.log(`Users ready: ${users.length}`);

  /* -------------------- ASSIGNMENTS -------------------- */

  await Assignment.deleteMany({});
  console.log('Cleared assignments');

  const samples = initData.data.map((s, index) => ({
    title: s.title,
    description: s.description,
    startingPrice: s.startingPrice,
    image: s.image,
    subject: s.subject || '',
    deadline: new Date(
      Date.now() + (s.deadlineOffsetDays || 7) * 24 * 60 * 60 * 1000
    ),
    status: s.status || 'open',
    postedBy: users[index % users.length]._id, 
    category: s.category || ''
  }));

  await Assignment.insertMany(samples);
  console.log(`Inserted assignments: ${samples.length}`);
}
