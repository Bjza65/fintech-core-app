import { Account } from "../../domain/entities/Account";
import { Account as PrismaAccount, Prisma} from "../../generated/prisma/client";

export class AccountMapper {
    public static toDomain(prismaAccount: PrismaAccount): Account {
        return Account.create({
            id: prismaAccount.id,
            accountNumber: prismaAccount.accountNumber,
            balanceAcc: prismaAccount.balanceAcc,
            userId: prismaAccount.userId,
            accountStatus: prismaAccount.accountStatus,
            createdAt: prismaAccount.createdAt
        })
    }

    public static toPersistence(domainAccount: Account) : Prisma.AccountUncheckedCreateInput {
        return {
            id: domainAccount.id,
            accountNumber: domainAccount.accountNumber,
            balanceAcc: domainAccount.balanceAcc,
            userId: domainAccount.userid,
            accountStatus: domainAccount.accountStatus,
            createdAt: domainAccount.createdAt
        };
    }
} 