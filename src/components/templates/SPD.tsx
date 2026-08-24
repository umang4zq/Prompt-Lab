import React from 'react';
import { motion } from 'framer-motion';

export default function SPD({ isPreview = false }: { isPreview?: boolean }) {
  // Added Google Fonts directly for this component via a style block to ensure they load
  // without needing global layout changes
  
  return (
    <div className={`w-full min-h-[600px] h-screen max-h-[1080px] bg-[#FF0000] overflow-hidden ${isPreview ? 'pointer-events-none' : ''}`}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Manrope:wght@300;400;600&family=Marck+Script&display=swap');
        
        .font-manrope { font-family: 'Manrope', sans-serif; }
        .font-italiana { font-family: 'Italiana', serif; }
        .font-marck { font-family: 'Marck Script', cursive; }
      `}} />
      
      <section className="relative h-full w-full bg-[#FF0000] flex flex-col z-10 overflow-hidden">
        {/* 1. Centered Content */}
        <div className="flex-1 flex flex-col items-center w-full pt-[60px] sm:pt-[100px] md:pt-[20vh]">
          <div className="flex flex-col items-center w-full px-8 text-center z-20 relative max-w-[900px] h-auto md:h-[620px] mx-auto font-manrope">
            
            {/* a) Logo SVG */}
            <svg className="mb-12" width="80" height="80" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M60 120C26.8629 120 0 93.1371 0 60V0C22.5654 0 42.2213 12.4569 52.4662 30.8691C38.4788 34.2089 28.0787 46.7902 28.0787 61.8006V63.1443C28.0787 79.9648 41.7146 93.6006 58.5353 93.6006H59.8789L59.8785 61.8006C59.8785 79.3633 74.1159 93.6006 91.6787 93.6006L91.6787 61.8006C91.6787 44.2783 77.5071 30.0661 60 30.0008L60 0H62.5352C94.2722 0 120 25.7279 120 57.4648V60C120 93.1371 93.1371 120 60 120Z" fill="white"/>
            </svg>

            {/* b) Mission statement */}
            <p className="text-white text-[16px] h-auto md:h-[100px] w-full max-w-[400px] leading-[1.6] mb-[40px] uppercase tracking-wider mx-auto">
              We built this platform with a single purpose to eliminate operational chaos and restore balance to your daily business routine
            </p>

            {/* c) Cursive signature */}
            <div className="font-marck text-white text-[100px] md:text-[120px] leading-none mb-[32px]">
              S.P.D
            </div>

            {/* d) Two paragraphs */}
            <div className="text-white leading-[1.6] mb-[60px] md:mb-24 w-full flex flex-col items-center font-light">
              <p className="mb-[24px] text-[16px] w-[400px] max-w-full text-center">
                I Was Exhausted By Software That Demanded More Effort Than It Actually Saved. That Is Why We Engineered An Autonomous Architecture That Operates Silently In The Background.
              </p>
              <p className="text-[16px] w-[400px] max-w-full text-center">
                Your Business Should Serve Your Life, Not Consume It. Let Our Algorithms Handle The Heavy Lifting, So You Can Focus On The Vision.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Bottom Video with Red Gradient Blend */}
        <div className="relative w-full h-[40vh] md:h-auto shrink-0 mt-auto flex justify-center">
          <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-[#FF0000] to-transparent z-10 pointer-events-none" />
          <video autoPlay loop muted playsInline className="w-full h-full md:h-auto max-h-[400px] block object-contain">
            <source
              src="https://res.cloudinary.com/daklr2whx/video/upload/v1778602552/track-video_2_s9lp53.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>
    </div>
  );
}
