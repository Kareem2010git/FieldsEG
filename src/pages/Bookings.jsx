import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Booking() {
  const { fieldId } = useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      alert('من فضلك اختر التاريخ ووقت الحجز أولاً!');
      return;
    }

    setLoading(true);
    try {
      // 1. جلب بيانات المستخدم المسجل حالياً من Supabase Auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('يجب تسجيل الدخول أولاً لإتمام الحجز!');
        navigate('/login');
        return;
      }

      // 2. جلب رقم الأدمن الحقيقي حصراً من جدول admins ديناميكياً
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('phone')
        .single();

      if (adminError || !adminData?.phone) {
        alert('لم يتم العثور على رقم الأدمن في قاعدة البيانات، برجاء إضافته في جدول admins');
        setLoading(false);
        return;
      }

      const adminPhone = adminData.phone;

      // 3. تسجيل الحجز في جدول bookings مع الـ user_id الحقيقي
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            field_id: fieldId,
            booking_date: selectedDate,
            time_slot: selectedTime,
            status: 'pending_payment',
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // 4. بناء الرابط المختصر والمباشر للإيصال
      const baseUrl = window.location.origin;
      const uploadLink = `${baseUrl}/?fieldId=${booking.id}`;

      // 5. تجهيز الرسالة المبسطة لتتوافق تماماً مع واتساب ويب وتفتح بال النص
      const message = `مرحباً، تم حجز الملعب بنجاح.\nالتاريخ: ${selectedDate}\nالوقت: ${selectedTime}\n\nبرجاء رفع الإيصال من هنا:\n${uploadLink}`;
      
      const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      navigate('/');

    } catch (err) {
      alert('حدث خطأ أثناء الحجز: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-2xl shadow-lg border border-gray-100" dir="rtl">
      <h2 className="text-xl font-bold mb-6 text-gray-800">تأكيد حجز الملعب</h2>

      <form onSubmit={handleBooking} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">تاريخ الحجز:</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">وقت الحجز (الساعة):</label>
          <input 
            type="text" 
            placeholder="مثال: 08:00 مساءً"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 shadow-md mt-4"
        >
          {loading ? 'جاري إتمام الحجز...' : 'تأكيد الحجز والانتقال للواتساب'}
        </button>
      </form>
    </div>
  );
}
