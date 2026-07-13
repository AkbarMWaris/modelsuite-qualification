const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Open', 'Claimed', 'Submitted', 'Approved', 'Rejected'],
    },
    category: {
      type: String,
      enum: ['Design', 'Development', 'Writing', 'Video', 'Marketing', 'Other'],
      default: 'Other',
},
    bounty: {
      type: Number,
      default: 0,
},
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    dueDate: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
