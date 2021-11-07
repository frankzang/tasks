import { NextFunction, Request, Response } from "express";
import { pipe } from "fp-ts/lib/function";
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { AuthError } from "../helpers/errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getError } from "../helpers/http";

const verifyJWT = async (token: string) => new Promise<JwtPayload>((res, rej) => {
    jwt.verify(token, process.env['JWT_SECRET'] as string, (err, decoded) => {
        return err ? rej(new AuthError()) : res((decoded as JwtPayload))
    })
})

export const requireAuth = (req: Request, res: Response, next: NextFunction) => pipe(
    req.headers.authorization,
    E.fromNullable(new AuthError()),
    TE.fromEither,
    TE.chain(
        (token) => TE.tryCatch(() => verifyJWT(token), E.toError)
    ),
    TE.map(payload => {
        req.userId = payload['id'] as number;
        next();
    }),
    TE.mapLeft(getError),
    TE.mapLeft(result => res.status(result.code).json({ ...result.error }))
)()
