import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const SakuraParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const petals: HTMLDivElement[] = [];
    const petalCount = 15;

    // Create sakura petals
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement('div');
      petal.className = 'sakura-petal';
      petal.style.cssText = `
        position: absolute;
        width: ${8 + Math.random() * 8}px;
        height: ${8 + Math.random() * 8}px;
        background: linear-gradient(135deg, hsl(350 100% 88%) 0%, hsl(345 83% 61%) 100%);
        border-radius: 50% 0 50% 0;
        opacity: ${0.4 + Math.random() * 0.4};
        left: ${Math.random() * 100}%;
        top: -50px;
      `;
      containerRef.current.appendChild(petal);
      petals.push(petal);

      // Animate each petal
      const duration = 10 + Math.random() * 10;
      const delay = Math.random() * 5;

      gsap.to(petal, {
        y: window.innerHeight + 100,
        x: `+=${Math.random() * 200 - 100}`,
        rotation: Math.random() * 360,
        duration,
        delay,
        repeat: -1,
        ease: 'none',
        onComplete: () => {
          gsap.set(petal, {
            y: -50,
            x: `${Math.random() * 100}%`,
          });
        },
      });

      // Add subtle swaying motion
      gsap.to(petal, {
        x: `+=${Math.random() * 50 - 25}`,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    return () => {
      petals.forEach((petal) => {
        petal.remove();
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
};

export default SakuraParticles;
