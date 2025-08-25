
import React from 'react';

const ContactPage: React.FC = () => {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
            <div className="w-full max-w-2xl bg-slate-800/60 p-8 rounded-xl shadow-2xl text-center">
                <h1 className="text-4xl font-bold mb-6 text-yellow-300">Contact Us</h1>
                <p className="text-lg text-gray-300">
                    For any inquiries or support, please reach out to us.
                </p>
                <p className="text-xl text-white mt-4 font-semibold">
                    support@ethiobingo.com
                </p>
            </div>
        </div>
    );
};

export default ContactPage;
