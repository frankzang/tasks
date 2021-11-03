import { Group } from ".prisma/client";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { getError } from "../../helpers/http";

type CreateGroupInDb = (group: Group) => Promise<Group>
type CreateGroupDeps = {
    createGroupInDb: CreateGroupInDb
}
export const createGroup = (group: Group) =>
    pipe(
        RTE.asks<CreateGroupDeps, CreateGroupInDb>(deps => deps.createGroupInDb),
        RTE.chain(
            (createGroupInDb) => RTE.fromTaskEither(
                TE.tryCatch(() => createGroupInDb(group), E.toError)
            )
        ),
        RTE.mapLeft(getError)
    )

type UpdateGroupInDb = (group: Group) => Promise<Group>
type UpdateGroupDeps = {
    updateGroupInDb: UpdateGroupInDb
}
export const updateGroup = (group: Group) =>
    pipe(
        RTE.asks<UpdateGroupDeps, UpdateGroupInDb>(deps => deps.updateGroupInDb),
        RTE.chain(
            (updateGroupInDb) => RTE.fromTaskEither(
                TE.tryCatch(() => updateGroupInDb(group), E.toError)
            )
        ),
        RTE.mapLeft(getError)
    )


type DeleteGroupInDb = (groupId: number) => Promise<Group>
type DeleteteGroupDeps = {
    deleteGroupInDb: DeleteGroupInDb
}
export const deleteGroup = (groupId: number) =>
    pipe(
        RTE.asks<DeleteteGroupDeps, DeleteGroupInDb>(deps => deps.deleteGroupInDb),
        RTE.chain(
            (deleteteGroupInDb) => RTE.fromTaskEither(
                TE.tryCatch(() => deleteteGroupInDb(groupId), E.toError)
            )
        ),
        RTE.mapLeft(getError)
    )
