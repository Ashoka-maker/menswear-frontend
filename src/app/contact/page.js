'use client';
import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
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
            <h1 className="text-2xl font-black text-slate-900">Contact Us</h1>
            <p className="text-xs text-slate-500 mt-1">We are here to assist you with your orders and inquiries.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800">Store Address</h4>
                  <p className="text-slate-500 mt-0.5">Plot 42, Silicon Valley High Street, Hyderabad, Telangana - 500081</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800">Mobile Number</h4>
                  <p className="text-slate-500 mt-0.5">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800">Email Address</h4>
                  <p className="text-slate-500 mt-0.5">support@modernwalk.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800">Working Hours</h4>
                  <p className="text-slate-500 mt-0.5">Mon - Sat: 10:00 AM - 8:00 PM IST</p>
                </div>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Send us a Message</h3>
              <div>
                <label className="text-slate-600 block mb-1">Your Name</label>
                <input type="text" required placeholder="John Doe" className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-amber-400 bg-white" />
              </div>
              <div>
                <label className="text-slate-600 block mb-1">Email Address</label>
                <input type="email" required placeholder="john@example.com" className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-amber-400 bg-white" />
              </div>
              <div>
                <label className="text-slate-600 block mb-1">Message</label>
                <textarea required rows="3" placeholder="How can we help you?" className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-amber-400 bg-white"></textarea>
              </div>
              <button type="submit" className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-2 rounded-lg transition">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}