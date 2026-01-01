
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: Check existence or get data (already handled by page render, but good for API)
export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const moment = await db.moment.findFirst({
        where: { user: { username } },
    });

    if (!moment) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(moment);
}

// PATCH: Update Moment
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const body = await req.json();

    try {
        const existingMoment = await db.moment.findFirst({
            where: { user: { username } }
        });

        if (!existingMoment) {
            return NextResponse.json({ error: "Moment not found" }, { status: 404 });
        }

        const moment = await db.moment.update({
            where: { id: existingMoment.id },
            data: {
                message: body.message,
                theme: body.theme,
                atmosphere: body.atmosphere,
                typography: body.typography,
                // We do NOT update targetYear usually
            }
        });
        return NextResponse.json(moment);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

// DELETE: Delete Moment
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    try {
        // Delete all moments for this user (conceptually only one)
        await db.moment.deleteMany({
            where: { user: { username } },
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
