import { getDb } from "@/src/db";
import { users, moments } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const nextYear = new Date().getFullYear() + 1;

// Simple validation schema
const CreateMomentSchema = z.object({
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_-]+$/, "Alphanumeric only"),
    theme: z.string(),
    atmosphere: z.string(),
    typography: z.string(),
    message: z.string().max(280).optional(),
    targetYear: z.number().int().min(2025).max(2100).default(nextYear),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const data = CreateMomentSchema.parse(body);
        const db = await getDb();

        const existingUser = await db.query.users.findFirst({
            where: eq(users.username, data.username),
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 409 }
            );
        }

        const userId = crypto.randomUUID();
        const momentId = crypto.randomUUID();

        // Transaction for atomicity
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (db as any).transaction(async (tx: any) => {
            await tx.insert(users).values({
                id: userId,
                username: data.username,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            await tx.insert(moments).values({
                id: momentId,
                theme: data.theme,
                atmosphere: data.atmosphere,
                typography: data.typography,
                message: data.message || "",
                targetYear: data.targetYear,
                userId: userId,
                createdAt: new Date(),
                updatedAt: new Date(),
                isPublic: true
            });
        });

        return NextResponse.json({ success: true, username: data.username });
    } catch (error) {
        console.error("Failed to create moment:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}


const UpdateMomentSchema = z.object({
    username: z.string(),
    message: z.string().max(280),
    theme: z.string().optional(),
    atmosphere: z.string().optional(),
    typography: z.string().optional(),
});

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const data = UpdateMomentSchema.parse(body);
        const db = await getDb();

        const user = await db.query.users.findFirst({
            where: eq(users.username, data.username),
            with: { moments: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.moments.length > 0) {
            await db.update(moments)
                .set({
                    message: data.message,
                    theme: data.theme,
                    atmosphere: data.atmosphere,
                    typography: data.typography,
                    updatedAt: new Date(),
                })
                .where(eq(moments.id, user.moments[0].id));
        } else {
            await db.insert(moments).values({
                id: crypto.randomUUID(),
                userId: user.id,
                message: data.message,
                theme: data.theme || 'default',
                atmosphere: data.atmosphere || 'void',
                typography: data.typography || 'sans',
                targetYear: nextYear,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        return NextResponse.json({ success: true, username: user.username });
    } catch (error) {
        console.error("Failed to update moment:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
