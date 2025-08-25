import React, { useState } from 'react';
import TransactionCheckerModal from '../components/TransactionCheckerModal';
import WithdrawalModal from '../components/WithdrawalModal';
import { TRANSACTION_HISTORY_DATA } from '../constants';

// Modal types to manage which modal is open
type ModalType = 
    | 'telebirr-checker'
    | 'cbe-checker'
    | 'withdraw'
    | null;


interface DepositPageProps {
    balance: number;
    bonusBalance: number;
    addToBalance: (amount: number) => void;
}

const DepositPage: React.FC<DepositPageProps> = ({ balance, bonusBalance, addToBalance }) => {
    const [activeTab, setActiveTab] = useState('deposit');
    const [modal, setModal] = useState<ModalType>(null);
    
    const renderDepositContent = () => (
        <div className="flex flex-col items-center justify-center h-full space-y-6 pt-8">
            <button 
                onClick={() => setModal('cbe-checker')}
                className="w-full max-w-md bg-blue-600 text-white font-bold py-6 px-12 rounded-lg text-2xl hover:bg-blue-700 transition-transform transform hover:scale-105 duration-200 shadow-lg"
            >
                CBE Birr Deposit Verify
            </button>
            <button 
                onClick={() => setModal('telebirr-checker')}
                className="w-full max-w-md bg-green-500 text-white font-bold py-6 px-12 rounded-lg text-2xl hover:bg-green-600 transition-transform transform hover:scale-105 duration-200 shadow-lg"
            >
                Telebirr Deposit Verify
            </button>
        </div>
    );
    
     const renderWithdrawContent = () => (
        <div className="flex flex-col items-center justify-center h-full">
            <button 
                onClick={() => setModal('withdraw')}
                className="bg-green-500 text-white font-bold py-6 px-12 rounded-lg text-2xl hover:bg-green-600 transition-transform transform hover:scale-105 duration-200"
            >
                Manual Withdrawal
            </button>
        </div>
    );

    const renderHistoryContent = () => (
         <div className="h-full">
            <h3 className="text-2xl font-bold text-white mb-4">Transaction History</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {TRANSACTION_HISTORY_DATA.map(tx => {
                    const isDeposit = tx.type === 'Deposit';
                    const statusColor = tx.status === 'Completed' ? 'text-green-400' : 'text-yellow-400';
                    return (
                        <div key={tx.id} className="bg-slate-600/50 p-4 rounded-lg flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDeposit ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                    {isDeposit ? 
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> :
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                                    }
                                </div>
                                <div>
                                    <p className="font-bold text-white text-lg">{tx.type}</p>
                                    <p className="text-gray-400 text-sm">{tx.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold text-lg ${isDeposit ? 'text-green-400' : 'text-red-400'}`}>
                                    {isDeposit ? '+' : '-'} {tx.amount.toFixed(2)} ETB
                                </p>
                                <p className={`text-sm font-semibold ${statusColor}`}>{tx.status}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
    
    const renderMainContent = () => {
        switch (activeTab) {
            case 'deposit':
                return renderDepositContent();
            case 'withdraw':
                return renderWithdrawContent();
            case 'history':
                return renderHistoryContent();
            default:
                return renderDepositContent();
        }
    };

    return (
        <div className="flex justify-center mt-10">
            {modal === 'telebirr-checker' && <TransactionCheckerModal provider="Telebirr" onClose={() => setModal(null)} onCheckSuccess={addToBalance} />}
            {modal === 'cbe-checker' && <TransactionCheckerModal provider="CBEBirr" onClose={() => setModal(null)} onCheckSuccess={addToBalance} />}
            {modal === 'withdraw' && <WithdrawalModal onClose={() => setModal(null)} />}
            
            <div className="flex w-full max-w-6xl">
                {/* Left Sidebar */}
                <div className="w-1/4 bg-white text-slate-800 rounded-l-lg p-6 shadow-lg flex flex-col items-center space-y-4">
                     <button 
                        onClick={() => setActiveTab('deposit')}
                        className={`w-full text-lg font-semibold py-4 px-6 rounded-lg flex items-center justify-center space-x-3 transition-colors duration-200 ${activeTab === 'deposit' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-200'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <span>Deposit</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('withdraw')}
                        className={`w-full text-lg font-semibold py-4 px-6 rounded-lg flex items-center justify-center space-x-3 transition-colors duration-200 ${activeTab === 'withdraw' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-200'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                        <span>Withdraw</span>
                    </button>
                     <button 
                        onClick={() => setActiveTab('history')}
                        className={`w-full text-lg font-semibold py-4 px-6 rounded-lg flex items-center justify-center space-x-3 transition-colors duration-200 ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-gray-200'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>History</span>
                    </button>
                </div>

                {/* Main Content */}
                <div className="w-3/4 bg-slate-700/50 rounded-r-lg p-8 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white text-slate-800 p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-gray-500 text-lg">Main Balance</h3>
                            <p className="text-3xl font-bold mt-2">ETB {balance.toFixed(2)}</p>
                        </div>
                        <div className="bg-white text-slate-800 p-6 rounded-lg shadow-md text-center">
                            <h3 className="text-gray-500 text-lg">Bonus Balance</h3>
                            <p className="text-3xl font-bold mt-2">ETB {bonusBalance.toFixed(2)}</p>
                        </div>
                    </div>

                    {renderMainContent()}
                </div>
            </div>
        </div>
    );
};

export default DepositPage;