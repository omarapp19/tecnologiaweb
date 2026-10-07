"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "motion/react";

export default function BackgroundNebulae() {
  const mouseX = useMotionValue(500);
  const mouseY = useMotionValue(500);
  const [isLight, setIsLight] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Define different springs for each nebula to create a premium fluid-splitting effect
  const spring1X = useSpring(mouseX, { damping: 45, stiffness: 80, mass: 1 });
  const spring1Y = useSpring(mouseY, { damping: 45, stiffness: 80, mass: 1 });

  const spring2X = useSpring(mouseX, { damping: 55, stiffness: 50, mass: 1.5 });
  const spring2Y = useSpring(mouseY, { damping: 55, stiffness: 50, mass: 1.5 });

  const spring3X = useSpring(mouseX, { damping: 65, stiffness: 30, mass: 2 });
  const spring3Y = useSpring(mouseY, { damping: 65, stiffness: 30, mass: 2 });

  // Scroll tracking for premium parallax effect on mobile
  const { scrollY } = useScroll();
  const scrollY1 = useTransform(scrollY, (value) => value * -0.2);
  const scrollY2 = useTransform(scrollY, (value) => value * -0.1);
  const scrollY3 = useTransform(scrollY, (value) => value * -0.3);

  useEffect(() => {
    setIsMounted(true);
    
    // Set to center of viewport initially
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Observe theme changes on <html> class list
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.classList.contains("light"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    setIsLight(document.documentElement.classList.contains("light"));

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
    };
  }, [mouseX, mouseY]);

  if (isMounted && isMobile) {
    return (
      <div id="background-nebulae" className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
        {/* Indigo Nebula */}
        <motion.div
          className="absolute"
          style={{
            left: "20%",
            top: "25%",
            y: scrollY1,
          }}
        >
          <div className="-translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{
                x: [0, 80, -60, 40, 0],
                y: [0, -70, 80, -30, 0],
                scale: [1, 1.10, 0.95, 1.05, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`w-[70vw] h-[70vw] rounded-full blur-[55px] transition-colors duration-700 ${
                isLight ? "bg-blue-100/[0.45]" : "bg-blue-500/[0.18]"
              }`}
            />
          </div>
        </motion.div>
        
        {/* Deep Indigo Nebula */}
        <motion.div
          className="absolute"
          style={{
            left: "80%",
            top: "50%",
            y: scrollY2,
          }}
        >
          <div className="-translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{
                x: [0, -90, 70, -40, 0],
                y: [0, 80, -60, 50, 0],
                scale: [1, 1.12, 0.93, 1.07, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`w-[85vw] h-[85vw] rounded-full blur-[70px] transition-colors duration-700 ${
                isLight ? "bg-sky-100/[0.40]" : "bg-sky-600/[0.14]"
              }`}
            />
          </div>
        </motion.div>
        
        {/* Purple/Indigo Nebula */}
        <motion.div
          className="absolute"
          style={{
            left: "30%",
            top: "75%",
            y: scrollY3,
          }}
        >
          <div className="-translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{
                x: [0, 70, -80, 50, 0],
                y: [0, -50, 90, -60, 0],
                scale: [1, 1.08, 0.96, 1.04, 1],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`w-[75vw] h-[75vw] rounded-full blur-[60px] transition-colors duration-700 ${
                isLight ? "bg-cyan-100/[0.35]" : "bg-cyan-500/[0.14]"
              }`}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="background-nebulae" className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
      {/* Indigo Nebula */}
      <motion.div
        className={`absolute w-[45vw] h-[45vw] max-w-[500px] rounded-full blur-[110px] transition-colors duration-700 ${
          isLight ? "bg-blue-100/[0.30]" : "bg-blue-500/[0.08]"
        }`}
        style={{
          x: spring1X,
          y: spring1Y,
          left: 0,
          top: 0,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      {/* Deep Indigo Nebula */}
      <motion.div
        className={`absolute w-[50vw] h-[50vw] max-w-[600px] rounded-full blur-[130px] transition-colors duration-700 ${
          isLight ? "bg-sky-100/[0.30]" : "bg-sky-600/[0.06]"
        }`}
        style={{
          x: spring2X,
          y: spring2Y,
          left: 0,
          top: 0,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      {/* Purple/Indigo Nebula */}
      <motion.div
        className={`absolute w-[42vw] h-[42vw] max-w-[550px] rounded-full blur-[120px] transition-colors duration-700 ${
          isLight ? "bg-cyan-100/[0.25]" : "bg-cyan-500/[0.05]"
        }`}
        style={{
          x: spring3X,
          y: spring3Y,
          left: 0,
          top: 0,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </div>
  );
}

