const mongoose = require('mongoose');

const taskHistorySchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  action: {
    type: String,
    enum: ['edit', 'delete'],
    required: true
  },
  dataBefore: Object,
  dataAfter: Object,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TaskHistory', taskHistorySchema);
