import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AccessDenied from './AccessDenied';
import { LogOut } from 'lucide-react';

export const AccessControl = ({
    children,
    requiredPermission,
    requiredRole,
}: any) => {
    const { user, isAuthenticated, isLoading, logout } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check Role
    if (
        requiredRole &&
        user.role?.toLowerCase() !== requiredRole.toLowerCase()
    ) {
        return <AccessDenied />;
    }

    // Check Permission-flat permissions
    if (
        requiredPermission &&
        (!user.permissions || !user.permissions[requiredPermission])
    ) {
        return <AccessDenied />;
    }

    // Access Granted
    return (
        <>
            <div className="fixed top-4 right-4 z-50">
                <button 
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur hover:bg-red-50 hover:text-red-600 text-slate-700 shadow-md border border-slate-200 rounded-lg transition-all font-semibold text-sm cursor-pointer"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </div>
            {children}
        </>
    );
};