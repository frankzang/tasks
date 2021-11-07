import { Router } from 'express';
import { pipe } from 'fp-ts/lib/function';
import { createUserInDb, getUserByEmailFromDb, getUserFromDb } from '../database/user';
import { createUser, getUser, loginUser } from '../services/user';
import * as TE from "fp-ts/lib/TaskEither";
import { requireAuth } from '../middlewares/auth';

const userRoute = Router();

userRoute.get('/', requireAuth, (req, res) => {
    const { userId } = req;

    pipe(
        getUser(userId)({ getUserFromDb }),
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

userRoute.post('/login', (req, res) => {
    const { email, password } = req.body;

    pipe(
        loginUser(email, password)({ getUserByEmailFromDb }),
        TE.map(token => res.json({ token })),
        TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
    )()
});

export default userRoute;
