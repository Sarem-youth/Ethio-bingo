import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../types';
import { GlobeIcon } from './icons/GlobeIcon';
import { UserIcon } from './icons/UserIcon';

interface HeaderProps {
    navigateTo: (page: Page) => void;
    balance: number;
    currentPage: Page;
    logout: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const NavButton: React.FC<{ page: Page; currentPage: Page; navigateTo: (page: Page) => void; children: React.ReactNode; isMobile?: boolean; }> = ({ page, currentPage, navigateTo, children, isMobile }) => {
    const isActive = currentPage === page;
    const baseClasses = "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white";
    const activeClasses = "border-b-2 border-blue-500 dark:border-white";
    const mobileClasses = "text-2xl py-4 w-full text-center";

    return (
        <button 
            onClick={() => navigateTo(page)} 
            className={`${baseClasses} ${isActive ? activeClasses : ''} ${isMobile ? mobileClasses : 'pb-1'}`}
        >
            {children}
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ navigateTo, balance, currentPage, logout, theme, toggleTheme }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    const handleNavClick = (page: Page) => {
        navigateTo(page);
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { page: Page.Home, label: 'Home' },
        { page: Page.Contact, label: 'Contact' },
        { page: Page.Leaderboard, label: 'Leaderboard' },
        { page: Page.HowToPlay, label: 'How To Play' },
        { page: Page.ReferralIncome, label: 'Referral Income' },
    ];

    return (
        <header className="bg-white/80 dark:bg-slate-700/50 shadow-lg backdrop-blur-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 flex justify-between items-center py-3">
                <div className="flex items-center space-x-8">
                    <img src="https://i.imgur.com/yQk8sHl.png" alt="Ethio Bingo Logo" className="h-12 w-12 rounded-full" />
                    <nav className="hidden md:flex items-center space-x-6">
                        {navLinks.map(link => (
                             <NavButton key={link.page} page={link.page} currentPage={currentPage} navigateTo={handleNavClick}>{link.label}</NavButton>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                     <label htmlFor="theme-toggle" className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" id="theme-toggle" className="sr-only" onChange={toggleTheme} checked={theme === 'dark'} />
                            <div className="block bg-gray-400 dark:bg-gray-600 w-10 h-5 rounded-full"></div>
                            <div className="dot absolute left-1 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out"></div>
                        </div>
                    </label>
                    <button onClick={() => navigateTo(Page.Deposit)} className="bg-gray-700 dark:bg-gray-800 text-white px-4 py-2 rounded-md shadow-md">
                        ETB {balance.toFixed(2)}
                    </button>
                    <div className="hidden md:flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                        <GlobeIcon />
                        <span>AMH</span>
                        <span className="text-xs">▼</span>
                    </div>
                     <div className="hidden md:flex relative" ref={dropdownRef}>
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 cursor-pointer p-2 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600/50">
                            <UserIcon />
                            <span>sarem</span>
                            <span className={`text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-slate-600">
                                <button onClick={() => { handleNavClick(Page.Profile); setIsDropdownOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600">Profile</button>
                                <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                     <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 dark:text-gray-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                 <div className="md:hidden fixed inset-0 bg-gray-100/90 dark:bg-slate-900/90 backdrop-blur-md z-50 flex flex-col items-center pt-20">
                    <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-5 right-5 text-gray-600 dark:text-gray-300">
                       <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <nav className="flex flex-col items-center space-y-6 w-full">
                         {navLinks.map(link => (
                             <NavButton key={link.page} page={link.page} currentPage={currentPage} navigateTo={handleNavClick} isMobile>{link.label}</NavButton>
                        ))}
                         <NavButton page={Page.Profile} currentPage={currentPage} navigateTo={handleNavClick} isMobile>Profile</NavButton>
                         <button onClick={logout} className="text-2xl py-4 w-full text-center text-red-500 dark:text-red-400">Logout</button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;