import React, { useEffect, useState } from "react";
import "./_group.css";

export function VariantA() {
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setScanProgress((prev) => (prev >= 98 ? 98 : prev + 1));
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0B0F1A] text-white flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full object-cover opacity-30 z-0 bg-center bg-cover"
        style={{ backgroundImage: 'url("/__mockup/images/hero-bg-variant-a.png")' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F1A] via-[#0B0F1A]/80 to-transparent z-0"></div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Text Content */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 text-[#E8D5A3] text-sm font-medium mb-8 tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse"></span>
            The Future of Real Estate
          </div>
          
          <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Stop losing <span className="text-[#C9A84C] italic">a full week</span> to property videos.
          </h1>
          
          <p className="font-inter text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
            Filming is your biggest time killer. Clone yourself <strong className="text-white font-semibold">once</strong>, and let your AI digital twin present every future listing in under 2 minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] hover:from-[#E8D5A3] hover:to-[#C9A84C] text-[#0B0F1A] font-bold py-4 px-8 rounded-lg shadow-[0_0_20px_rgba(201,168,76,0.3)] transition-all duration-300 transform hover:-translate-y-1 font-inter">
              Create Your Digital Twin
            </button>
            <button className="bg-transparent border border-[#C9A84C] text-[#E8D5A3] hover:bg-[#C9A84C]/10 font-medium py-4 px-8 rounded-lg transition-all duration-300 font-inter">
              See How It Works
            </button>
          </div>
          
          <div className="mt-10 flex items-center gap-4 text-sm text-gray-400 font-inter">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0B0F1A] bg-gray-700 flex items-center justify-center text-xs overflow-hidden">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                </div>
              ))}
            </div>
            <p>Join 500+ top Australian agents saving 20hrs/week</p>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="relative h-[600px] w-full flex items-center justify-center perspective-1000">
          
          {/* Back Card: Property Video Mockup */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 md:w-80 aspect-[9/16] rounded-2xl border border-white/10 overflow-hidden shadow-2xl transform rotate-y-12 rotate-x-6 translate-x-12 translate-z-[-100px] glass-card">
            <img 
              src="/__mockup/images/ai-presenter-variant-a.png" 
              alt="AI Presenter" 
              className="w-full h-full object-cover"
            />
            {/* UI Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full border border-[#C9A84C] overflow-hidden">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=agent" alt="Agent" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Sarah Jenkins</p>
                  <p className="text-[#C9A84C] text-xs">LensFlow AI Twin</p>
                </div>
              </div>
              <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                <div className="bg-[#C9A84C] w-2/3 h-full"></div>
              </div>
            </div>
          </div>

          {/* Front Card: Scanning UI */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 md:w-72 bg-[#0B0F1A]/80 backdrop-blur-xl border border-[#C9A84C]/40 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform -rotate-y-12 -rotate-x-6 -translate-x-8 translate-z-[100px] animate-float">
            <div className="w-full h-48 bg-gray-800 rounded-xl mb-6 relative overflow-hidden flex items-center justify-center border border-white/5">
              <div className="absolute inset-0 scan-line bg-gradient-to-b from-transparent via-[#C9A84C]/50 to-transparent w-full h-8 opacity-50"></div>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=agent" alt="Original" className="w-32 h-32 opacity-50 filter grayscale" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <svg className="w-16 h-16 text-[#C9A84C] opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                 </svg>
              </div>
            </div>
            
            <h3 className="text-white font-playfair font-semibold text-xl mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              SCANNING...
            </h3>
            
            <div className="flex justify-between text-sm text-gray-400 mb-2 font-inter">
              <span>Clone Generation</span>
              <span className="text-[#C9A84C] font-semibold">{scanProgress}%</span>
            </div>
            
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] h-full transition-all duration-300 ease-out"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
