import React, { useEffect, useRef } from 'react';

const BackgroundAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (!canvas) return;

    const ctx = canvas?.getContext('2d');
    let animationFrameId;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system for subtle market data visualization
    const particles = [];
    const particleCount = 50;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas?.width;
        this.y = Math.random() * canvas?.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.color = Math.random() > 0.5 ? '#10B981' : '#2563EB'; // profit/primary colors
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Wrap around edges
        if (this.x < 0) this.x = canvas?.width;
        if (this.x > canvas?.width) this.x = 0;
        if (this.y < 0) this.y = canvas?.height;
        if (this.y > canvas?.height) this.y = 0;
        
        // Subtle pulsing
        this.opacity = 0.1 + Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.1;
      }
      
      draw() {
        ctx?.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx?.beginPath();
        ctx?.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx?.fill();
        ctx?.restore();
      }
    }
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles?.push(new Particle());
    }
    
    // Connection lines between nearby particles
    const drawConnections = () => {
      for (let i = 0; i < particles?.length; i++) {
        for (let j = i + 1; j < particles?.length; j++) {
          const dx = particles?.[i]?.x - particles?.[j]?.x;
          const dy = particles?.[i]?.y - particles?.[j]?.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx?.save();
            ctx.globalAlpha = (100 - distance) / 100 * 0.1;
            ctx.strokeStyle = '#334155'; // slate-700
            ctx.lineWidth = 0.5;
            ctx?.beginPath();
            ctx?.moveTo(particles?.[i]?.x, particles?.[i]?.y);
            ctx?.lineTo(particles?.[j]?.x, particles?.[j]?.y);
            ctx?.stroke();
            ctx?.restore();
          }
        }
      }
    };
    
    // Grid pattern
    const drawGrid = () => {
      const gridSize = 50;
      ctx?.save();
      ctx.globalAlpha = 0.03;
      ctx.strokeStyle = '#64748B'; // slate-500
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let x = 0; x <= canvas?.width; x += gridSize) {
        ctx?.beginPath();
        ctx?.moveTo(x, 0);
        ctx?.lineTo(x, canvas?.height);
        ctx?.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y <= canvas?.height; y += gridSize) {
        ctx?.beginPath();
        ctx?.moveTo(0, y);
        ctx?.lineTo(canvas?.width, y);
        ctx?.stroke();
      }
      
      ctx?.restore();
    };
    
    // Market data waves
    const drawWaves = () => {
      const time = Date.now() * 0.001;
      const amplitude = 30;
      const frequency = 0.01;
      
      ctx?.save();
      ctx.globalAlpha = 0.05;
      ctx.strokeStyle = '#2563EB'; // primary
      ctx.lineWidth = 2;
      
      for (let wave = 0; wave < 3; wave++) {
        ctx?.beginPath();
        for (let x = 0; x <= canvas?.width; x += 5) {
          let y = canvas?.height / 2 + 
                   Math.sin(x * frequency + time + wave * 2) * amplitude +
                   Math.sin(x * frequency * 2 + time * 1.5 + wave) * amplitude * 0.5;
          
          if (x === 0) {
            ctx?.moveTo(x, y);
          } else {
            ctx?.lineTo(x, y);
          }
        }
        ctx?.stroke();
      }
      
      ctx?.restore();
    };
    
    // Animation loop
    const animate = () => {
      ctx?.clearRect(0, 0, canvas?.width, canvas?.height);
      
      // Draw background elements
      drawGrid();
      drawWaves();
      
      // Update and draw particles
      particles?.forEach(particle => {
        particle?.update();
        particle?.draw();
      });
      
      // Draw connections
      drawConnections();
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
};

export default BackgroundAnimation;