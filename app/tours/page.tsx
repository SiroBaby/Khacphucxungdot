// pages/tours.tsx
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Tour {
    id: number;
    name: string;
    description: string;
    available_seats: number;
}

interface Booking {
    id: number;
    tour_id: number;
    status: string;
    tour_name: string;
}

export default function Tours() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            router.push('/login');
        } else {
            setIsLoggedIn(true);
            fetchTours();
            fetchBookings(userId);
        }
    }, [router]);

    const fetchTours = async () => {
        const res = await fetch('/api/tours');
        const data = await res.json();
        setTours(data);
    };

    const fetchBookings = async (userId: string) => {
        const res = await fetch(`/api/bookings?userId=${userId}`);
        const data = await res.json();
        setBookings(data);
    };

    const bookTour = async (tourId: number) => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                router.push('/login');
                return;
            }

            const res = await fetch('/api/book-tour', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: parseInt(userId), tourId })
            });

            if (!res.ok) {
                const errorText = await res.text();
                let errorMessage;
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message;
                } catch {
                    errorMessage = 'Có lỗi xảy ra khi đặt tour';
                }
                throw new Error(errorMessage);
            }

            const data = await res.json();
            alert(data.message);
            
            // Refresh data after successful booking
            fetchTours();
            fetchBookings(userId);

        } catch (err) {
            alert(`Lỗi: ${err instanceof Error ? err.message : 'Có lỗi xảy ra khi đặt tour'}`);
        }
    };

    const cancelBooking = async (bookingId: number) => {
        try {
            const res = await fetch('/api/cancel-booking', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId })
            });
    
            const data = await res.json();
    
            if (res.ok) {
                alert(data.message);
                const userId = localStorage.getItem('userId');
                fetchTours();
                if (userId) fetchBookings(userId);
            } else {
                throw new Error(data.message || 'Có lỗi xảy ra');
            }
        } catch (err) {
            alert(`Lỗi khi hủy đặt tour: ${err instanceof Error ? err.message : 'Có lỗi xảy ra'}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        router.push('/login');
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center p-4">
                <h1>Danh sách Tour</h1>
                {isLoggedIn && (
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500 text-white p-2 rounded"
                    >
                        Đăng xuất
                    </button>
                )}
            </div>
            <div className="mb-8">
                <h2 className="text-xl font-bold">Tours Đã Đặt</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {bookings.map(booking => (
                        <div key={booking.id} className="border p-4 rounded shadow">
                            <h3 className="font-bold">{booking.tour_name}</h3>
                            <p className="text-gray-600">Trạng thái: {booking.status}</p>
                            {booking.status === 'confirmed' && (
                                <button
                                    onClick={() => cancelBooking(booking.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-600"
                                >
                                    Hủy Đặt Tour
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            {tours.map((tour) => (
                <div key={tour.id} className='mb-8'>
                    <h2>{tour.name}</h2>
                    <p>Mô tả: {tour.description}</p>
                    <p>Ghế còn trống: {tour.available_seats}</p>
                    <button 
                        onClick={() => bookTour(tour.id)}
                        disabled={!isLoggedIn}
                        className={`p-2 rounded ${isLoggedIn ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                    >
                        Đặt Tour
                    </button>
                </div>
            ))}
        </div>
    );
}
