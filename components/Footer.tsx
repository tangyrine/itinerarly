import React from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react'

const Footer: React.FC = () => (
  <footer className="bg-gray-900 text-gray-300 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Itinerarly</h3>
          <p className="text-sm">
            Making travel planning simple and enjoyable for everyone.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {['About', 'Features', 'Pricing', 'Blog'].map((item) => (
              <li key={item}>
                <Link 
                  href={`/${item.toLowerCase()}`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2">
            {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms'].map((item) => (
              <li key={item}>
                <Link 
                  href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
          <div className="flex space-x-4">
            {[
              { icon: Facebook, href: 'https://facebook.com' },
              { icon: Twitter, href: 'https://twitter.com' },
              { icon: Instagram, href: 'https://instagram.com' },
              { icon: Linkedin, href: 'https://linkedin.com' },
              { icon: Mail, href: 'mailto:contact@itinerarly.com' },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 pt-8 border-t border-gray-800">
        <p className="text-sm text-center">
          &copy; {new Date().getFullYear()} Itinerarly. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
)

export default Footer