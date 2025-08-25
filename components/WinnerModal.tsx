import React from 'react';
import { Page } from '../types';
import { TrophyIcon } from './icons/TrophyIcon';
import { BINGO_CARD_DATA } from '../constants';
import type { BingoCardNumbers } from '../types';

interface WinnerModalProps {
    navigateTo: (page: Page) => void;
    winnings: number;
    cardId: number;
    winningNumbers: number[];
}

const BingoCardGrid: React.FC<{ card: BingoCardNumbers; winningNumbers: number[] }> = ({ card, winningNumbers }) => {
    const headers = ['B', 'I', 'N', 'G', 'O'];
    
    const winningSet = new Set(winningNumbers);

    const cardMatrix = [card.B, card.I, card.N, card.G, card.O];
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
        <div className="bg-slate-200 rounded-lg p-3 shadow-inner">
            <div className="grid grid-cols-5 gap-1 text-center">
                {headers.map(header => (
                    <div key={header} className="w-10 h-10 flex items-center justify-center bg-red-600 text-white font-bold rounded-full text-xl shadow-md">
                        {header}
                    </div>
                ))}
                {numbersToRender.map((num, index) => {
                    const isFreeSpace = num === 'F';
                    const actualNum = isFreeSpace ? 0 : num as number;
                    const isWinningNumber = winningSet.has(actualNum);
                    return (
                        <div key={index} className={`w-10 h-10 flex items-center justify-center rounded-md font-bold text-lg ${isWinningNumber ? 'bg-yellow-400 text-slate-900 ring-4 ring-yellow-500 animate-pulse' : 'bg-white text-slate-800'} shadow`}>
                            {num}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const WinnerModal: React.FC<WinnerModalProps> = ({ navigateTo, winnings, cardId, winningNumbers }) => {
    const cardData = BINGO_CARD_DATA[cardId] || BINGO_CARD_DATA[11];
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
            <div 
                className="bg-green-900 bg-opacity-80 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center text-white border-2 border-green-400"
                style={{ backdropFilter: 'blur(10px)' }}
            >
                <div className="flex justify-center mb-4">
                    <TrophyIcon className="w-24 h-24 text-yellow-400" />
                </div>
                <h2 className="text-4xl font-extrabold text-yellow-300 mb-2 animate-pulse">Congratulations</h2>
                <p className="text-2xl font-semibold mb-4">YOU WON: {winnings.toFixed(2)} ETB</p>
                
                <div className="my-6">
                    <p className="mb-2 font-medium">Winning Card: No. {cardId}</p>
                    <div className="inline-block">
                        <BingoCardGrid card={cardData} winningNumbers={winningNumbers} />
                    </div>
                </div>

                <button 
                    onClick={() => navigateTo(Page.Stake)}
                    className="w-full bg-yellow-400 text-slate-900 font-bold py-4 rounded-lg text-xl hover:bg-yellow-300 transition-transform transform hover:scale-105 duration-200"
                >
                    Play again
                </button>
            </div>
        </div>
    );
};

export default WinnerModal;