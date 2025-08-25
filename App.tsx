import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Page } from './types';
import type { StakeLevel } from './types';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import StakePage from './pages/StakePage';
import DepositPage from './pages/DepositPage';
import CardSelectionPage from './pages/CardSelectionPage';
import CardViewPage from './pages/CardViewPage';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import HowToPlayPage from './pages/HowToPlayPage';
import ContactPage from './pages/ContactPage';
import ReferralIncomePage from './pages/ReferralIncomePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ProfilePage from './pages/ProfilePage';
import { DEFAULT_STAKE_LEVELS } from './constants';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<Page>(Page.Login);
    const [balance, setBalance] = useState<number>(200.00);
    const [selectedStake, setSelectedStake] = useState<StakeLevel | null>(null);
    const [previewCardId, setPreviewCardId] = useState<number | null>(null);
    const [selectedCardsForGame, setSelectedCardsForGame] = useState<number[]>([]);
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [stakeLevels, setStakeLevels] = useState<StakeLevel[]>(DEFAULT_STAKE_LEVELS);

    const gameStateRef = useRef({ selectedStake, selectedCardsForGame, currentPage });
    gameStateRef.current = { selectedStake, selectedCardsForGame, currentPage };

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
    }, [theme]);
    
    useEffect(() => {
        const timerId = setInterval(() => {
            setStakeLevels(prevLevels =>
                prevLevels.map(level => {
                    const newTime = level.timer > 0 ? level.timer - 1 : 0;

                    if (newTime === 0) {
                        const { selectedStake: currentStake, selectedCardsForGame: currentCards, currentPage: page } = gameStateRef.current;
                        
                        if (currentStake?.id === level.id && currentCards.length > 0) {
                            if (page === Page.CardSelection) {
                                setCurrentPage(Page.Game);
                            } else {
                                // Forfeit: Not on card selection page when timer ends
                                setSelectedCardsForGame([]);
                                setSelectedStake(null);
                                // The user is not on the card selection page, so navigate them to StakePage
                                if (page !== Page.Stake) {
                                   setCurrentPage(Page.Stake);
                                }
                            }
                        }
                        
                        return { 
                            ...level, 
                            timer: 60, 
                            active: Math.random() > 0.7 ? 'Playing' : 'None', 
                            possibleWin: level.stake * 25 
                        };
                    }
                    
                    return { ...level, timer: newTime };
                })
            );
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    }, []);

    const navigateTo = useCallback((page: Page, data?: any) => {
        if (page === Page.Stake) {
            setSelectedCardsForGame([]);
            setSelectedStake(null);
        } else if (data?.stake) {
            // Persist card selection if returning to the same stake room
            if (selectedStake?.id !== data.stake.id) {
                setSelectedCardsForGame([]);
            }
            setSelectedStake(data.stake);
        }

        setCurrentPage(page);

        if (data?.cardId) {
            setPreviewCardId(data.cardId);
        }
    }, [selectedStake]);

    const login = useCallback(() => {
        setIsAuthenticated(true);
        navigateTo(Page.Home);
    }, [navigateTo]);

    const register = useCallback(() => {
        // In a real app, this would involve an API call.
        // For this implementation, registration automatically logs the user in.
        setIsAuthenticated(true);
        navigateTo(Page.Home);
    }, [navigateTo]);

    const logout = useCallback(() => {
        setIsAuthenticated(false);
        setBalance(200.00);
        setSelectedStake(null);
        setPreviewCardId(null);
        setSelectedCardsForGame([]);
        navigateTo(Page.Login);
    }, [navigateTo]);
    
    const addCardToSelection = useCallback((cardId: number) => {
        if (selectedStake && !selectedCardsForGame.includes(cardId)) {
            const cost = selectedStake.stake;
            if (balance >= cost) {
                setBalance(prev => prev - cost);
                setSelectedCardsForGame(prev => [...prev, cardId]);
                navigateTo(Page.CardSelection, { stake: selectedStake });
            } else {
                alert("Insufficient balance!");
            }
        }
    }, [balance, navigateTo, selectedStake, selectedCardsForGame]);

    const addToBalance = useCallback((amount: number) => {
        setBalance(prev => prev + amount);
    }, []);

    const renderPage = () => {
        if (!isAuthenticated) {
            switch (currentPage) {
                case Page.Registration:
                    return <RegistrationPage register={register} navigateTo={navigateTo} />;
                case Page.Login:
                default:
                    return <LoginPage login={login} navigateTo={navigateTo} />;
            }
        }

        switch (currentPage) {
            case Page.Home:
                return <HomePage navigateTo={navigateTo} />;
            case Page.Stake:
                return <StakePage navigateTo={navigateTo} stakeLevels={stakeLevels} />;
            case Page.Deposit:
                return <DepositPage balance={balance} bonusBalance={0.00} addToBalance={addToBalance} />;
            case Page.Leaderboard:
                return <LeaderboardPage />;
            case Page.HowToPlay:
                return <HowToPlayPage />;
            case Page.Contact:
                return <ContactPage />;
            case Page.ReferralIncome:
                return <ReferralIncomePage />;
            case Page.Profile:
                return <ProfilePage balance={balance} bonusBalance={0.00} />;
            case Page.CardSelection:
                 if (!selectedStake) return <StakePage navigateTo={navigateTo} stakeLevels={stakeLevels} />;
                 const currentStakeDetails = stakeLevels.find(s => s.id === selectedStake.id) || selectedStake;
                return <CardSelectionPage 
                            stake={currentStakeDetails} 
                            navigateTo={navigateTo} 
                            selectedCards={selectedCardsForGame}
                        />;
            case Page.CardView:
                 if (!previewCardId || !selectedStake) return <StakePage navigateTo={navigateTo} stakeLevels={stakeLevels} />;
                return <CardViewPage 
                            cardId={previewCardId} 
                            stake={selectedStake} 
                            navigateTo={navigateTo} 
                            addCardToSelection={addCardToSelection}
                            selectedCards={selectedCardsForGame}
                        />;
            case Page.Game:
                if (!selectedStake || selectedCardsForGame.length === 0) return <StakePage navigateTo={navigateTo} stakeLevels={stakeLevels} />;
                return <GamePage 
                            stake={selectedStake} 
                            navigateTo={navigateTo} 
                            cardIds={selectedCardsForGame} 
                            onWin={addToBalance}
                        />;
            default:
                return <HomePage navigateTo={navigateTo} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-800 text-slate-800 dark:text-white" style={{background: theme === 'dark' ? 'linear-gradient(to bottom, #1E3A8A, #111827)' : 'linear-gradient(to bottom, #a1c4fd, #c2e9fb)'}}>
            {isAuthenticated ? (
                <>
                    <Header navigateTo={navigateTo} balance={balance} currentPage={currentPage} logout={logout} theme={theme} toggleTheme={toggleTheme} />
                    <main className="container mx-auto px-4 py-8">
                        {renderPage()}
                    </main>
                </>
            ) : (
                renderPage()
            )}
        </div>
    );
};

export default App;