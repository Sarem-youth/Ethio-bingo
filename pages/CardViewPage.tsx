

import React from 'react';
import { Page, StakeLevel } from '../types';
import { BINGO_CARD_DATA } from '../constants';

interface CardViewPageProps {
    cardId: number;
    stake: StakeLevel;
    navigateTo: (page: Page, data?: any) => void;
    addCardToSelection: (cardId: number) => void;
    selectedCards: number[];
}

const CardViewPage: React.FC<CardViewPageProps> = ({ cardId, stake, navigateTo, addCardToSelection, selectedCards }) => {
    const cardData = BINGO_CARD_DATA[cardId] || BINGO_CARD_DATA[34];
    const headers = ['B', 'I', 'N', 'G', 'O'];
    const isAlreadySelected = selectedCards.includes(cardId);

    const cardMatrix = [cardData.B, cardData.I, cardData.N, cardData.G, cardData.O];
    const numbersToRender: (number | string)[] = [];
    for (let i = 0; i < 5; i++) { // rows
        for (let j = 0; j < 5; j++) { // columns
            const num = cardMatrix[j][i];
            if (num === 0) {
                numbersToRender.push('F');
            } else {
                numbersToRender.push(num);
            }
        }
    }

    return (
        <div className="flex flex-col items-center">
            <span className="bg-slate-700 text-lg font-semibold px-6 py-3 rounded-lg shadow-md mb-8">
                {stake.stake} Birr Per Card
            </span>
            <div className="bg-slate-300 p-4 rounded-lg shadow-2xl">
                <h2 className="text-slate-800 text-2xl font-bold text-center mb-4">Card No. {cardId}</h2>
                <div className="grid grid-cols-5 gap-2">
                    {headers.map((header) => (
                        <div key={header} className={`w-16 h-16 flex items-center justify-center text-white text-3xl font-bold rounded-full shadow-lg bg-gradient-to-br from-blue-500 to-blue-700`}>
                            {header}
                        </div>
                    ))}
                    {numbersToRender.map((num, index) => (
                        <div key={index} className="w-16 h-16 flex items-center justify-center bg-white text-slate-800 text-2xl font-bold rounded-md shadow-md">
                            {num === 'F' ? <span className="text-blue-600">F</span> : num}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex space-x-6 mt-8">
                 <button 
                    onClick={() => navigateTo(Page.CardSelection, { stake })}
                    className="bg-white text-slate-800 font-bold py-3 px-10 rounded-lg text-xl hover:bg-gray-200 transition-transform transform hover:scale-105 duration-200"
                >
                    Go Back
                </button>
                 <button 
                    onClick={() => addCardToSelection(cardId)}
                    className="bg-green-500 text-white font-bold py-3 px-10 rounded-lg text-xl hover:bg-green-600 transition-transform transform hover:scale-105 duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    disabled={isAlreadySelected}
                >
                    {isAlreadySelected ? 'Card Selected' : 'Select This Card'}
                </button>
            </div>
        </div>
    );
};

export default CardViewPage;