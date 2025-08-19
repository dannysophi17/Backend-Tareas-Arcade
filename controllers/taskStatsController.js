const Task = require('../models/Task');

exports.getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const total = await Task.countDocuments({ user: userId });
    const completadas = await Task.countDocuments({ user: userId, completed: true, deleted: false });
    const pendientes  = await Task.countDocuments({ user: userId, completed: false, deleted: false });
    const eliminadas  = await Task.countDocuments({ user: userId, deleted: true });

    res.status(200).json({
      total,
      completed: completadas,
      pending: pendientes,
      deleted: eliminadas
    });
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener estadísticas', error: error.message });
  }
};

