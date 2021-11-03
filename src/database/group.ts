import { Group } from ".prisma/client"
import { prisma } from "../config/database/prisma"
import { ValidationError } from "../helpers/errors";

export const createGroupInDb = async (groupData: Group) => {
    try {
        const group = await prisma.group.create({
            data: groupData
        });

        return group;
    } catch (error: any) {
        console.error(error);
        throw new ValidationError("Invalid group data");
    }
};
export const updateGroupInDb = async (groupData: Group) => {
    try {
        const group = await prisma.group.update({
            where: { id: groupData.id },
            data: {
                title: groupData.title,
            }
        });

        return group;
    } catch (error: any) {
        console.error(error);
        throw new ValidationError("Can't update group");
    }
};

export const deleteGroupInDb = async (groupId: number) => {
    try {
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
