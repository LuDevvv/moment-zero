
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/src/db";
import { users, moments } from "@/src/db/schema";
import { eq } from "drizzle-orm";

// GET: Check existence or get data
export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const db = await getDb();

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.username, username),
            with: { moments: true }
        });

        const moment = user?.moments[0];

        if (!moment) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(moment);
    } catch (e) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
}

// PATCH: Update Moment
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = await req.json() as any;
    const db = await getDb();

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.username, username),
            with: { moments: true }
        });

        const existingMoment = user?.moments[0];

        if (!existingMoment) {
            return NextResponse.json({ error: "Moment not found" }, { status: 404 });
        }

        const updatedMoment = await db.update(moments)
            .set({
                message: body.message,
                theme: body.theme,
                atmosphere: body.atmosphere,
                typography: body.typography,
                updatedAt: new Date(),
            })
            .where(eq(moments.id, existingMoment.id))
            .returning();

        return NextResponse.json(updatedMoment[0]);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

// DELETE: Delete Moment
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const db = await getDb();

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.username, username),
            with: { moments: true }
        });

        if (user && user.moments.length > 0) {
            await db.delete(moments).where(eq(moments.userId, user.id));
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
