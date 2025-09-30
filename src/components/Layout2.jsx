import React from "react";

const Layout2 = () => {
  return (
    <div className="md:mt-[5.5%] mt-[10%] w-[92%] border-black/5 bg-neutral-800/5 rounded-md">
      <div className="md:text-2xl text-[1rem] text-start md:p-7 p-1 mt-4 md:mt-0 font-semibold">
        <p>Discover an Extensive Selection of Creamy,</p>
        <p>Delicious Ice Creams Just for You!</p>
      </div>
      <div className="grid md:grid-cols-4 md:flex  items-center justify-evenly w-[100%] ">
        <div className="md:w-[20rem] w-full md:h-[25rem] h-[10rem] md:flex md:flex-col justify-center items-center text-center grid grid-cols-2 md:gap-0 gap-[2%]">
          <div className="w-[12rem] md:w-full">
            <img
              src="https://i.pinimg.com/1200x/ed/8c/a3/ed8ca3bf49cc68cfa40af95e21d4bda4.jpg"
              alt="picture"
              className="rounded-2xl hover:p-2 w-full h-auto"
            />
          </div>

          <div className="md:mt-[5%] mt-[3%] md:px-0 px-2">
            <p className="md:text-[1rem] text-[0.8rem]">
              Discover the Art of Ice Cream Making
            </p>
            <p className="text-[0.6rem] md:mt-[2%] mt-[0.5%] md:p-0 p-0.5">
              Step into our creamy wonderland, watch the churning process, and
              see how we transform simple ingredients into frozen perfection.
            </p>
            <p className="text-[0.6rem] md:mt-[5%] mt-[2%]">Learn more</p>
          </div>
        </div>

        <div className="md:w-[20rem] w-full md:h-[25rem] h-[10rem] md:flex md:flex-col justify-center items-center text-center grid grid-cols-2 md:gap-0 gap-[2%]">
          <div className="w-[12rem] md:w-full">
            <img
              src="https://i.pinimg.com/736x/fa/07/0a/fa070a405c3c83592af45203d79cd3e8.jpg"
              alt="picture"
              className="rounded-2xl hover:p-2 w-full h-auto"
            />
          </div>

          <div className="md:mt-[5%] mt-[3%] md:px-0 px-2">
            <p className="md:text-[1rem] text-[0.8rem]">
              Freshly Churned, Artisan Crafted
            </p>
            <p className="text-[0.6rem] md:mt-[2%] mt-[0.5%] md:p-0 p-0.5">
              Taste the richness of small-batch ice cream made with love and
              precision, straight from our creamery to your cone.
            </p>
            <p className="text-[0.6rem] md:mt-[5%] mt-[2%]">Learn more</p>
          </div>
        </div>

        <div className="md:w-[20rem] w-full md:h-[25rem] h-[10rem] md:flex md:flex-col justify-center items-center text-center grid grid-cols-2 md:gap-0 gap-[2%]">
          <div className="w-[12rem] md:w-full">
            <img
              src="https://i.pinimg.com/736x/b6/a3/05/b6a305bc5264090048759198c59bf293.jpg"
              alt="picture"
              className="rounded-2xl hover:p-2 w-full h-auto"
            />
          </div>

          <div className="md:mt-[5%] mt-[3%] md:px-0 px-2">
            <p className="md:text-[1rem] text-[0.8rem]">
              Meet the Makers Behind the Magic
            </p>
            <p className="text-[0.6rem] md:mt-[2%] mt-[0.5%] md:p-0 p-0.5">
              Get inspired by our passionate artisans and learn how traditional
              techniques create unforgettable frozen experiences.
            </p>
            <p className="text-[0.6rem] md:mt-[5%] mt-[2%]">Learn more</p>
          </div>
        </div>

        <div className="md:w-[20rem] w-full md:h-[25rem] h-[10rem] md:flex md:flex-col justify-center items-center text-center grid grid-cols-2 md:gap-0 gap-[2%]">
          <div className="w-[12rem] md:w-full">
            <img
              src="https://i.pinimg.com/736x/39/b4/51/39b451361e66d9336d50dfed5fafccfa.jpg"
              alt="picture"
              className="rounded-2xl hover:p-2 w-full h-auto"
            />
          </div>

          <div className="md:mt-[5%] mt-[3%] md:px-0 px-2">
            <p className="md:text-[1rem] text-[0.8rem]">
              A Pint of Happiness at Your Doorstep
            </p>
            <p className="text-[0.6rem] md:mt-[2%] mt-[0.5%] md:p-0 p-0.5">
              Enjoy hand-scooped premium ice creams delivered weekly — creamy,
              dreamy, and utterly irresistible.
            </p>
            <p className="text-[0.6rem] md:mt-[5%] mt-[2%]">Learn more</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout2;
