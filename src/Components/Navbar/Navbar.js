import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);
    return (
        <nav className={scrolled ? "navbar scrolled" : "navbar"}>
            <ul className="nav-links">
                <li><NavLink to="/Test" activeClassName="active">About</NavLink></li>
                <li><NavLink to="/Test" activeClassName="active">Education</NavLink></li>
                <li><NavLink to="/Test" activeClassName="active">Work Ex</NavLink></li>
                <li><NavLink to="/Test" activeClassName="active">Projects</NavLink></li>
                <li><NavLink to="/Test" activeClassName="active">Extracurricular</NavLink></li>
            </ul>
        </nav>
    );
}

export default Navbar;
