import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-24">
        {/* Header Section */}
        <section className="bg-green-800 text-white py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">KrishiGram Community</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Connect with farmers, share knowledge, and learn from experts in our 
              agriculture-focused social network.
            </p>
          </div>
        </section>

        {/* Community Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-green-800">Share Your Farming Journey</h2>
                <p className="text-gray-700">
                  With KrishiGram, you can share your farming experiences, techniques, and success 
                  stories through short videos and posts. Connect with other farmers, learn from their 
                  experiences, and build a supportive community around sustainable farming practices.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Upload short videos about your farming techniques</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Share daily updates through stories</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Comment and like content from other farmers</span>
                  </li>
                </ul>
                <div>
                  <Link href="/register">
                    <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                      Join KrishiGram Today
                    </button>
                  </Link>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-xl h-[400px]">
                <Image
                  src="/images/farm/krishigram-feed.jpg"
                  alt="KrishiGram feed interface"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16 md:flex-row-reverse">
              <div className="space-y-6 md:order-2">
                <h2 className="text-3xl font-bold text-green-800">Join Specialized Farming Groups</h2>
                <p className="text-gray-700">
                  Connect with farmers who share your specific interests. Join or create groups focused on 
                  particular crops, organic farming techniques, regional challenges, or any agricultural topic 
                  that matters to you.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Crop-specific communities (Rice, Wheat, Cotton, etc.)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Regional farming groups based on your location</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Special interest groups like organic farming or permaculture</span>
                  </li>
                </ul>
                <div>
                  <Link href="/community-groups">
                    <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                      Explore Groups
                    </button>
                  </Link>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-xl h-[400px] md:order-1">
                <Image
                  src="/images/farm/farming-groups.jpg"
                  alt="Farming groups discussion"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-green-800">Learn from Agriculture Experts</h2>
                <p className="text-gray-700">
                  Access expert advice, tutorials, and guidance from agricultural professionals. 
                  Watch expert-created content, participate in live Q&A sessions, and get your 
                  farming questions answered by verified specialists.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Educational videos and tutorials from verified experts</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Live webinars and Q&A sessions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-700">Direct messaging with agriculture specialists</span>
                  </li>
                </ul>
                <div>
                  <Link href="/experts">
                    <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                      Connect with Experts
                    </button>
                  </Link>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-xl h-[400px]">
                <Image
                  src="/images/farm/expert-advice.jpg"
                  alt="Agriculture experts providing advice"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Content */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-12">Featured Community Content</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Featured Post 1 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 relative">
                  <Image
                    src="/images/farm/featured-post-1.jpg"
                    alt="Organic pest control techniques"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    Organic Farming
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-green-800 mb-2">5 Natural Pest Control Techniques That Actually Work</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Farmer Rajesh Kumar shares his experience with effective organic pest control methods 
                    that have improved his crop yield without chemicals.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-800 text-sm font-bold">RK</span>
                      </div>
                      <span className="text-xs text-gray-500">Rajesh Kumar</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>4.2K views</span>
                      <span>•</span>
                      <span>3 days ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Post 2 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 relative">
                  <Image
                    src="/images/farm/featured-post-2.jpg"
                    alt="Water conservation techniques"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                    Water Management
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-green-800 mb-2">Water Conservation Techniques for Summer Crops</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Learn how to reduce water usage by up to 30% while maintaining healthy crop growth 
                    during the hot summer months.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-800 text-sm font-bold">SP</span>
                      </div>
                      <span className="text-xs text-gray-500">Dr. Sunita Patel</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>3.7K views</span>
                      <span>•</span>
                      <span>1 week ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Post 3 */}
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 relative">
                  <Image
                    src="/images/farm/featured-post-3.jpg"
                    alt="Soil preparation techniques"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full">
                    Soil Health
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-green-800 mb-2">Preparing Your Soil for Monsoon Planting</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    A step-by-step guide to preparing your soil before the monsoon season for 
                    optimal nutrient absorption and root development.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <span className="text-yellow-800 text-sm font-bold">AM</span>
                      </div>
                      <span className="text-xs text-gray-500">Anita Mehta</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>5.9K views</span>
                      <span>•</span>
                      <span>2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/community-feed">
                <button className="px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                  Explore All Content
                </button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-green-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Growing Community</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Connect with thousands of farmers across India, share your knowledge, and 
              learn from others' experiences to improve your agricultural practices.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <button className="px-8 py-4 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-all">
                  Register Now
                </button>
              </Link>
              <Link href="/auth/sign-in">
                <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all">
                  Login
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