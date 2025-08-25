
import React from 'react';

const HowToPlayPage: React.FC = () => {
    return (
        <div className="flex justify-center items-start min-h-[calc(100vh-150px)] pt-10">
            <div className="w-full max-w-4xl bg-slate-800/60 p-8 rounded-xl shadow-2xl">
                <h1 className="text-4xl font-bold text-center mb-8 text-yellow-300">How to Play Ethio Bingo</h1>
                <div className="space-y-8 text-lg text-gray-200">
                    <div className="p-6 bg-slate-700/50 rounded-lg">
                        <h2 className="text-2xl font-bold mb-3 text-white">Step 1: Choose Your Stake</h2>
                        <p>
                            Navigate to the "Play" section from the home page. You will be presented with a list of available stake rooms. Each room has a different entry fee ("Stake") and a potential prize ("Possible Win"). Choose the room that suits your budget and click the "Join" button to proceed.
                        </p>
                    </div>

                    <div className="p-6 bg-slate-700/50 rounded-lg">
                        <h2 className="text-2xl font-bold mb-3 text-white">Step 2: Select Your Cards</h2>
                        <p>
                            After joining a room, you will enter the card selection screen. A 60-second timer will begin, during which you can purchase your bingo cards for the round. Click on any available card number to preview it. If you like the card, click "Select This Card" to purchase it. Your balance will be debited, and you can continue to select and purchase as many cards as you like until the timer runs out.
                        </p>
                    </div>

                    <div className="p-6 bg-slate-700/50 rounded-lg">
                        <h2 className="text-2xl font-bold mb-3 text-white">Step 3: The Live Draw</h2>
                        <p>
                            Once the selection timer expires, you will automatically be taken to the live draw page. The game will begin, and numbers from 1 to 75 will be drawn one by one. Listen for the Amharic audio callouts and watch as the numbers are marked on the main board. The corresponding numbers on your personal cards will be automatically daubed (marked).
                        </p>
                    </div>
                    
                    <div className="p-6 bg-slate-700/50 rounded-lg">
                        <h2 className="text-2xl font-bold mb-3 text-white">Step 4: Winning the Game!</h2>
                        <p>
                           The goal is to complete a winning pattern on any of your cards. The first player to complete a single straight line (horizontally, vertically, or diagonally) wins the game. When one of your cards has a winning pattern, the "BINGO" button will become active. Click it to claim your prize! A confirmation modal will appear, and the winnings will be added to your account balance. Good luck!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowToPlayPage;
