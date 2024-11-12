// app/api/book-tour/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface Tour extends RowDataPacket {
    available_seats: number;
}

export async function POST(req: Request) {
    let connection;
    try {
        // Parse request body
        const body = await req.json();
        const { userId, tourId } = body;

        if (!userId || !tourId) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get connection from pool
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Check available seats
        const [tours] = await connection.query<Tour[]>(
            "SELECT available_seats FROM tours WHERE id = ?", 
            [tourId]
        );

        const tour = tours[0];
        if (!tour || tour.available_seats <= 0) {
            await connection.rollback();
            return NextResponse.json(
                { message: 'Tour đã hết chỗ hoặc không tồn tại.' },
                { status: 400 }
            );
        }

        // Update seats
        await connection.query(
            "UPDATE tours SET available_seats = available_seats - 1 WHERE id = ?",
            [tourId]
        );

        // Create booking
        const [result] = await connection.query<ResultSetHeader>(
            "INSERT INTO bookings (user_id, tour_id, status) VALUES (?, ?, 'confirmed')",
            [userId, tourId]
        );

        await connection.commit();

        return NextResponse.json({
            success: true,
            message: 'Đặt tour thành công!',
            bookingId: result.insertId
        });

    } catch (error) {
        console.error('Book tour error:', error);
        if (connection) {
            await connection.rollback();
        }
        return NextResponse.json(
            { 
                message: 'Lỗi khi đặt tour', 
                error: error instanceof Error ? error.message : 'Database error' 
            },
            { status: 500 }
        );
    } finally {
        if (connection) {
            connection.release();
        }
    }
}