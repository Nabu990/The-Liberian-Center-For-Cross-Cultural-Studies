import Link from 'next/link'
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-royal-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <GraduationCap className="h-10 w-10" />
              <span className="text-2xl font-bold font-heading">LCCCS</span>
            </div>
            <p className="text-gray-300 mb-6">
              Liberian Center for Cross Cultural Studies - A world-class institution dedicated to academic excellence and cross-cultural understanding.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-gold-400 transition-colors">
                <Facebook />
              </Link>
              <Link href="#" className="hover:text-gold-400 transition-colors">
                <Twitter />
              </Link>
              <Link href="#" className="hover:text-gold-400 transition-colors">
                <Linkedin />
              </Link>
              <Link href="#" className="hover:text-gold-400 transition-colors">
                <Instagram />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-300 hover:text-gold-400 transition-colors">About Us</Link></li>
              <li><Link href="/academics" className="text-gray-300 hover:text-gold-400 transition-colors">Academics</Link></li>
              <li><Link href="/admissions" className="text-gray-300 hover:text-gold-400 transition-colors">Admissions</Link></li>
              <li><Link href="/student-life" className="text-gray-300 hover:text-gold-400 transition-colors">Student Life</Link></li>
              <li><Link href="/news" className="text-gray-300 hover:text-gold-400 transition-colors">News & Events</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-gold-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Programs</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-300 hover:text-gold-400 transition-colors">Undergraduate</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-gold-400 transition-colors">Graduate</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-gold-400 transition-colors">Professional</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-gold-400 transition-colors">Online Learning</Link></li>
              <li><Link href="#" className="text-gray-300 hover:text-gold-400 transition-colors">Certificate Programs</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 mt-1 text-gold-400" />
                <span className="text-gray-300">Monrovia, Liberia</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gold-400" />
                <span className="text-gray-300">+231 XXX XXXX</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gold-400" />
                <span className="text-gray-300">info@lcccs.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Liberian Center for Cross Cultural Studies. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
