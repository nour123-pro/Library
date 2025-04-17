import React, { useEffect, useRef, useState } from 'react';
import "../assets/css/pro.css"
// Type declarations for progressbar.js
declare global {
  namespace ProgressBar {
    interface SemiCircleOptions {
      strokeWidth?: number;
      color?: string;
      trailColor?: string;
      trailWidth?: number;
      easing?: string;
      duration?: number;
      svgStyle?: null | Record<string, string>;
      text?: {
        value?: string;
        alignToBottom?: boolean;
        className?: string;
      };
      step?: (state: any, bar: any) => void;
    }

    class SemiCircle {
      constructor(container: HTMLElement, options: SemiCircleOptions);
      animate(value: number, options?: { duration?: number }): void;
      setText(text: string): void;
      value(): number;
      path: SVGPathElement;
      text: HTMLElement;
    }
  }
}
interface ProgressBarProps {
  numberbookread: string; // Changed from string to number
}

const ProgressBarComponent: React.FC <ProgressBarProps>= ({numberbookread}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/progressbar.js@1.1.0/dist/progressbar.min.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    script.onerror = () => console.error('Failed to load progressbar.js');

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!loaded || !containerRef.current) return;

    const bar = new ProgressBar.SemiCircle(containerRef.current, {
      strokeWidth: 10,
      color: 'black',
      trailColor: 'rgba(255,255,255, 0.4)',
      trailWidth: 3,
      easing: 'easeInOut',
      duration: 1400,
      svgStyle: null,
      text: {
        value: '',
        alignToBottom: false,
        className: 'progressbar__label',
      },
      step: (state, bar) => {
        bar.path.setAttribute('stroke', state.color);
        const value = Math.round(bar.value() * 100);
        if (value === 0) {
          bar.setText('');
        } else {
          bar.setText(
            `<span style='margin-left:30%;color:var(--blue);font-family:var(--dreamfont);font-weight:900;font-size:60px'>${value}%</span><br><span style='font-size: 14px;color:var(--gray2)'>Your have Completed ${numberbookread} <span style='font-size: 34px;'>📖</span>      </span>`
          );
        }
        bar.text.style.color = state.color;
      },
    });
    
    bar.animate(+numberbookread/100);

    return () => {
      // Cleanup if needed
    };
  }, [loaded]);

  return <div ref={containerRef} style={{width:"100%",height:"100%"}} className='svg'/>;
};

export default ProgressBarComponent;