import { Router } from 'express';
import { pipe } from 'fp-ts/lib/function';
import * as TE from "fp-ts/lib/TaskEither";
import { createTask, deleteTask, updateTask } from '../services/task';
import { createTaskInDb, updateTaskInDb, deleteTaskInDb } from '../database/task';

const taskRoute = Router();

taskRoute.post('/', (req, res) => {
    const task = req.body;

    pipe(
        createTask(task)({ createTaskInDb }),
        TE.map(task => res.json({ task })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

taskRoute.put('/', (req, res) => {
    const task = req.body;

    pipe(
        updateTask(task)({ updateTaskInDb }),
        TE.map(task => res.json({ task })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

taskRoute.delete('/:taskId', (req, res) => {
    pipe(
        deleteTask(Number(req.params.taskId))({ deleteTaskInDb }),
        TE.map(task => res.json({ task })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

export default taskRoute;

