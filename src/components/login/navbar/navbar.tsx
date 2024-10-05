'use client'

import Link from "next/link";
import { useState } from 'react'
import { AlignJustify } from 'lucide-react';
import Image from "next/image";

export default function Navbar() {
    
    const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <nav className="bg-black text-white p-4">
    <div className="container mx-auto flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold">  <Image src="/Logo.png" width={70} height={70} alt="logo"/></Link>
    
      <div className="hidden md:flex space-x-4">
        <Link href="#" className="hover:text-[#F7B5CD]">Home</Link>
        <Link href="#" className="hover:text-[#F7B5CD]">Team</Link>
        <Link href="#" className="hover:text-[#F7B5CD]">Matches</Link>
        <Link href="#" className="hover:text-[#F7B5CD]">News</Link>
      </div>
      <button 
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
      <AlignJustify />
      </button>
    </div>
    {isMenuOpen && (
      <div className="md:hidden mt-2 space-y-2">
        <Link href="#" className="block hover:text-[#F7B5CD]">Home</Link>
        <Link href="#" className="block hover:text-[#F7B5CD]">Team</Link>
        <Link href="#" className="block hover:text-[#F7B5CD]">Matches</Link>
        <Link href="#" className="block hover:text-[#F7B5CD]">News</Link>
      </div>
    )}
  </nav>
  );
}
