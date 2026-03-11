"use client"

import Image from "next/image";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { FiShoppingCart, FiUser } from "react-icons/fi";

const Header = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full px-3 relative">

      <div className="bg-white w-full my-6 px-4 py-3 rounded-2xl flex justify-between items-center">

    
        <Image
          src="/images/logo.png"
          alt="Stelcity logo"
          width={100}
          height={80}
        />

    
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#">Home</a>
          <a href="#">Products</a>
          <a href="#">Services</a>

          <div className="flex items-center gap-6">
            <FiShoppingCart size={20} className="cursor-pointer" />
            <FiUser size={20} className="cursor-pointer" />
          </div>
        </nav>

    
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
        >
          {menuOpen ? <IoClose size={28} /> : <GiHamburgerMenu size={26} />}
        </button>

      </div>

      
      {menuOpen && (
        <div className="md:hidden bg-white rounded-2xl px-6 py-6 flex flex-col gap-6 shadow-lg">

          <a href="#" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#" onClick={() => setMenuOpen(false)}>Products</a>
          <a href="#" onClick={() => setMenuOpen(false)}>Services</a>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <FiShoppingCart size={20} />
              <span>Cart</span>
            </div>
            

            <div className="flex items-center gap-2">
              <FiUser size={20} />
              <span>Account</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Header;