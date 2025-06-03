const Task = require('../models/Task');

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const total = await Task.countDocuments({ user: userId, deleted: false });
    const completadas = await Task.countDocuments({ user: userId, deleted: false, completed: true });
    const pendientes = await Task.countDocuments({ user: userId, deleted: false, completed: false });
    const eliminadas = await Task.countDocuments({ user: userId, deleted: true });

    res.json({
      total,
      completadas,
      pendientes,
      eliminadas
    });
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener estadísticas', error: error.message });
  }
};
