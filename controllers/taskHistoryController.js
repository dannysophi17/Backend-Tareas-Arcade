const TaskHistory = require('../models/TaskHistory');

exports.getTaskHistory = async (req, res) => {
  try {
    const history = await TaskHistory.find({
      taskId: req.params.taskId,
      user: req.user.id
    }).sort({ date: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener historial', error: error.message });
  }
};
