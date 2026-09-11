import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import AuthLayout from '@/components/auth/AuthLayout';

const roles = ['farmer', 'buyer', 'logistics', 'storage'];

const Register = () => {
    const [searchParams] = useSearchParams();
    const roleParam = searchParams.get('role');
    const [activeRole, setActiveRole] = useState(roleParam || 'farmer');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const role = searchParams.get('role');
        if (role && roles.includes(role)) {
            setActiveRole(role);
        }
    }, [searchParams]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await register(formData, activeRole);

            // Redirect based on role
            switch (activeRole) {
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
            // Error is handled in AuthContext
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create an account"
            subtitle="Start your journey with KisanBazaar today."
            activeRole={activeRole}
            onRoleChange={setActiveRole}
            onSubmit={handleRegister}
            isLoading={isLoading}
            submitText="Create Account"
            footerPrompt="Already have an account?"
            footerLinkText="Sign In"
            footerLinkHref="/login"
        >
            <div className="space-y-4">
                <div>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0b7a55] focus:ring-2 focus:ring-[#0b7a55]/20 outline-none transition-all"
                    />
                </div>

                {(activeRole === 'logistics' || activeRole === 'storage') && (
                    <div>
                        <input
                            id="companyName"
                            name="companyName"
                            type="text"
                            placeholder="Company Name"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            required
                            className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0b7a55] focus:ring-2 focus:ring-[#0b7a55]/20 outline-none transition-all"
                        />
                    </div>
                )}

                <div>
                    <input
                        id="email"
                        name="email"
                        type="text"
                        placeholder="Email or Phone"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0b7a55] focus:ring-2 focus:ring-[#0b7a55]/20 outline-none transition-all"
                    />
                </div>

                <div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0b7a55] focus:ring-2 focus:ring-[#0b7a55]/20 outline-none transition-all"
                    />
                </div>

                <div>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0b7a55] focus:ring-2 focus:ring-[#0b7a55]/20 outline-none transition-all"
                    />
                </div>
            </div>
        </AuthLayout>
    );
};

export default Register;
