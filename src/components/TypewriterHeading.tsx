"use client";

import { useState, useEffect } from "react";

interface TypewriterHeadingProps {
  text: string;
  speed?: number;
  delay?: number;
  accentLength?: number;
}

export default function TypewriterHeading({ text, speed = 35, delay = 400, accentLength = 22 }: TypewriterHeadingProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsTyping(true);
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayedText(text.slice(0, i));
        if (i === text.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, speed);
      
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  const accentText = displayedText.slice(0, accentLength);
  const remainingText = displayedText.slice(accentLength);

  return (
    <h1 className="text-[28px] md:text-[36px] lg:text-[48px] xl:text-[64px] font-semibold leading-tight tracking-[-1.5px] min-h-[192px] lg:min-h-[144px] xl:min-h-[192px]">
      <span className="text-primary">{accentText}</span>
      <span className="text-text-light">{remainingText}</span>
      <span className={`inline-block w-[3px] h-[1em] bg-primary ml-1 align-middle transition-opacity duration-100 ${isTyping ? 'opacity-100' : 'animate-pulse'}`}></span>
    </h1>
  );
}
