const db = require('../config/firebase');

exports.getTasks = async (req, res) => {
  try {
    const tasksRef = db.collection('tasks');
    const snapshot = await tasksRef.where('userId', '==', req.auth.userId).get();

    const tasks = [];
    snapshot.forEach(doc => tasks.push({ id: doc.id, ...doc.data() }));
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, deadline, priority } = req.body;

    const newTask = {
      title,
      description,
      deadline,
      priority,
      status: 'pending',
      userId: req.auth.userId,
      createdAt: new Date().toISOString(),
    };

    const taskRef = await db.collection('tasks').add(newTask);
    res.status(201).json({ id: taskRef.id, ...newTask });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    await db.collection('tasks').doc(taskId).update(req.body);
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    await db.collection('tasks').doc(taskId).delete();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
