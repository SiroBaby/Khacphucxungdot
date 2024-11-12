import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { userId } = await req.json();
    
    // Thay thế phần này bằng logic kiểm tra database thực tế
    // Ví dụ giả định các ID từ 1-100 là hợp lệ
    const exists = userId >= 1 && userId <= 100;

    return NextResponse.json({ exists });
}