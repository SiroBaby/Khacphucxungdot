// app/api/cancel-booking/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface Booking extends RowDataPacket {
    tour_id: number;
}

export async function POST(req: Request) {
    let connection;
    try {
        const { bookingId } = await req.json();

        // Get connection from pool
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Check booking exists and not already cancelled
        const [bookings] = await connection.query<Booking[]>(
            "SELECT tour_id FROM bookings WHERE id = ? AND status = 'confirmed'", 
            [bookingId]
        );

        const booking = bookings[0];
        if (!booking) {
            await connection.rollback();
            return NextResponse.json(
                { message: "Đặt chỗ không tồn tại hoặc đã bị hủy." },
                { status: 404 }
            );
        }

        // Cancel booking and update seats
        await connection.query(
            "UPDATE bookings SET status = 'cancelled' WHERE id = ?",
            [bookingId]
        );
        
        await connection.query(
            "UPDATE tours SET available_seats = available_seats + 1 WHERE id = ?",
            [booking.tour_id]
        );

        await connection.commit();

        return NextResponse.json({
            success: true,
            message: "Hủy đặt chỗ thành công!"
        });

    } catch (error) {
        console.error('Cancel booking error:', error);
        if (connection) {
            await connection.rollback();
        }
        return NextResponse.json(
            { 
                message: 'Lỗi khi hủy đặt chỗ.',
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