"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeTransaction = (obj) => {
    const serialized = {...obj}
    if(obj.balance) {
        serialized.balance = obj.balance.toNumber()
    }
} 

export async function createAccount(data) {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error("User not authenticated");
        }

        const user = await db.user.findUnique({
            where: { clerkUserId : userId },
        })
        if (!user) {
            throw new Error("User not found in the database");
        }
        
        // Convert balance to a float and validate it before saving
        const balanceFloat = parseFloat(data.balance);
        if(isNaN(balanceFloat) || balanceFloat < 0) {
            throw new Error("Invalid balance amount");
        }

        //Check if this is the first account for the user
        const existingAccount = await db.account.findMany({
            where: { userId: user.id },
        });

        const shouldBeDefaultAccount = existingAccount.length === 0 ? true : data.isDefault; 
        
        // If this is default account, set all other accounts to not default
        if(shouldBeDefaultAccount) {
            await db.account.updateMany({
                where: { userId: user.id, isDefault : true },
                data: { isDefault: false },
            });
        }

        const account = await db.account.create({
            data: {
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefaultAccount,
            },
        });
        const serializedAccount = serializeTransaction(account);
        revalidatePath('/dashboard');
        return { success : true, data: serializedAccount };
    } catch (error) {
        console.error("Error creating account:", error);
        throw new Error("Failed to create account. Please try again later.");   
    }
}