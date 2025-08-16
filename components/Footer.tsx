import React from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Github } from 'lucide-react'

const Footer: React.FC = () => (
  <footer className="relative bg-black/90 backdrop-blur-md text-white border-t border-white/10">
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Company Info */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-400">
              Itinerarly
            </span>
          </h3>
          <p className="text-sm text-gray-300 max-w-md">
            Making travel planning simple and enjoyable for everyone. Your intelligent companion for exploring the incredible landscapes and rich cultural heritage of India.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex flex-col md:items-end">
          <h3 className="text-base font-semibold text-white mb-3">Connect With Us</h3>
          <div className="flex space-x-4">
            {[
              { icon: Twitter, href: 'https://x.com/iWriteCode__', label: 'Twitter' },
              { icon: Github, href: 'https://github.com/heisen47', label: 'GitHub' },
              { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
              { icon: Mail, href: 'mailto:contact@itinerarly.com', label: 'Email' },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-orange-400 transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/10 hover:border-white/20"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 pt-6 border-t border-white/20">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Itinerarly. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Made with ❤️ for travelers</span>
            <div className="flex items-center space-x-1">
              <span className="text-orange-400">⚡</span>
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Background decoration */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
  </footer>
)

export default Footer