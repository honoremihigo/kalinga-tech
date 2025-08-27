import React, { useEffect, useState } from 'react';
import { Lock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import adminServiceInstance from '../../../Services/Dispatch/Auth';
import { use } from 'react';


function LockScreen() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const userData = await adminServiceInstance.getProfile();
                if (!userData) {
                    return navigate('/dispatch'); // Redirect to login if no user data
                }
                if (!userData.isLocked) {
                    return navigate('/dispatch/dashboard/reservation'); // Redirect to dashboard if not locked
                    
                }

                setUser(userData);
                setIsLoading(false);
            } catch (error) {
                setError('Failed to fetch profile: ' + error.message);
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);




    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password) {
            setError('Password is required');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Use the new unlock method instead of login
            await adminServiceInstance.unlock(password);
            setIsLoading(false);
            navigate('/dispatch/dashboard/reservation'); // Redirect to dashboard on success
        } catch (err) {
            setError(err.message || 'Invalid password');
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await adminServiceInstance.logout();
            navigate('/dispatch', { replace: true }); // Redirect to login page after logout
        } catch (err) {
            console.error('Logout failed:', err);
            navigate('/dispatch', { replace: true }); // Redirect to login page after logout
        }
    };

    if (isLoading && !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4">
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-teal-600 mb-4"></div>
                    <p className="text-gray-600">Loading user profile...</p>
                </div>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-4">Error</h1>
                    <p className="text-red-600 mb-6">{error}</p>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-teal-600 hover:underline focus:outline-none"
                    >
                        Sign out and try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl min-h-[60vh] flex flex-col justify-center p-10 w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full -translate-y-16 translate-x-16 opacity-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-300 to-teal-500 rounded-full translate-y-12 -translate-x-12 opacity-10"></div>
                <div className="absolute top-1/2 left-0 w-2 h-16 bg-gradient-to-b from-teal-400 to-teal-600 opacity-20"></div>

                <div className="text-center mb-8 relative z-10">
                    <div className="flex items-center justify-center mb-6">
                        <span className="text-4xl font-bold text-gray-800">Abyride</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">Admin Lock Screen</h1>
                    <p className="text-gray-600">Enter your password to unlock</p>
                    <div className="mt-4 w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-semibold text-xl mx-auto">
                        {adminServiceInstance.getInitials(user?.names) || 'A'}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{user?.names || 'Admin'}</p>
                </div>

                <div className="space-y-6 relative z-10">
                    {error && (
                        <div className="text-center text-sm text-red-600 bg-red-50 p-3 rounded-xl">
                            {error}
                        </div>
                    )}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
                        >
                            <Lock className="w-4 h-4 mr-2 text-teal-600" />
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            placeholder="Enter your password"
                            className={`w-full px-3 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400 transition-all duration-200 bg-gray-50 focus:bg-white ${
                                error ? 'border-red-500' : 'border-gray-200'
                            }`}
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 px-6 rounded-xl hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-300 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white mr-2"></div>
                                Unlocking...
                            </div>
                        ) : (
                            'Unlock'
                        )}
                    </button>

                    <div className="text-center">
                        <button
                            onClick={handleLogout}
                            className="text-sm text-teal-600 hover:underline focus:outline-none"
                        >
                            Not you? Sign out
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center relative z-10">
                    <div className="w-16 h-1 bg-gradient-to-r from-teal-400 to-teal-600 mx-auto rounded-full"></div>
                </div>
            </div>
        </div>
    );
}

export default LockScreen;