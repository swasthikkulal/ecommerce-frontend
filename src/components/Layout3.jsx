import React from "react";

const Layout3 = () => {
  return (
    <div className="w-[92%] border-black/5 bg-neutral-800/5 mt-[2%] rounded-md">
      <div className="flex items-center justify-center md:gap-[20%] gap-[13%] p-5 md:h-[60vh] h-[25vh]">
        <div className="flex flex-col items-center w-[5rem]">
          {/* Email Icon - Using SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="md:h-10 h-7 md:w-10 w-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
          <p className="md:text-4xl text-xl md:mt-5 mt-2.5">Email</p>
          <p className="md:text-[0.9rem] text-[0.6rem]">
            swasthik126@gmail.com
          </p>
        </div>

        <div className="flex flex-col items-center w-[5rem]">
          {/* Phone Icon - Using SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="md:h-10 h-6 md:w-10 w-6"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <p className="md:text-4xl text-xl md:mt-5 mt-2.5">Phone</p>
          <p className="md:text-[0.9rem] text-[0.6rem]">9483369031</p>
        </div>

        <div className="flex flex-col items-center w-[5rem]">
          {/* Map Pin Icon - Using SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="md:h-10 h-6 md:w-10 w-6"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <p className="md:text-4xl text-xl md:mt-5 mt-2.5">Location</p>
          <p className="md:text-[0.9rem] text-[0.6rem]">Mangalore</p>
        </div>
      </div>
    </div>
  );
};

export default Layout3;
