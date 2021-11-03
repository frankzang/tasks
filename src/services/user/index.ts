import { User } from ".prisma/client";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { getError } from "../../helpers/http";
import { ValidationError } from "../../helpers/errors";

type CreateUserDeps = {
    createUserInDb(user: User): Promise<User>
}
export const createUser = (user: User) =>
    pipe(
        RTE.ask<CreateUserDeps>(),
        RTE.chain(
            ({ createUserInDb }) => RTE.fromTaskEither(
                TE.tryCatch(() => createUserInDb(user), E.toError)
            )
        ),
        RTE.mapLeft(getError)
    )

const validateUserId = (id: number) => Number.isNaN(id) ? E.left(new ValidationError('Invalida id')) : E.right(id);

type GetUserDeps = {
    getUserFromDb(id: number): Promise<User>
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
