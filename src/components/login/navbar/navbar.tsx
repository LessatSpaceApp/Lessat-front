"use client";

import Link from "next/link";
import { useState } from "react";
import { AlignJustify } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-black p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and "Lessat" text together */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-2xl font-bold">
            <Image src="/Logo.png" width={70} height={70} alt="logo" />
          </Link>
          <div className="text-2xl font-bold text-pink-100">LESSAT</div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden space-x-4 md:flex">
          <Link href="/" className="hover:text-[#F7B5CD]">
            Home
          </Link>
          <Link href="/team" className="hover:text-[#F7B5CD]">
            Team
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <AlignJustify />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mt-2 space-y-2 md:hidden">
          <Link href="/" className="block hover:text-[#F7B5CD]">
            Home
          </Link>
          <Link href="/team" className="block hover:text-[#F7B5CD]">
            Team
          </Link>
          <Link href="#" className="block hover:text-[#F7B5CD]">
            Matches
          </Link>
          <Link href="#" className="block hover:text-[#F7B5CD]">
            News
          </Link>
        </div>
      )}
    </nav>
  );
}
