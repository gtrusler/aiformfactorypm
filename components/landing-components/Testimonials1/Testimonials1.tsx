"use client";

import React from "react";
import { useState } from "react";
import { TestimonialProps } from "./types";
import { defaultTestimonials } from "./testimonials";

interface Testimonial {
  id: string;
  image: string;
  name: string;
  role: string;
  quote: string;
  stars: number[];
}

const Testimonials1: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: "1",
      image: "/images/testimonials/user1.jpg",
      name: "John Doe",
      role: "Software Engineer",
      quote: "Amazing product!\nReally helped our team.",
      stars: [1, 2, 3, 4, 5],
    },
    // ... add more testimonials as needed
  ];

  return (
    <section className="mb-32 text-center">
      <h2 className="mb-12 text-3xl font-bold">Testimonials</h2>
      <div className="grid gap-x-6 md:grid-cols-3 lg:gap-x-12">
        {testimonials.map((testimonial, index) => (
          <li key={`testimonial-${index}`} className="mb-12 md:mb-0">
            <div className="mb-6 flex justify-center">
              <img
                src={testimonial.image}
                className="w-32 rounded-full shadow-lg dark:shadow-black/20"
                alt={testimonial.name}
              />
            </div>
            <h5 className="mb-2 text-lg font-bold">{testimonial.name}</h5>
            <h6 className="mb-4 font-medium text-primary dark:text-primary-400">
              {testimonial.role}
            </h6>
            <p className="mb-4">
              {testimonial.quote.split("\n").map((line, i) => (
                <span key={`quote-${index}-${i}`}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <ul className="mb-0 flex justify-center">
              {testimonial.stars.map((star, i) => (
                <li key={`star-${index}-${i}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 96 960 960"
                    className="w-5 text-warning"
                  >
                    <path
                      fill="currentColor"
                      d="m233 976 65-281L80 506l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"
                    />
                  </svg>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </div>
    </section>
  );
};

export default Testimonials1;
