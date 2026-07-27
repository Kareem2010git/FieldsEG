import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Fields() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const { data, error } = await supabase.from('fields').select('*');
      if (error) throw error;
      setFields(data || []);
    } catch (err) {
      console.error('خطأ في جلب الملاعب:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-lg">جاري تحميل الملاعب...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">اختر الملعب المناسب</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{field.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{field.description || 'ملعب مجهز بالكامل للحجوزات'}</p>
              <p className="text-green-600 font-semibold mb-4">السعر: {field.price_per_hour} ج.م / ساعة</p>
            </div>

            <button
              onClick={() => navigate(`/book/${field.id}`)}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              احجز هذا الملعب
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}