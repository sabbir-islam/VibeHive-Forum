import React, { useState, useEffect } from "react";
import animationData from "../assets/404-animation.json";
import Lottie from "react-lottie";

const NotFound = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8 text-center">
        <div>
          <div className="flex justify-center mb-4 sm:mb-6">
            <Lottie
              options={defaultOptions}
              height={isMobile ? 250 : 350}
              width={isMobile ? 300 : 450}
            />
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900">
            404
          </h1>
          <h2 className="mt-4 sm:mt-6 text-xl sm:text-3xl font-bold text-gray-900">
            Page not found
          </h2>
          <p className="mt-2 text-base sm:text-lg text-gray-600 px-2 sm:px-0">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
          <a
            href="/"
            className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#082B48] hover:bg-[#082b48d2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Go back home
          </a>

          <button
            onClick={() => window.history.back()}
            className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-[#EF433F] hover:bg-[#082B48] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
