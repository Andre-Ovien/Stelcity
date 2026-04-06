'use client';
import React from 'react';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const reviews = [
    {
      name: 'Esther',
      initial: 'E',
      text: 'The quality of the ingredients is top-notch! My formulations have never been more stable and effective.',
      color: 'bg-[#A888FF]',
      rotation: -6, 
    },
    {
      name: 'Rachel',
      initial: 'R',
      text: 'Gentle on my skin and it actually works. I noticed visible improvements within a few weeks.',
      color: 'bg-[#89D46C]',
      rotation: 6,
    },
    {
      name: 'Mercy',
      initial: 'M',
      text: 'Fast delivery and reliable products. My order arrived exactly as described and well-packaged.',
      color: 'bg-[#F23D7A]',
      rotation: -3,
    },
  ];

  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };


  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      rotate: 0 
    },
    visible: (rotation) => ({
      opacity: 1,
      y: 0,
      rotate: rotation,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    }),
  };

  return (
    <section className="bg-[#D9E9D1] py-20 px-6 flex flex-col items-center overflow-hidden">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center"
      >
        What Our Clients Say
      </motion.h2>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="flex flex-col gap-3 w-full max-w-md"
      >
        {reviews.map((review, index) => (
          <motion.div
            key={index}
            custom={review.rotation}
            variants={cardVariants}
            whileHover={{ 
              rotate: 0, 
              scale: 1.05,
              zIndex: 10,
              transition: { duration: 0.2 } 
            }}
            whileTap={{ scale: 0.98 }}
            className={`
              ${review.color} 
              p-6 rounded-[20px] shadow-lg cursor-pointer
            `}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-black">
                {review.initial}
              </div>
              <div>
                <p className="font-bold text-sm leading-none">{review.name}</p>
                <div className="flex text-yellow-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm font-medium leading-relaxed text-gray-900">
              {review.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Testimonials;