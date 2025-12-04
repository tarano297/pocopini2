import React, { useState } from 'react';
import { LazyImage } from '../components';

const GiftGuide = () => {
  const [selectedAge, setSelectedAge] = useState('all');
  const [selectedOccasion, setSelectedOccasion] = useState('all');

  const ageGroups = [
    { id: 'all', name: 'همه سنین', icon: '👶👧👦' },
    { id: 'newborn', name: 'نوزاد (0-12 ماه)', icon: '👶' },
    { id: 'toddler', name: 'نوپا (1-3 سال)', icon: '🧒' },
    { id: 'preschool', name: 'پیش دبستانی (3-5 سال)', icon: '👧' },
    { id: 'school', name: 'دبستانی (6-12 سال)', icon: '👦' }
  ];

  const occasions = [
    { id: 'all', name: 'همه مناسبت‌ها', icon: '🎁' },
    { id: 'birthday', name: 'تولد', icon: '🎂' },
    { id: 'newborn', name: 'نوزاد تازه متولد شده', icon: '🍼' },
    { id: 'eid', name: 'عید', icon: '🌙' },
    { id: 'nowruz', name: 'نوروز', icon: '🌸' },
    { id: 'back-to-school', name: 'بازگشت به مدرسه', icon: '🎒' }
  ];

  const giftIdeas = [
    {
      id: 1,
      title: 'ست لباس نوزادی',
      description: 'ست کامل شامل بادی، شلوار و کلاه برای نوزادان',
      age: 'newborn',
      occasion: 'newborn',
      price: '۱,۲۰۰,۰۰۰',
      image: '/images/photo2.png',
      items: ['بادی نخی', 'شلوار راحتی', 'کلاه نرم', 'جوراب']
    },
    {
      id: 2,
      title: 'لباس مجلسی دخترانه',
      description: 'پیراهن زیبا برای جشن‌ها و مهمانی‌ها',
      age: 'preschool',
      occasion: 'birthday',
      price: '۲,۵۰۰,۰۰۰',
      image: '/images/photo3.png',
      items: ['پیراهن مجلسی', 'تل مو', 'جوراب شیک']
    }
,
    {
      id: 3,
      title: 'ست پسرانه اسپرت',
      description: 'تیشرت و شلوار راحت برای بازی و فعالیت',
      age: 'school',
      occasion: 'all',
      price: '۱,۸۰۰,۰۰۰',
      image: '/images/photo4.png',
      items: ['تیشرت نخی', 'شلوار جین', 'کفش اسپرت']
    },
    {
      id: 4,
      title: 'لباس عید نوپا',
      description: 'لباس زیبا و راحت برای عید',
      age: 'toddler',
      occasion: 'eid',
      price: '۱,۵۰۰,۰۰۰',
      image: '/images/photo2.png',
      items: ['پیراهن/تیشرت', 'شلوار', 'کفش']
    },
    {
      id: 5,
      title: 'ست نوروزی دخترانه',
      description: 'لباس رنگارنگ برای سال نو',
      age: 'preschool',
      occasion: 'nowruz',
      price: '۲,۲۰۰,۰۰۰',
      image: '/images/photo3.png',
      items: ['پیراهن بهاری', 'کفش', 'تل مو']
    },
    {
      id: 6,
      title: 'لباس بازگشت به مدرسه',
      description: 'لباس راحت و شیک برای مدرسه',
      age: 'school',
      occasion: 'back-to-school',
      price: '۱,۹۰۰,۰۰۰',
      image: '/images/photo4.png',
      items: ['تیشرت', 'شلوار', 'کفش', 'کوله پشتی']
    }
  ];

  const filteredGifts = giftIdeas.filter(gift => {
    const ageMatch = selectedAge === 'all' || gift.age === selectedAge;
    const occasionMatch = selectedOccasion === 'all' || gift.occasion === selectedOccasion;
    return ageMatch && occasionMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-coral via-primary to-pastel-pink overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full opacity-10 blur-2xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-white rounded-full opacity-10 blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center text-white">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <span className="ml-2">🎁</span>
              راهنمای انتخاب هدیه
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
              هدیه مناسب را پیدا کنید
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              با راهنمای ما، بهترین هدیه را برای کودکان عزیزتان انتخاب کنید
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                انتخاب بر اساس سن
              </label>
              <div className="flex flex-wrap gap-2">
                {ageGroups.map(age => (
                  <button
                    key={age.id}
                    onClick={() => setSelectedAge(age.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      selectedAge === age.id
                        ? 'bg-coral text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="ml-2">{age.icon}</span>
                    {age.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                انتخاب بر اساس مناسبت
              </label>
              <div className="flex flex-wrap gap-2">
                {occasions.map(occasion => (
                  <button
                    key={occasion.id}
                    onClick={() => setSelectedOccasion(occasion.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      selectedOccasion === occasion.id
                        ? 'bg-primary text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="ml-2">{occasion.icon}</span>
                    {occasion.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Ideas Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              پیشنهادات ویژه هدیه
            </h2>
            <p className="text-gray-600">
              {filteredGifts.length} گزینه پیدا شد
            </p>
          </div>

          {filteredGifts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGifts.map((gift, index) => (
                <div
                  key={gift.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <LazyImage
                      src={gift.image}
                      alt={gift.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-coral text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {gift.price} تومان
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {gift.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {gift.description}
                    </p>

                    {/* Items List */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2">شامل:</p>
                      <ul className="space-y-1">
                        {gift.items.map((item, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <a
                      href="/products"
                      className="block w-full bg-gradient-to-r from-coral to-primary text-white text-center py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      مشاهده محصولات
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                هیچ پیشنهادی یافت نشد
              </h3>
              <p className="text-gray-600 mb-6">
                لطفاً فیلترهای دیگری را امتحان کنید
              </p>
              <button
                onClick={() => {
                  setSelectedAge('all');
                  setSelectedOccasion('all');
                }}
                className="inline-block bg-coral text-white px-6 py-3 rounded-full font-bold hover:bg-primary transition-all duration-300"
              >
                نمایش همه
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-gradient-to-br from-pastel-pink to-pastel-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              نکات مهم در انتخاب هدیه
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-coral/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">👕</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">سایز مناسب</h3>
              <p className="text-gray-600 text-sm">
                حتماً سایز دقیق کودک را بدانید. در صورت شک، یک سایز بزرگتر انتخاب کنید.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">کیفیت پارچه</h3>
              <p className="text-gray-600 text-sm">
                پارچه‌های نخی و طبیعی برای پوست حساس کودکان بهترین انتخاب هستند.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">رنگ و طرح</h3>
              <p className="text-gray-600 text-sm">
                رنگ‌های شاد و طرح‌های جذاب، کودکان را خوشحال می‌کنند.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">بسته‌بندی زیبا</h3>
              <p className="text-gray-600 text-sm">
                ما هدیه شما را با بسته‌بندی زیبا آماده می‌کنیم.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            هنوز مطمئن نیستید؟
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            تیم ما آماده است تا به شما در انتخاب بهترین هدیه کمک کند
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-coral to-primary text-white px-8 py-4 rounded-full font-bold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              تماس با ما
            </a>
            <a
              href="/products"
              className="inline-block border-2 border-coral text-coral px-8 py-4 rounded-full font-bold hover:bg-coral hover:text-white transition-all duration-300"
            >
              مشاهده همه محصولات
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GiftGuide;
