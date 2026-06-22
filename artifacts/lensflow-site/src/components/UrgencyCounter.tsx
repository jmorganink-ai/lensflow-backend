import React, { useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useGetLeadCount } from "@workspace/api-client-react";

export function UrgencyCounter() {
  const { data } = useGetLeadCount();
  const targetCount = data?.displayCount || 428;
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      const percentage = Math.min(progress / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      
      setCount(Math.floor(easeOutQuart * targetCount));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetCount]);

  if (!data) return null;

  return (
    <span className="font-mono text-primary font-bold">{count.toLocaleString()}</span>
  );
}
