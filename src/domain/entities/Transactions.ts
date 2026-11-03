import Decimal from "decimal.js";
import { InvalidPropValueError } from "../exceptions/DomainError";

export interface TransactionProps {
    id?: string;
    amount: Decimal;
    status: TransactionStatus;
    description: string;
    createdAt: Date;
}

export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

export abstract class Transaction {
    private readonly props: TransactionProps;

    protected constructor(props: TransactionProps) {
        this.props = props;
    }
    
    public static validateAmount(props: TransactionProps,  errorMessage: string): void{
        if(props.amount.lte(0)){
            throw new InvalidPropValueError(errorMessage);
        }
    }

    //Getters
    get id(): string {return this.props.id?? '';} 
    get amount(): Decimal{return this.props.amount;}
    get status(): TransactionStatus{return this.props.status;}
    get description(): string{return this.props.description;}
    get createdAt(): Date{return this.props.createdAt;}

    markAsCompleted(): void {
    this.props.status = "COMPLETED";
  }

  markAsFailed(): void {
    this.props.status = "FAILED";
  }

}

export interface DepositProps extends TransactionProps {
  destinationAccountId: string;
}

export class Deposit extends Transaction {
    private readonly destinationAccountId: string;

    private constructor(props: DepositProps) {
        super(props);
        this.destinationAccountId = props.destinationAccountId;
    }

    public static create(props: DepositProps): Deposit{
        Transaction.validateAmount(props, "El monto de la transacción debe ser mayor que cero");
        return new Deposit(props);
    }

    get destinationAccount(): string{return this.destinationAccountId;}

}

export interface WithdrawalProps extends TransactionProps {
  sourceAccountId: string;
}

export class Withdrawal extends Transaction {
    private readonly sourceAccountId: string;

    private constructor(props: WithdrawalProps) {
        super(props);
        this.sourceAccountId = props.sourceAccountId;
    }

    public static create(props: WithdrawalProps): Withdrawal {
        Transaction.validateAmount(props, "El monto de la transacción debe ser mayor que cero");
        return new Withdrawal(props);
    }

    get sourceAccount(): string {return this.sourceAccountId;}
}

export interface TransferProps extends TransactionProps{
    sourceAccountId: string;
    destinationAccountId: string;
}

export class Transfer extends Transaction {
    private readonly sourceAccountId: string;
    private readonly destinationAccountId: string;

    private constructor(props: TransferProps) {
        super(props);
        this.sourceAccountId = props.sourceAccountId;
        this.destinationAccountId = props.destinationAccountId;
    }

    public static create(props: TransferProps): Transfer {
        
        Transaction.validateAmount(props, "El monto de la transacción debe ser mayor que cero");
        
        if (props.sourceAccountId == props.destinationAccountId) {
            throw new InvalidPropValueError("La cuenta de origen y la de destino, no pueden ser las mismas.");
        }
        
        return new Transfer(props);
    }

    get sourceAccount(): string { return this.sourceAccountId; }
    get destinationAccount(): string { return this.destinationAccountId; }

}