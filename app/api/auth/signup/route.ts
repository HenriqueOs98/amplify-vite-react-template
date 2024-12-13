import { db } from "@/src/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
   try {
       const { email, password, username } = await request.json();
       const result = await db.register(email, password, username);
       
       // Send verification email
       await db.client.collection('users').requestVerification(email);

       return NextResponse.json({ 
           message: "Signup successful. Please check your email to verify your account.",
           record: result.record
       });
   } catch (err: any) {
       return NextResponse.json({ error: err.message || err.toString() }, { status: 500 });
   }
}

