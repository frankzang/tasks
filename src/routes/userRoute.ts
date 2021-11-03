import { Router } from 'express';
import { pipe } from 'fp-ts/lib/function';
import { createUserInDb, getUserFromDb } from '../database/user';
import { createUser, getUser } from '../services/user';
import * as TE from "fp-ts/lib/TaskEither";

const userRoute = Router();

userRoute.get('/:id', (req, res) => {
    pipe(
        getUser(Number(req.params.id))({ getUserFromDb }),
        TE.map(user => res.json({ user })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

userRoute.post('/', (req, res) => {
    const user = req.body;

    pipe(
        createUser(user)({ createUserInDb }),
        TE.map(user => res.json({ user })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

export default userRoute;

