
import React from 'react';
import { LEADERBOARD_DATA } from '../constants';
import { TrophyIcon } from '../components/icons/TrophyIcon';

const LeaderboardPage: React.FC = () => {
    
    const getTrophyColor = (rank: number) => {
        if (rank === 1) return 'text-yellow-400';
        if (rank === 2) return 'text-gray-300';
        if (rank === 3) return 'text-yellow-600';
        return 'text-transparent';
    };

    return (
        <div className="flex justify-center items-start min-h-[calc(100vh-150px)] pt-10">
            <div className="w-full max-w-3xl bg-slate-800/60 p-8 rounded-xl shadow-2xl">
                <h1 className="text-4xl font-bold text-center mb-8 text-yellow-300">Leaderboard</h1>
                <div className="space-y-3">
                    {/* Header */}
                    <div className="grid grid-cols-4 text-gray-300 font-bold p-3 border-b-2 border-slate-600">
                        <div className="text-center">Rank</div>
                        <div>Player</div>
                        <div className="text-right">Winnings (ETB)</div>
                        <div className="text-center"></div>
                    </div>
                    {/* Rows */}
                    {LEADERBOARD_DATA.map((player) => (
                         <div key={player.rank} className={`grid grid-cols-4 items-center p-3 rounded-lg transition-all duration-300 ${player.rank <= 3 ? 'bg-slate-700/70' : 'bg-slate-700/40'} hover:bg-slate-600/50`}>
                            <div className="font-bold text-xl text-center">{player.rank}</div>
                            <div className="font-semibold text-lg">{player.name}</div>
                            <div className="font-semibold text-lg text-right">{player.winnings.toFixed(2)}</div>
                            <div className="flex justify-center">
                                <TrophyIcon className={`w-6 h-6 ${getTrophyColor(player.rank)}`} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
