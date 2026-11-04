"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
class TransactionController {
    transferMoneyUseCase;
    depositUseCase;
    withdrawalUseCase;
    getTransactionHistoryUseCase;
    constructor(transferMoneyUseCase, depositUseCase, withdrawalUseCase, getTransactionHistoryUseCase) {
        this.transferMoneyUseCase = transferMoneyUseCase;
        this.depositUseCase = depositUseCase;
        this.withdrawalUseCase = withdrawalUseCase;
        this.getTransactionHistoryUseCase = getTransactionHistoryUseCase;
    }
    transfer = async (req, res, next) => {
        try {
            const result = await this.transferMoneyUseCase.execute(req.body, req.user.userId);
            res.status(201).json({
                status: 'success',
                message: 'Transferencia ejecutada de forma satisfactoria',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    deposit = async (req, res, next) => {
        try {
            const result = await this.depositUseCase.execute(req.body, req.user.userId);
            res.status(201).json({
                status: 'success',
                message: 'Depósito ejecutado de forma satisfactoria',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    withdrawal = async (req, res, next) => {
        try {
            const result = await this.withdrawalUseCase.execute(req.body, req.user.userId);
            res.status(201).json({
                status: 'success',
                message: 'Retiro ejecutado de forma satisfactoria',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getHistory = async (req, res, next) => {
        try {
            const accountId = Array.isArray(req.params.accountId) ? req.params.accountId[0] : req.params.accountId;
            const history = await this.getTransactionHistoryUseCase.execute({ accountId });
            res.status(200).json({
                status: 'success',
                data: history,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.TransactionController = TransactionController;
