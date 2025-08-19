import React, { useEffect, useState } from 'react';
import { Briefcase, Code, Share, Server, PenTool, TrendingUp, DollarSign, Truck, BookOpen, Smartphone, ClipboardCheck, Megaphone, UserSearch, ShoppingCart, Gamepad2, Shield, Sparkles, Rocket } from 'lucide-react';

const iconMap = {
  Briefcase, Code, Share, Server, PenTool, TrendingUp, DollarSign, Truck, BookOpen, Smartphone, ClipboardCheck, Megaphone, UserSearch, ShoppingCart, Gamepad2, Shield, Sparkles, Rocket
};

type CategoryNode = {
  id: string;
  name: string;
  icon: keyof typeof iconMap;
  children: CategoryNode[];
};

export default function Categories() {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/categories')
      .then(res => {
        if (!res.ok) throw new Error('Gagal mengambil kategori');
        return res.json();
      })
      .then(data => {
        setCategories(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError('Gagal mengambil kategori');
        setLoading(false);
      });
  }, []);

  const renderCategory = (cat: CategoryNode, depth: number = 0) => (
    <div key={cat.id} style={{ marginLeft: depth * 20, marginTop: 10 }}>
      <div className="flex items-center gap-3">
        {React.createElement(iconMap[cat.icon] || Briefcase, { size: 24 })}
        <span className="font-black text-lg">{cat.name}</span>
      </div>
      {cat.children && cat.children.length > 0 && (
        <div>
          {cat.children.map(sub => renderCategory(sub, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-2 flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-black text-blue-700 mb-6">Kategori Forum</h2>
        {loading ? (
          <div className="text-center text-blue-700 font-bold py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 font-bold py-8">{error}</div>
        ) : (
          <div>
            {categories.map(cat => renderCategory(cat))}
          </div>
        )}
        <div className="mt-6 text-xs text-gray-400 text-center">
          Kategori ditentukan oleh pemilik website, tidak dapat diubah oleh pengguna.
        </div>
      </div>
    </main>
  );
}
