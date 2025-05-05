import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
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
  );
} 