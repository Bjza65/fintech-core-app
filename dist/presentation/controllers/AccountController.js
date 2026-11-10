"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
class AccountController {
    createAccountUseCase;
    getUserAccountsUseCase;
    getBalanceUseCase;
    freezeAccountUseCase;
    unfreezeAccountUseCase;
    constructor(createAccountUseCase, getUserAccountsUseCase, getBalanceUseCase, freezeAccountUseCase, unfreezeAccountUseCase) {
        this.createAccountUseCase = createAccountUseCase;
        this.getUserAccountsUseCase = getUserAccountsUseCase;
        this.getBalanceUseCase = getBalanceUseCase;
        this.freezeAccountUseCase = freezeAccountUseCase;
        this.unfreezeAccountUseCase = unfreezeAccountUseCase;
    }
    createAccount = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const newAccount = await this.createAccountUseCase.execute({ userId });
            res.status(201).json({
                status: 'success',
                data: newAccount,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getUserAccounts = async (req, res, next) => {
        try {
            const userId = req.user.userId;
            const accounts = await this.getUserAccountsUseCase.execute({ userId });
            res.status(200).json({
                status: 'success',
                data: accounts,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getBalance = async (req, res, next) => {
        try {
            const accountId = Array.isArray(req.params.accountId) ? req.params.accountId[0] : req.params.accountId;
            const userId = req.user.userId;
            const balance = await this.getBalanceUseCase.execute({ accountId }, userId);
            res.status(200).json({
                status: 'success',
                data: balance,
            });
        }
        catch (error) {
            next(error);
        }
    };
    freezeAccount = async (req, res, next) => {
        try {
            const accountId = Array.isArray(req.params.accountId) ? req.params.accountId[0] : req.params.accountId;
            const userId = req.user.userId;
            await this.freezeAccountUseCase.execute(accountId, userId);
            res.status(200).json({
                status: 'success',
                message: 'Cuenta congelada correctamente',
            });
        }
        catch (error) {
            next(error);
        }
    };
    unfreezeAccount = async (req, res, next) => {
        try {
            const accountId = Array.isArray(req.params.accountId) ? req.params.accountId[0] : req.params.accountId;
            const userId = req.user.userId;
            await this.unfreezeAccountUseCase.execute(accountId, userId);
            res.status(200).json({
                status: 'success',
                message: 'Cuenta descongelada correctamente',
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AccountController = AccountController;
