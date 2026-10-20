'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import SearchModal from './SearchModal';
import {
  Search,
  Menu,
  X,
  Compass,
  Sparkles,
  BookOpen,
  FolderGit2,
  Award,
  Layers,
  User,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [domainsDropdown, setDomainsDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Domains', href: '/domains', hasDropdown: true },
    { name: 'Activities', href: '/activities' },
    { name: 'Learn', href: '/learn' },
    { name: 'Projects', href: '/projects' },
    { name: 'Resources', href: '/resources' },
    { name: 'Certifications', href: '/certifications' }
  ];

  const domainLinks = [
    { name: '01 · Awareness', href: '/domains/awareness' },
    { name: '02 · Explore', href: '/domains/explore' },
    { name: '03 · Red & Blue Team', href: '/domains/red-blue-team' },
    { name: '04 · Digital Forensics', href: '/domains/digital-forensics' },
    { name: '05 · Cryptography', href: '/domains/cryptography' },
    { name: '06 · Cloud Security', href: '/domains/cloud-security' },
    { name: '07 · Security Architecture', href: '/domains/security-architecture' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'py-2.5 bg-white/70 backdrop-blur-xl shadow-xs border-b border-[#E8D8C3]/60'
            : 'py-4 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Official Primary Brand Logo: 3D Glass Symbol + 0XNULL Wordmark ONLY (NO TAGLINES) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-[#D4AF37]/50 shadow-sm transition-transform duration-300 group-hover:scale-105 bg-[#FAF7F2] p-1 flex items-center justify-center">
              <Image
                src="/assets/0xnull-symbol.png"
                alt="0XNULL 3D Glass Symbol"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex items-center">
              <span className="font-black tracking-[0.22em] text-lg sm:text-xl text-[#151417] leading-none">
                0X<span className="text-[#C89D3C]">NULL</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setDomainsDropdown(true)}
                    onMouseLeave={() => setDomainsDropdown(false)}
                  >
                    <Link
                      href={link.href}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors ${
                        pathname.startsWith('/domains')
                          ? 'text-[#967223] bg-[#F5EBDD] font-semibold'
                          : 'text-[#47434E] hover:text-[#151417] hover:bg-[#F5EBDD]/60'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className="w-3 h-3 text-[#967223]" />
                    </Link>

                    {domainsDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-[#FCFBF9] border border-[#E8D8C3] rounded-2xl shadow-xl py-2 px-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#967223] border-b border-[#E8D8C3]/50 mb-1">
                          Seven Domains
                        </div>
                        {domainLinks.map((d) => (
                          <Link
                            key={d.href}
                            href={d.href}
                            onClick={() => setDomainsDropdown(false)}
                            className={`block px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                              pathname === d.href
                                ? 'bg-[#F5EBDD] text-[#967223] font-semibold'
                                : 'text-[#47434E] hover:bg-[#FAF7F2] hover:text-[#151417]'
                            }`}
                          >
                            {d.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-colors ${
                    isActive
                      ? 'text-[#967223] bg-[#F5EBDD] font-semibold'
                      : 'text-[#47434E] hover:text-[#151417] hover:bg-[#F5EBDD]/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Search + Auth */}
          <div className="flex items-center gap-2.5">
            {/* Global Command / Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#E8D8C3] text-xs text-[#645E6D] hover:text-[#151417] hover:border-[#C89D3C] transition-all cursor-pointer shadow-2xs"
              title="Global Search (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#967223]" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] rounded bg-[#FAF7F2] text-[#8A8592] border border-[#E8D8C3]">
                ⌘K
              </kbd>
            </button>

            {/* Join the Club Action */}
            <Link
              href="/join"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] border border-[#D4AF37]/40 shadow-2xs transition-all hover:scale-[1.02]"
            >
              <span>Join the Club</span>
            </Link>

            {/* Auth / Dashboard link */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors shadow-2xs"
                >
                  <User className="w-3.5 h-3.5 text-[#E5C378]" />
                  <span>Dashboard</span>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-[#C89D3C] to-[#A87D25] text-white hover:opacity-95 transition-all shadow-sm"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#47434E] hover:text-[#151417] hover:bg-[#F5EBDD]/60 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-[#FCFBF9] border-l border-[#E8D8C3] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8D8C3]">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37]/50 bg-[#FAF7F2] p-1 flex items-center justify-center">
                    <Image
                      src="/assets/0xnull-symbol.png"
                      alt="0XNULL Logo"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <span className="font-black text-base tracking-wider text-[#151417]">
                    0X<span className="text-[#C89D3C]">NULL</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#8A8592] hover:text-[#151417] hover:bg-[#FAF7F2]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              <div className="mt-4 flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'bg-[#F5EBDD] text-[#967223] font-semibold'
                        : 'text-[#47434E] hover:bg-[#FAF7F2] hover:text-[#151417]'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="pt-3 pb-1">
                  <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#967223]">
                    Seven Domains
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {domainLinks.map((d) => (
                      <Link
                        key={d.href}
                        href={d.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          pathname === d.href
                            ? 'bg-[#F5EBDD] text-[#967223] font-semibold'
                            : 'text-[#55505C] hover:bg-[#FAF7F2] hover:text-[#151417]'
                        }`}
                      >
                        {d.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions inside drawer */}
            <div className="pt-6 border-t border-[#E8D8C3] space-y-3">
              <Link
                href="/join"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#151417] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Join the Club</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-[#E8D8C3] bg-white text-xs font-semibold text-[#151417] flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 text-[#967223]" />
                <span>Search Everything (⌘K)</span>
              </button>

              {user ? (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#151417] text-[#FAF7F2] text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4 text-[#E5C378]" />
                    <span>My Student Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 text-xs font-medium text-[#8A8592] hover:text-rose-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C89D3C] to-[#A87D25] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
                >
                  <span>Sign In with Google</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
