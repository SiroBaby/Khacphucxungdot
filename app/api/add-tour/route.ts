import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        if (!data.name || !data.description || !data.price || 
            !data.start_date || !data.end_date || !data.max_seats) {
            return NextResponse.json(
                { message: 'Thiếu thông tin bắt buộc' },
                { status: 400 }
            );
        }

        const available_seats = data.max_seats;

        const query = `
            INSERT INTO tours (
                name,
                description,
                start_date,
                end_date,
                price,
                max_seats,
                available_seats
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [
            data.name,
            data.description,
            new Date(data.start_date),
            new Date(data.end_date),
            data.price,
            data.max_seats,
            available_seats
        ]);

        return NextResponse.json({
            message: 'Thêm tour thành công',
            data: result
        }, { status: 201 });

    } catch (error) {
        console.error('Lỗi khi thêm tour:', error);
        return NextResponse.json(
            { message: 'Lỗi khi thêm tour', error },
            { status: 500 }
        );
    }
}

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