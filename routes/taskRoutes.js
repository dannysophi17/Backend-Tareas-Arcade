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

const {
  getTaskHistory,
  createTaskHistory
} = require('../controllers/taskHistoryController');

const { getStats } = require('../controllers/taskStatsController');

// Tareas
router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);
router.patch('/toggle/:id', auth, toggleComplete);

// Historial de tareas
router.post('/:id/history', auth, createTaskHistory);
router.get('/:id/history', auth, getTaskHistory);

// Estadísticas
router.get('/stats', auth, getStats);

module.exports = router;


