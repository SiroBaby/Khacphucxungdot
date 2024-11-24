'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TourInput {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    price: number;
    max_seats: number;
}

export default function AddTour() {
    const router = useRouter();
    const [tourData, setTourData] = useState<TourInput>({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        price: 0,
        max_seats: 0
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTourData(prev => ({
            ...prev,
            [name]: ['price', 'max_seats'].includes(name) ? parseInt(value) || 0 : value
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        //localStorage.removeItem('userRole');
        router.push('/login');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const res = await fetch('/api/add-tour', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tourData)
            });

            if (!res.ok) {
                const responseData = await res.json();
                throw new Error(responseData.message || 'Có lỗi xảy ra khi thêm tour');
            }

            alert('Thêm tour thành công!');
            router.push('/tours');
        } catch (err) {
            console.error('Submit error:', err);
            alert(`Lỗi: ${err instanceof Error ? err.message : 'Có lỗi xảy ra khi thêm tour'}`);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Thêm Tour Mới</h1>
                <button 
                    onClick={handleLogout}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    aria-label="Đăng xuất"
                >
                    Đăng xuất
                </button>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto" aria-label="Form thêm tour mới">
                <div className="mb-4">
                    <label htmlFor="tour-name" className="block text-gray-700 text-sm font-bold mb-2">
                        Tên Tour:
                    </label>
                    <input
                        id="tour-name"
                        type="text"
                        name="name"
                        value={tourData.name}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                        aria-label="Tên Tour"
                        placeholder="Nhập tên tour"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="tour-description" className="block text-gray-700 text-sm font-bold mb-2">
                        Mô tả:
                    </label>
                    <textarea
                        id="tour-description"
                        name="description"
                        value={tourData.description}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                        required
                        aria-label="Mô tả tour"
                        placeholder="Nhập mô tả chi tiết về tour"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="start-date" className="block text-gray-700 text-sm font-bold mb-2">
                        Ngày bắt đầu:
                    </label>
                    <input
                        id="start-date"
                        type="date"
                        name="start_date"
                        value={tourData.start_date}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                        aria-label="Ngày bắt đầu"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="end-date" className="block text-gray-700 text-sm font-bold mb-2">
                        Ngày kết thúc:
                    </label>
                    <input
                        id="end-date"
                        type="date"
                        name="end_date"
                        value={tourData.end_date}
                        onChange={handleInputChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                        aria-label="Ngày kết thúc"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                        Giá tour:
                    </label>
                    <input
                        id="price"
                        type="number"
                        name="price"
                        value={tourData.price}
                        onChange={handleInputChange}
                        min="0"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                        aria-label="Giá tour"
                        placeholder="Nhập giá tour"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="max-seats" className="block text-gray-700 text-sm font-bold mb-2">
                        Số chỗ tối đa:
                    </label>
                    <input
                        id="max-seats"
                        type="number"
                        name="max_seats"
                        value={tourData.max_seats}
                        onChange={handleInputChange}
                        min="1"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                        aria-label="Số chỗ tối đa"
                        placeholder="Nhập số lượng chỗ tối đa"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        aria-label="Thêm tour mới"
                    >
                        Thêm Tour
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/tours')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        aria-label="Quay lại trang danh sách tour"
                    >
                        Danh Sách Tour
                    </button>
                </div>
            </form>
        </div>
    );
}
