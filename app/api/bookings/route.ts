// app/api/bookings/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface Booking extends RowDataPacket {
    id: number;
    tour_id: number;
    status: string;
    tour_name: string;
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { message: 'Missing userId parameter' },
                { status: 400 }
            );
        }

        const [bookings] = await db.query<Booking[]>(
            `SELECT b.*, t.name as tour_name 
             FROM bookings b 
             JOIN tours t ON b.tour_id = t.id 
             WHERE b.user_id = ?`,
            [userId]
        );

        return NextResponse.json(bookings);

    } catch (error) {
        console.error('Fetch bookings error:', error);
        return NextResponse.json(
            { 
                message: 'Lỗi khi lấy danh sách đặt tour',
                error: error instanceof Error ? error.message : 'Database error'
            },
            { status: 500 }
        );
    }
}