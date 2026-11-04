import { UserRepository } from "../domain/repositories/Repositories";
import { PasswordHasher } from "../domain/Services/PasswordHasher";
import { TokenService } from "../domain/Services/TokenService";
import { LoginInputDTO, LoginOutputDTO } from "./dto/AuthDTOs";

export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly passwordHasher: PasswordHasher
  ) { }

  async execute(input: LoginInputDTO): Promise<LoginOutputDTO> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isPasswordValid = await this.passwordHasher.compare(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password.');
    }

    const token = this.tokenService.generateToken({ userId: user.id!, email: user.email });

    return {
      token,
      user: {
        id: user.id!,
        name: user.fullName,
        email: user.email,
      },
    };
  }
}