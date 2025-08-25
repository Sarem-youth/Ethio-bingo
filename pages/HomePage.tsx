import React from 'react';
import { Page } from '../types';

interface HomePageProps {
    navigateTo: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-[calc(100vh-150px)]">
            <div className="md:w-1/3 p-8 bg-white/50 dark:bg-slate-700/50 rounded-lg shadow-xl mr-0 md:mr-10 mb-10 md:mb-0 backdrop-blur-sm">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="bg-gray-200 text-slate-800 rounded-full h-16 w-16 flex items-center justify-center font-bold text-3xl">
                        8
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">ቢንጎ ንጉስ</h1>
                </div>
                <button 
                    onClick={() => navigateTo(Page.Stake)}
                    className="w-full bg-slate-800 text-white dark:bg-white dark:text-slate-800 font-bold py-3 px-6 rounded-lg text-xl hover:bg-slate-700 dark:hover:bg-gray-200 transition-transform transform hover:scale-105 duration-200 flex items-center justify-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Play</span>
                </button>
            </div>
            <div className="md:w-2/3 flex justify-center">
                 <img src="https://i.imgur.com/uRcr9xY.png" alt="Bingo Balls" className="max-w-sm md:max-w-md" />
            </div>
        </div>
    );
};

export default HomePage;