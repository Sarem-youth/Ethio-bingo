
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Page } from '../types';
import type { StakeLevel, BingoCardNumbers } from '../types';
import { BINGO_CARD_DATA } from '../constants';
import { VolumeIcon, MuteIcon } from '../components/icons/VolumeIcon';
import WinnerModal from '../components/WinnerModal';
import { UserIcon } from '../components/icons/UserIcon';

interface GamePageProps {
    stake: StakeLevel;
    navigateTo: (page: Page) => void;
    cardIds: number[];
    onWin: (amount: number) => void;
}

interface PlayerCardProps {
    cardId: number;
    cardData: BingoCardNumbers;
    calledNumbers: number[];
    daubedNumbers: number[];
    onDaub: (cardId: number, number: number) => void;
}

interface WinningInfo {
    patternType: string;
    numbers: number[];
}

const checkCardForWin = (cardData: BingoCardNumbers, daubedNumbers: number[]): WinningInfo | null => {
    const cardMatrix = [
        cardData.B,
        cardData.I,
        cardData.N,
        cardData.G,
        cardData.O,
    ];
    const daubedSet = new Set(daubedNumbers);
    daubedSet.add(0); // Free space is always daubed

    // Check horizontal lines
    for (let row = 0; row < 5; row++) {
        const winningNumbers = [];
        let lineComplete = true;
        for (let col = 0; col < 5; col++) {
            const num = cardMatrix[col][row];
            if (!daubedSet.has(num)) {
                lineComplete = false;
                break;
            }
            winningNumbers.push(num);
        }
        if (lineComplete) return { patternType: `row-${row}`, numbers: winningNumbers };
    }

    // Check vertical lines
    for (let col = 0; col < 5; col++) {
         if (cardMatrix[col].every(num => daubedSet.has(num))) {
            return { patternType: `col-${col}`, numbers: cardMatrix[col] };
         }
    }

    // Check diagonals
    const diag1Numbers = [];
    let diag1Complete = true;
    for (let i = 0; i < 5; i++) {
        const num = cardMatrix[i][i];
        diag1Numbers.push(num);
        if (!daubedSet.has(num)) {
            diag1Complete = false;
        }
    }
    if (diag1Complete) return { patternType: 'diag-tl-br', numbers: diag1Numbers };

    const diag2Numbers = [];
    let diag2Complete = true;
    for (let i = 0; i < 5; i++) {
        const num = cardMatrix[4 - i][i];
        diag2Numbers.push(num);
        if (!daubedSet.has(num)) {
            diag2Complete = false;
        }
    }
    if (diag2Complete) return { patternType: 'diag-tr-bl', numbers: diag2Numbers };
    
    // Check four corners
    const cornerNumbers = [
        cardMatrix[0][0], // top-left
        cardMatrix[4][0], // top-right
        cardMatrix[0][4], // bottom-left
        cardMatrix[4][4]  // bottom-right
    ];
    if (cornerNumbers.every(num => daubedSet.has(num))) {
        return { patternType: 'corners', numbers: cornerNumbers };
    }


    return null;
};


const PlayerCard: React.FC<PlayerCardProps> = ({ cardId, cardData, calledNumbers, daubedNumbers, onDaub }) => {
    const cardMatrix = [cardData.B, cardData.I, cardData.N, cardData.G, cardData.O];
    
    const numbersToRender: { num: number, isFree: boolean }[] = [];
    for (let i = 0; i < 5; i++) { // rows
        for (let j = 0; j < 5; j++) { // columns
            const num = cardMatrix[j][i];
            numbersToRender.push({ num, isFree: num === 0 });
        }
    }

    return (
        <div className="bg-slate-200 dark:bg-slate-300 p-2 md:p-4 rounded-lg shadow-2xl flex-shrink-0 w-[300px] md:w-[350px]">
            <h2 className="text-slate-800 text-xl md:text-2xl font-bold text-center mb-2 md:mb-4">Card No. {cardId}</h2>
            <div className="grid grid-cols-5 gap-1 md:gap-2">
                {['B', 'I', 'N', 'G', 'O'].map(header => (
                    <div key={header} className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-white text-2xl md:text-3xl font-bold rounded-full shadow-lg bg-gradient-to-br from-red-500 to-red-700">{header}</div>
                ))}
                {numbersToRender.map(({ num, isFree }, index) => {
                     const isFreeSpace = isFree;
                     const isCalled = calledNumbers.includes(num);
                     const isDaubed = daubedNumbers.includes(num);

                     let buttonClasses = `w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-xl md:text-2xl font-bold rounded-md shadow-md transition-all duration-300`;

                    if (isFreeSpace) {
                        buttonClasses += ' bg-blue-500 text-white cursor-default';
                    } else if (isDaubed) {
                        buttonClasses += ' bg-blue-500 text-white'; // Daubed
                    } else if (isCalled) {
                        buttonClasses += ' bg-white text-slate-800 ring-2 ring-yellow-400 animate-pulse'; // Actionable to daub
                    } else {
                        buttonClasses += ' bg-white text-slate-800 opacity-70 cursor-not-allowed'; // Not called
                    }
                    
                     return (
                        <button 
                            key={index} 
                            onClick={() => onDaub(cardId, num)}
                            disabled={!isCalled || isFreeSpace}
                            className={buttonClasses}
                        >
                            {isFreeSpace ? 'F' : num}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};


const generateFullNumberSet = () => {
    const set: { [key: string]: number[] } = { B: [], I: [], N: [], G: [], O: [] };
    for (let i = 1; i <= 75; i++) {
        if (i <= 15) set.B.push(i);
        else if (i <= 30) set.I.push(i);
        else if (i <= 45) set.N.push(i);
        else if (i <= 60) set.G.push(i);
        else set.O.push(i);
    }
    return set;
};

const GamePage: React.FC<GamePageProps> = ({ stake, navigateTo, cardIds, onWin }) => {
    const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
    const [daubedNumbers, setDaubedNumbers] = useState<{ [key: number]: number[] }>({});
    const [hasBingo, setHasBingo] = useState(false);
    const [winningCardsInfo, setWinningCardsInfo] = useState<{ [key: number]: WinningInfo }>({});
    const [lastCalled, setLastCalled] = useState<{ letter: string; number: number } | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [winnerInfo, setWinnerInfo] = useState<{ cardId: number; pattern: WinningInfo } | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playerCards = useMemo(() => {
        return cardIds.map(id => ({
            id,
            data: BINGO_CARD_DATA[id] || BINGO_CARD_DATA[Object.keys(BINGO_CARD_DATA)[0] as any]
        }));
    }, [cardIds]);

    const fullNumberSet = useMemo(() => generateFullNumberSet(), []);

    const playSound = useCallback((number: number) => {
        if (!isMuted) {
            const audioSrc = `https://audio.ahunbingo.com/audio/Amharic/F${number}.mp3`;
            if (audioRef.current) {
                audioRef.current.src = audioSrc;
                audioRef.current.play().catch(error => console.error("Audio play failed:", error));
            }
        }
    }, [isMuted]);
    
    useEffect(() => {
        // Initialize daubed state with free space (0) for each card
        const initialDaubs: { [key: number]: number[] } = {};
        for (const card of playerCards) {
            initialDaubs[card.id] = [0];
        }
        setDaubedNumbers(initialDaubs);
    }, [playerCards]);


    useEffect(() => {
        audioRef.current = new Audio();
        // Preload an empty audio file to enable autoplay on some browsers
        audioRef.current.src = "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
    }, []);
    
    useEffect(() => {
        const allPossibleNumbers = Array.from({length: 75}, (_, i) => i + 1);
        
        const callNumber = () => {
             if (winnerInfo) {
                clearInterval(interval);
                return;
            }
            const availableNumbers = allPossibleNumbers.filter(n => !calledNumbers.includes(n));
            if (availableNumbers.length === 0) {
                clearInterval(interval);
                return;
            }
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            const newNumber = availableNumbers[randomIndex];
            
            setCalledNumbers(prev => [...prev, newNumber]);
            let letter = '';
            if (newNumber <= 15) letter = 'B';
            else if (newNumber <= 30) letter = 'I';
            else if (newNumber <= 45) letter = 'N';
            else if (newNumber <= 60) letter = 'G';
            else letter = 'O';
            setLastCalled({ letter, number: newNumber });
            playSound(newNumber);
        };
        
        const interval = setInterval(callNumber, 3000);

        return () => clearInterval(interval);
    }, [calledNumbers, winnerInfo, playSound]);

    const handleDaub = useCallback((cardId: number, number: number) => {
        if (!calledNumbers.includes(number)) return;

        setDaubedNumbers(prev => {
            const currentDaubs = prev[cardId] || [0];
            const isDaubed = currentDaubs.includes(number);
            const newDaubs = isDaubed ? currentDaubs.filter(n => n !== number) : [...currentDaubs, number];
            return { ...prev, [cardId]: newDaubs };
        });
    }, [calledNumbers]);
    
    useEffect(() => {
        if (winnerInfo) return;

        const newWinningCards: { [key: number]: WinningInfo } = {};
        let anyBingo = false;

        for (const card of playerCards) {
            const cardDaubs = daubedNumbers[card.id];
            if (cardDaubs) {
                const winCheck = checkCardForWin(card.data, cardDaubs);
                if (winCheck) {
                    newWinningCards[card.id] = winCheck;
                    anyBingo = true;
                }
            }
        }
        
        setWinningCardsInfo(newWinningCards);
        setHasBingo(anyBingo);

    }, [daubedNumbers, playerCards, winnerInfo]);
    
    useEffect(() => {
        if (winnerInfo) {
            onWin(stake.possibleWin);
        }
    }, [winnerInfo, onWin, stake.possibleWin]);

    const handleBingoClick = () => {
        if (!hasBingo) return;
        
        const winningCardIds = Object.keys(winningCardsInfo);
        if (winningCardIds.length > 0) {
            const firstWinningCardId = parseInt(winningCardIds[0], 10);
            setWinnerInfo({ 
                cardId: firstWinningCardId, 
                pattern: winningCardsInfo[firstWinningCardId] 
            });
        }
    };


    return (
        <div className="flex flex-col items-center">
            {winnerInfo && <WinnerModal navigateTo={navigateTo} winnings={stake.possibleWin} cardId={winnerInfo.cardId} winningNumbers={winnerInfo.pattern.numbers} />}
            <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-8">
                {/* Left Panel */}
                <div className="w-full lg:w-1/4 space-y-4">
                    <div className="bg-white dark:bg-slate-200 rounded-full w-40 h-40 flex flex-col items-center justify-center shadow-2xl border-8 border-purple-500 mx-auto">
                        {lastCalled ? <>
                            <span className="text-5xl font-extrabold text-purple-700">{lastCalled.letter}</span>
                            <span className="text-7xl font-extrabold text-slate-800">{lastCalled.number}</span>
                        </> : <span className="text-slate-800 text-2xl font-bold">Waiting...</span>}
                    </div>
                    <div className="text-center bg-white/50 dark:bg-slate-700/50 p-4 rounded-lg">
                        <p className="text-xl">{calledNumbers.length} Balls Called</p>
                        <p className="text-xl font-bold text-yellow-500 dark:text-yellow-400">Win - {stake.possibleWin} ETB</p>
                    </div>
                    <button onClick={() => setIsMuted(!isMuted)} className="mx-auto block text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
                        {isMuted ? <MuteIcon className="w-12 h-12" /> : <VolumeIcon className="w-12 h-12" />}
                    </button>
                </div>
                
                {/* Center Panel - Main Board */}
                <div className="w-full lg:w-1/2 bg-white/50 dark:bg-slate-700/50 p-4 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                         <h2 className="text-2xl font-bold">Good Luck!!!</h2>
                         <div className="flex items-center space-x-2 bg-black/30 px-3 py-1 rounded-full text-white">
                            <UserIcon className="w-5 h-5" />
                            <span>23</span>
                         </div>
                    </div>
                    <div className="grid grid-cols-5 gap-1">
                        {Object.entries(fullNumberSet).map(([letter, numbers]) => 
                            <div key={letter} className="space-y-1">
                                 <div className="w-full h-8 flex items-center justify-center rounded-full font-bold text-lg bg-red-500 text-white mb-1">{letter}</div>
                                {numbers.map(num => {
                                    const isCalled = calledNumbers.includes(num);
                                    return (
                                    <div key={num} className={`w-full h-8 flex items-center justify-center rounded-full font-bold text-sm transition-all duration-300
                                        ${isCalled ? `bg-blue-500 text-white scale-105` : 'bg-gray-200 text-slate-800'}`}>
                                        {num}
                                    </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Panel - Player Cards */}
            <div className="mt-8 w-full">
                <div className="flex space-x-4 overflow-x-auto pb-4">
                    {playerCards.map(card => (
                        <PlayerCard 
                            key={card.id} 
                            cardId={card.id} 
                            cardData={card.data} 
                            calledNumbers={calledNumbers}
                            daubedNumbers={daubedNumbers[card.id] || []}
                            onDaub={handleDaub}
                        />
                    ))}
                </div>
                 <button 
                    className="w-full max-w-sm mx-auto mt-4 bg-blue-600 text-white font-bold py-4 rounded-lg text-xl hover:bg-blue-700 transition-transform transform hover:scale-105 duration-200 disabled:bg-gray-500 disabled:scale-100 disabled:cursor-not-allowed"
                    disabled={!hasBingo || !!winnerInfo}
                    onClick={handleBingoClick}
                 >
                    Bingo
                </button>
            </div>
        </div>
    );
};

export default GamePage;