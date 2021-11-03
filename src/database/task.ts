import { Task } from ".prisma/client"
import { prisma } from "../config/database/prisma"
import { ForbiddenError, ValidationError } from "../helpers/errors";

export const createTaskInDb = async (taskData: Task) => {
    try {
        const task = await prisma.task.create({
            data: taskData
        });

        return task;
    } catch (error: any) {
        console.error(error);
        if (error instanceof ForbiddenError) throw error;

        throw new ValidationError("Invalid session data");
    }
};

export const updateTaskInDb = async ({ id, ...taskData }: Task) => {
    try {
        const task = await prisma.task.update({
            where: { id },
            data: taskData
        });

        return task;
    } catch (error: any) {
        console.error(error);
        throw new ValidationError("Invalid task data");
    }
};

export const deleteTaskInDb = async (taskId: number) => {
    try {
        const task = await prisma.task.update({
            where: { id: taskId },
            data: { deleted: true }
        });

        return task;
    } catch (error: any) {
        console.error(error);
        throw new ValidationError("Invalid task data");
    }
};
