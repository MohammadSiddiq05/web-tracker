import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser || !clerkUser.primaryEmailAddress?.emailAddress) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const email = clerkUser.primaryEmailAddress.emailAddress;
        const name = clerkUser.fullName ?? "";

        const [existingUser] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (existingUser) {
            return NextResponse.json(existingUser, { status: 200 });
        }

        const [createdUser] = await db
            .insert(usersTable)
            .values({ email, name })
            .returning();

        if (!createdUser) {
            return NextResponse.json(
                { error: "Failed to create user" },
                { status: 500 }
            );
        }

        return NextResponse.json(createdUser, { status: 201 });

    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || "Server error" },
            { status: 500 }
        );
    }
}