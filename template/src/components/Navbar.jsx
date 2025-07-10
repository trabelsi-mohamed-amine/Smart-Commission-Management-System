// Navbar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import du fichier CSS
import NavbarAuth from "./NavbarAuth";
import "./NavbarAuth.css";

const Navbar = () => {
  // We'll use this for any scroll effects
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0 ${scrollPosition > 50 ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar-brand d-flex align-items-center px-4 px-lg-5">
        <div className="d-flex align-items-center">
          <img
            src="/img/smart.png"
            alt="SmartMeet Logo"
            className="navbar-logo"
          />
          <h1 className="navbar-brand-text">SmartMeet</h1>
        </div>
      </Link>

      <button
        type="button"
        className="navbar-toggler me-4"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <div className="navbar-nav ms-auto p-4 p-lg-0 align-items-center">
          <Link to="/" className="nav-item nav-link">Home</Link>
          <Link to="/about" className="nav-item nav-link">About</Link>
          <Link to="/service" className="nav-item nav-link">Services</Link>
          <Link to="/contact" className="nav-item nav-link">Contact</Link>
          <NavbarAuth />
        </div>
      </div>
    </nav>
  );
}
export default Navbar;