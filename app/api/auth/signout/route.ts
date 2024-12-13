import { db } from "@/src/db";
import { cookies } from 'next/headers';
import { NextResponse } from "next/server";

export async function POST() {
    try {
        db.client.authStore.clear();
        cookies().delete('pb_auth');
        return NextResponse.json({ message: "Signed out successfully" });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || err.toString() }, { status: 500 });
    }
}

