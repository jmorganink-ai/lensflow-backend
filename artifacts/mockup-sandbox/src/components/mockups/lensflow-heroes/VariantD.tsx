import React from "react";
import { Play, Volume2, Menu } from "lucide-react";
import "./_group.css";

export function VariantD() {
  return (
    <div className="min-h-screen bg-[#06080F] text-white flex flex-col font-sans overflow-x-hidden relative selection:bg-[#C9A84C]/30 selection:text-white">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#C9A84C]/5 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#C9A84C]/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="w-full px-6 py-6 flex items-center justify-between z-50 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#C9A84C] to-[#E8D5A3] shadow-[0_0_15px_rgba(201,168,76,0.3)]" />
          <span className="text-xl font-bold tracking-tight text-white">LensFlow</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button className="text-gray-400 hover:text-white transition-colors tracking-wide">
            Sign In
          </button>
          <button className="bg-[#C9A84C]/10 text-[#E8D5A3] px-6 py-2.5 rounded-full border border-[#C9A84C]/20 hover:bg-[#C9A84C]/20 transition-colors tracking-wide">
            Get Started
          </button>
        </div>
        <button className="md:hidden text-gray-400">
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start pt-16 md:pt-24 px-4 pb-32 z-10 w-full max-w-7xl mx-auto">
        <div className="max-w-4xl w-full text-center flex flex-col items-center gap-8">
          
          {/* Phase 1 */}
          <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-[#E8D5A3] bg-[#C9A84C]/10 rounded-full border border-[#C9A84C]/20 uppercase">
              THE OLD WAY
            </span>
            <p className="text-lg md:text-xl text-gray-500 font-light tracking-wide line-through decoration-gray-700 decoration-2">
              Film every listing. Edit. Wait a week.
            </p>
          </div>

          {/* Phase 2 */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both">
            YOUR DIGITAL<br />
            <span className="text-gradient-gold">TWIN IS HERE.</span>
          </h1>

          {/* Phase 3 */}
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl leading-relaxed tracking-wide animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-both">
            Record once. Your AI clone presents every listing in under 2 minutes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-5 mt-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
            <button className="w-full sm:w-auto bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] text-[#06080F] px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_30px_rgba(201,168,76,0.25)] hover:scale-105 transition-all duration-300">
              Clone Yourself Free
            </button>
            <button className="w-full sm:w-auto group flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-lg text-white border border-gray-800 hover:border-gray-500 hover:bg-white/5 transition-all duration-300">
              <Play className="w-5 h-5 group-hover:text-[#C9A84C] transition-colors" />
              Watch It Work
            </button>
          </div>
        </div>

        {/* Video Mockup - Cinematic Strip */}
        <div className="w-full mt-24 relative animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700 fill-mode-both">
          {/* Decorative glow behind video */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#C9A84C]/10 blur-[120px] rounded-[100px] pointer-events-none" />
          
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl md:rounded-[2.5rem] border border-[#C9A84C]/20 overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] group bg-[#0A0D14]">
            
            {/* Background Property Image */}
            <img 
              src="/__mockup/images/luxury-home-golden-hour.png" 
              alt="Luxury Australian Home at Golden Hour" 
              className="absolute inset-0 w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[2s] ease-out opacity-80"
            />

            {/* Gradients to blend UI and mock avatar */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#06080F] via-[#06080F]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06080F]/80 via-transparent to-transparent" />
            
            {/* Mock Presenter Avatar */}
            <div className="absolute bottom-0 right-[10%] w-[40%] md:w-[25%] h-[85%] flex items-end justify-center pointer-events-none">
              <div className="w-full h-full bg-gradient-to-t from-black via-black/80 to-transparent rounded-t-[100px] opacity-60 mix-blend-overlay" />
              {/* Optional: Add an actual silhouette image if available, using a placeholder box for now to simulate the depth */}
              <div className="absolute bottom-0 w-[80%] h-[90%] bg-white/5 rounded-t-[100px] blur-md" />
            </div>

            {/* UI Controls Overlay */}
            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex flex-col md:flex-row items-end md:items-center justify-between gap-6">
              
              {/* Audio / Voice Indicator */}
              <div className="flex items-center gap-5 bg-black/60 backdrop-blur-xl px-5 py-3.5 md:px-6 md:py-4 rounded-2xl border border-white/10 shadow-xl">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#E8D5A3] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[0_0_20px_rgba(201,168,76,0.3)]">
                  <Play className="w-5 h-5 md:w-6 md:h-6 text-black ml-1" fill="currentColor" />
                </div>
                
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#E8D5A3] animate-pulse" />
                    <span className="text-xs md:text-sm font-semibold text-white tracking-widest uppercase">
                      AI Presenter Active
                    </span>
                  </div>
                  
                  {/* Waveform */}
                  <div className="flex items-end gap-[3px] h-6 md:h-8">
                    {[...Array(32)].map((_, i) => {
                      // Generate a somewhat organic-looking random-ish pattern for the heights
                      const height = 20 + Math.sin(i * 0.5) * 40 + Math.random() * 40;
                      return (
                        <div 
                          key={i} 
                          className="w-[2px] md:w-1 bg-gradient-to-t from-[#C9A84C] to-[#E8D5A3] rounded-full waveform-bar opacity-80" 
                          style={{ 
                            animationDelay: `${i * 0.05}s`,
                            height: `${Math.max(10, Math.min(100, height))}%`
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Volume / Extra Controls */}
              <div className="hidden md:flex items-center gap-4 bg-black/60 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/10 shadow-xl">
                <div className="flex items-center gap-4">
                  <Volume2 className="w-5 h-5 text-gray-400" />
                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-gradient-to-r from-[#C9A84C] to-[#E8D5A3] rounded-full" />
                  </div>
                </div>
                <div className="w-[1px] h-6 bg-white/10 mx-2" />
                <span className="text-sm font-medium text-gray-400 tracking-wider">0:42 / 1:55</span>
              </div>
            </div>
            
            {/* Top right badges */}
            <div className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-3">
              <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold tracking-widest text-white">REC</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VariantD;
