"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
class LoginUseCase {
    userRepository;
    tokenService;
    passwordHasher;
    constructor(userRepository, tokenService, passwordHasher) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.passwordHasher = passwordHasher;
    }
    async execute(input) {
        const user = await this.userRepository.findByEmail(input.email);
        if (!user) {
            throw new Error('Invalid email or password.');
        }
        const isPasswordValid = await this.passwordHasher.compare(input.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password.');
        }
        const token = this.tokenService.generateToken({ userId: user.id, email: user.email });
        return {
            token,
            user: {
                id: user.id,
                name: user.fullName,
                email: user.email,
            },
        };
    }
}
exports.LoginUseCase = LoginUseCase;
