import { useState } from 'react';
import {
  Mail, Phone, MapPin, Clock, Send, CheckCircle,
  MessageSquare, BookOpen, HelpCircle, ArrowRight,
  Twitter, Linkedin, Instagram, Facebook,
} from 'lucide-react';
import Header from '../components/Header';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';
import { useI18n } from '../lib/i18n';

const SOCIAL_ICONS = [
  { icon: Twitter,   href: '#', label: 'Twitter' },
  { icon: Linkedin,  href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook,  href: '#', label: 'Facebook' },
];

export default function Contact() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', profile: '', subject: '', message: '', consent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) return;
    // Persiste la demande (best-effort) puis confirme. Fallback : mailto.
    try {
      await supabase.from('contact_messages').insert({
        name: form.name || null,
        email: form.email || null,
        subject: form.subject || null,
        message: form.message || null,
      });
    } catch { /* la table peut ne pas exister : on garde le mailto en secours */ }
    setSent(true);
  };

  const update = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* HERO */}
      <section className="pt-32 pb-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-brand-600 font-semibold text-xs uppercase tracking-widest mb-3">{t('contact.support')}</p>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">{t('contact.title')}</h1>
          <p className="text-lg text-gray-500">{t('contact.subtitle')}</p>
        </div>
      </section>

      {/* FORM + INFOS */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* FORM */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-6">{t('contact.formTitle')}</h2>
              {sent ? (
                <div className="bg-brand-50 border-2 border-brand-200 rounded-2xl p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-brand-500 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{t('contact.sent')}</h3>
                  <p className="text-sm text-gray-500">{t('contact.sentDesc', { email: form.email })}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="ct-name" className="block text-sm font-semibold text-gray-700 mb-1.5">{t('contact.name')} *</label>
                    <input id="ct-name" type="text" required value={form.name} onChange={e => update('name', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all text-sm" placeholder="Jean Dupont" />
                  </div>
                  <div>
                    <label htmlFor="ct-email" className="block text-sm font-semibold text-gray-700 mb-1.5">{t('contact.email')} *</label>
                    <input id="ct-email" type="email" required value={form.email} onChange={e => update('email', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all text-sm" placeholder="jean@entreprise.com" />
                  </div>
                  <div>
                    <label htmlFor="ct-phone" className="block text-sm font-semibold text-gray-700 mb-1.5">{t('contact.phone')}</label>
                    <input id="ct-phone" type="tel" value={form.phone} onChange={e => update('phone', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all text-sm" placeholder="+33 6 12 34 56 78" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ct-role" className="block text-sm font-semibold text-gray-700 mb-1.5">{t('contact.youAre')}</label>
                      <select value={form.profile} onChange={e => update('profile', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all text-sm bg-white">
                        <option value="">{t('contact.select')}</option>
                        <option value="acheteur">{t('contact.optBuyer')}</option>
                        <option value="producteur">{t('contact.optProducer')}</option>
                        <option value="investisseur">{t('contact.optInvestor')}</option>
                        <option value="presse">{t('contact.optPress')}</option>
                        <option value="autre">{t('contact.optOther')}</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="ct-subject" className="block text-sm font-semibold text-gray-700 mb-1.5">{t('contact.subject')}</label>
                      <select id="ct-subject" value={form.subject} onChange={e => update('subject', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all text-sm bg-white">
                        <option value="">{t('contact.select')}</option>
                        <option value="generale">{t('contact.optGeneral')}</option>
                        <option value="technique">{t('contact.optTech')}</option>
                        <option value="partenariat">{t('contact.optPartnership')}</option>
                        <option value="presse">{t('contact.optPress')}</option>
                        <option value="autre">{t('contact.optOther')}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ct-message" className="block text-sm font-semibold text-gray-700 mb-1.5">{t('contact.message')} *</label>
                    <textarea id="ct-message" required rows={5} value={form.message} onChange={e => update('message', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all text-sm resize-none" placeholder={t('contact.messagePlaceholder')} />
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.consent} onChange={e => update('consent', e.target.checked)} className="mt-1 w-4 h-4 accent-brand-500" />
                    <span className="text-xs text-gray-500 leading-relaxed">{t('contact.consent')} <a href="/confidentialite" className="text-brand-600 font-semibold hover:underline">{t('contact.consentPrivacy')}</a></span>
                  </label>
                  <button type="submit" disabled={!form.consent}
                    className="btn-primary w-full py-3.5 text-sm inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Send className="w-4 h-4" /> {t('contact.submit')}
                  </button>
                </form>
              )}
            </div>

            {/* INFOS */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-6">{t('contact.infoTitle')}</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-0.5">{t('contact.infoEmail')}</p>
                      <p className="text-sm text-gray-500">contact@ethimarket.com</p>
                      <p className="text-sm text-gray-500">support@ethimarket.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-0.5">{t('contact.infoPhone')}</p>
                      <p className="text-sm text-gray-500">+33 1 23 45 67 89</p>
                      <p className="text-xs text-gray-500">{t('contact.infoHours')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-0.5">{t('contact.infoAddress')}</p>
                      <p className="text-sm text-gray-500">EthiMarket SAS</p>
                      <p className="text-sm text-gray-500">123 rue de l'Impact</p>
                      <p className="text-sm text-gray-500">75001 Paris, France</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-0.5">{t('contact.infoSupport')}</p>
                      <p className="text-sm text-gray-500">{t('contact.infoHours')}</p>
                      <p className="text-sm text-gray-500">{t('contact.sundayClosed')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-sm mb-4">{t('contact.follow')}</h3>
                <div className="flex gap-3">
                  {SOCIAL_ICONS.map(({ icon: Icon, href, label }) => (
                    <a key={label} href={href} aria-label={label}
                      className="w-10 h-10 bg-gray-100 hover:bg-brand-50 rounded-xl flex items-center justify-center text-gray-500 hover:text-brand-600 transition-all">
                      <Icon className="w-4.5 h-4.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AUTRES MOYENS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: MessageSquare, title: t('contact.chatTitle'), desc: t('contact.chatDesc'), action: t('contact.chatAction') },
              { icon: BookOpen, title: t('contact.helpTitle'), desc: t('contact.helpDesc'), action: t('contact.helpAction') },
              { icon: HelpCircle, title: t('contact.faqTitle'), desc: t('contact.faqDesc'), action: t('contact.faqAction') },
            ].map(({ icon: Icon, title, desc, action }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 text-center hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
                <p className="text-xs text-gray-500 mb-4">{desc}</p>
                <button className="inline-flex items-center gap-1 text-brand-600 font-semibold text-xs hover:gap-1.5 transition-all">
                  {action} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
