// app/api/tours/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        const [tours] = await db.query("SELECT * FROM tours");
        return NextResponse.json(tours);
    } catch (error) {
        return NextResponse.json(
            { message: 'Lỗi khi lấy danh sách tour', error }, 
            { status: 500 }
        );
    }
}