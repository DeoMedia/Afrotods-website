import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { ORDER_EMAIL_KEY } from '../shop/api';

const baloo = "'Baloo 2', cursive";

export function TrackOrder() {
  const navigate = useNavigate();
  const [reference, setReference] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem(ORDER_EMAIL_KEY, email.trim());
    navigate(`/shop/order/${reference.trim().toUpperCase()}`);
  };

  return (
    <div className="pt-24 min-h-screen">
      <section className="relative py-20 bg-gradient-to-br from-[#F97316] via-[#FB923C] to-[#FBBF24] text-white overflow-hidden">
        <div className="relative max-w-[1140px] mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4 text-[#2D0A6B]" style={{ fontFamily: baloo }}>
            Track Your Order
          </h1>
          <p className="text-xl text-white/90 max-w-[600px] mx-auto leading-relaxed">
            Enter your order number and the email you used at checkout.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-[480px] mx-auto px-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              required
              placeholder="Order number (e.g. AFR-7K2M9QX4)"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-[#F97316] outline-none font-semibold uppercase"
            />
            <input
              required
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 focus:border-[#F97316] outline-none font-semibold"
            />
            <button
              type="submit"
              className="px-10 py-4 bg-gradient-to-r from-[#F97316] to-[#FBBF24] text-[#2D0A6B] rounded-full font-extrabold text-lg shadow-[0_8px_32px_rgba(249,115,22,0.45)] hover:-translate-y-0.5 transition-all"
              style={{ fontFamily: baloo }}
            >
              Track Order →
            </button>
          </form>
          <p className="text-xs text-gray-400 text-center font-semibold mt-6">
            Your order number is in your confirmation email. Both must match — this keeps your order details private.
          </p>
        </div>
      </section>
    </div>
  );
}
