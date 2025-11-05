import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  color?: 'primary' | 'secondary' | 'accent';
}

const ProgressBar = ({ current, max, label, color = 'primary' }: ProgressBarProps) => {
  const fillRef = useRef<HTMLDivElement>(null);
  const percentage = Math.min((current / max) * 100, 100);

  useEffect(() => {
    if (fillRef.current) {
      gsap.fromTo(
        fillRef.current,
        { width: '0%' },
        { width: `${percentage}%`, duration: 1, ease: 'power2.out' }
      );
    }
  }, [percentage]);

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-2 text-sm">
          <span className="font-medium text-foreground">{label}</span>
          <span className="font-bold text-muted-foreground">
            {current} / {max}
          </span>
        </div>
      )}
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          ref={fillRef}
          className={`h-full ${colorClasses[color]} rounded-full transition-all shadow-glow`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
