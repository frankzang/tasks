import { Group } from ".prisma/client"
import { prisma } from "../config/database/prisma"
import { AuthError, ValidationError } from "../helpers/errors";

const checkIfUserOwnsGroup = (groupId: number, userId: number) => prisma.group.findFirst({
    where: {
        id: groupId,
        userId,
    }
});

export const createGroupInDb = async (groupData: Group, userId: number) => {
    try {
        const group = await prisma.group.create({
            data: { ...groupData, userId }
        });

        return group;
    } catch (error: any) {
        console.error(error);
        throw new ValidationError("Invalid group data");
    }
};

export const updateGroupInDb = async (groupData: Group, userId: number) => {
    try {
        const userOwnsGroup = await checkIfUserOwnsGroup(groupData.id, userId)

        if (!userOwnsGroup) throw new AuthError();

        const group = await prisma.group.update({
            where: { id: groupData.id },

            data: {
                title: groupData.title,
            }
        });

        return group;
    } catch (error: any) {
        console.error(error);
        if (error instanceof AuthError) throw error;
        throw new ValidationError("Can't update group");
    }
};

export const deleteGroupInDb = async (groupId: number, userId: number) => {
    try {
        const userOwnsGroup = await checkIfUserOwnsGroup(groupId, userId)

        if (!userOwnsGroup) throw new AuthError();

        const group = await prisma.group.update({
            where: { id: groupId },
            data: {
                deleted: true,
            },
        });

        return group;
    } catch (error: any) {
        console.error(error);
        throw new ValidationError("Can't delete group");
    }
};
