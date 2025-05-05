import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <div className="fixed w-full top-0 bg-green-900/90 backdrop-blur-md transition-all duration-300 shadow-lg border-b border-green-800/50 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo with Animation */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center p-2 border-2 border-yellow-400/80 shadow-lg transform transition-transform group-hover:rotate-12 group-hover:scale-110 duration-300 relative">
              <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping"></div>
              <div className="relative w-full h-full animate-pulse-subtle">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#1E5128" />
                  <path d="M12 6C12 6 7 10 7 14C7 16.5 9 18 12 18C15 18 17 16.5 17 14C17 10 12 6 12 6Z" fill="#4CAF50" />
                  <path d="M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2" stroke="#FFC107" strokeWidth="0.5" />
                  <path d="M12 11L13.5 14H10.5L12 11Z" fill="#FFC107" />
                  <path d="M9 11.5C9 11.5 12 14 15 11.5" stroke="#FFC107" strokeWidth="0.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white leading-none tracking-wide">कृषि<span className="text-yellow-300 relative">सागर
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-300/70"></span>
              </span></span>
              <span className="text-xs text-green-100 opacity-90 font-medium">Agriculture Ocean</span>
            </div>
          </Link>
          
          {/* Navigation with Improved Hover Effects */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-yellow-300 transition-colors relative group py-1 font-medium">
              <span className="relative z-10 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link href="/about" className="text-white hover:text-yellow-300 transition-colors relative group py-1 font-medium">
              <span className="relative z-10 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>About</span>
              </span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link href="/projects" className="text-white hover:text-yellow-300 transition-colors relative group py-1 font-medium">
              <span className="relative z-10 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Services</span>
              </span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link href="/blog" className="text-white hover:text-yellow-300 transition-colors relative group py-1 font-medium">
              <span className="relative z-10 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Community</span>
              </span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
            <Link href="/contact" className="text-white hover:text-yellow-300 transition-colors relative group py-1 font-medium">
              <span className="relative z-10 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Contact</span>
              </span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          </nav>
          
          {/* Action Buttons & Enhanced Language Selector */}
          <div className="flex items-center gap-4">
            {/* Improved Language Selector Dropdown */}
            <div className="relative group">
              <button className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center gap-2 transition-all hover:shadow-md font-medium">
                <span className="hidden sm:inline text-sm">English</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="absolute right-0 top-full mt-1 w-36 bg-green-800 border border-green-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform -translate-y-2 group-hover:translate-y-0 z-50">
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-white hover:bg-green-700 flex items-center gap-2 text-sm font-medium">
                    <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">EN</span>
                    <span>English</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-white hover:bg-green-700 flex items-center gap-2 text-sm font-medium">
                    <span className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold">हि</span>
                    <span>हिंदी</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-white hover:bg-green-700 flex items-center gap-2 text-sm font-medium">
                    <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold">ગુ</span>
                    <span>ગુજરાતી</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Search Button */}
            <button className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors hover:shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Account Button */}
            <Link href="/auth/sign-in" className="hidden md:block">
              <div className="relative">
                <div className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors hover:shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </Link>
            
            {/* Mobile Menu Button */}
            <button className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white md:hidden transition-colors hover:shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 