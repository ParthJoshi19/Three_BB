import React from "react";

const Navbar = () => {
  return (
    <nav>
      <div className="p-4 border-3 border-black m-3 rounded-3xl flex justify-between">
        <div className="text-2xl">My Weather App</div>
        <ul className="flex gap-8 text-lg  ">
          <li className="hover:underline">Home</li>
          <li className="hover:underline">Predict Weather</li>
          <li className="hover:underline transition-all duration-200 ">About us</li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
