'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [userId, setUserId] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // Kiểm tra ID trong database
        const res = await fetch('/api/check-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: parseInt(userId) })
        });
        const data = await res.json();
        
        if (data.exists) {
            localStorage.setItem('userId', userId);
            router.push('/tours');
        } else {
            alert('ID không tồn tại!');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleLogin} className="p-6 border rounded">
                <h1 className="text-2xl mb-4">Đăng nhập</h1>
                <input
                    type="number"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Nhập ID của bạn"
                    className="border p-2 mb-4 text-black"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Đăng nhập
                </button>
            </form>
        </div>
    );
}