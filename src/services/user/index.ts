import { User } from ".prisma/client";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { getError } from "../../helpers/http";
import { ValidationError } from "../../helpers/errors";
import { string } from "fp-ts";
import { buildAuthToken, comparePassword, hashPassword } from "../../config/auth";

type CreateUserDeps = {
    createUserInDb(user: User): Promise<User>,
}
export const createUser = (user: User) =>
    pipe(
        RTE.ask<CreateUserDeps>(),
        RTE.chainW(
            ({ createUserInDb }) => pipe(
                RTE.fromTaskEither(hashPassword(user.password)),
                RTE.chainW(
                    (password) => RTE.fromTaskEither(
                        TE.tryCatch(() => createUserInDb({ ...user, password }), E.toError)
                    )
                )
            )
        ),
        RTE.mapLeft(getError)
    )

const validateUserId = (id: number) => Number.isNaN(id) ? E.left(new ValidationError('Invalida id')) : E.right(id);

type GetUserDeps = {
    getUserFromDb(id: number): Promise<Partial<User>>
}
export const getUser = (id: number) => pipe(
    validateUserId(id),
    RTE.fromEither,
    RTE.chain(
        (id) => pipe(
            RTE.ask<GetUserDeps>(),
            RTE.chain(
                ({ getUserFromDb }) => RTE.fromTaskEither(
                    TE.tryCatch(() => getUserFromDb(id), E.toError)
                )
            )
        )
    ),
    RTE.mapLeft(getError)
);

const validateSignInData = (email: string, password: string) =>
    (string.isString(email) && string.isString(password))
        ? E.right({ email, password })
        : E.left(new ValidationError("Invalid email or password"));

type SignInDeps = {
    getUserByEmailFromDb: (email: string) => Promise<User>
}
export const loginUser = (email: string, password: string) => pipe(
    validateSignInData(email, password),
    RTE.fromEither,
    RTE.chain(
        ({ email, password }) => pipe(
            RTE.ask<SignInDeps>(),
            RTE.chain(
                ({ getUserByEmailFromDb }) => pipe(
                    RTE.fromTaskEither(
                        TE.tryCatch(() => getUserByEmailFromDb(email), E.toError)
                    ),
                )
            ),
            RTE.chainW(
                ({ id, password: hashedPassword }) => pipe(
                    RTE.fromTaskEither(comparePassword(password, hashedPassword)),
                    RTE.chainW(
                        () => RTE.fromEither(buildAuthToken(id))
                    )
                )
            ),
        )
    ),
    RTE.mapLeft(getError)
)
