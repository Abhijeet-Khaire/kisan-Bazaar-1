import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { auth, db } from '@/lib/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const ROLE_TO_DOC_ID = {
    'farmer': 'Farmers',
    'buyer': 'Buyers',
    'logistics': 'Logistics owners',
    'storage': 'Storage Owners'
};

export const DEFAULT_PROFILES = {
    farmer: {
        uid: "F001",
        name: "Rajesh Kumar",
        email: "rajesh.kumar@kisanbazaar.in",
        phone: "+91 98765 43210",
        alternatePhone: "+91 98765 11223",
        role: "farmer",
        state: "Haryana",
        district: "Karnal",
        village: "Taraori, Ward 4",
        pincode: "132116",
        language: "Hindi",
        dob: "1984-06-15",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200",
        // Farm Details
        farmName: "Kumar Organic Agro Farms",
        farmSize: "14.5",
        farmSizeUnit: "Acres",
        soilType: "Alluvial Clay Loam",
        primaryCrops: ["Basmati Rice", "Wheat", "Mustard", "Sugarcane"],
        irrigationType: "Tube Well & Solar Drip",
        machineryOwned: ["John Deere 5050D Tractor", "Laser Land Leveler", "Rotavator"],
        organicCertified: true,
        certificationNumber: "NPOP/IM/2023/88921",
        // KYC & Government
        aadhaarNumber: "•••• •••• 8912",
        panNumber: "ABCDE1234F",
        khasraNumber: "142/18, 142/19 (Khatauni #402)",
        pmKisanId: "HR-KNL-2019-983210",
        kisanCreditCard: "KCC-SBI-662901",
        kycStatus: "verified",
        // Banking & DBT
        bankName: "State Bank of India (SBI)",
        branchName: "Karnal Main Agri Branch",
        accountHolderName: "Rajesh Kumar",
        accountNumber: "3892019827361",
        ifscCode: "SBIN0001248",
        accountType: "KCC Agri Account",
        upiId: "rajeshfarmer@oksbi",
        dbtAutoCredit: true,
        // Trust & Stats
        trustRating: 4.9,
        totalDeals: 34,
        totalEarnings: 845000,
        memberSince: "Jan 2023",
        badges: ["Verified Farmer", "Grade A Cultivator", "Fast Dispatcher", "Top Rated 2024"]
    },
    buyer: {
        uid: "BU001",
        name: "Vikram Singhania",
        email: "vikram@agromart.in",
        phone: "+91 98112 34567",
        alternatePhone: "+91 98112 76543",
        role: "buyer",
        state: "Delhi NCR",
        district: "New Delhi",
        village: "Lawrence Road Industrial Area",
        pincode: "110035",
        language: "English",
        dob: "1980-11-22",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
        companyName: "Agromart Foods & Exports Pvt Ltd",
        businessType: "Food Processing & Grain Exporter",
        gstin: "07AAACA1234A1Z5",
        mandiLicenseNumber: "DL-MN-2021-9981",
        dailyProcurementCapacity: "150 MT",
        sourcingCrops: ["Basmati Rice", "Wheat", "Soybean", "Pulses"],
        bankName: "HDFC Bank Ltd",
        branchName: "Connaught Place, New Delhi",
        accountHolderName: "Agromart Foods & Exports Pvt Ltd",
        accountNumber: "50200028917261",
        ifscCode: "HDFC0000003",
        accountType: "Current Account",
        upiId: "agromart@okhdfcbank",
        dbtAutoCredit: true,
        kycStatus: "verified",
        trustRating: 4.8,
        totalDeals: 112,
        totalEarnings: 4200000,
        memberSince: "Aug 2022",
        badges: ["Verified Institutional Buyer", "Escrow Prompt Pay", "Bulk Sourcing Partner"]
    },
    logistics: {
        uid: "L001",
        name: "Harjeet Singh Sandhu",
        email: "sandhu.transport@kisanbazaar.in",
        phone: "+91 97791 22334",
        alternatePhone: "+91 97791 88776",
        role: "logistics",
        state: "Punjab",
        district: "Ludhiana",
        village: "Transport Nagar",
        pincode: "141003",
        language: "Punjabi",
        dob: "1978-04-10",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
        companyName: "Sandhu Agri-Freight & Cold Fleet",
        fleetSize: "18 Trucks",
        vehicleTypes: ["Refrigerated Reefers (16T)", "Multi-axle Eicher (10T)", "Tata 407 (3.5T)"],
        operatingRoutes: "Punjab - Haryana - Delhi - Maharashtra - Gujarat",
        transportLicense: "PB-TR-2018-4412",
        gstin: "03AABCS4455C1Z2",
        bankName: "Punjab National Bank",
        branchName: "Ludhiana GT Road",
        accountHolderName: "Sandhu Agri-Freight",
        accountNumber: "1298002100098765",
        ifscCode: "PUNB0129800",
        accountType: "Current Account",
        upiId: "sandhutransport@okaxis",
        dbtAutoCredit: true,
        kycStatus: "verified",
        trustRating: 4.9,
        totalDeals: 280,
        totalEarnings: 1540000,
        memberSince: "Mar 2023",
        badges: ["GPS Certified Fleet", "Temperature Controlled", "On-Time Guarantee"]
    },
    storage: {
        uid: "S001",
        name: "Mahesh B. Patel",
        email: "mahesh@kisanstorage.in",
        phone: "+91 94260 11998",
        alternatePhone: "+91 94260 55443",
        role: "storage",
        state: "Gujarat",
        district: "Ahmedabad",
        village: "Sanand Industrial GIDC",
        pincode: "382110",
        language: "Gujarati",
        dob: "1975-09-08",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
        companyName: "Patel Agro Cold Storage & Warehousing",
        storageType: "Multi-Commodity CA Cold Storage & Dry Silos",
        capacityMetricTons: "12,500 MT",
        temperatureRange: "-2°C to +15°C",
        fssaiLicense: "10719001000452",
        enwrRegistered: true,
        bankName: "Bank of Baroda",
        branchName: "Sanand GIDC Branch",
        accountHolderName: "Patel Agro Cold Storage",
        accountNumber: "01920200004921",
        ifscCode: "BARB0SANAND",
        accountType: "Current Account",
        upiId: "patelstorage@okicici",
        dbtAutoCredit: true,
        kycStatus: "verified",
        trustRating: 4.9,
        totalDeals: 164,
        totalEarnings: 2310000,
        memberSince: "Nov 2022",
        badges: ["e-NWR Certified", "24/7 Power Backup", "Pest Controlled Guarantee"]
    }
};

const findUserProfile = async (uid) => {
    const checks = Object.values(ROLE_TO_DOC_ID).map(async (docTimeout) => {
        const docRef = doc(db, "Users", docTimeout, "accounts", uid);
        const snapshot = await getDoc(docRef);
        return { snapshot, exists: snapshot.exists() };
    });

    const results = await Promise.all(checks);
    const found = results.find(r => r.exists);

    return found ? found.snapshot.data() : null;
};

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('kisan_bazaar_user');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error("Failed to load user from localStorage", e);
        }
        // Default to Rajesh Kumar (Farmer) for full interactive demonstration
        return DEFAULT_PROFILES.farmer;
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userData = await findUserProfile(firebaseUser.uid);
                    if (userData) {
                        const merged = { ...DEFAULT_PROFILES[userData.role || 'farmer'], ...firebaseUser, ...userData };
                        setUser(merged);
                        localStorage.setItem('kisan_bazaar_user', JSON.stringify(merged));
                    } else {
                        setUser(prev => {
                            const updated = { ...(prev || DEFAULT_PROFILES.farmer), ...firebaseUser };
                            localStorage.setItem('kisan_bazaar_user', JSON.stringify(updated));
                            return updated;
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateUserProfile = async (updates) => {
        try {
            const updatedUser = { ...user, ...updates };
            setUser(updatedUser);
            localStorage.setItem('kisan_bazaar_user', JSON.stringify(updatedUser));

            // If Firebase is active and user has a real UID
            if (auth.currentUser && !auth.currentUser.uid.startsWith('demo-') && updatedUser.role) {
                const roleDocId = ROLE_TO_DOC_ID[updatedUser.role];
                if (roleDocId) {
                    const docRef = doc(db, "Users", roleDocId, "accounts", auth.currentUser.uid);
                    await setDoc(docRef, updates, { merge: true });
                }
            }

            toast.success("Profile updated successfully!");
            return updatedUser;
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile details");
            throw error;
        }
    };

    const switchDemoRole = (newRole) => {
        if (!DEFAULT_PROFILES[newRole]) return;
        const profile = { ...DEFAULT_PROFILES[newRole] };
        setUser(profile);
        localStorage.setItem('kisan_bazaar_user', JSON.stringify(profile));
        toast.info(`Switched role to ${newRole.toUpperCase()}`);
    };

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userData = await findUserProfile(userCredential.user.uid);
            const role = userData?.role || 'farmer';
            const mergedUser = {
                ...DEFAULT_PROFILES[role],
                ...userCredential.user,
                ...(userData || {})
            };

            setUser(mergedUser);
            localStorage.setItem('kisan_bazaar_user', JSON.stringify(mergedUser));
            toast.success(`Welcome back, ${mergedUser.name || 'User'}!`);
            return mergedUser;
        } catch (error) {
            console.error("Login Error:", error);

            // Fallback for local demo mode if Firebase is unconfigured or offline
            if (error.code === 'auth/invalid-api-key' || error.code === 'auth/api-key-not-valid' || error.code === 'auth/network-request-failed' || error.message?.includes("api-key") || error.message?.includes("configuration")) {
                const demoUser = {
                    ...DEFAULT_PROFILES.farmer,
                    uid: 'demo-' + Date.now(),
                    email: email,
                    name: email.split('@')[0] || 'Demo User',
                    role: 'farmer'
                };
                setUser(demoUser);
                localStorage.setItem('kisan_bazaar_user', JSON.stringify(demoUser));
                toast.success(`Signed in as ${demoUser.name}`);
                return demoUser;
            }

            toast.error(error.message || "Failed to login");
            throw error;
        }
    };

    const register = async (details, role) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, details.email, details.password);
            const firebaseUser = userCredential.user;

            const userData = {
                ...DEFAULT_PROFILES[role],
                name: details.name,
                email: details.email,
                role: role,
                createdAt: new Date().toISOString(),
                id: firebaseUser.uid,
                uid: firebaseUser.uid,
                ...(details.companyName && { companyName: details.companyName })
            };

            const roleDocId = ROLE_TO_DOC_ID[role];
            if (!roleDocId) throw new Error("Invalid role mapping");

            await setDoc(doc(db, "Users", roleDocId, "accounts", firebaseUser.uid), userData);

            const mergedUser = { ...firebaseUser, ...userData };
            setUser(mergedUser);
            localStorage.setItem('kisan_bazaar_user', JSON.stringify(mergedUser));
            toast.success("Account created successfully!");
            return mergedUser;
        } catch (error) {
            console.error("Registration Error:", error);

            if (error.code === 'auth/invalid-api-key' || error.code === 'auth/api-key-not-valid' || error.code === 'auth/network-request-failed' || error.message?.includes("api-key") || error.message?.includes("configuration")) {
                const demoUser = {
                    ...DEFAULT_PROFILES[role],
                    uid: 'demo-' + Date.now(),
                    email: details.email,
                    name: details.name || 'New User',
                    role: role,
                    ...(details.companyName && { companyName: details.companyName })
                };
                setUser(demoUser);
                localStorage.setItem('kisan_bazaar_user', JSON.stringify(demoUser));
                toast.success(`Account created for ${demoUser.name}`);
                return demoUser;
            }

            let message = error.message || "Failed to register";
            if (error.code === 'auth/email-already-in-use') {
                message = "This email is already registered.";
            } else if (error.code === 'auth/weak-password') {
                message = "Password should be at least 6 characters.";
            } else if (error.code === 'permission-denied') {
                message = "Database permission denied. Check your Firestore rules.";
            }

            toast.error(message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem('kisan_bazaar_user');
            toast.info("Logged out successfully");
        } catch (error) {
            console.error("Logout Error:", error);
            setUser(null);
            localStorage.removeItem('kisan_bazaar_user');
            toast.info("Logged out successfully");
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            loading,
            updateUserProfile,
            switchDemoRole
        }}>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

