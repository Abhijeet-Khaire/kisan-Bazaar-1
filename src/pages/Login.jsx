import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import AuthLayout from '@/components/auth/AuthLayout';

const Login = () => {
    const [activeRole, setActiveRole] = useState('farmer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            const user = await login(email, password);

            // Redirect based on the user's actual role from database
            switch (user?.role || activeRole) {
                case 'farmer':
                    navigate('/farmer/dashboard');
                    break;
                case 'buyer':
                    navigate('/buyer/marketplace');
                    break;
                case 'logistics':
                    navigate('/logistics');
                    break;
                case 'storage':
                    navigate('/storage');
                    break;
                default:
                    navigate('/');
            }
        } catch (error) {
            // Error is handled in AuthContext but caught here to stop loading state
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Sign in to your account"
            subtitle="Welcome back! Please enter your details to access your dashboard."
            activeRole={activeRole}
            onRoleChange={setActiveRole}
            onSubmit={handleLogin}
            isLoading={isLoading}
            submitText="Sign In"
            footerPrompt="Don't have an account?"
            footerLinkText="Create an account"
            footerLinkHref="/register"

        >
            <div className="space-y-4">
                <div>
                    <input
                        id="email"
                        type="text"
                        placeholder="Email or Phone"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0b7a55] focus:ring-2 focus:ring-[#0b7a55]/20 outline-none transition-all"
                    />
                </div>
                <div>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0b7a55] focus:ring-2 focus:ring-[#0b7a55]/20 outline-none transition-all"
                    />
                </div>
            </div>
        </AuthLayout>
    );
};

export default Login;
