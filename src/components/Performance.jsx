import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { performanceImages, performanceImgPositions } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const Performance = () => {
  const sectionRef = useRef(null);
  const isMobile = useRef(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      isMobile.current = window.innerWidth <= 1024;
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useGSAP(
    () => {
      // Text animation (runs on all screen sizes)
      const contentP = sectionRef.current?.querySelector('.content p');
      if (contentP) {
        gsap.fromTo(
          contentP,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              end: 'top 50%',
              scrub: 1,
              markers: false,
            },
          }
        );
      }

      // Image timeline (desktop only)
      if (!isMobile.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
            markers: false,
           scrollTrigger: {
             trigger: sectionRef.current,
             start: 'top center',
             end: 'bottom center',
             scrub: 1,
             markers: false,
           },          },
        });

        // Animate all images at time 0
        performanceImages.forEach(({ id }) => {
          // Skip p5 as per requirements
          if (id === 'p5') return;

          const img = sectionRef.current?.querySelector(`.${id}`);
          if (!img) return;

          const positionData = performanceImgPositions.find(
            (pos) => pos.id === id
          );
          if (!positionData) return;

          const animProps = {};

          // Build final position styles
          if (positionData.left !== undefined) {
            animProps.left = `${positionData.left}%`;
          }
          if (positionData.right !== undefined) {
            animProps.right = `${positionData.right}%`;
          }
          if (positionData.bottom !== undefined) {
            animProps.bottom = `${positionData.bottom}%`;
          }
          if (positionData.transform) {
            animProps.transform = positionData.transform;
          }

          // All animations start at time 0
          tl.fromTo(
            img,
            {
              opacity: 0,
              y: 100,
            },
            {
              opacity: 1,
              y: 0,
              ...animProps,
              duration: 1,
            },
            0
          );
        });
      }

      // Refresh ScrollTrigger on resize
      const handleResize = () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.refresh());
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section id="performance" ref={sectionRef}>
      <h2>Next-level graphics performance. Game on.</h2>

      <div className="wrapper">
        {performanceImages.map(({ id, src, alt }) => (
          <img key={id} className={id} src={src} alt={alt || `Performance graphic ${id}`} />
        ))}      </div>

      <div className="content">
        <p>
          Run graphics-intensive workflows with a responsiveness that keeps up
          with your imagination. The M4 family of chips features a GPU with a
          second-generation hardware-accelerated ray tracing engine that renders
          images faster, so{' '}
          <span className="text-white">
            gaming feels more immersive and realistic than ever.
          </span>{' '}
          And Dynamic Caching optimizes fast on-chip memory to dramatically
          increase average GPU utilization -- driving a huge performance boost
          for the most demanding pro apps and games.
        </p>
      </div>
    </section>
  );
};

export default Performance;
