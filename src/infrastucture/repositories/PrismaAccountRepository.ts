import { Account } from "../../domain/entities/Account";
import { AccountRepository } from "../../domain/repositories/Repositories";
import { PrismaClient } from "../../generated/prisma/client";

export class PrismaAccountRepository implements AccountRepository {
    
    constructor(private readonly prisma: PrismaClient) {}
    
    save(account: Account): Promise<Account> {
        throw new Error("Method not implemented.");
    }
    
    async findById(id: string): Promise<Account | null> {
        
    }
    
    findByAccountNumber(accountNumber: string): Promise<Account | null> {
        throw new Error("Method not implemented.");
    }
    
    findByUserId(userId: string): Promise<Account[]> {
        throw new Error("Method not implemented.");
    }

} //clase 4 - 1hr 19min