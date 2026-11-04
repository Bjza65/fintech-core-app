"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const User_1 = require("../../domain/entities/User");
const UserMapper_1 = require("../mappers/UserMapper");
class PrismaUserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const prismaUser = await this.prisma.user.findUnique({
            where: { id }
        });
        if (!prismaUser)
            return null;
        return User_1.User.create(UserMapper_1.UserMapper.toDomain(prismaUser));
    }
    async findByEmail(email) {
        const prismaUser = await this.prisma.user.findUnique({
            where: { email }
        });
        if (!prismaUser)
            return null;
        return User_1.User.create(UserMapper_1.UserMapper.toDomain(prismaUser));
    }
    async save(user) {
        const saved = await this.prisma.user.upsert({
            where: { email: user.email },
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
        return User_1.User.create(UserMapper_1.UserMapper.toDomain(saved));
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
