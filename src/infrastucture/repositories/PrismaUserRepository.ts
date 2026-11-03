import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/repositories/Repositories";
import { PrismaClient } from "../../generated/prisma/client";
import { UserMapper } from "../mappers/UserMapper";

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaClient){}
    
    async findById(id: string): Promise<User | null> {
        const prismaUser = await this.prisma.user.findUnique({
            where: {id}
        });

        if(!prismaUser) return null;

        return User.create(UserMapper.toDomain(prismaUser));
    }

    async findByEmail(email: string): Promise<User | null> {
        const prismaUser = await this.prisma.user.findUnique({
            where: {email}
        });
        
        if (!prismaUser) return null;

        return User.create(UserMapper.toDomain(prismaUser));
    }

    async save(user: User): Promise<User> {
        const saved = await this.prisma.user.upsert({
            where:{ id: user.id, email: user.email },
            update: {
                email: user.email,
                passwordHash: user.passwordHash,
                fullName: user.fullName
            },
            create: {
                fullName: user.fullName,
                email: user.email,
                passwordHash: user.passwordHash,
                createdAt: user.createdAt
            },
        });

        return User.create(UserMapper.toDomain(saved))
    }
}