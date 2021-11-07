import { Router } from 'express';
import { pipe } from 'fp-ts/lib/function';
import * as TE from "fp-ts/lib/TaskEither";
import { createGroup, deleteGroup, updateGroup } from '../services/group';
import { createGroupInDb, updateGroupInDb, deleteGroupInDb } from '../database/group';
import { requireAuth } from '../middlewares/auth';

const groupRoute = Router();

groupRoute.post('/', requireAuth, (req, res) => {
    const group = req.body;
    const { userId } = req;

    pipe(
        createGroup(group, userId)({ createGroupInDb }),
        TE.map(group => res.json({ group })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

groupRoute.put('/', requireAuth, (req, res) => {
    const group = req.body;
    const { userId } = req;

    pipe(
        updateGroup(group, userId)({ updateGroupInDb }),
        TE.map(group => res.json({ group })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

groupRoute.delete('/:groupId', requireAuth, (req, res) => {
    const groupId = Number(req.params['groupId'])
    const { userId } = req;
    pipe(
        deleteGroup(groupId, userId)({ deleteGroupInDb }),
        TE.map(group => res.json({ group })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

export default groupRoute;
