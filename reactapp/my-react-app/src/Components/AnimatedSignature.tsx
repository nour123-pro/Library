import React, { useState, useEffect, useRef } from 'react';
import '../assets/css/signature.css'; // We'll create this CSS file

const AnimatedSignature = () => {
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (!isAnimating) {
      animateSignature(e.target.value);
    }
  };

  const animateSignature = (fullName: string) => {
    setIsAnimating(true);
    setDisplayName('');
    let currentIndex = 0;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx) return;

    // Canvas setup
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.font = 'italic 400 36px "Brush Script MT", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const drawFrame = () => {
      if (currentIndex <= fullName.length) {
        const partialName = fullName.substring(0, currentIndex);
        setDisplayName(partialName);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw signature with "ink" effect
        if (partialName) {
          ctx.fillStyle = '#333';
          ctx.fillText(partialName, canvas.width/2, canvas.height/2);
          
          // Add "ink blot" at the end
          if (currentIndex < fullName.length) {
            ctx.beginPath();
            ctx.arc(
              canvas.width/2 + ctx.measureText(partialName).width/2 + 2, 
              canvas.height/2 - 5, 
              3, 
              0, 
              Math.PI * 2
            );
            ctx.fillStyle = '#1a73e8';
            ctx.fill();
          }
        }
        
        currentIndex++;
        animationRef.current = requestAnimationFrame(drawFrame);
      } else {
        setIsAnimating(false);
      }
    };

    drawFrame();
  };

  return (
    <div className="signature-container">
      <div className="input-container">
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Type your name"
          className="signature-input"
        />
      </div>
      
      <div className="signature-display">
        <canvas 
          ref={canvasRef} 
          className="signature-canvas"
          style={{ display: name ? 'block' : 'none' }}
        />
        {!name && (
          <div className="signature-placeholder">
            Your signature will appear here
          </div>
        )}
      </div>
      
      
    </div>
  );
};

export default AnimatedSignature;