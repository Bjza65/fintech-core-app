import { User } from "../domain/entities/User";
import { UserRepository } from "../domain/repositories/Repositories";
import { PasswordHasher } from "../domain/Services/PasswordHasher";
import { RegisterUserInputDTO, RegisterUserOutputDTO } from "./dto/AuthDTOs";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher
  ) { }

  async execute(input: RegisterUserInputDTO): Promise<RegisterUserOutputDTO> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    const user = await this.userRepository.save(User.create({
      fullName: input.name,
      email: input.email,
      passwordHash: passwordHash,
      createdAt: new Date()
    }));

    return {
      id: user.id!,
      name: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}