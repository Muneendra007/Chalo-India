import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-slate-950 pt-20 pb-10 border-t border-white/10 text-white">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Company Info */}
                    <div>
                        <div className="flex items-center space-x-2 mb-6">
                            <MapPin className="w-6 h-6 text-emerald-400" />
                            <span className="text-xl font-serif tracking-wide">Chalo India</span>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mb-6">
                            Empowering travelers to discover India's hidden gems with premium experiences and unmatched hospitality.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition group">
                                <Facebook className="w-4 h-4 text-white/60 group-hover:text-white" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition group">
                                <Twitter className="w-4 h-4 text-white/60 group-hover:text-white" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition group">
                                <Instagram className="w-4 h-4 text-white/60 group-hover:text-white" />
                            </a>
                            <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition group">
                                <Youtube className="w-4 h-4 text-white/60 group-hover:text-white" />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-lg font-serif mb-6 text-emerald-400">Company</h4>
                        <ul className="space-y-3 text-sm text-white/60">
                            <li><a href="#" className="hover:text-white transition">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition">Press & Media</a></li>
                            <li><a href="#" className="hover:text-white transition">Sustainability</a></li>
                            <li><a href="#" className="hover:text-white transition">Travel Blog</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Services */}
                    <div>
                        <h4 className="text-lg font-serif mb-6 text-emerald-400">Services</h4>
                        <ul className="space-y-3 text-sm text-white/60">
                            <li><a href="#" className="hover:text-white transition">Holiday Packages</a></li>
                            <li><a href="#" className="hover:text-white transition">Corporate Travel</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h4 className="text-lg font-serif mb-6 text-emerald-400">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-white/40 mt-0.5" />
                                <span>+91 9390007029<br /><span className="text-xs text-white/30">Mon-Sun, 9am - 9pm</span></span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-white/40" />
                                <span>support@chaloindia.in</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-white/40 mt-0.5" />
                                <span>123, Cyber City, DLF Phase 2,<br />Gurugram, Haryana, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-white/40">
                    <p>© 2026 Chalo India. All rights reserved. | Developed by Muneendra</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition">Terms of Service</a>
                        <a href="#" className="hover:text-white transition">Sitemap</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
