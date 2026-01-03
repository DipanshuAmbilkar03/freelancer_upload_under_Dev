const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { 
    type: String, 
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', 
    trim: true 
  },
  savedAssignments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment'
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

