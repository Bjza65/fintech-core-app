"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
const User_1 = require("../domain/entities/User");
class RegisterUserUseCase {
    userRepository;
    passwordHasher;
    constructor(userRepository, passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }
    async execute(input) {
        const existingUser = await this.userRepository.findByEmail(input.email);
        if (existingUser) {
            throw new Error('User with this email already exists.');
        }
        const passwordHash = await this.passwordHasher.hash(input.password);
        const user = await this.userRepository.save(User_1.User.create({
            fullName: input.name,
            email: input.email,
            passwordHash: passwordHash,
            createdAt: new Date()
        }));
        return {
            id: user.id,
            name: user.fullName,
            email: user.email,
            createdAt: user.createdAt,
        };
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
