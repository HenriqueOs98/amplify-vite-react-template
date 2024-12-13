import { db } from "@/src/db";
import { cookies } from 'next/headers';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();
        const result = await db.authenticate(email, password);
        
        if (!result.record.verified) {
            return NextResponse.json({ error: "Please verify your email before logging in." }, { status: 403 });
        }

        const { record, token } = result;
        record.token = token;
        cookies().set('pb_auth', db.client.authStore.exportToCookie());
        return NextResponse.json(record);
    } catch (err: any) {
        return NextResponse.json({ error: err.message || err.toString() }, { status: 500 });
    }
}

