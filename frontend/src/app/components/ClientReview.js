import React from 'react';

const Testimonials = () => {
  const reviews = [
    {
      name: 'Esther',
      initial: 'E',
      text: 'The quality of the ingredients is top-notch! My formulations have never been more stable and effective.',
      color: 'bg-[#A888FF]', 
      rotation: '-rotate-6',
    },
    {
      name: 'Rachel',
      initial: 'R',
      text: 'Gentle on my skin and it actually works. I noticed visible improvements within a few weeks.',
      color: 'bg-[#89D46C]', 
      rotation: 'rotate-6',
    },
    {
      name: 'Mercy',
      initial: 'M',
      text: 'Fast delivery and reliable products. My order arrived exactly as described and well-packaged.',
      color: 'bg-[#F23D7A]', 
      rotation: '-rotate-3',
    },
  ];

  return (
    <section className="bg-[#D9E9D1] py-20 px-6 flex flex-col items-center overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
        What Our Clients Say
      </h2>

      <div className="flex flex-col gap-8 w-full max-w-md">
        {reviews.map((review, index) => (
          <div
            key={index}
            className={`
              ${review.color} 
              ${review.rotation} 
              p-6 rounded-[20px]
              transition-transform hover:rotate-0 hover:scale-105 duration-300
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;