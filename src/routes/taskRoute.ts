import { Router } from 'express';
import { pipe } from 'fp-ts/lib/function';
import * as TE from "fp-ts/lib/TaskEither";
import { createTask, deleteTask, updateTask } from '../services/task';
import { createTaskInDb, updateTaskInDb, deleteTaskInDb } from '../database/task';
import { requireAuth } from '../middlewares/auth';

const taskRoute = Router();

taskRoute.post('/', requireAuth, (req, res) => {
    const task = req.body;

    pipe(
        createTask(task)({ createTaskInDb }),
        TE.map(task => res.json({ task })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

taskRoute.put('/', requireAuth, (req, res) => {
    const task = req.body;

    pipe(
        updateTask(task)({ updateTaskInDb }),
        TE.map(task => res.json({ task })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

taskRoute.delete('/:taskId', requireAuth, (req, res) => {
    pipe(
        deleteTask(Number(req.params['taskId']))({ deleteTaskInDb }),
        TE.map(task => res.json({ task })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

export default taskRoute;

