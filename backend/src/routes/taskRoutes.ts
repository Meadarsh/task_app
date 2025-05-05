import express from 'express';

import { taskSchema } from '../models/task';
import { protect, validate } from '../middleware/authMiddleware';
import { createTask, deleteTask, getTasks, updateTask } from '../controller/task.controller';

const router = express.Router();

router.use(protect);

router.post('/', validate(taskSchema), createTask);

router.get('/', getTasks);

router.put('/:id', validate(taskSchema.partial()), updateTask);

router.delete('/:id', deleteTask);

export default router;