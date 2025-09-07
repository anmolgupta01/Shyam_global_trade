import React, { useMemo, useEffect, useState, useRef } from 'react';

const CounterCard = React.memo(({ targetValue, label, isVisible, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState('0');
  
  // Extract number and suffix from target value (e.g., "1500+" -> 1500 and "+")
  const numericValue = parseInt(targetValue.replace(/[^\d]/g, '')) || 0;
  const suffix = targetValue.replace(/[\d]/g, '') || '';

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    const duration = 2500; // 2.5 seconds for counting animation
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) {
        startTime = timestamp + delay;
        return animationFrame = requestAnimationFrame(animate);
      }
      
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      const currentNumber = Math.floor(easeOutCubic * numericValue);
      setDisplayValue(`${currentNumber}${suffix}`);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    // Start animation after delay
    const timer = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, numericValue, suffix, delay]);

  return (
    <div className={`
      text-center transition-all duration-700 ease-out
      ${isVisible 
        ? 'opacity-100 transform translate-y-0 scale-100' 
        : 'opacity-0 transform translate-y-8 scale-95'
      }
    `}
    style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-4xl font-bold mb-4 text-white">
        {displayValue}
      </div>
      <p className="text-gray-300">{label}</p>
    </div>
  );
});

CounterCard.displayName = 'CounterCard';

const StatisticsSection = React.memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  const statisticsData = useMemo(() => [
    { value: "60+", label: "Years in Business" },
    { value: "1500+", label: "Happy Clients" },
    { value: "2500+", label: "Yearly Consignment" },
    { value: "50+", label: "Countries" }
  ], []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% visible
        rootMargin: '0px 0px -100px 0px' // Start animation 100px before entering view
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  return (
    <section 
      ref={sectionRef}
      className={`
        py-16 bg-[#254F7E] text-white transition-all duration-1000 ease-out
        ${isVisible 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-50 transform translate-y-8'
        }
      `}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {statisticsData.map((stat, index) => (
            <CounterCard 
              key={stat.label}
              targetValue={stat.value}
              label={stat.label}
              isVisible={isVisible}
              delay={index * 300} // 300ms delay between each counter
            />
          ))}
        </div>
      </div>
    </section>
  );
});

StatisticsSection.displayName = 'StatisticsSection';

export default StatisticsSection;
