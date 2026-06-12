import React from "react";
import "./_group.css";

export function VariantC() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white overflow-hidden font-sans">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="/__mockup/images/variant-c-hero-bg.png"
          alt="Luxury Australian coastal property at sunset"
          className="w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-transparent to-[#1A1200]" />
        <div className="absolute inset-0 bg-gradient-radial-gold" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-3xl font-serif font-bold text-[#C9A84C] tracking-wide">
          LensFlow
        </div>
        <div className="hidden md:flex space-x-8 text-sm tracking-widest text-[#E8D5A3]/80">
          <a href="#" className="hover:text-[#C9A84C] transition-colors">PRODUCT</a>
          <a href="#" className="hover:text-[#C9A84C] transition-colors">FEATURES</a>
          <a href="#" className="hover:text-[#C9A84C] transition-colors">PRICING</a>
          <a href="#" className="hover:text-[#C9A84C] transition-colors">RESOURCES</a>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#" className="text-sm tracking-widest text-[#E8D5A3]/80 hover:text-[#C9A84C] transition-colors hidden md:block">LOGIN</a>
          <button className="bg-gradient-to-r from-[#C9A84C] to-[#A88B3D] text-[#0A0A0A] px-6 py-2.5 rounded-sm font-semibold tracking-wide hover:shadow-[0_0_15px_rgba(201,168,76,0.4)] transition-all">
            START FREE
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
            Your Digital Twin.<br />
            <span className="relative inline-block">
              Every Listing.
              <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent"></div>
            </span>
          </h1>
          <p className="text-xl text-[#E8D5A3]/80 max-w-2xl mx-auto font-light leading-relaxed">
            Real estate agents waste a full week producing a professional property video. Clone yourself once, and your AI digital twin presents every listing automatically in under 2 minutes.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Card 1: Clone Yourself Once */}
          <div className="card-blur rounded-xl p-8 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-500">
            <h3 className="text-2xl font-serif text-[#C9A84C] mb-8">Clone Yourself Once</h3>
            <div className="w-48 h-48 rounded-full border border-[#C9A84C]/30 flex items-center justify-center p-4 mb-8 scan-container relative">
              <div className="scan-line"></div>
              {/* Silhouette SVG */}
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#E8D5A3]/40">
                <path d="M12 2C8.68629 2 6 4.68629 6 8C6 11.3137 8.68629 14 12 14C15.3137 14 18 11.3137 18 8C18 4.68629 15.3137 2 12 2ZM12 16C7.58172 16 4 19.5817 4 24H20C20 19.5817 16.4183 16 12 16Z" fill="currentColor"/>
              </svg>
            </div>
            <p className="text-[#E8D5A3]/70 font-light text-sm max-w-xs">
              Upload a 2-minute video of yourself. We map your voice, expressions, and mannerisms with stunning accuracy.
            </p>
          </div>

          {/* Card 2: AI Presenter */}
          <div className="card-blur rounded-xl p-8 flex flex-col justify-center group hover:-translate-y-1 transition-transform duration-500 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 blur-3xl rounded-full"></div>
            <h3 className="text-2xl font-serif text-[#C9A84C] mb-6">AI Presenter</h3>
            
            <div className="bg-[#0A0A0A]/80 border border-[#C9A84C]/20 rounded-lg p-5 mb-6 shadow-inner w-full flex-grow flex flex-col relative z-10">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#C9A84C]/10">
                <div className="flex items-center space-x-2">
                   <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                   <span className="text-xs text-[#E8D5A3]/60 tracking-wider font-semibold">GENERATING VIDEO...</span>
                </div>
                <span className="text-[#C9A84C] text-xs font-mono">01:58</span>
              </div>
              <div className="space-y-3 flex-grow">
                <div className="h-3 bg-[#E8D5A3]/10 rounded w-full"></div>
                <div className="h-3 bg-[#E8D5A3]/10 rounded w-5/6"></div>
                <div className="h-3 bg-[#E8D5A3]/10 rounded w-4/6"></div>
                <div className="h-3 bg-[#E8D5A3]/10 rounded w-full"></div>
                <div className="h-3 bg-[#E8D5A3]/10 rounded w-3/4"></div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                 <div className="text-xs text-[#E8D5A3]/40 font-mono">Script: 84 Sydney Rd</div>
                 <div className="w-6 h-6 rounded-full border border-[#C9A84C] flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#C9A84C] rounded-sm"></div>
                 </div>
              </div>
            </div>

            <p className="text-[#E8D5A3]/70 font-light text-sm text-center">
              Just paste a listing URL. Your twin delivers the perfect pitch, complete with cinematic b-roll.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VariantC;
