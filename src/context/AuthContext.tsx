import React, { createContext, useState, useEffect, type ReactNode } from 'react';

// Define the User interface based on the backend response
export interface User {
    user_id: string;
    email: string;
    full_name: string;
    role: string;
    permissions: string[];
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => void;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {


    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Load from localStorage on mount or refresh....Otherwise refresh → state resets → AccessControl thinks you're logged out.
    useEffect(() => {
        const storedToken = localStorage.getItem('JWT');
        const storedUser = localStorage.getItem('USER_DATA');

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user data from local storage", error);
                localStorage.removeItem('JWT');
                localStorage.removeItem('USER_DATA');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User, token: string) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem('JWT', token);
        localStorage.setItem('USER_DATA', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('JWT');
        localStorage.removeItem('USER_DATA');
    };

    const hasPermission = (permission: string): boolean => {
        if (!user || !user.permissions) return false;
        return user.permissions.includes(permission);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, hasPermission, isAuthenticated: !!token, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
