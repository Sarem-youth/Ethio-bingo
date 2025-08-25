import React from 'react';
import { UserIcon } from '../components/icons/UserIcon';

interface ProfilePageProps {
    balance: number;
    bonusBalance: number;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ balance, bonusBalance }) => {
    const user = {
        name: 'sarem',
        joinDate: 'July 15, 2024',
        email: 's***m@example.com', // Masked email
        phone: '*******978' // Masked phone
    };

    return (
        <div className="flex justify-center items-start min-h-[calc(100vh-150px)] pt-10">
            <div className="w-full max-w-3xl bg-white/50 dark:bg-slate-800/60 p-8 rounded-xl shadow-2xl backdrop-blur-sm">
                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left">
                    <div className="relative mb-6 md:mb-0 md:mr-8">
                        <div className="w-32 h-32 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center border-4 border-blue-500">
                            <UserIcon className="w-20 h-20 text-gray-500 dark:text-gray-400" />
                        </div>
                         <div className="absolute bottom-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white dark:border-slate-800">
                            Online
                        </div>
                    </div>
                    <div className="flex-grow">
                        <h1 className="text-4xl font-bold text-slate-800 dark:text-white">{user.name}</h1>
                        <p className="text-gray-600 dark:text-gray-400">Joined on {user.joinDate}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                            <div className="bg-slate-200/50 dark:bg-slate-700/50 p-6 rounded-lg shadow-md">
                                <h3 className="text-gray-600 dark:text-gray-400 text-lg">Main Balance</h3>
                                <p className="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">ETB {balance.toFixed(2)}</p>
                            </div>
                            <div className="bg-slate-200/50 dark:bg-slate-700/50 p-6 rounded-lg shadow-md">
                                <h3 className="text-gray-600 dark:text-gray-400 text-lg">Bonus Balance</h3>
                                <p className="text-3xl font-bold mt-2 text-yellow-600 dark:text-yellow-400">ETB {bonusBalance.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-slate-300 dark:border-slate-700 pt-8">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Account Details</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-slate-200/50 dark:bg-slate-700/50 p-4 rounded-lg">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Email:</span>
                            <span className="font-semibold">{user.email}</span>
                        </div>
                         <div className="flex justify-between items-center bg-slate-200/50 dark:bg-slate-700/50 p-4 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Phone:</span>
                                <div className="group relative flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-xs hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 text-center">
                                        Your phone number cannot be changed after registration.
                                    </span>
                                </div>
                            </div>
                            <span className="font-semibold">{user.phone}</span>
                        </div>
                         <div className="flex justify-between items-center bg-slate-200/50 dark:bg-slate-700/50 p-4 rounded-lg">
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Password:</span>
                            <button className="text-blue-500 dark:text-blue-400 hover:underline">Change Password</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;