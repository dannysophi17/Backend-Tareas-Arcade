const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleComplete
} = require('../controllers/taskController');

const { getTaskHistory } = require('../controllers/taskHistoryController');
const { getStats } = require('../controllers/taskStatsController');

router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.get('/history/:taskId', auth, getTaskHistory);
router.get('/stats', auth, getStats);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);
router.patch('/toggle/:id', auth, toggleComplete);

module.exports = router;
