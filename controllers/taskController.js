const Task = require('../models/Task');
const TaskHistory = require('../models/TaskHistory');


// Crear tarea
exports.createTask = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const nuevaTarea = new Task({ title, description, tags, user: req.user.id });
    await nuevaTarea.save();
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear tarea', error: error.message });
  }
};

// Obtener todas las tareas del usuario
exports.getTasks = async (req, res) => {
  try {
    const tareas = await Task.find({ user: req.user.id, deleted: false });
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener tareas', error: error.message });
  }
};

// Actualizar tarea
exports.updateTask = async (req, res) => {
  try {
    const oldTask = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!oldTask) return res.status(404).json({ msg: 'Tarea no encontrada' });

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    // Guardar en historial
    await TaskHistory.create({
      taskId: updatedTask._id,
      user: req.user.id,
      action: 'edit',
      dataBefore: oldTask,
      dataAfter: updatedTask
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ msg: 'Error al actualizar tarea', error: error.message });
  }
};


// Eliminar tarea 
exports.deleteTask = async (req, res) => {
  try {
    const tarea = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { deleted: true },
      { new: true }
    );

    if (!tarea) return res.status(404).json({ msg: 'Tarea no encontrada' });

    // Guardar en historial
    await TaskHistory.create({
      taskId: tarea._id,
      user: req.user.id,
      action: 'delete',
      dataBefore: tarea
    });

    res.json({ msg: 'Tarea eliminada (soft delete)' });
  } catch (error) {
    res.status(500).json({ msg: 'Error al eliminar tarea', error: error.message });
  }
};



// Marcar como completada / pendiente
exports.toggleComplete = async (req, res) => {
  try {
    const tarea = await Task.findOne({ _id: req.params.id, user: req.user.id });
    tarea.completed = !tarea.completed;
    await tarea.save();
    res.json({ msg: 'Tarea actualizada', tarea });
  } catch (error) {
    res.status(500).json({ msg: 'Error al cambiar estado', error: error.message });
  }
};
