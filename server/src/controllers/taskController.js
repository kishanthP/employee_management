const taskModel = require("../models/taskModel");

exports.createTask = async (req, res) => {

  try {

    const { title, description, assigned_to, priority, due_date } = req.body;

    const createdBy = req.user.id;

    const task = await taskModel.createTask(
      title,
      description,
      assigned_to,
      createdBy,
      priority,
      due_date
    );

    res.json({
      message: "Task created successfully",
      task
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


exports.myTasks = async (req, res) => {

  try {

    const userId = req.user.id;

    const tasks = await taskModel.getMyTasks(userId);

    res.json(tasks);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


exports.updateStatus = async (req, res) => {

  try {

    const taskId = req.params.id;

    const { status } = req.body;

    const task = await taskModel.updateTaskStatus(taskId, status);

    res.json({
      message: "Task updated",
      task
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


exports.allTasks = async (req, res) => {

  try {

    const tasks = await taskModel.getAllTasks();

    res.json(tasks);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};