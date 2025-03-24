import React from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-[#000] text-white shadow-md md:py-4 py-2">
      <div className="container mx-auto px-4 md:py-3 py-2 md:flex  justify-center md:justify-between items-center">
        <Link to="/" className=" justify-center md:justify-start  md:mb-0 mb-4 flex items-center space-x-2 text-xl font-bold">
          <Award size={24} />
          <span>Certificate Issuance System</span>
        </Link>
        <div className="flex justify-center md:justify-start items-center space-x-4">
          <Link to="/" className="hover:text-black transition-colors bg-[#fff] text-black py-1 md:py-2 px-3 rounded-lg">
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;