
import React from 'react';

interface TelebirrDepositModalProps {
    onClose: () => void;
}

const TelebirrDepositModal: React.FC<TelebirrDepositModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-slate-800 rounded-lg shadow-2xl p-8 w-full max-w-lg text-white border border-slate-600">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Telebirr Transfer Deposit</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                </div>
                <div className="space-y-4 text-center text-lg">
                    <p className="text-yellow-400">የተሳካ ገቢ መሙላት ለማድረግ እነዚህን ቀላል ደረጃዎች ይከተሉ</p>
                    <ol className="text-left list-decimal list-inside space-y-2 bg-slate-700 p-4 rounded-md">
                        <li>Telebirr App ወይም *127# ይደውሉ</li>
                        <li>ወደ እኛ አካውንት ያስተላልፉ</li>
                        <li>Transaction Checker ገብተው ያስገቡትን ገንዘብ (Transaction Number) በማስገባት ገንዘቦን ይቀበሉ</li>
                    </ol>

                    <div className="bg-white text-black p-4 rounded-md">
                        <p className="text-gray-600">ስልክ ቁጥር :</p>
                        <p className="font-bold text-xl">098434978</p>
                        <p className="text-gray-600 mt-2">ስም:</p>
                        <p className="font-bold text-xl">ሃና ሙሉጌታ</p>
                    </div>

                    <p className="text-red-500 font-semibold">ከላይ በተጠቀሰው ስልክ ቁጥር እና ስም መላክዎን ያረጋግጡ፣ በተሳሳተ አድራሻ ለሚልኩት ገንዘብ ምንም አይነት ሀላፊነት አንወስድም</p>
                    <p className="font-bold">ወደ Hanna (098434978) ያስተላለፉት ገንዘብ መጠን ስንት ነው?</p>

                    <div>
                        <label htmlFor="transaction-id" className="block text-left mb-2">Transaction ግብይት ቁጥር:</label>
                        <input
                            type="text"
                            id="transaction-id"
                            placeholder="Telebirr ከላኩልን በኋላ የሚደርሶት Receipt ላይ ያለ ቁጥር C21999DA3SAD"
                            className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button className="w-full bg-gray-200 text-slate-800 font-bold py-3 rounded-lg hover:bg-white transition duration-200">
                        ገንዘቤን አስገባ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TelebirrDepositModal;
