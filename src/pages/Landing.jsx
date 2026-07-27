import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-sm bg-white sticky top-0 z-50">
        <div className="text-2xl font-black text-green-600 tracking-wider">
          Fields<span className="text-gray-900">EG</span>
        </div>
        <div className="space-x-4 space-x-reverse">
          <Link to="/fields" className="text-gray-600 hover:text-green-600 font-medium">الملاعب</Link>
          <Link to="/login" className="bg-green-600 text-white px-5 py-2 rounded-full font-bold hover:bg-green-700 transition">تسجيل الدخول</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="md:w-1/2 space-y-6 text-right">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            احجز ملعبك المفضّل بكل <span className="text-green-600">سهولة</span>
          </h1>
          <p className="text-lg text-gray-600">
            منصة FieldsEG بتوفر عليك وقت وجهد في البحث عن ملاعب كرة القدم وحجزها في أي وقت ومن أي مكان.
          </p>
          <div className="space-x-4 space-x-reverse">
            <Link to="/fields" className="bg-green-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-green-700 transition">
              احجز ملعبك دلوقتي
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <div className="w-72 h-72 md:w-96 md:h-96 bg-green-200 rounded-full flex items-center justify-center shadow-inner">
            <img src="" alt=""/>
          </div>
        </div>
      </header>

      {/* Footer / Contact */}
      <footer className="bg-gray-900 text-white py-8 px-8 text-center mt-20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-xl font-black text-green-500 mb-4 md:mb-0">FieldsEG</div>
          <p className="text-gray-400 text-sm">جميع الحقوق محفوظة © 2026 FieldsEG</p>
          <div className="space-x-4 space-x-reverse text-gray-300 mt-4 md:mt-0">
            <span>تواصل معنا: support@fieldseg.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}