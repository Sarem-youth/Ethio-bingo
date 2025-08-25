import React, { useState } from 'react';

interface TransactionCheckerModalProps {
    provider: 'Telebirr' | 'CBEBirr';
    onClose: () => void;
    onCheckSuccess: (amount: number) => void;
}

const TransactionCheckerModal: React.FC<TransactionCheckerModalProps> = ({ provider, onClose, onCheckSuccess }) => {
    const [transactionId, setTransactionId] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const placeholderText = provider === 'Telebirr' 
        ? "e.g., CBR608Q0UW"
        : "e.g., CBE_SUCCESS_123";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const parsedAmount = parseFloat(amount);
        if (!transactionId || isNaN(parsedAmount) || parsedAmount <= 0) {
            setError('Please enter a valid transaction ID and amount.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        await new Promise(resolve => setTimeout(resolve, 2000));

        // --- MOCK API RESPONSE DATABASE ---
        const MOCK_API_RESPONSES = {
            Telebirr: {
                'CBR608Q0UW': {
                    transactionId: 'CBR608Q0UW',
                    amount: 300,
                    recipientAccount: '098434978',
                    senderAccount: '0911123456',
                    status: 'Completed'
                }
            },
            CBEBirr: {
                'CBE_SUCCESS_123': {
                    transactionId: 'CBE_SUCCESS_123',
                    amount: 500,
                    recipientAccount: '098434978',
                    senderAccount: '0922334455',
                    status: 'Completed'
                },
                'CBR608Q0UW': {
                    error: 'Failed to get transaction data from CBE Birr.'
                }
            }
        };
        
        const CORRECT_RECIPIENT_ACCOUNT = '098434978';
        const transactionData = MOCK_API_RESPONSES[provider]?.[transactionId];

        if (!transactionData) {
            setError('Transaction not found.');
            setIsLoading(false);
            return;
        }

        if ((transactionData as any).error) {
            setError((transactionData as any).error);
            setIsLoading(false);
            return;
        }

        const { recipientAccount, amount: txAmount } = transactionData as any;

        // --- VALIDATION CHECKS ---
        if (recipientAccount !== CORRECT_RECIPIENT_ACCOUNT) {
            setError('This transaction was not sent to the correct account.');
        } else if (txAmount !== parsedAmount) {
            setError(`The transaction amount (${txAmount} ETB) does not match the amount you entered (${parsedAmount} ETB).`);
        } else {
            // All checks passed
            onCheckSuccess(parsedAmount);
            setSuccess(`Successfully verified! ${parsedAmount.toFixed(2)} ETB has been added to your balance.`);
            setTimeout(() => {
                onClose();
            }, 2500);
        }

        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-md text-white border border-slate-600">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{provider} Transfer Deposit Checker</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-left mb-2">Amount (የገንዘብ መጠን)</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g., 300"
                            className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="transaction-id" className="block text-left mb-2">Transaction ID (ግብይት ቁጥር)</label>
                        <input
                            type="text"
                            id="transaction-id"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder={placeholderText}
                            className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <div className="pt-2">
                        <button type="submit" className="w-full bg-gray-200 text-slate-800 font-bold py-3 rounded-lg hover:bg-white transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center" disabled={isLoading}>
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'ገንዘቤን አስገባ'}
                        </button>
                    </div>

                    {error && <p className="text-red-400 text-center font-semibold pt-2">{error}</p>}
                    {success && <p className="text-green-400 text-center font-semibold pt-2">{success}</p>}
                </form>
            </div>
        </div>
    );
};

export default TransactionCheckerModal;