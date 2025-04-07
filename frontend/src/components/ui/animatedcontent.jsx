import { useRef, useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

const AnimatedContent = ({
  children,
  distance = 100,
  direction = "vertical",
  reverse = false,
  config = { tension: 50, friction: 25 },
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  triggerOnScroll = true,
  triggerManually = false,
  manualTrigger = false,
  loop = false,
  animationDuration,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef();

  // Handle scroll-based triggering
  useEffect(() => {
    if (!triggerOnScroll || !ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!loop) {
            observer.unobserve(ref.current);
          }
          setTimeout(() => {
            setInView(true);
          }, delay);
        } else if (loop) {
          setInView(false);
        }
      },
      { threshold }
    );
    
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, delay, triggerOnScroll, loop]);

  // Handle manual triggering
  useEffect(() => {
    if (triggerManually) {
      setInView(manualTrigger);
    }
  }, [manualTrigger, triggerManually]);

  // Define animation directions
  const directions = {
    vertical: "Y",
    horizontal: "X",
  };

  // Optional animation duration
  const springConfig = animationDuration 
    ? { ...config, duration: animationDuration } 
    : config;

  // Create animation spring
  const springProps = useSpring({
    from: {
      transform: `translate${directions[direction]}(${reverse ? `-${distance}px` : `${distance}px`}) scale(${scale})`,
      opacity: animateOpacity ? initialOpacity : 1,
    },
    to: inView
      ? {
          transform: `translate${directions[direction]}(0px) scale(1)`,
          opacity: 1,
        }
      : {
          transform: `translate${directions[direction]}(${reverse ? `-${distance}px` : `${distance}px`}) scale(${scale})`,
          opacity: animateOpacity ? initialOpacity : 1,
        },
    config: springConfig,
    reset: loop,
  });

  return (
    <animated.div ref={ref} style={springProps}>
      {children}
    </animated.div>
  );
};

export default AnimatedContent;