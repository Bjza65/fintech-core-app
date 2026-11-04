import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

//Infraestructura
import { BcryptPasswordHasher } from '../infrastucture/services/BcryptPasswordHasher';
import { JwtTokenService } from '../infrastucture/services/JwtTokenService';
import { PrismaUserRepository } from '../infrastucture/repositories/PrismaUserRepository';
import { PrismaAccountRepository } from '../infrastucture/repositories/PrismaAccountRepository';
import { PrismaTransactionRepository } from '../infrastucture/repositories/PrismaTransactionRepository';

// Use Cases
import { RegisterUserUseCase } from '../use-cases/RegisterUserUseCase';
import { LoginUseCase } from '../use-cases/LoginUseCase';
import { CreateAccountUseCase } from '../use-cases/CreateAccountUseCase';
import { GetUserAccountsUseCase } from '../use-cases/GetUserAccountsUseCase';
import { GetBalanceUseCase } from '../use-cases/GetBalanceUserCase';
import { FreezeAccountUseCase } from '../use-cases/FreezeAccountUseCase';
import { UnfreezeAccountUseCase } from '../use-cases/UnfreezeAccountUseCase';
import { TransferMoneyUseCase } from '../use-cases/TransferMoneyUseCase';
import { DepositUseCase } from '../use-cases/DepositUseCase';
import { WithdrawalUseCase } from '../use-cases/WithdrawalUseCase';
import { GetTransactionHistoryUseCase } from '../use-cases/GetTransactionHistoryUseCase';

// Controladores
import { AuthController } from './controllers/AuthController';
import { AccountController } from './controllers/AccountController';
import { TransactionController } from './controllers/TransactionController';
import { AuthMiddleware } from './middlewares/AuthMiddleware';
import { validateRequest } from './middlewares/validateRequest';
import { errorHandler } from './middlewares/ErrorHandler';

// DTO Schemas
import { RegisterUserSchema, LoginSchema } from './dtos/AuthDTOs';
import { TransferMoneySchema, DepositMoneySchema, WithdrawalMoneySchema } from './dtos/TransactionDTOs';

export const createApp = (): Application => {
  const app = express();

  // Middlewares globales de Express
  app.use(cors());
  app.use(express.json());

  // 1. Instanciación de Base de datos (Capa de Infraestructura)
  const prisma = new PrismaClient({
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    }),
  });

  // 2. Instanciación de Servicios (Capa de Infraestructura)
  const passwordHasher = new BcryptPasswordHasher(10);
  const tokenService = new JwtTokenService();

  // 3. Instanciación de Repositorios (Capa de Infraestructura)
  const userRepository = new PrismaUserRepository(prisma);
  const accountRepository = new PrismaAccountRepository(prisma);
  const transactionRepository = new PrismaTransactionRepository(prisma);

  // 4. Instanciación de Casos de Uso (Capa de Aplicación)
  const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
  const loginUseCase = new LoginUseCase(userRepository, tokenService, passwordHasher);
  const createAccountUseCase = new CreateAccountUseCase(accountRepository);
  const getUserAccountsUseCase = new GetUserAccountsUseCase(accountRepository);
  const getBalanceUseCase = new GetBalanceUseCase(accountRepository);
  const freezeAccountUseCase = new FreezeAccountUseCase(accountRepository);
  const unfreezeAccountUseCase = new UnfreezeAccountUseCase(accountRepository);
  const transferMoneyUseCase = new TransferMoneyUseCase(accountRepository);
  const depositUseCase = new DepositUseCase(accountRepository);
  const withdrawalUseCase = new WithdrawalUseCase(accountRepository);
  const getTransactionHistoryUseCase = new GetTransactionHistoryUseCase(transactionRepository);

  // 5. Instanciación de Controladores y Guardias HTTP (Capa de Presentación)
  const authController = new AuthController(registerUserUseCase, loginUseCase);
  const accountController = new AccountController(
    createAccountUseCase,
    getUserAccountsUseCase,
    getBalanceUseCase,
    freezeAccountUseCase,
    unfreezeAccountUseCase
  );
  const transactionController = new TransactionController(
    transferMoneyUseCase,
    depositUseCase,
    withdrawalUseCase,
    getTransactionHistoryUseCase
  );
  const authMiddleware = new AuthMiddleware(tokenService);

  // 6. Definición y Enrutamiento de la API REST
  // --- Rutas Públicas (Autenticación) ---
  app.post('/api/auth/register', validateRequest(RegisterUserSchema), authController.register);
  app.post('/api/auth/login', validateRequest(LoginSchema), authController.login);

  // --- Rutas Protegidas (Cuentas) ---
  app.get('/api/accounts', authMiddleware.handle, accountController.getUserAccounts);
  app.post('/api/accounts', authMiddleware.handle, accountController.createAccount);
  app.get('/api/accounts/:accountId/balance', authMiddleware.handle, accountController.getBalance);
  app.patch('/api/accounts/:accountId/freeze', authMiddleware.handle, accountController.freezeAccount);
  app.patch('/api/accounts/:accountId/unfreeze', authMiddleware.handle, accountController.unfreezeAccount);

  // --- Rutas Protegidas (Transacciones) ---
  app.post('/api/transactions/transfer', authMiddleware.handle, validateRequest(TransferMoneySchema), transactionController.transfer);
  app.post('/api/transactions/deposit', authMiddleware.handle, validateRequest(DepositMoneySchema), transactionController.deposit);
  app.post('/api/transactions/withdrawal', authMiddleware.handle, validateRequest(WithdrawalMoneySchema), transactionController.withdrawal);
  app.get('/api/transactions/history/:accountId', authMiddleware.handle, transactionController.getHistory);

  // 7. Middleware Global de Manejo de Errores (Obligatoriamente al final)
  app.use(errorHandler);

  return app;
}