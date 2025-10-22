import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 60
  }
});

export default mongoose.model('User', userSchema);
