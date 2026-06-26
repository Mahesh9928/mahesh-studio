'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import api from '../services/api';

const SERVICES = [
  {
    id: 'wedding',
    title: 'Luxury Wedding Cinema',
    price: '$2,499',
    description: 'Full-day cinematic coverage, multicam shoot, drone footage, 4K highlight reel, and documentary film.',
    features: ['10 Hours Coverage', '2 Videographers', 'Drone Videography', '4K Edited Video Files']
  },
  {
    id: 'portrait',
    title: 'Editorial Portraiture',
    price: '$499',
    description: 'High-end studio or location shoot for executives, models, or personal branding. Includes full styling assistance.',
    features: ['2 Hours Session', 'Professional Lighting', '15 Retouched Images', 'Commercial Licensing']
  },
  {
    id: 'brand',
    title: 'Commercial & Brand Campaigns',
    price: '$1,499',
    description: 'Tailored content generation for product launches, web presence, and social campaigns. High conversion visual style.',
    features: ['Half-day Shoot', 'Creative Direction', 'Social Media Cuts', 'Raw Footage Available']
  },
  {
    id: 'events',
    title: 'Exclusive Event Coverage',
    price: '$799',
    description: 'Premium photography and videography for corporate events, private galas, conferences, and celebrations.',
    features: ['4 Hours Coverage', 'Next-day Teaser', 'Digital Download Gallery', 'Unlimited Rights']
  }
];

const SHOWCASE_ITEMS = [
  { id: 1, title: 'The Ethereal Wedding', category: 'wedding', imageClass: 'from-amber-700 to-amber-950', desc: 'Cinematic wedding film in Tuscany' },
  { id: 2, title: 'Vogue Editorial', category: 'portrait', imageClass: 'from-neutral-800 to-amber-900', desc: 'High-fashion studio shoot' },
  { id: 3, title: 'Elysian Jewelry', category: 'commercial', imageClass: 'from-amber-950 to-neutral-900', desc: 'Luxury brand advertisement' },
  { id: 4, title: 'Modern Architecture', category: 'commercial', imageClass: 'from-slate-800 to-neutral-900', desc: 'Real estate portfolio' },
  { id: 5, title: 'Summer Solstice', category: 'wedding', imageClass: 'from-amber-800 to-stone-900', desc: 'Outdoor wedding coverage' },
  { id: 6, title: 'Noir Portraits', category: 'portrait', imageClass: 'from-zinc-800 to-zinc-950', desc: 'Chiaroscuro studio photography' }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('all');
  
  // Booking Form State
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [selectedService, setSelectedService] = useState('wedding');
  const [message, setMessage] = useState('');
  
  // Form Status
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const bookingRef = useRef<HTMLDivElement>(null);

  const scrollToBooking = (serviceId?: string) => {
    if (serviceId) {
      setSelectedService(serviceId);
    }
    bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      const selectedServiceTitle = SERVICES.find(s => s.id === selectedService)?.title || selectedService;
      const formattedMessage = `[Selected Service: ${selectedServiceTitle}]\n\nCustomer Message:\n${message}`;

      await api.post('/booking', {
        customerName,
        email,
        phone,
        eventDate,
        message: formattedMessage
      });

      setSuccess(true);
      setCustomerName('');
      setEmail('');
      setPhone('');
      setEventDate('');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please check details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredShowcase = activeTab === 'all' 
    ? SHOWCASE_ITEMS 
    : SHOWCASE_ITEMS.filter(item => item.category === activeTab);

  return (
    <div className="bg-mesh-glow min-h-screen text-neutral-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-x-0 border-t-0 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-widest gold-gradient-text">MAHESH STUDIO</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wider text-neutral-400">
            <a href="#about" className="hover:text-gold-400 transition-colors">ABOUT</a>
            <a href="#showcase" className="hover:text-gold-400 transition-colors">SHOWCASE</a>
            <a href="#services" className="hover:text-gold-400 transition-colors">SERVICES</a>
            <a href="#reviews" className="hover:text-gold-400 transition-colors">TESTIMONIALS</a>
            <button 
              onClick={() => scrollToBooking()} 
              className="bg-gold-500 hover:bg-gold-600 text-neutral-950 font-bold px-5 py-2 rounded-full transition-all duration-300 text-xs tracking-widest shadow-md hover:scale-105"
            >
              BOOK NOW
            </button>
          </nav>
          <div>
            <Link 
              href="/login" 
              className="text-xs font-semibold text-neutral-500 hover:text-gold-400 border border-neutral-800 hover:border-gold-500 px-4 py-2 rounded-full transition-all duration-300"
            >
              ADMIN PORTAL
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6 flex items-center justify-center min-h-[85vh]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(190,146,71,0.03)_0%,transparent_70%)] animate-pulse-soft pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-dark-900 border border-gold-500/20 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest text-gold-400 mb-8 animate-float-slow">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-ping" />
            CRAFTING CINEMATIC STORIES
          </div>
          <h1 className="font-serif text-5xl md:text-8xl font-bold tracking-tight leading-tight mb-8">
            Capture Your Essence <br />
            <span className="gold-gradient-text font-serif italic">In Pure Light</span>
          </h1>
          <p className="max-w-2xl mx-auto text-neutral-400 text-base md:text-lg leading-relaxed mb-12">
            Mahesh Studio is a boutique creative production agency specializing in high-end photography, editorial portraits, and fine-art cinematic films. We craft visuals that evoke emotions and stand the test of time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => scrollToBooking()} 
              className="w-full sm:w-auto bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-bold px-8 py-4 rounded-full transition-all duration-300 tracking-wider shadow-lg hover:shadow-gold-500/10 hover:scale-105 cursor-pointer text-sm"
            >
              BOOK RESERVATION
            </button>
            <a 
              href="#showcase" 
              className="w-full sm:w-auto border border-neutral-800 hover:border-gold-500 bg-neutral-950/40 hover:bg-neutral-900/60 text-neutral-200 hover:text-gold-300 font-bold px-8 py-4 rounded-full transition-all duration-300 tracking-wider text-sm text-center"
            >
              VIEW PORTFOLIO
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-dark-950/60 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] w-full rounded-2xl bg-gradient-to-tr from-gold-950 via-neutral-900 to-neutral-800 border border-gold-500/20 p-8 flex flex-col justify-end relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80 z-0" />
              <div className="absolute top-6 right-6 font-serif text-9xl font-bold text-neutral-800/10 select-none">MS</div>
              <div className="relative z-10">
                <span className="text-xs font-semibold tracking-widest text-gold-400 uppercase">THE CREATIVE MIND</span>
                <h3 className="font-serif text-3xl font-bold mt-2 mb-4">Mahesh Prasad</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  "Photography is not just about catching light; it is about documenting the unsaid stories, the silent emotions, and preserving them forever in timeless luxury."
                </p>
              </div>
            </div>
          </div>
          <div>
            <span className="text-xs font-bold tracking-widest text-gold-500 uppercase">OUR PHILOSOPHY</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-4 mb-8">Elevated Vision, Flawless Execution</h2>
            <div className="space-y-6 text-neutral-400">
              <p>
                Founded on the pursuit of elegance, Mahesh Studio merges advanced technological artistry with deep artistic intuition. We provide premium visual assets for global brands and capture life's most defining milestones.
              </p>
              <p>
                Every project is handled with precision. From custom-tailored concepts, state-of-the-art cinematic lighting, to high-fidelity post-production, we guarantee a premium experience that respects and honors your vision.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-8 mt-12 border-t border-neutral-900 pt-8 text-center">
              <div>
                <p className="font-serif text-3xl font-bold gold-gradient-text">120+</p>
                <p className="text-xs text-neutral-500 tracking-wider mt-1">WEDDINGS SHOT</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold gold-gradient-text">500+</p>
                <p className="text-xs text-neutral-500 tracking-wider mt-1">CLIENTS SERVED</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold gold-gradient-text">8+</p>
                <p className="text-xs text-neutral-500 tracking-wider mt-1">YEARS SERVICE</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase Section */}
      <section id="showcase" className="py-24 px-6 bg-mesh-glow">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-gold-500 uppercase">CREATIVE PORTFOLIO</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-6">Recent Work Showcase</h2>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {['all', 'wedding', 'portrait', 'commercial'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest transition-all duration-300 uppercase cursor-pointer ${
                    activeTab === tab 
                      ? 'bg-gold-500 text-neutral-950 shadow-md font-semibold' 
                      : 'bg-dark-900/60 text-neutral-400 hover:text-gold-400 border border-neutral-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredShowcase.map((item) => (
              <div 
                key={item.id} 
                className="group relative overflow-hidden rounded-2xl glass-card border-neutral-900 aspect-[4/3] flex flex-col justify-end p-6 hover:-translate-y-2 transition-all duration-500 shadow-lg"
              >
                {/* Visual Placeholder representing a photo */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.imageClass} opacity-60 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
                
                {/* Animated Camera Icon Overlay */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-neutral-900/80 p-2 rounded-full border border-gold-500/20">
                  <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>

                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-widest text-gold-400 uppercase bg-gold-950/60 border border-gold-500/20 px-2 py-0.5 rounded">
                    {item.category.toUpperCase()}
                  </span>
                  <h4 className="font-serif text-xl font-bold mt-3 text-neutral-100">{item.title}</h4>
                  <p className="text-xs text-neutral-400 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Pricing Section */}
      <section id="services" className="py-24 px-6 bg-dark-950/60 border-y border-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-gold-500 uppercase">OUR SERVICES</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-6">Rates & Session Options</h2>
            <p className="max-w-xl mx-auto text-neutral-400 text-sm">
              We offer simple, transparent pricing structures. Choose a package below or reach out for custom, bespoke cinematic coverage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service) => (
              <div 
                key={service.id} 
                className={`glass-card p-8 rounded-2xl flex flex-col justify-between transition-all duration-300 relative ${
                  selectedService === service.id ? 'border-gold-500 ring-1 ring-gold-500/30' : 'border-neutral-900'
                }`}
              >
                {selectedService === service.id && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-500 text-neutral-950 font-bold px-3 py-1 rounded-full text-[10px] tracking-widest">
                    SELECTED
                  </span>
                )}
                <div>
                  <h3 className="font-serif text-xl font-bold text-neutral-100">{service.title}</h3>
                  <div className="flex items-baseline gap-1 my-4">
                    <span className="text-3xl font-bold font-serif gold-gradient-text">{service.price}</span>
                    <span className="text-xs text-neutral-500">/ package</span>
                  </div>
                  <p className="text-neutral-400 text-xs leading-relaxed mb-6 border-b border-neutral-900 pb-6 min-h-[60px]">
                    {service.description}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs text-neutral-300">
                        <svg className="w-3.5 h-3.5 text-gold-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => scrollToBooking(service.id)}
                  className={`w-full py-3 rounded-xl text-xs font-bold tracking-widest transition-all duration-300 cursor-pointer ${
                    selectedService === service.id
                      ? 'bg-gold-500 text-neutral-950'
                      : 'border border-neutral-800 hover:border-gold-500 text-neutral-300 hover:text-gold-400 bg-neutral-900/30'
                  }`}
                >
                  SELECT & BOOK
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 px-6 bg-mesh-glow">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-widest text-gold-500 uppercase">TESTIMONIALS</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3">Words From Clients</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-2xl border-neutral-900 relative">
              <div className="text-gold-500 text-4xl font-serif absolute top-4 left-6 opacity-20">“</div>
              <div className="flex gap-1 text-gold-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed italic mb-6">
                "Working with Mahesh and the team was an absolute dream. They managed to capture the raw emotions of our wedding day in a way that feels like a Hollywood production. The visual quality is out of this world!"
              </p>
              <div className="border-t border-neutral-900 pt-4 flex items-center gap-3">
                <div>
                  <h4 className="font-serif font-bold text-sm">Alexandra & Jonathan</h4>
                  <p className="text-xs text-neutral-500">Tuscany Wedding Client</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl border-neutral-900 relative">
              <div className="text-gold-500 text-4xl font-serif absolute top-4 left-6 opacity-20">“</div>
              <div className="flex gap-1 text-gold-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed italic mb-6">
                "We hired Mahesh Studio for our high-end jewelry brand campaign. Their understanding of lighting, composition, and direction elevated our products completely. Highly professional and efficient workflow."
              </p>
              <div className="border-t border-neutral-900 pt-4 flex items-center gap-3">
                <div>
                  <h4 className="font-serif font-bold text-sm">Marcus Vance</h4>
                  <p className="text-xs text-neutral-500">Creative Director, Elysian Jewelry</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section ref={bookingRef} className="py-24 px-6 bg-neutral-950 border-t border-neutral-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-gold-500 uppercase">RESERVATIONS</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-4">Book Your Session</h2>
            <p className="text-neutral-400 text-xs">
              Fill in the form below. Our management team will coordinate details and confirm availability.
            </p>
          </div>

          <div className="glass-card p-8 md:p-12 rounded-3xl border-neutral-850 shadow-xl relative overflow-hidden">
            {success ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl font-bold text-neutral-100 mb-3">Session Requested!</h3>
                <p className="text-neutral-400 text-sm max-w-md mx-auto mb-8">
                  Thank you for booking with us. We have received your booking details and will contact you via email or phone within 24 hours to confirm your dates.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-gold-500 hover:bg-gold-600 text-neutral-950 font-bold px-6 py-3 rounded-full text-xs tracking-widest"
                >
                  SUBMIT ANOTHER REQUEST
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="bg-red-950/30 border border-red-500/20 text-red-300 text-xs px-4 py-3 rounded-xl">
                    {errorMsg}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 tracking-wider mb-2 uppercase">Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-dark-900 border border-neutral-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-neutral-200 text-sm px-4 py-3 rounded-xl transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 tracking-wider mb-2 uppercase">Email Address</label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-dark-900 border border-neutral-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-neutral-200 text-sm px-4 py-3 rounded-xl transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 tracking-wider mb-2 uppercase">Phone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. +1 (555) 019-2834"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-dark-900 border border-neutral-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-neutral-200 text-sm px-4 py-3 rounded-xl transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 tracking-wider mb-2 uppercase">Preferred Event Date</label>
                    <input
                      required
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full bg-dark-900 border border-neutral-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-neutral-200 text-sm px-4 py-3 rounded-xl transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 tracking-wider mb-2 uppercase">Service / Session Type</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-dark-900 border border-neutral-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-neutral-200 text-sm px-4 py-3 rounded-xl transition-all outline-none"
                  >
                    <option value="wedding">Luxury Wedding Cinema ($2,499)</option>
                    <option value="portrait">Editorial Portraiture ($499)</option>
                    <option value="brand">Commercial & Brand Campaigns ($1,499)</option>
                    <option value="events">Exclusive Event Coverage ($799)</option>
                    <option value="custom">Custom / Other Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-400 tracking-wider mb-2 uppercase">Message / Special Requirements</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about your project or event location, timing, and details..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-dark-900 border border-neutral-800 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/30 text-neutral-200 text-sm px-4 py-3.5 rounded-xl transition-all outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-bold py-4 rounded-xl transition-all duration-300 tracking-wider shadow-lg hover:shadow-gold-500/10 cursor-pointer disabled:opacity-50 text-xs"
                >
                  {loading ? 'SENDING RESERVATION REQUEST...' : 'SUBMIT RESERVATION REQUEST'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-950 border-t border-neutral-900 py-16 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h4 className="font-serif text-xl font-bold gold-gradient-text tracking-widest mb-4">MAHESH STUDIO</h4>
            <p className="text-neutral-400 text-sm max-w-sm leading-relaxed mb-6">
              Boutique photography & cinematic media agency, committed to excellence and delivering breathtaking visual legacies.
            </p>
            <div className="flex gap-4">
              {/* Instagram Icon */}
              <a href="#" className="text-neutral-500 hover:text-gold-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* Facebook Icon */}
              <a href="#" className="text-neutral-500 hover:text-gold-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
              </a>
              {/* YouTube Icon */}
              <a href="#" className="text-neutral-500 hover:text-gold-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h5 className="text-xs font-bold text-neutral-300 tracking-widest mb-4 uppercase">Contact Info</h5>
            <ul className="space-y-3 text-neutral-400 text-xs">
              <li>📍 450 Studio Drive, Los Angeles, CA</li>
              <li>📞 +1 (323) 555-8291</li>
              <li>✉️ book@maheshstudio.com</li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold text-neutral-300 tracking-widest mb-4 uppercase">Links</h5>
            <ul className="space-y-3 text-neutral-400 text-xs">
              <li><a href="#about" className="hover:text-gold-400 transition-colors">About Story</a></li>
              <li><a href="#services" className="hover:text-gold-400 transition-colors">Pricing Packages</a></li>
              <li><a href="#showcase" className="hover:text-gold-400 transition-colors">Portfolios</a></li>
              <li><Link href="/login" className="hover:text-gold-400 transition-colors font-semibold">Admin Dashboard Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-neutral-900 text-center flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Mahesh Studio. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed & developed with absolute precision.</p>
        </div>
      </footer>
    </div>
  );
}