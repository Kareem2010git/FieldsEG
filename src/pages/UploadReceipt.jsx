import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function UploadReceipt() {
    const [searchParams] = useSearchParams()
    const fieldId = searchParams.get('fieldId')
    const date = searchParams.get('date')
    const time = searchParams.get('time')

    const [receiptFile, setReceiptFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const navigate = useNavigate()

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!receiptFile) {
            setErrorMsg('الرجاء اختيار صورة إيصال التحويل أولاً.')
            return
        }

        setLoading(true)
        setErrorMsg('')

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('يجب تسجيل الدخول أولاً لإتمام الحجز.')

            // 1. رفع صورة الإيصال إلى Supabase Storage
            const fileExt = receiptFile.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('receipts')
                .upload(filePath, receiptFile)

            if (uploadError) throw uploadError

            // الحصول على الرابط العام للصورة
            const { data: { publicUrl } } = supabase.storage
                .from('receipts')
                .getPublicUrl(filePath)

            // 2. حفظ تفاصيل الحجز في جدول bookings (تم تعديل booking_time إلى booking_date أو إرسال الوقت بالشكل المناسب)
            // 2. حفظ تفاصيل الحجز في جدول bookings
            const { error: insertError } = await supabase
                .from('bookings')
                .insert([
                    {
                        user_id: user.id,
                        field_id: fieldId,
                        booking_date: date,
                        time_slot: time, // تم تعديلها هنا لتطابق عمود القاعدة لديك
                        receipt_url: publicUrl,
                        status: 'pending' // في انتظار مراجعة الأدمن
                    }
                ])

            if (insertError) throw insertError

            alert('تم رفع الإيصال بنجاح! سيتم مراجعة الحجز والتواصل معك قريبًا.')
            navigate('/')
        } catch (err) {
            setErrorMsg(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" dir="rtl">
            <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">رفع إيصال الحجز البنكي</h2>

                {errorMsg && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-1">
                        <p><strong>تاريخ الحجز:</strong> {date || 'غير محدد'}</p>
                        <p><strong>الوقت:</strong> {time || 'غير محدد'}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">صورة إيصال التحويل (صورة واضحة)</label>
                        <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={(e) => setReceiptFile(e.target.files[0])}
                            className="w-full px-3 py-2 border rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
                    >
                        {loading ? 'جاري رفع الإيصال...' : 'تأكيد وإرسال الحجز'}
                    </button>
                </form>
            </div>
        </div>
    )
}