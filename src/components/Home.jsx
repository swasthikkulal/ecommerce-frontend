import React, { useEffect, useRef, useState } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Layout2 from "./Layout2";
import Layout3 from "./Layout3";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [allIcecream, setallIcecream] = useState();
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/product")
      .then((res) => {
        setallIcecream(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const heroTextRef = useRef(null);
  const paraRef = useRef(null);
  const buttonRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(heroTextRef.current, {
      x: -30,
      opacity: 0,
      duration: 0.3,
      delay: 1.8,
      ease: "power1.out",
    });
    tl.from(paraRef.current, {
      x: -30,
      opacity: 0,
      duration: 0.3,
      ease: "power1.out",
    });
    tl.from(buttonRef.current, {
      x: -30,
      opacity: 0,
      duration: 0.3,
      ease: "power1.out",
    });
    tl.from(
      imageRef.current,
      {
        x: 30,
        opacity: 0,
        duration: 0.3,
        ease: "power1.out",
      },
      "-=1"
    );
  });

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-16 sm:pt-[-10%] font-['cola']">
      <div
        className="
          w-[95%] sm:w-[90%] lg:w-[85%] xl:w-[80%]
          mt-[5%] md:mt-[0%] lg:mt-[10%]
          h-auto lg:h-[75%]
          bg-white shadow-lg rounded-xl
          p-4 sm:p-6 lg:p-8
          flex flex-col lg:flex-row justify-center items-center
          transition-all duration-300
        "
      >
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
          <div className="p-4 sm:p-6">
            <h1
              ref={heroTextRef}
              className="
                text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl
                text-black font-bold leading-tight
              "
            >
              Empowering Minds,
              <br className="hidden md:block" /> Shaping Futures
            </h1>

            <p
              ref={paraRef}
              className="
                mt-3 sm:mt-4 md:mt-5
                text-gray-700
                text-sm sm:text-base md:text-lg lg:text-xl
                max-w-md md:max-w-lg lg:max-w-xl
                mx-auto lg:mx-0
              "
            >
              Discover a world-class educational experience that nurtures
              creativity, critical thinking, and personal growth. Our commitment
              is to provide transformative learning opportunities for every
              student.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 justify-center lg:justify-start"
              ref={buttonRef}
            >
              <button
                className="
                  bg-blue-500 text-white
                  px-5 py-2
                  rounded-lg
                  hover:bg-blue-600
                  transition
                  w-full sm:w-auto text-sm sm:text-base
                "
              >
                Explore
              </button>
              <button
                className="
                  text-black shadow-lg
                  px-5 py-2
                  rounded-lg
                  hover:bg-gray-200
                  transition
                  w-full sm:w-auto text-sm sm:text-base
                "
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center items-center mt-6 md:mt-8 lg:mt-0">
          <img
            ref={imageRef}
            src="https://i.pinimg.com/1200x/b7/91/f4/b791f4141ea1164605aa9a6c876b93d4.jpg"
            alt="students"
            width={500}
            height={500}
            className="w-[80%] sm:w-[70%] md:w-[65%] lg:w-[80%] max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-3 mt-5">
        {allIcecream &&
          allIcecream.map((item, index) => (
            <div
              key={index}
              className="md:w-[17rem] w-[22rem] rounded-xl p-1 md:h-[20rem] h-[8rem] grid grid-cols-2 md:grid-cols-none cursor-pointer border border-t-5 border-t-orange-200 bg-neutral-800/5"
            >
              <div className="md:h-[15rem] md:w-full rounded-md w-[80%] h-full mx-5 md:mx-0 hover:p-3">
                {/* <Img
              src="https://i.pinimg.com/1200x/bd/76/54/bd76543030db11c3f7c7bbd85f5d0270.jpg"
              alt="fruits"
              width={300}
              height={100}
              className="imageShadow1"
            /> */}
                <img src={item.image} alt="icecream" />
              </div>
              <div className="grid md:grid-cols-2">
                <div className="text-center md:text-start mt-3 md:mt-0 md:px-3">
                  <p className="font-semibold md:text-[1rem] text-[1rem]">
                    {item.name}
                  </p>
                  <p className="text-[0.8rem]">{item.price}per 1/kg</p>
                </div>
                <div
                  className="flex items-center justify-center w-[5rem] h-[2rem] bg-orange-300 md:mt-2 mt-0 rounded-md mx-12 md:mx-0 cursor-pointer"
                  onClick={() => navigate(`/singleview/${item._id}`)}
                >
                  <p className="md:text-[1rem] text-[0.8rem]">View</p>
                </div>
              </div>
            </div>
          ))}
      </div>
      <Layout2 />
      <Layout3 />
    </div>
  );
};

export default Home;
