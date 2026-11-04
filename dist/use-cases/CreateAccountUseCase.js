"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountUseCase = void 0;
const decimal_js_1 = __importDefault(require("decimal.js"));
const FinancialErrors_1 = require("../domain/exceptions/FinancialErrors");
const Account_1 = require("../domain/entities/Account");
class CreateAccountUseCase {
    accountRepository;
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async execute(input) {
        const initialAmount = input.initialBalance?.toNumber() ?? 0;
        if (initialAmount < 0) {
            throw new FinancialErrors_1.InvalidAmountError("El monto de la operación debe ser un valor estricto mayor a cero.");
        }
        const accountNumber = `ACC-${Math.floor(100000000 + Math.random() * 900000000)}`;
        const newAccount = Account_1.Account.create({
            id: crypto.randomUUID(),
            accountNumber,
            balanceAcc: new decimal_js_1.default(initialAmount),
            userId: input.userId,
            accountStatus: "ACTIVE",
            createdAt: new Date()
        });
        const savedAccount = await this.accountRepository.save(newAccount);
        return {
            id: savedAccount.id,
            accountNumber: savedAccount.accountNumber,
            balance: new decimal_js_1.default(savedAccount.balanceAcc),
            status: savedAccount.accountStatus,
            userId: savedAccount.userid,
            createdAt: savedAccount.createdAt,
        };
    }
}
exports.CreateAccountUseCase = CreateAccountUseCase;
