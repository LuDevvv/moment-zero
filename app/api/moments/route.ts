import { db } from "@/lib/db";
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

        // Check if username exists (Conflict if user exists)
        const existingUser = await db.user.findUnique({
            where: { username: data.username },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Username already taken" },
                { status: 409 }
            );
        }

        // Create User AND Moment atomically
        const user = await db.user.create({
            data: {
                username: data.username,
                moments: {
                    create: {
                        theme: data.theme,
                        atmosphere: data.atmosphere,
                        typography: data.typography,
                        message: data.message || "",
                        targetYear: data.targetYear,
                    }
                }
            },
            include: { moments: true }
        });

        return NextResponse.json({ success: true, username: user.username });
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
