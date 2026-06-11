'use client';

import { useScroll, useTransform, useReducedMotion, motion } from 'framer-motion';
import { useRef } from 'react';

interface Image {
    src: string;
    alt?: string;
}

interface ZoomParallaxProps {
    /** Array of images to be displayed in the parallax effect max 7 images */
    images: Image[];
}

export function ZoomParallax({ images }: ZoomParallaxProps) {
    const container = useRef(null);
    const reducedMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end'],
    });

    const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4.4]);
    const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
    const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
    const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
    const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

    const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

    const captionOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
    const captionY = useTransform(scrollYProgress, [0.85, 1], [16, 0]);

    if (reducedMotion) {
        return (
            <div className="grid grid-cols-2 gap-3 px-6 pb-24 md:grid-cols-3">
                {images.map(({ src, alt }, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={alt || `Gallery image ${index + 1}`}
                        className="aspect-[4/3] w-full object-cover"
                        loading="lazy"
                    />
                ))}
            </div>
        );
    }

    return (
        <div ref={container} className="relative h-[300vh]">
            <div className="sticky top-0 h-screen overflow-hidden bg-brand-bg">
                {images.map(({ src, alt }, index) => {
                    const scale = scales[index % scales.length];

                    return (
                        <motion.div
                            key={index}
                            style={{ scale }}
                            className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? '[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]' : ''} ${index === 2 ? '[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]' : ''} ${index === 3 ? '[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]' : ''} ${index === 4 ? '[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]' : ''} ${index === 5 ? '[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]' : ''} ${index === 6 ? '[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]' : ''} `}
                        >
                            <div className="relative h-[25vh] w-[25vw]">
                                <img
                                    src={src || '/placeholder.svg'}
                                    alt={alt || `Parallax image ${index + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </motion.div>
                    );
                })}

                {/* Closing caption — resolves the zoom instead of just ending */}
                <motion.div
                    style={{ opacity: captionOpacity, y: captionY }}
                    className="pointer-events-none absolute inset-x-0 bottom-14 z-10 flex flex-col items-center gap-3"
                >
                    <span className="inline-block h-1.5 w-1.5 rotate-45 bg-gold/80" />
                    <p className="font-display text-lg font-light italic tracking-wide text-white/85 md:text-2xl">
                        Basarab&apos;s Dance — unforgettable moments
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
