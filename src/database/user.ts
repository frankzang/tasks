import { User } from ".prisma/client"
import { prisma } from "../config/database/prisma"
import { NotFoundError, ValidationError } from "../helpers/errors";

export const getUserFromDb = async (id: number) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                name: true,
                email: true,
                Group: {
                    where: {
                        deleted: false,
                    },
                    include: {
                        Task: {
                            where: {
                                deleted: false,
                            }
                        }
                    }
                },
            }
        });

        if (!user) throw new NotFoundError("User not found");

        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const createUserInDb = async (userData: User) => {
    try {
        const user = await prisma.user.create({
            data: userData
        });

        return user;
    } catch (error: any) {
        console.error(error);
        if (error?.meta?.target === 'users_email_key')
            throw new ValidationError("Email already in use");

        throw new ValidationError("Invalid user data");
    }
};

export const getUserByEmailFromDb = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) throw new NotFoundError("User not found");

        return user;
    } catch (error: any) {
        console.error(error);
        throw error
    }
};
