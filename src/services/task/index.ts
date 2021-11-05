import { Task } from ".prisma/client";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { getError } from "../../helpers/http";

type CreateTaskDeps = {
    createTaskInDb(task: Task): Promise<Task>
}
export const createTask = (task: Task) =>
    pipe(
        RTE.asks<CreateTaskDeps, CreateTaskDeps["createTaskInDb"]>(deps => deps.createTaskInDb),
        RTE.chain(
            (createTaskInDb) => RTE.fromTaskEither(
                TE.tryCatch(() => createTaskInDb(task), E.toError)
            )
        ),
        RTE.mapLeft(getError)
    )

type UpdateTaskDeps = {
    updateTaskInDb(task: Task): Promise<Task>
}
export const updateTask = (task: Task) =>
    pipe(
        RTE.asks<UpdateTaskDeps, UpdateTaskDeps["updateTaskInDb"]>(deps => deps.updateTaskInDb),
        RTE.chain(
            (updateTaskInDb) => RTE.fromTaskEither(
                TE.tryCatch(() => updateTaskInDb(task), E.toError)
            )
        ),
        RTE.mapLeft(getError)
    )

type DeleteTaskDeps = {
    deleteTaskInDb(taskId: number): Promise<Task>
}
export const deleteTask = (taskId: number) =>
    pipe(
        RTE.asks<DeleteTaskDeps, DeleteTaskDeps["deleteTaskInDb"]>(deps => deps.deleteTaskInDb),
        RTE.chain(
            (deleteTaskInDb) => RTE.fromTaskEither(
                TE.tryCatch(() => deleteTaskInDb(taskId), E.toError)
            )
        ),
        RTE.mapLeft(getError)
    )
