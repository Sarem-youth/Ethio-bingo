import React, { useState } from 'react';
import { Page } from '../types';

interface RegistrationPageProps {
    register: () => void;
    navigateTo: (page: Page) => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ register, navigateTo }) => {
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validatePhone = (phoneNumber: string): boolean => {
        const phoneRegex = /^(?:\+251|251|0)(9|7)\d{8}$/;
        return phoneRegex.test(phoneNumber);
    };

    const normalizePhone = (phoneNumber: string): string => {
        if (phoneNumber.startsWith('+251')) {
            return '0' + phoneNumber.substring(4);
        }
        if (phoneNumber.startsWith('251')) {
            return '0' + phoneNumber.substring(3);
        }
        return phoneNumber;
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const newErrors: { [key: string]: string } = {};

        if (!username.trim()) {
            newErrors.username = 'Username is required.';
        }
        if (!password) {
            newErrors.password = 'Password is required.';
        }
        if (!phone.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else if (!validatePhone(phone)) {
            newErrors.phone = 'Please enter a valid Ethiopian phone number (e.g., 09..., +2519..., 07...).';
        }
        
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const normalized = normalizePhone(phone);
            console.log('Registering user:', { username, phone: normalized, password });
            // In a real app, you would send this to a server
            register();
        }
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen px-4">
             <div className="text-center mb-8">
                <img src="https://i.imgur.com/yQk8sHl.png" alt="Ethio Bingo Logo" className="h-24 w-24 rounded-full mx-auto mb-4 border-4 border-slate-400 dark:border-slate-600 shadow-lg" />
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white">Create an Account</h1>
                <p className="text-gray-600 dark:text-gray-400">Join Ethio Bingo today!</p>
            </div>
            <div className="w-full max-w-sm bg-white/50 dark:bg-slate-700/50 p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-600 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                        <input
                            type="text"
                            id="reg-username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full bg-white/50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-3 px-4 text-slate-800 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+251912345678"
                            className="mt-1 block w-full bg-white/50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-3 px-4 text-slate-800 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                     <div>
                        <label htmlFor="reg-password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            id="reg-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full bg-white/50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-3 px-4 text-slate-800 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 duration-200 !mt-6"
                    >
                        Register
                    </button>
                </form>
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigateTo(Page.Login)}
                            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;
