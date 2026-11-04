"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const User_1 = require("../../domain/entities/User");
class UserMapper {
    static toDomain(prismaUser) {
        return User_1.User.create({
            id: prismaUser.id,
            email: prismaUser.email,
            passwordHash: prismaUser.passwordHash,
            fullName: prismaUser.fullName,
            createdAt: prismaUser.createdAt
        });
    }
    static toPersistance(user) {
        return {
            id: user.id,
            email: user.email,
            passwordHash: user.passwordHash,
            fullName: user.fullName,
            createdAt: user.createdAt
        };
    }
}
exports.UserMapper = UserMapper;
