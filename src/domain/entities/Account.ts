import Decimal from "decimal.js";
import { InvalidPropValueError } from "../exceptions/DomainError";
import { get } from "node:http";
import { error } from "node:console";
import { AccountFrozenError, InsufficientBalanceError, InvalidAmountError } from "../exceptions/FinancialErrors";

export type AccountStatus = "ACTIVE" | "FROZEN";

export interface AccountProps{
    id?: string;
    accountNumber: string;
    balanceAcc: Decimal;
    accountStatus: AccountStatus;
    createdAt?: Date;
    userId: string;
}

export class Account{
    private readonly props: AccountProps;

    private constructor(props: AccountProps) {
        this.props = props;
    }

    public static create(props: AccountProps): Account{
        if (props.balanceAcc.isNegative()){
            throw new InvalidPropValueError(`Una cuenta no puede ser inicializada con saldo negativo`);
        }
        if(props.createdAt === undefined){
            props.createdAt = new Date()
        }
        return new Account(props);
    }
    
    get id(): string | undefined {return this.props.id;} 
    get accountNumber(): string {return this.props.accountNumber;}
    get balanceAcc(): Decimal {return this.props.balanceAcc;}
    get accountStatus(): AccountStatus {return this.props.accountStatus;}
    get createdAt(): Date | undefined {return this.props.createdAt;}
    get userid(): string {return this.props.userId;}

    //Comportamiento de clase

    public deposit(amount: Decimal): void{
        if(amount.lte(0)){
            throw new InvalidAmountError(`El monto del depósito debe ser estrictamente mayor a cero.`);
        }
        this.props.balanceAcc = this.props.balanceAcc.plus(amount);
    }

    public withdraw(amount: Decimal): void{
        if(amount.lte(0)){
            throw new InvalidAmountError(`El monto del retiro debe ser estrictamente mayor a cero.`);
        }
        if(this.props.balanceAcc.lessThan(amount)){
            throw new InsufficientBalanceError(this.id!);
        }
        if(this.props.accountStatus === "FROZEN"){
            throw new AccountFrozenError(this.id!);
        }
        this.props.balanceAcc = this.props.balanceAcc.minus(amount);
    }

    public freeze(): void{
        if(this.props.accountStatus === "FROZEN"){
            throw new InvalidPropValueError("La cuenta ya se encuentra congelada.");
        }
        this.props.accountStatus = "FROZEN";
    }

    public unfreeze(): void{
        if(this.props.accountStatus === "ACTIVE"){
            throw new InvalidPropValueError("La cuenta ya se encuentra activa.");
        }
        this.props.accountStatus = "ACTIVE";
    }
}