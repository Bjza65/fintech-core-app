import { Account } from "../entities/Account";
import { Transaction } from "../entities/Transactions";
import { User } from "../entities/User";

export interface UserRepository{
    save(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>
}

export interface AccountRepository{
    save(account: Account): Promise<Account>;
    findById(id: string): Promise<Account | null>;
    findByAccountNumber(accountNumber: string): Promise<Account | null>;
    findByUserId(userId: string): Promise<Account[]>
}

export interface TransactionRepository{
    findById(id: string): Promise<Transaction | null>;
    findByAccountId(accountId: string): Promise<Transaction[]>; // Promise es cada que se harán operaciones que se van a demorar en el tiempo como por ejemplo hablar entre sistemas, debemos usar una operacion asincrona, es decir, que se va a usar dicha operacion pero un futuro se esperará una respuesta. Promesa es un tipo de dato que estará esperando a que tenga un resultado, si no se hiciera una promesa se bloquearia la aplicación mientras se realiza la operacion, como un tipo de tarea en background.
    save(transaction: Transaction): Promise<Transaction>;
}