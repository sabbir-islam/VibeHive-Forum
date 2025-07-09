import React from "react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div>
      <footer className="relative bg-gradient-to-br from-[#354351ec] to-[#354351] text-white overflow-hidden">
        {/* Background geometric pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="absolute top-0 right-0 w-full h-full"
            viewBox="0 0 800 400"
            preserveAspectRatio="none"
          >
            <path
              d="M0,100 L200,50 L400,120 L600,80 L800,100 L800,400 L0,400 Z"
              fill="currentColor"
              opacity="0.1"
            />
            <path
              d="M0,200 L300,150 L500,220 L800,180 L800,400 L0,400 Z"
              fill="currentColor"
              opacity="0.1"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Brand and Description */}
            <div className="md:col-span-1">
              {/* Logo and Brand Name */}
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-lg mr-3 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">V</span>
                </div>
                <h3 className="text-2xl font-bold">VIBEHIBE</h3>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                Connecting communities through meaningful conversations and
                shared experiences. Join the vibe and discover new perspectives
                in our dynamic forum platform.
              </p>

              {/* Social Media Icons */}
              <div className="flex space-x-4 mb-6">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.223.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
              </div>

              {/* Back to Top Button */}
              <button
                onClick={scrollToTop}
                className="inline-flex items-center px-4 py-2 border border-gray-400 text-gray-300 hover:text-white hover:border-white transition-colors duration-200"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
                BACK TO TOP
              </button>
            </div>

            {/* Middle Column - Site Map */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Site Map</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors duration-200 underline"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/forums"
                    className="text-gray-300 hover:text-white transition-colors duration-200 underline"
                  >
                    Membership
                  </a>
                </li>
              </ul>
            </div>
            {/* Right Column - Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/privacy"
                    className="text-gray-300 hover:text-white transition-colors duration-200 underline"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-gray-300 hover:text-white transition-colors duration-200 underline"
                  >
                    Terms of Services
                  </a>
                </li>
                <li>
                  <a
                    href="/community-guidelines"
                    className="text-gray-300 hover:text-white transition-colors duration-200 underline"
                  >
                    Community Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="/cookies"
                    className="text-gray-300 hover:text-white transition-colors duration-200 underline"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/dmca"
                    className="text-gray-300 hover:text-white transition-colors duration-200 underline"
                  >
                    DMCA Notice
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 py-4">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-white text-sm">
              Copyright © 2025 vibehibe. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
