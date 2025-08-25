import React from 'react';
import { Page } from '../types';
import type { StakeLevel } from '../types';

interface CardSelectionPageProps {
    stake: StakeLevel;
    navigateTo: (page: Page, data?: any) => void;
    selectedCards: number[];
}

const CardSelectionPage: React.FC<CardSelectionPageProps> = ({ stake, navigateTo, selectedCards }) => {

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const cardNumbers = Array.from({ length: 250 }, (_, i) => i + 1);
    // Mock some cards as taken
    const takenCards = [3, 8, 12, 25, 33, 43, 44, 58, 77, 91, 104, 111, 121, 135, 149, 155, 167, 189, 201, 222, 245];

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-6xl font-bold text-green-500 dark:text-green-400 mb-4 tracking-widest">{formatTime(stake.timer)}</h1>
            <div className="flex items-center space-x-4 mb-8">
                <span className="bg-slate-200 dark:bg-slate-700 text-lg font-semibold px-6 py-3 rounded-lg shadow-md">
                    {stake.stake} Birr Per Card
                </span>
                <button 
                    onClick={() => navigateTo(Page.Stake)}
                    className="bg-gray-500 dark:bg-gray-600 text-white text-xl font-bold w-12 h-12 rounded-full hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                    ×
                </button>
            </div>
            <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 lg:grid-cols-25 gap-2 w-full max-w-7xl">
                {cardNumbers.map(num => {
                    const isUserSelected = selectedCards.includes(num);
                    const isTaken = takenCards.includes(num) && !isUserSelected;
                    return (
                        <button
                            key={num}
                            onClick={() => !isTaken && !isUserSelected && navigateTo(Page.CardView, { cardId: num })}
                            className={`p-2 rounded-md font-bold text-center transition-all duration-200
                                ${isTaken ? 'bg-red-500 cursor-not-allowed text-white' : ''}
                                ${isUserSelected ? 'bg-green-500 text-white scale-110 cursor-default' : ''}
                                ${!isUserSelected && !isTaken ? 'bg-gray-300 dark:bg-gray-200 text-slate-800 hover:bg-gray-400 dark:hover:bg-gray-300' : ''}
                            `}
                            disabled={isTaken || isUserSelected}
                        >
                            {num}
                        </button>
                    );
                })}
            </div>
            {selectedCards.length > 0 && (
                 <div className="mt-8 text-center text-lg p-3 bg-slate-700/50 rounded-lg">
                    You have selected {selectedCards.length} card(s). The game will begin when the timer ends.
                 </div>
            )}
        </div>
    );
};

export default CardSelectionPage;