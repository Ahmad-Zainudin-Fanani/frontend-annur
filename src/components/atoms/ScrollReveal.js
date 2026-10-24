"use client";

import React, { useEffect, useRef, useState } from "react";

export default function ScrollReveal({
  children,
  animation = "fade-up", // "fade-up" | "fade-down" | "fade-left" | "fade-right" | "zoom-in"
  delay = 0, // ms
  duration = 750, // ms
  threshold = 0.12,
  className = "",
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Toggle visibility when scrolling in or out
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Allow gentle re-triggering when scrolling back up
          if (entry.boundingClientRect.top > 0) {
            setIsVisible(false);
          }
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const currentElem = elementRef.current;
    if (currentElem) {
      observer.observe(currentElem);
    }

    return () => {
      if (currentElem) {
        observer.unobserve(currentElem);
      }
    };
  }, [threshold]);

  let initialTransform = "translateY(36px)";
  if (animation === "fade-down") initialTransform = "translateY(-36px)";
  if (animation === "fade-left") initialTransform = "translateX(40px)";
  if (animation === "fade-right") initialTransform = "translateX(-40px)";
  if (animation === "zoom-in") initialTransform = "scale(0.92) translateY(20px)";

  return (
    <div
      ref={elementRef}
      className={`transition-all ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : initialTransform,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
