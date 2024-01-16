import express from 'express';
import {
  createTask,
  deleteTask,
  getSingleTask,
  getAllTasks,
  updateTask
} from '../controllers/taskController.js';
import { verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// Get all tasks
router.get('/', getAllTasks);

// Get a specific task by ID
router.get('/:id', getSingleTask);

// Create a new task
router.post('/', verifyAdmin, createTask);

// Update a task by ID
router.patch('/:id', verifyAdmin, updateTask);

// Delete a task by ID
router.delete('/:id', verifyAdmin, deleteTask);

export default router;
