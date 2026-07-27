import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function AdminDashboard() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isAdminLoggedIn')
        if (!isLoggedIn) {
            navigate('/admin/login')
            return
        }

        fetchBookings()
    }, [navigate])

    const fetchBookings = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setBookings(data || [])
        } catch (err) {
            setErrorMsg(err.message)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', id)

            if (error) throw error
            setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b))
        } catch (err) {
            alert('خطأ أثناء تحديث الحالة: ' + err.message)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('isAdminLoggedIn')
        localStorage.removeItem('adminName')
        navigate('/admin/login')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center" dir="rtl">
                <p className="text-lg text-gray-600">جاري تحميل لوحة التحكم...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6" dir="rtl">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">لوحة تحكم الأدمن - حجوزات الملاعب</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition"
                    >
                        تسجيل الخروج
                    </button>
                </div>

                {errorMsg && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                        {errorMsg}
                    </div>
                )}

                {bookings.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">لا توجد حجوزات حتى الآن.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="bg-gray-100 border-b text-gray-700 text-sm">
                                    <th className="p-3">رقم المستخدم</th>
                                    <th className="p-3">التاريخ والوقت</th>
                                    <th className="p-3">الإيصال</th>
                                    <th className="p-3">الحالة</th>
                                    <th className="p-3">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {bookings.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="p-3 font-mono text-xs text-gray-600">
                                            {item.user_id ? item.user_id.slice(0, 8) + '...' : 'غير معروف'}
                                        </td>
                                        <td className="p-3 text-gray-600">
                                            {item.booking_date} ({item.time_slot})
                                        </td>
                                        <td className="p-3">
                                            {item.receipt_url ? (
                                                <a
                                                    href={item.receipt_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-green-600 hover:underline font-semibold"
                                                >
                                                    عرض الإيصال
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-xs">لم يتم الرفع حتى الان</span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {item.status === 'approved' ? 'مقبول' : item.status === 'rejected' ? 'مرفوض' : 'معلق'}
                                            </span>
                                        </td>
                                        <td className="p-3 space-x-2 space-x-reverse">
                                            <button
                                                onClick={() => updateStatus(item.id, 'approved')}
                                                className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition"
                                            >
                                                قبول
                                            </button>
                                            <button
                                                onClick={() => updateStatus(item.id, 'rejected')}
                                                className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition"
                                            >
                                                رفض
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}