import { Task } from ".prisma/client";
import * as RTE from "fp-ts/lib/ReaderTaskEither";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { getError } from "../../helpers/http";

type CreateTaskDeps = {
    createTaskInDb(task: Task, userId: number): Promise<Task>
}
export const createTask = (task: Task, userId: number) =>
    pipe(
        RTE.asks<CreateTaskDeps, CreateTaskDeps["createTaskInDb"]>(deps => deps.createTaskInDb),
        RTE.chain(
            (createTaskInDb) => RTE.fromTaskEither(
                TE.tryCatch(() => createTaskInDb(task, userId), E.toError)
            )
        ),
        RTE.mapLeft(getError)
    )

type UpdateTaskDeps = {
    updateTaskInDb(task: Task, userId: number): Promise<Task>
}
export const updateTask = (task: Task, userId: number) =>
    pipe(
        RTE.asks<UpdateTaskDeps, UpdateTaskDeps["updateTaskInDb"]>(deps => deps.updateTaskInDb),
        RTE.chain(
            (updateTaskInDb) => RTE.fromTaskEither(
                TE.tryCatch(() => updateTaskInDb(task, userId), E.toError)
            )
        ),
        RTE.mapLeft(getError)
    )

type UpdateTaskStatusDeps = {
    updateTaskStatusActiveInDb(taskId: number, userId: number): Promise<Task>
}
export const updateTaskStatus = (taskId: number, userId: number) =>
    pipe(
        RTE.asks<UpdateTaskStatusDeps, UpdateTaskStatusDeps["updateTaskStatusActiveInDb"]>(deps => deps.updateTaskStatusActiveInDb),
        RTE.chain(
            (updateTaskStatusActiveInDb) => RTE.fromTaskEither(
                TE.tryCatch(() => updateTaskStatusActiveInDb(taskId, userId), E.toError)
            )
        ),
        RTE.mapLeft(getError)
    )

type DeleteTaskDeps = {
    deleteTaskInDb(taskId: number, userId: number): Promise<Task>
}
export const deleteTask = (taskId: number, userId: number) =>
    pipe(
        RTE.asks<DeleteTaskDeps, DeleteTaskDeps["deleteTaskInDb"]>(deps => deps.deleteTaskInDb),
        RTE.chain(
            (deleteTaskInDb) => RTE.fromTaskEither(
                TE.tryCatch(() => deleteTaskInDb(taskId, userId), E.toError)
            )
        ),
        RTE.mapLeft(getError)
    )
