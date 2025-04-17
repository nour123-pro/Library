import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Words = () => {
  useEffect(() => {
    // GSAP Animation Code
    gsap.fromTo(
      '.word', 
      { opacity: 0, y: 40 }, // Start: Hidden & moved down
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, // Longer duration for smoother effect
        stagger: 1, // Slower stagger between words
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.MainWords',
          start: 'top top', // Starts when `.MainWordsContainer` is at top
          end: '+=100%', // Keeps animation within viewport
          scrub: true, // Makes animation smooth
          pin: false, // Fixes `.MainWordsContainer` in place
          toggleActions: 'play reverse play reverse'
        }
      }
    );
  }, []);

  return (
    <div className="Words">
      <div className="MainWords">
        <span className="word"><i className="fas fa-pen"></i> <span style={{ color: 'red' }}>R</span>eading</span>
        <span className="word"><i className="fas fa-circle"></i> <span style={{ color: 'blue' }}>i</span>s</span>
        <span className="word"><i className="fas fa-triangle"></i> t<span style={{ color: 'green' }}>h</span>e</span>
        <span className="word"><i className="fas fa-key"></i> k<span style={{ color: 'orange' }}>e</span>y</span>
        <span className="word"><i className="fas fa-cogs"></i> t<span style={{ color: 'purple' }}>h</span>at</span>
        <span className="word"><i className="fas fa-unlock"></i> un<span style={{ color: 'yellow' }}>l</span>ocks</span>
        <span className="word"><i className="fas fa-infinity"></i> inf<span style={{ color: 'pink' }}>i</span>nite</span>
        <span className="word"><i className="fas fa-globe"></i> wo<span style={{ color: 'blue' }}>r</span>lds</span>
      </div>
      <div className="SecondWords"></div>
    </div>
  );
}

export default Words;
