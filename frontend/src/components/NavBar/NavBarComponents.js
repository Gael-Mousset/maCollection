import React from "react";
import { Link } from "react-router-dom";
import "./NavBarComponents.css";

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Recherche</Link>
        </li>
        <li>
          <Link to="/collection">Ma Collection</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
