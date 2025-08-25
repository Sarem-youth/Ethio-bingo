import React from 'react';
import { BANKS } from '../constants';

interface WithdrawalModalProps {
    onClose: () => void;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-lg text-white border border-slate-600">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Manual Withdrawal</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                </div>

                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded-md" role="alert">
                  <p className="font-bold">ውድ ደንበኞቻችን ገንዘብ ማውጣት(Manual) ሲፈልጉ ከታች ያሉትን መረጃዎች በትክክል በመሙላት ከ 1 ሰዓት እስከ 30 ደቂቃ ባለው ጊዜ ውስጥ ገንዘብዎን እንልካለን።</p>
                  <p className="text-red-600 font-semibold mt-2">ከአገልግሎት ክፍያ ነፃ የሆነው የማውጫ አማራጭ Withdrawን ይጠቀሙ</p>
                </div>
                
                <form className="space-y-4">
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-300">Amount (የገንዘብ መጠን)</label>
                        <input type="number" id="amount" placeholder="Enter amount" className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                     <div>
                        <label htmlFor="bank" className="block text-sm font-medium text-gray-300">ባንክ ይምረጡ</label>
                        <select id="bank" className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option>Select a bank</option>
                            {BANKS.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="account-number" className="block text-sm font-medium text-gray-300">Account Number (የአካውንት ቁጥር)</label>
                        <input type="text" id="account-number" placeholder="Enter account number" className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                     <div>
                        <label htmlFor="account-holder" className="block text-sm font-medium text-gray-300">Account Holder (የአካውንት ባለቤት ስም)</label>
                        <input type="text" id="account-holder" placeholder="Enter account holder" className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 mt-6 !mt-8">
                        Manual Withdraw
                    </button>
                </form>

            </div>
        </div>
    );
};

export default WithdrawalModal;