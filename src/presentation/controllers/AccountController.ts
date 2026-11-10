import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import { GetUserAccountsUseCase } from '../../use-cases/GetUserAccountsUseCase';
import { CreateAccountUseCase } from '../../use-cases/CreateAccountUseCase';
import { GetBalanceUseCase } from '../../use-cases/GetBalanceUserCase';
import { FreezeAccountUseCase } from '../../use-cases/FreezeAccountUseCase';
import { UnfreezeAccountUseCase } from '../../use-cases/UnfreezeAccountUseCase';

export class AccountController {
  constructor(
    private readonly createAccountUseCase: CreateAccountUseCase,
    private readonly getUserAccountsUseCase: GetUserAccountsUseCase,
    private readonly getBalanceUseCase: GetBalanceUseCase,
    private readonly freezeAccountUseCase: FreezeAccountUseCase,
    private readonly unfreezeAccountUseCase: UnfreezeAccountUseCase
  ) {}

  createAccount = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const newAccount = await this.createAccountUseCase.execute({ userId });

      res.status(201).json({
        status: 'success',
        data: newAccount,
      });
    } catch (error) {
      next(error);
    }
  };

getUserAccounts = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.userId;
      const accounts = await this.getUserAccountsUseCase.execute({ userId });

      res.status(200).json({
        status: 'success',
        data: accounts,
      });
    } catch (error) {
      next(error);
    }
  };

  getBalance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accountId = Array.isArray(req.params.accountId) ? req.params.accountId[0] : req.params.accountId;
      const userId = req.user!.userId;
      const balance = await this.getBalanceUseCase.execute({ accountId }, userId);

      res.status(200).json({
        status: 'success',
        data: balance,
      });
    } catch (error) {
      next(error);
    }
  };

  freezeAccount = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accountId = Array.isArray(req.params.accountId) ? req.params.accountId[0] : req.params.accountId;
      const userId = req.user!.userId;
      await this.freezeAccountUseCase.execute(accountId, userId);

      res.status(200).json({
        status: 'success',
        message: 'Cuenta congelada correctamente',
      });
    } catch (error) {
      next(error);
    }
  };

  unfreezeAccount = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const accountId = Array.isArray(req.params.accountId) ? req.params.accountId[0] : req.params.accountId;
      const userId = req.user!.userId;
      await this.unfreezeAccountUseCase.execute(accountId, userId);

      res.status(200).json({
        status: 'success',
        message: 'Cuenta descongelada correctamente',
      });
    } catch (error) {
      next(error);
    }
  };
}