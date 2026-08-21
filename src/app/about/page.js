'use client';
import Link from 'next/link';
import { ArrowLeft, Building2, ShieldCheck, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-2xl font-black text-slate-900">About Modern Walk</h1>
            <p className="text-xs text-slate-500 mt-1">Redefining Everyday Men's Fashion</p>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Welcome to <strong>Modern Walk</strong>, your ultimate destination for high-quality, contemporary men's apparel and accessories. We bring together comfort, style, and durability to craft wardrobe essentials tailored for the modern lifestyle.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <Building2 className="w-6 h-6 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-800">Premium Quality</h3>
              <p className="text-[11px] text-slate-500">Carefully sourced fabrics designed for durability and ease.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <ShieldCheck className="w-6 h-6 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-800">100% Authentic</h3>
              <p className="text-[11px] text-slate-500">Directly managed inventory guaranteeing original items.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
              <Award className="w-6 h-6 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-800">Customer First</h3>
              <p className="text-[11px] text-slate-500">Seamless logistics, quick returns, and dedicated support.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}