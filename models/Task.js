import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    completed: {
      type: Number, 
      default: 0
    }
  }, {
  timestamps: true
});

export default mongoose.model('Task', taskSchema);
