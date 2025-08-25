import React from 'react';
import { Page } from '../types';
import type { StakeLevel } from '../types';

interface StakePageProps {
    navigateTo: (page: Page, data: { stake: StakeLevel }) => void;
    stakeLevels: StakeLevel[];
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};


const StakeRow: React.FC<{ level: StakeLevel, onJoin: () => void }> = ({ level, onJoin }) => {
    const isPlaying = level.active === 'Playing';
    const rowColor = isPlaying ? 'bg-green-600/30 dark:bg-green-600/50' : 'bg-slate-300/30 dark:bg-slate-700/50';

    return (
        <div className={`grid grid-cols-4 md:grid-cols-5 items-center p-3 rounded-lg ${rowColor} transition-all duration-300 hover:bg-slate-400/50 dark:hover:bg-slate-600/50 relative`}>
             {level.bonus && (
                <div className="absolute -left-4 -top-3 transform -rotate-45 bg-yellow-400 text-black text-xs font-bold px-8 py-1 rounded-full shadow-lg">
                    {level.bonus}
                </div>
            )}
            <div className="font-semibold">{level.stake} birr</div>
            <div className="hidden md:block">
                {isPlaying ? 
                    <span className="text-red-500 dark:text-red-400 font-bold">{level.active}</span> : 
                    level.active
                }
            </div>
            <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm.01-4a1 1 0 110 2 1 1 0 010-2z"></path></svg>
                <span>{level.possibleWin > 0 ? `${level.possibleWin} Birr` : '-'}</span>
            </div>
            <div className="text-center font-mono text-lg">{formatTime(level.timer)}</div>
            <div className="text-right">
                <button onClick={onJoin} className="bg-slate-800 text-white dark:bg-white dark:text-slate-800 font-bold py-2 px-6 rounded-lg hover:bg-slate-700 dark:hover:bg-gray-300 transition-transform transform hover:scale-105 duration-200">
                    Join »
                </button>
            </div>
        </div>
    );
};

const StakePage: React.FC<StakePageProps> = ({ navigateTo, stakeLevels }) => {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
            <div className="w-full max-w-4xl bg-white/50 dark:bg-slate-800/60 p-4 md:p-8 rounded-xl shadow-2xl backdrop-blur-sm">
                <h1 className="text-3xl font-bold text-center mb-8">Please Choose Your Stake</h1>
                <div className="space-y-3">
                    <div className="grid grid-cols-4 md:grid-cols-5 text-gray-500 dark:text-gray-400 font-bold p-3 border-b-2 border-slate-300 dark:border-slate-600">
                        <div>Stake</div>
                        <div className="hidden md:block">Active</div>
                        <div>Possible Win</div>
                        <div className="text-center">Time Left</div>
                        <div className="text-right">Join</div>
                    </div>
                    {stakeLevels.map(level => (
                        <StakeRow key={level.id} level={level} onJoin={() => navigateTo(Page.CardSelection, { stake: level })} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StakePage;