import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Link } from 'react-router-dom'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      // 1. تسجيل المستخدم في نظام Auth مع حفظ الاسم ورقم الهاتف في الـ metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
          }
        }
      })

      if (error) throw error

      alert('تم إنشاء الحساب بنجاح! يجدر بك تسجيل الدخول الآن.')
      navigate('/login')
    } catch (err) {
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">إنشاء حساب جديد في FieldsEG</h2>
        
        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
            <input 
              type="text" 
              required
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="محمد أحمد"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الموبايل (للتواصل والحجز)</label>
            <input 
              type="tel" 
              required
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="01012345678"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input 
              type="email5" 
              required
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <input 
              type="password" 
              required
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
          >
            {loading ? 'جاري إنشاء الحساب...' : 'تسجيل حساب'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          لديك حساب بالفعل؟ <Link to="/login" className="text-green-600 font-semibold hover:underline">سجل دخولك</Link>
        </p>
      </div>
    </div>
  )
}