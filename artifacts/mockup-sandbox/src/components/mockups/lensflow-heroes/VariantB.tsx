import React, { useState, useEffect } from 'react';
import { Play, Clock, TrendingUp, Zap, Shield, Pause, VolumeX, Volume2, ArrowRight } from 'lucide-react';
import './_group.css';

export function VariantB() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-[100dvh] bg-[#080C18] overflow-hidden flex flex-col font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
        .split-diagonal { clip-path: polygon(0 0, 100% 0, 85% 100%, 0% 100%); }
        .bg-split-right { clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%); }
        @media (max-width: 1024px) {
          .split-diagonal { clip-path: none; }
          .bg-split-right { clip-path: none; }
        }
      `}} />

      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#C9A84C]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#C9A84C]/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-6 lg:px-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C9A84C] to-[#E8D5A3] flex items-center justify-center text-[#080C18] font-bold">L</div>
          <span className="text-xl font-bold text-white tracking-tight">LensFlow</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">How it Works</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Presenters</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          <a href="#" className="hidden md:block text-gray-300 hover:text-white text-sm font-medium transition-colors">Sign In</a>
          <button className="px-5 py-2.5 rounded-sm bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] text-[#080C18] text-sm font-semibold hover:opacity-90 transition-opacity">
            Start Free Trial
          </button>
        </div>
      </header>

      {/* Main Hero Area */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        
        {/* Left Content Area (Split Diagonal) */}
        <div className="w-full lg:w-[60%] flex flex-col justify-center px-6 lg:px-12 xl:px-20 py-12 lg:py-0 split-diagonal relative z-10 bg-[#080C18]">
          <div className="max-w-2xl">
            <div className={`transition-all duration-1000 ease-out transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 mb-6">
                <Zap className="w-4 h-4 text-[#C9A84C]" />
                <span className="text-[#C9A84C] text-sm font-medium tracking-wide">For Australian Real Estate</span>
              </div>
              
              <h1 className="font-bebas text-7xl md:text-8xl lg:text-9xl text-white leading-[0.85] tracking-tight mb-6 uppercase">
                Stop Filming.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3]">Start Cloning.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg leading-relaxed font-light">
                Clone yourself once. Let your AI twin present every luxury listing automatically. Turn a 7-day video production nightmare into a <strong className="text-white">2-minute workflow</strong>.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] text-[#080C18] rounded-sm font-semibold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(201,168,76,0.3)]">
                  Create Your AI Twin
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-transparent text-white rounded-sm font-medium text-lg flex items-center justify-center gap-2 hover:bg-white/5 transition-colors border border-white/10">
                  <Play className="w-5 h-5 text-[#C9A84C]" />
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Video Area */}
        <div className="w-full lg:w-[55%] lg:absolute lg:right-0 lg:top-0 lg:bottom-0 bg-split-right overflow-hidden border-l-0 lg:border-l-4 border-[#C9A84C]/30 relative group min-h-[50vh]">
          {/* Fallback dark bg while image loads */}
          <div className="absolute inset-0 bg-gray-900" />
          
          <img 
            src="/__mockup/images/luxury-listing-b.jpg" 
            alt="Luxury Listing"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110 opacity-60"
          />
          
          {/* Subtle gradient overlay to make text pop */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080C18]/40 via-transparent to-[#080C18]/90" />
          
          {/* Mockup UI Container */}
          <div className={`absolute inset-0 flex items-center justify-center p-6 lg:p-12 lg:pl-32 transition-all duration-1000 delay-300 ease-out transform ${mounted ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
            <div className="w-full max-w-sm aspect-[9/16] bg-black/40 backdrop-blur-md rounded-xl border border-[#C9A84C]/40 overflow-hidden relative shadow-2xl flex flex-col">
              
              {/* Video Header / Twin Indicator */}
              <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-medium text-white">LIVE PRESENTATION</span>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#C9A84C] overflow-hidden bg-gray-800">
                  <img src="/__mockup/images/agent-avatar.jpg" alt="Agent Twin" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Main Presenter Area */}
              <div className="flex-1 relative flex items-center justify-center">
                {/* Simulated Presenter */}
                <div className="w-3/4 h-3/4 rounded-lg border-2 border-dashed border-[#C9A84C]/30 flex flex-col items-center justify-center bg-black/20 p-6 text-center">
                  <div className="scan-container w-24 h-24 mb-4 flex items-center justify-center border border-[#C9A84C]/50">
                    <div className="scan-line"></div>
                    <img src="/__mockup/images/agent-avatar.jpg" alt="Twin" className="w-full h-full object-cover opacity-80" />
                  </div>
                  <p className="text-white text-sm font-medium mb-1">AI Twin Generated</p>
                  <p className="text-gray-400 text-xs">Ready in 1m 42s</p>
                </div>

                {/* Video Controls overlay */}
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 z-10 flex items-center justify-center hover:bg-black/10 transition-colors"
                >
                  {!isPlaying && (
                    <div className="w-16 h-16 rounded-full bg-[#C9A84C] flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(201,168,76,0.5)]">
                      <Play className="w-8 h-8 text-[#080C18]" />
                    </div>
                  )}
                </button>
              </div>

              {/* Property Details Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <h3 className="text-white font-semibold text-lg drop-shadow-md">74 Bayview Terrace</h3>
                    <p className="text-[#E8D5A3] text-sm drop-shadow-md">Vaucluse, NSW</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                    className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/60 z-20"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded text-white text-xs font-medium border border-white/5">
                    <span>4 Bed</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded text-white text-xs font-medium border border-white/5">
                    <span>3 Bath</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded text-white text-xs font-medium border border-white/5">
                    <span>2 Cars</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 w-full bg-white/20 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-[#C9A84C] w-[45%] relative">
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Stat Pills */}
      <div className="relative z-20 mt-auto border-t border-white/5 bg-[#080C18]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6 overflow-x-auto no-scrollbar">
          <div className={`flex items-center justify-start lg:justify-center gap-4 sm:gap-8 lg:gap-16 min-w-max transition-all duration-1000 delay-500 ease-out transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">Save 10+ Hrs</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Per Campaign</p>
              </div>
            </div>

            <div className="w-px h-8 bg-white/10 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">3x More Listings</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Marketed</p>
              </div>
            </div>

            <div className="w-px h-8 bg-white/10 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">2 Min Delivery</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider">Instead of Days</p>
              </div>
            </div>

            <div className="w-px h-8 bg-white/10 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#C9A84C]" />
              </div>
              <div>
                <p className="text-white font-bold text-lg leading-tight">Enterprise Grade</p>
                <p className="text-gray-400 text-xs uppercase tracking-wider">AI Quality</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default VariantB;