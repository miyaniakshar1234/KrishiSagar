import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Enhanced with better animations and design */}
      <section className="relative min-h-screen text-white overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-80 scale-110 transform transition-transform duration-10000 animate-subtle-zoom"></div>
          {/* Overlay with Grain Texture and Improved Color Gradient */}
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-green-800/30 to-green-900/70"></div>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')" }}></div>
        </div>
        
        {/* Header/Nav - Enhanced with better design and interactions */}
        <div className="relative z-20">
          <div className="fixed w-full top-0 bg-green-900/80 backdrop-blur-md transition-all duration-300 shadow-lg border-b border-green-800/50">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Redesigned Logo with Animation */}
                <div className="flex items-center gap-2 group cursor-pointer">
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
                    <span className="text-xl font-bold text-white leading-none tracking-wide">कृषि<span className="text-yellow-400 relative">सागर
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-400/50"></span>
                    </span></span>
                    <span className="text-xs text-green-200 opacity-80">Agriculture Ocean</span>
                  </div>
                </div>
                
                {/* Navigation with Improved Hover Effects */}
                <nav className="hidden md:flex items-center space-x-6">
                  <Link href="/" className="text-white hover:text-yellow-400 transition-colors relative group py-1">
                    <span className="relative z-10 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Home</span>
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
                  <Link href="/about" className="text-white hover:text-yellow-400 transition-colors relative group py-1">
                    <span className="relative z-10 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>About</span>
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
                  <Link href="/projects" className="text-white hover:text-yellow-400 transition-colors relative group py-1">
                    <span className="relative z-10 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>Services</span>
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
                  <Link href="/blog" className="text-white hover:text-yellow-400 transition-colors relative group py-1">
                    <span className="relative z-10 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Community</span>
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
                  <Link href="/contact" className="text-white hover:text-yellow-400 transition-colors relative group py-1">
                    <span className="relative z-10 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>Contact</span>
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </Link>
                </nav>
                
                {/* Action Buttons & Enhanced Language Selector */}
                <div className="flex items-center gap-4">
                  {/* Improved Language Selector Dropdown */}
                  <div className="relative group">
                    <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 transition-all hover:shadow-md">
                      <span className="hidden sm:inline text-sm">English</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <div className="absolute right-0 top-full mt-1 w-36 bg-green-800 border border-green-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform -translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="py-1">
                        <button className="w-full text-left px-4 py-2 text-white hover:bg-green-700 flex items-center gap-2 text-sm">
                          <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">EN</span>
                          <span>English</span>
                        </button>
                        <button className="w-full text-left px-4 py-2 text-white hover:bg-green-700 flex items-center gap-2 text-sm">
                          <span className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs">हि</span>
                          <span>हिंदी</span>
                        </button>
                        <button className="w-full text-left px-4 py-2 text-white hover:bg-green-700 flex items-center gap-2 text-sm">
                          <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs">ગુ</span>
                          <span>ગુજરાતી</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Search Button */}
                  <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors hover:shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  
                  {/* Account Button */}
                  <Link href="/auth/sign-in" className="hidden md:block">
                    <div className="relative">
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full text-xs flex items-center justify-center font-bold">0</div>
                      <div className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors hover:shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Mobile Menu Button */}
                  <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white md:hidden transition-colors hover:shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Hero Content with Better Typography and Animations */}
        <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 md:pt-40 md:pb-32 flex items-center min-h-screen">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full">
            <div className="w-full md:w-1/2 space-y-6 animate-fade-in-up">
              <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm mb-4 border border-white/20 shadow-lg">
                <span className="animate-pulse-subtle">🌱 Smart Agriculture Ecosystem</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
                <span className="block animate-slide-up delay-100">WELCOME TO</span>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-green-600 px-3 py-1 inline-block animate-slide-up delay-200">कृषि</span>
                  <span className="bg-yellow-500 text-black px-3 py-1 inline-block animate-slide-up delay-300">सागर</span>
                </div>
                <span className="block text-2xl md:text-3xl mt-3 text-green-300 animate-slide-up delay-500">
                  The Agriculture Ocean
                </span>
              </h1>
              <p className="text-lg text-gray-200 max-w-xl animate-fade-in delay-500 leading-relaxed">
                A comprehensive agriculture ecosystem combining AI, IoT, and community support to revolutionize farming with sustainable organic practices that empower farmers, stores, brokers, and consumers.
              </p>
              <div className="pt-6 flex flex-wrap gap-4 animate-fade-in delay-700">
                <Link href="/about" className="inline-block">
                  <button className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-semibold rounded-full hover:from-yellow-400 hover:to-yellow-300 transition-all transform hover:scale-105 hover:shadow-xl shadow-lg flex items-center gap-2 group relative overflow-hidden">
                    <span className="relative z-10">Get Started</span>
                    <span className="absolute inset-0 bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform relative z-10" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </Link>
                <Link href="/about" className="inline-block">
                  <button className="px-6 py-4 bg-transparent border-2 border-white text-white font-medium rounded-full hover:bg-white/10 transition-all hover:shadow-lg flex items-center gap-2 group relative overflow-hidden">
                    <span className="relative z-10">Discover More</span>
                    <span className="absolute inset-0 bg-green-500/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </Link>
              </div>
              
              {/* Trust Badges Section */}
              <div className="pt-10 animate-fade-in delay-1000">
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-green-300">Empowering Farmers Across India</p>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold text-yellow-500">5000+</div>
                      <div className="text-xs text-gray-300">Active Farmers</div>
                    </div>
                    <div className="h-10 w-px bg-white/20"></div>
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold text-yellow-500">20+</div>
                      <div className="text-xs text-gray-300">States Covered</div>
                    </div>
                    <div className="h-10 w-px bg-white/20"></div>
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold text-yellow-500">100%</div>
                      <div className="text-xs text-gray-300">Organic Focused</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Interactive Floating Farm Illustration */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="w-full h-96 rounded-xl bg-gradient-to-b from-green-500/10 to-green-700/20 backdrop-blur-sm border border-white/10 p-6 animate-float">
                  <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <div className="w-full h-full relative">
                      {/* The "3D" farm illustration layers */}
                      <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <Image 
                          src="https://images.unsplash.com/photo-1586771107445-d3ca888129ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                          alt="Smart Farm Illustration" 
                          width={400} 
                          height={300}
                          className="object-contain animate-float rounded-lg shadow-xl"
                        />
                      </div>
                      
                      {/* Animated dots/particles in the background */}
                      <div className="absolute bottom-6 left-6 flex gap-1 z-20">
                        <span className="w-3 h-3 rounded-full bg-white opacity-80"></span>
                        <span className="w-3 h-3 rounded-full bg-white opacity-40"></span>
                        <span className="w-3 h-3 rounded-full bg-white opacity-40"></span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-green-500/20 backdrop-blur-sm animate-pulse-slow"></div>
                <div className="absolute -bottom-5 -left-5 w-16 h-16 rounded-full bg-yellow-500/20 backdrop-blur-sm animate-pulse-slow animation-delay-1000"></div>
                <div className="absolute top-1/4 -right-8 w-12 h-12 rounded-full bg-yellow-500/10 backdrop-blur-sm animate-float delay-700"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-8 h-14 rounded-full border-2 border-white/50 flex items-center justify-center">
            <div className="w-1 h-3 bg-white/80 rounded-full animate-pulse-slow"></div>
          </div>
          <div className="text-xs text-white/70 text-center mt-2">Scroll Down</div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-green-600">5K+</h2>
              <p className="text-gray-600">Active Farmers</p>
            </div>

            <div className="text-center">
              <h2 className="text-4xl font-bold text-green-600">500+</h2>
              <p className="text-gray-600">Agro Stores</p>
            </div>

            <div className="text-center">
              <h2 className="text-4xl font-bold text-green-600">20+</h2>
              <p className="text-gray-600">States Covered</p>
            </div>

            <div className="text-center">
              <h2 className="text-4xl font-bold text-green-600">50+</h2>
              <p className="text-gray-600">Agriculture Experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with Numbers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="inline-block px-4 py-1 bg-yellow-500 text-black text-sm rounded-full mb-2">OUR SERVICES</h3>
            <h2 className="text-3xl font-bold text-green-800">REVOLUTIONARY AGRICULTURE SOLUTIONS</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center">
                    <span className="text-white text-2xl">🌿</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-green-800">Organic Farming Support</h3>
                  <p className="text-gray-600">
                    Comprehensive database of organic farming methods, including soil preparation, crop rotation, organic fertilizers, and pesticide alternatives.
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 text-8xl font-bold text-green-100 z-0">01</div>
            </div>

            {/* Service 2 */}
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center">
                    <span className="text-white text-2xl">🔬</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-green-800">AI-Powered Crop Analysis</h3>
                  <p className="text-gray-600">
                    Upload crop images for AI inspection that detects diseases, pests, and nutrient deficiencies with personalized treatment recommendations.
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 text-8xl font-bold text-green-100 z-0">02</div>
            </div>

            {/* Service 3 */}
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center">
                    <span className="text-white text-2xl">📱</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-green-800">KrishiGram Social Network</h3>
                  <p className="text-gray-600">
                    Share farming videos, join crop-specific communities, and connect with fellow farmers through our agriculture-focused social platform.
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 text-8xl font-bold text-green-100 z-0">03</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section with 100% Organic Badge */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 space-y-6">
              <h3 className="inline-block px-4 py-1 bg-yellow-500 text-black text-sm rounded-full">ABOUT US</h3>
              <h2 className="text-3xl md:text-4xl font-bold text-green-800">
                REVOLUTIONIZING AGRICULTURE WITH TECHNOLOGY
              </h2>
              <p className="text-gray-600">
                कृषि सागर (Krishi Sagar) is a smart agriculture ecosystem designed to modernize and empower India's agricultural landscape. Our primary objective is to revolutionize farming with a particular focus on promoting organic practices that benefit farmers, consumers, and our planet.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Advanced AI crop analysis and disease detection</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Comprehensive knowledge base for organic farming</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Farmer-to-consumer direct marketplace for better profits</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Complete financial tracking and management</span>
                </li>
              </ul>
              <div className="pt-4">
                <Link href="/about">
                  <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 relative">
              <div className="relative h-[400px] rounded-xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Farmer using KrishiSagar technology"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-green-600 flex flex-col items-center justify-center p-4 border-4 border-white">
                <span className="text-white font-bold text-xl">100%</span>
                <span className="text-white text-sm">ORGANIC</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg">
                <p className="font-bold text-green-800">Empowering Farmers Digitally</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-green-800">
            AGRICULTURAL SMART PROCESS
          </h2>

          <div className="relative">
            {/* Circle with lines connecting the process steps (simplified version) */}
            <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-2 border-dashed border-green-300 rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Process 1 */}
              <div className="relative z-10">
                <div className="bg-green-600 text-white p-6 rounded-xl">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold mb-4">01</div>
                  <h3 className="text-xl font-bold mb-2">Daily Crop Monitoring</h3>
                  <p className="text-sm text-white/80">
                    Upload daily crop images from multiple angles for AI analysis of health, pests, and nutrient status.
                  </p>
                </div>
              </div>

              {/* Process 2 */}
              <div className="relative z-10 md:mt-32">
                <div className="bg-green-600 text-white p-6 rounded-xl">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold mb-4">02</div>
                  <h3 className="text-xl font-bold mb-2">AI-Driven Analysis</h3>
                  <p className="text-sm text-white/80">
                    Receive alerts and solutions based on AI analysis, soil tests, and weather data for optimal crop health.
                  </p>
                </div>
              </div>

              {/* Process 3 */}
              <div className="relative z-10">
                <div className="bg-green-600 text-white p-6 rounded-xl">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold mb-4">03</div>
                  <h3 className="text-xl font-bold mb-2">Treatment Guidance</h3>
                  <p className="text-sm text-white/80">
                    Get treatment suggestions with organic options and find nearby agro-stores with the needed products.
                  </p>
                </div>
              </div>

              {/* Process 4 */}
              <div className="relative z-10 md:mt-32">
                <div className="bg-green-600 text-white p-6 rounded-xl">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold mb-4">04</div>
                  <h3 className="text-xl font-bold mb-2">Market Connection</h3>
                  <p className="text-sm text-white/80">
                    Sell directly to consumers or through yard market brokers with blockchain-verified transactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="inline-block px-4 py-1 bg-yellow-500 text-black text-sm rounded-full mb-2">OUR PLATFORM</h3>
            <h2 className="text-3xl font-bold text-green-800">KEY FEATURES FOR USERS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 - Farmer */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-64 bg-gray-100 relative">
                <Image
                  src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Farmer Features"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-md">Core User</div>
                <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">AI Enabled</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 text-green-800">👨‍🌾 Farmer Dashboard</h3>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Daily crop monitoring with AI analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Financial tracking of all transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>KrishiGram farming social network</span>
                  </li>
                </ul>
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-medium text-sm">Free Registration</span>
                  <Link href="/about" className="inline-block">
                    <button className="px-3 py-1 bg-yellow-500 text-black rounded-full text-sm">Learn More</button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature 2 - Agro Store */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-64 bg-gray-100 relative">
                <Image
                  src="https://images.unsplash.com/photo-1542992015-4a0b729b1385?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Agro Store Features"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-md">Business</div>
                <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">GST Ready</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 text-green-800">🏪 Agro Store Management</h3>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>GST-compliant digital billing system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Inventory and stock management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>AI alerts for demand forecasting</span>
                  </li>
                </ul>
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-medium text-sm">Business Account</span>
                  <Link href="/projects" className="inline-block">
                    <button className="px-3 py-1 bg-yellow-500 text-black rounded-full text-sm">Learn More</button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature 3 - Market Broker */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-64 bg-gray-100 relative">
                <Image
                  src="https://images.unsplash.com/photo-1474440692490-2e83ae13ba29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Market Broker Features"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-md">Market</div>
                <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">Blockchain</div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-2 text-green-800">🏢 Market Operations</h3>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Digital sales receipt management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Blockchain-verified transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Market price trend monitoring</span>
                  </li>
                </ul>
                <div className="flex justify-between items-center">
                  <span className="text-green-700 font-medium text-sm">Market Account</span>
                  <Link href="/blog" className="inline-block">
                    <button className="px-3 py-1 bg-yellow-500 text-black rounded-full text-sm">Learn More</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-700 via-green-600 to-green-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjwvcmVjdD4KPC9zdmc+')] opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-900/30"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Farming?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of farmers across India revolutionizing agriculture with AI-powered crop analysis, 
            organic farming techniques, and a supportive community on कृषि सागर.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-block">
              <button className="px-8 py-4 bg-yellow-500 text-black text-lg font-semibold rounded-lg hover:bg-yellow-400 transition-all transform hover:scale-105 hover:shadow-xl shadow-lg relative overflow-hidden group">
                <span className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                <span className="relative z-10">Register Now</span>
              </button>
            </Link>
            <Link href="/about" className="inline-block">
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white/10 transition-all transform hover:scale-105 relative overflow-hidden group">
                <span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                <span className="relative z-10 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Demo
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-green-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center p-2 border-2 border-yellow-400/80">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#1E5128" />
                    <path d="M12 6C12 6 7 10 7 14C7 16.5 9 18 12 18C15 18 17 16.5 17 14C17 10 12 6 12 6Z" fill="#4CAF50" />
                    <path d="M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2" stroke="#FFC107" strokeWidth="0.5" />
                    <path d="M12 11L13.5 14H10.5L12 11Z" fill="#FFC107" />
                    <path d="M9 11.5C9 11.5 12 14 15 11.5" stroke="#FFC107" strokeWidth="0.5" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-xl font-bold">कृषि सागर</span>
              </div>
              <p className="mb-4">A comprehensive smart agriculture ecosystem focused on organic farming, designed to revolutionize India's agricultural landscape through AI, IoT, and community collaboration.</p>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs bg-white/10 px-2 py-1 rounded">Available in:</span>
                <span className="text-xs">English</span>
                <span className="text-xs">•</span>
                <span className="text-xs">हिंदी</span>
                <span className="text-xs">•</span>
                <span className="text-xs">ગુજરાતી</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/about" className="hover:text-white">Features</Link></li>
                <li><Link href="/projects" className="hover:text-white">Organic Farming</Link></li>
                <li><Link href="/projects" className="hover:text-white">AI Crop Analysis</Link></li>
                <li><Link href="/blog" className="hover:text-white">Marketplace</Link></li>
                <li><Link href="/blog" className="hover:text-white">KrishiGram</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">For Users</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white">Farmers</Link></li>
                <li><Link href="/projects" className="hover:text-white">Agro Store Owners</Link></li>
                <li><Link href="/blog" className="hover:text-white">Market Brokers</Link></li>
                <li><Link href="/contact" className="hover:text-white">Agriculture Experts</Link></li>
                <li><Link href="/contact" className="hover:text-white">Agriculture Students</Link></li>
                <li><Link href="/blog" className="hover:text-white">Consumers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
              <p className="mb-2">Email: info@krishisagar.com</p>
              <p className="mb-4">Phone: +91 9876543210</p>
              <p className="mb-2">Headquarters:</p>
              <p className="text-sm mb-4">Ahmedabad, Gujarat, India</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
                <a href="#" className="hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-green-800 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} कृषि सागर. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
