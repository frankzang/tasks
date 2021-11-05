import { Router } from 'express';
import { pipe } from 'fp-ts/lib/function';
import * as TE from "fp-ts/lib/TaskEither";
import { createGroup, deleteGroup, updateGroup } from '../services/group';
import { createGroupInDb, updateGroupInDb, deleteGroupInDb } from '../database/group';

const groupRoute = Router();

groupRoute.post('/', (req, res) => {
    const group = req.body;

    pipe(
        createGroup(group)({ createGroupInDb }),
        TE.map(group => res.json({ group })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

groupRoute.put('/', (req, res) => {
    const group = req.body;

    pipe(
        updateGroup(group)({ updateGroupInDb }),
        TE.map(group => res.json({ group })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

groupRoute.delete('/:groupId', (req, res) => {
    pipe(
        deleteGroup(Number(req.params.groupId))({ deleteGroupInDb }),
        TE.map(group => res.json({ group })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

export default groupRoute;
