import { Router } from 'express';
import { pipe } from 'fp-ts/lib/function';
import * as TE from "fp-ts/lib/TaskEither";
import { createTask, deleteTask, updateTask, updateTaskStatus } from '../services/task';
import { createTaskInDb, updateTaskInDb, deleteTaskInDb, updateTaskStatusActiveInDb } from '../database/task';
import { requireAuth } from '../middlewares/auth';

const taskRoute = Router();

taskRoute.post('/', requireAuth, (req, res) => {
    const task = req.body;
    const { userId } = req;

    pipe(
        createTask(task, userId)({ createTaskInDb }),
        TE.map(task => res.json({ task })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

taskRoute.put('/', requireAuth, (req, res) => {
    const task = req.body;
    const { userId } = req;

    pipe(
        updateTask(task, userId)({ updateTaskInDb }),
        TE.map(task => res.json({ task })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

taskRoute.put('/activate/:taskId', requireAuth, (req, res) => {
    const taskId = Number(req.params['taskId']);
    const { userId } = req;

    pipe(
        updateTaskStatus(taskId, userId)({ updateTaskStatusActiveInDb }),
        TE.map(task => res.json({ task })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

taskRoute.delete('/:taskId', requireAuth, (req, res) => {
    const taskId = Number(req.params['taskId']);
    const { userId } = req;
    pipe(
        deleteTask(taskId, userId)({ deleteTaskInDb }),
        TE.map(task => res.json({ task })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

export default taskRoute;

