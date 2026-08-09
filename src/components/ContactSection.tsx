import React, { useState } from 'react';
import { MapPin, Mail, Send, CheckCircle2 } from 'lucide-react';
import { Order } from '../types';

interface ContactSectionProps {
  onInquirySubmitted?: (order: Order) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onInquirySubmitted }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [brief, setBrief] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerPhone: '+62 Inquire Form',
          projectAddress: 'Jakarta / Consultative Project',
          items: [
            {
              productId: 'inquiry-general',
              title: 'Konsultasi Ruang & Design Brief',
              price: 0,
              quantity: 1,
              imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBff8NqqLEQcWfB31NGM4-7mq2AUrjUQDZtHUMPo2NWsuVfLuv_Yk2kwaXNXDMH0e5DxV9RmZ2feUN9WZXM7CTRZvrpg9UTlbev0g9Tnf18W_9QresaycleOgTGF5cJkzWxqK8S8bPbNLqXi9fet5v1tz2fJqtfEispQBrMzMo59v_-3wbs_BSbWwDs2ZOtBj9u1cAM3TbBL_lU6vR3tfpusthcgI0vyuhL5EtjaI0RP6kvEvqwo_Pr5WjVkqnZVwrGnQ'
            }
          ],
          notes: brief || 'General design brief inquiry submitted via Contact form.',
          totalAmount: 0,
        }),
      });

      if (!response.ok) throw new Error('Gagal mengirmkan inquiry');

      const createdOrder: Order = await response.json();
      setSuccess(true);
      if (onInquirySubmitted) onInquirySubmitted(createdOrder);

      setName('');
      setEmail('');
      setBrief('');

      setTimeout(() => setSuccess(false), 6000);
    } catch (err) {
      console.error('Error submitting contact form:', err);
      alert('Gagal mengirimkan pesan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      <div className="bg-white rounded-2xl shadow-sm border border-[#e3e2e0] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Studio Contact Information */}
          <div className="p-10 md:p-16 bg-[#f4f3f1] flex flex-col justify-center">
            <h2 className="font-headline font-light text-3xl md:text-4xl text-[#171818] mb-6">
              Start a Conversation.
            </h2>
            <p className="font-body text-[#444748] text-base md:text-lg mb-12 leading-relaxed">
              Whether you are conceptualizing a new space or refining an existing one, our studio is ready to translate your vision.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#6a5d43] shadow-2xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-body text-[#171818] text-sm md:text-base font-medium">
                  Jakarta Design District, ID
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#6a5d43] shadow-2xs">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="font-body text-[#171818] text-sm md:text-base font-medium">
                  studio@ruangpintar.com
                </span>
              </div>
            </div>
          </div>

          {/* Right Inquiry Form */}
          <div className="p-10 md:p-16 flex flex-col justify-center">
            {success ? (
              <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-headline text-xl text-[#171818] font-normal">Pesan Inquiry Terkirim!</h3>
                <p className="font-body text-xs text-[#444748]">
                  Inquiry Anda telah berhasil disiarkan ke Admin Panel secara real-time. Tim kami akan segera merespons via email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block font-mono text-xs text-[#444748] uppercase tracking-widest mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-[#c4c7c7] focus:border-[#6a5d43] focus:ring-0 px-0 py-2 font-body text-[#171818] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#444748] uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-[#c4c7c7] focus:border-[#6a5d43] focus:ring-0 px-0 py-2 font-body text-[#171818] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-[#444748] uppercase tracking-widest mb-2">
                    Project Brief
                  </label>
                  <textarea
                    rows={3}
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    className="w-full bg-transparent border-0 border-b border-[#c4c7c7] focus:border-[#6a5d43] focus:ring-0 px-0 py-2 font-body text-[#171818] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#6a5d43] hover:bg-[#51452d] text-white px-8 py-3.5 rounded-lg font-mono text-xs uppercase tracking-widest transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
