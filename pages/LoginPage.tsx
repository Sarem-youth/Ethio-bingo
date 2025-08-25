import React from 'react';
import { Page } from '../types';

interface LoginPageProps {
    login: () => void;
    navigateTo: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ login, navigateTo }) => {

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        login();
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen px-4">
             <div className="text-center mb-8">
                <img src="https://i.imgur.com/yQk8sHl.png" alt="Ethio Bingo Logo" className="h-24 w-24 rounded-full mx-auto mb-4 border-4 border-slate-400 dark:border-slate-600 shadow-lg" />
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white">Welcome to Ethio Bingo</h1>
                <p className="text-gray-600 dark:text-gray-400">Please sign in to continue</p>
            </div>
            <div className="w-full max-w-sm bg-white/50 dark:bg-slate-700/50 p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-600 backdrop-blur-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                        <input
                            type="text"
                            id="username"
                            defaultValue="sarem"
                            className="mt-1 block w-full bg-white/50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-3 px-4 text-slate-800 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            id="password"
                            defaultValue="password"
                            className="mt-1 block w-full bg-white/50 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm py-3 px-4 text-slate-800 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-transform transform hover:scale-105 duration-200"
                    >
                        Login
                    </button>
                </form>
                 <div className="text-center mt-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigateTo(Page.Registration)}
                            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
                        >
                            Register now
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;