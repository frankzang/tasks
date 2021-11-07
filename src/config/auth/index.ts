import bcrypt from 'bcrypt';
import { string } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import * as B from 'fp-ts/boolean'
import { ValidationError } from '../../helpers/errors';
import jwt from 'jsonwebtoken';

const isValidPassword = (p: string) =>
    string.isString(p) ? E.right(p) : E.left(new ValidationError('Invalid password'));

export const hashPassword = (password: string) => pipe(
    isValidPassword(password),
    TE.fromEither,
    TE.chain(
        () => TE.tryCatch(
            () => bcrypt.hash(password, 10),
            E.toError
        )
    ),
)

export const comparePassword = (password: string, hashedPassword: string) => pipe(
    TE.tryCatch(
        () => bcrypt.compare(password, hashedPassword),
        E.toError
    ),
    TE.chainW(
        B.fold(
            () => TE.left(new ValidationError('Invalid password')),
            () => TE.right(true)
        )
    )
)

export const buildAuthToken = (userId: number) => pipe(
    E.of(
        jwt.sign(
            { id: userId },
            process.env['JWT_SECRET'] as string,
            {
                expiresIn: 60 * 60
            }
        )
    )
)
