import { Task, TaskStatus } from ".prisma/client"
import { prisma } from "../config/database/prisma"
import { AuthError, NotFoundError, ValidationError } from "../helpers/errors";
import { addHours } from 'date-fns';

const checkIfUserOwnsTask = (taskId: number, userId: number) => prisma.task.findFirst({
    where: {
        id: taskId,
        userId,
    },
});

export const createTaskInDb = async (taskData: Task, userId: number) => {
    try {
        console.log({ taskData, userId });

        const task = await prisma.task.create({
            data: { ...taskData, userId }
        });

        return task;
    } catch (error: any) {
        console.error(error);
        throw new ValidationError("Invalid session data");
    }
};

export const updateTaskInDb = async ({ id, ...taskData }: Task, userId: number) => {
    try {
        const userOwnsTask = await checkIfUserOwnsTask(id, userId)

        if (!userOwnsTask) throw new NotFoundError('Task not found')

        const task = await prisma.task.update({
            where: { id },
            data: {
                title: taskData.title,
                requiredTime: taskData.requiredTime,
                groupId: taskData.groupId,
                status: taskData.status,
            }
        });

        return task;
    } catch (error: any) {
        console.error(error);
        if (error instanceof NotFoundError) throw error;
        throw new ValidationError("Invalid task data");
    }
};

export const updateTaskStatusActiveInDb = async (taskId: number, userId: number) => {
    try {
        const userTask = await checkIfUserOwnsTask(taskId, userId);
        if (!userTask) throw new AuthError();

        const now = new Date()
        const dueDate = addHours(now, userTask.requiredTime);
        const task = await prisma.task.update({
            where: { id: taskId },
            data: {
                status: TaskStatus.ACTIVE,
                dueDate,
            }
        });

        return task
    } catch (error: any) {
        console.error(error);
        if (error instanceof AuthError) throw error;
        throw new ValidationError("Invalid task data");
    }
};

export const deleteTaskInDb = async (taskId: number, userId: number) => {
    try {
        const userOwnsTask = await checkIfUserOwnsTask(taskId, userId)

        if (!userOwnsTask) throw new NotFoundError('Task not found')

        const task = await prisma.task.update({
            where: { id: taskId },
            data: { deleted: true }
        });

        return task;
    } catch (error: any) {
        console.error(error);
        if (error instanceof NotFoundError) throw error;
        throw new ValidationError("Invalid task data");
    }
};
