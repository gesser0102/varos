'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LoadingLink } from '@/components/ui/LoadingLink'
import { useState } from 'react'

export function DashboardHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="border-b border-[#222729]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
        <Image
          src="/logo-varos.png"
          alt="VAROS"
          width={101}
          height={18}
          className="w-20 sm:w-[101px] h-auto"
        />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-3 lg:gap-4">
          <LoadingLink
            href="/dashboard"
            className={`px-4 py-2 rounded-lg text-sm lg:text-base transition-all ${
              pathname === '/dashboard'
                ? 'text-white font-medium bg-[#1a1a1a] border border-[#2a2a2a]'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]/50 border border-transparent'
            }`}
            skeletonClassName="px-4 py-2 rounded-lg text-sm lg:text-base bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400"
          >
            Clientes
          </LoadingLink>
          <LoadingLink
            href="/consultores"
            className={`px-4 py-2 rounded-lg text-sm lg:text-base transition-all ${
              pathname === '/consultores'
                ? 'text-white font-medium bg-[#1a1a1a] border border-[#2a2a2a]'
                : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]/50 border border-transparent'
            }`}
            skeletonClassName="px-4 py-2 rounded-lg text-sm lg:text-base bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400"
          >
            Consultores
          </LoadingLink>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-[#222729] bg-[#131313]">
          <div className="px-4 py-2 space-y-1">
            <LoadingLink
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base transition-colors ${
                pathname === '/dashboard'
                  ? 'text-white font-medium bg-[#1a1a1a] border border-[#2a2a2a]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]/50'
              }`}
              skeletonClassName="block px-3 py-2 rounded-lg text-base bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400"
            >
              Clientes
            </LoadingLink>
            <LoadingLink
              href="/consultores"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base transition-colors ${
                pathname === '/consultores'
                  ? 'text-white font-medium bg-[#1a1a1a] border border-[#2a2a2a]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]/50'
              }`}
              skeletonClassName="block px-3 py-2 rounded-lg text-base bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400"
            >
              Consultores
            </LoadingLink>
          </div>
        </nav>
      )}
    </div>
  )
}
