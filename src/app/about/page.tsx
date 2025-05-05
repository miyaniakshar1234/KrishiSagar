import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-24">
        {/* Header Section */}
        <section className="bg-green-800 text-white py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Krishi Sagar</h1>
            <p className="text-xl max-w-3xl mx-auto">
              A comprehensive smart agriculture ecosystem focused on revolutionizing 
              India's farming landscape through technology and organic practices.
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-3xl font-bold text-green-800">Our Mission</h2>
                <p className="text-gray-700">
                  Krishi Sagar's primary objective is to revolutionize the agricultural landscape, 
                  with a particular focus on promoting Organic Farming. We provide a comprehensive 
                  platform for farmers, store owners, brokers, and consumers to interact and manage 
                  agricultural activities seamlessly.
                </p>
                <p className="text-gray-700">
                  By integrating financial management, community features, and detailed organic 
                  farming insights, we help farmers adopt more sustainable farming practices while 
                  improving their livelihoods.
                </p>
                
                <h3 className="text-2xl font-bold text-green-700 mt-8">Why Organic Farming?</h3>
                <p className="text-gray-700">
                  Organic farming is the heart of our project. It emphasizes natural processes 
                  and the use of organic materials to cultivate crops. Our aim is to educate farmers, 
                  provide them with tools for organic farming, and connect them to a marketplace 
                  where they can sell their organic produce directly to consumers.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 mt-8">
                  <div className="flex-1 bg-white rounded-lg p-6 shadow-md">
                    <h4 className="font-bold text-green-700 mb-2">Sustainable Practices</h4>
                    <p className="text-sm text-gray-600">
                      We promote farming techniques that maintain soil health and biodiversity 
                      while reducing environmental impact.
                    </p>
                  </div>
                  <div className="flex-1 bg-white rounded-lg p-6 shadow-md">
                    <h4 className="font-bold text-green-700 mb-2">Community Support</h4>
                    <p className="text-sm text-gray-600">
                      We build networks of farmers, experts, and consumers to share knowledge 
                      and create sustainable markets.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="relative">
                  <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-xl">
                    <div className="relative w-full h-full">
                      <Image 
                        src="/images/farm/organic-farming.jpg" 
                        alt="Organic farming practices" 
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-yellow-500 flex items-center justify-center text-center p-4 border-4 border-white shadow-lg">
                    <span className="text-black font-bold">100% Organic Focus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-12">Our Core Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-green-800 mb-2">Sustainability</h3>
                <p className="text-gray-600 text-center">
                  We believe in agricultural practices that meet present needs without compromising 
                  future generations, focusing on soil health and biodiversity.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-green-800 mb-2">Community</h3>
                <p className="text-gray-600 text-center">
                  We foster a supportive ecosystem of farmers, experts, and consumers 
                  collaborating to share knowledge and improve agricultural practices.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-green-800 mb-2">Innovation</h3>
                <p className="text-gray-600 text-center">
                  We leverage technology to solve agricultural challenges, from AI-powered 
                  crop analysis to digital financial tracking and blockchain verification.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-green-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Join the Agriculture Revolution</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Be part of our community and help transform India's agricultural landscape 
              with sustainable practices and innovative technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <button className="px-8 py-4 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-all">
                  Register Now
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </main>
  );
} 