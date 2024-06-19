import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar_new.css';

function NavbarNew() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

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
    const scrollToAboutContent = () => {
        const centerCard = document.getElementById('center-card-about');
        if (centerCard) {
            centerCard.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const scrollToWorkContent = () => {
        const centerCard = document.getElementById('work-timeline');
        if (centerCard) {
            centerCard.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const scrollToProjectContent = () => {
        const centerCard = document.getElementById('projects');
        if (centerCard) {
            centerCard.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const scrollToEduContent = () => {
        const centerCard = document.getElementById('edu-timeline');
        if (centerCard) {
            centerCard.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (
        <nav className={scrolled ? "navbar scrolled" : "navbar"}>
            <div className='menu' onClick={() => {
                setMenuOpen(!menuOpen);
            }}>
                <span className={menuOpen ? "open-menu" : ""}></span>
                <span className={menuOpen ? "open-menu" : ""}></span>
                <span className={menuOpen ? "open-menu" : ""}></span>
            </div>
            <ul className={menuOpen ? "open-nav-links" : "nav-links"}>
                <li><button onClick={scrollToAboutContent} activeClassName="active">About</button></li>
                <li><button onClick={scrollToWorkContent} activeClassName="active">Work</button></li>
                <li><button onClick={scrollToProjectContent}  activeClassName="active">Projects</button></li>
                <li><button onClick={scrollToEduContent} activeClassName="active">Education</button></li>
            </ul>
        </nav>
    );
}

export default NavbarNew;
