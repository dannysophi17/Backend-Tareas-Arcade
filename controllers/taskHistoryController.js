const TaskHistory = require('../models/TaskHistory');

exports.getTaskHistory = async (req, res) => {
  try {
    const history = await TaskHistory.find({
      taskId: req.params.id,
      user: req.user.id
    }).sort({ date: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener historial', error: error.message });
  }
};

exports.createTaskHistory = async (req, res) => {
  try {
    const newHistory = new TaskHistory({
      taskId: req.params.id,
      user: req.user.id,
      action: req.body.action,
      description: req.body.description
    });

    await newHistory.save();
    res.status(201).json(newHistory);
  } catch (error) {
    res.status(500).json({ msg: 'Error al guardar historial', error: error.message });
  }
};
