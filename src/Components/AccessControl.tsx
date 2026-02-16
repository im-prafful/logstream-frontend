import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AccessDenied from './AccessDenied';

interface AccessControlProps {
    children: ReactNode;
    requiredPermission?: string;
    requiredRole?: string;
}

export const AccessControl: React.FC<AccessControlProps> = ({
    children,
    requiredPermission,
    requiredRole,

}) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user) {
        // Authenticated but no user data yet (shouldn't happen with our logic, but safe guard)
        return <Navigate to="/login" replace />;
    }

    // Check Role
    if (requiredRole && user.role.toLowerCase() !== requiredRole.toLowerCase()) {
        return <>{<AccessDenied />}</>;
    }

    // Check Permission
    if (requiredPermission && (!user.permissions || !user.permissions.map((permission) => permission.toLowerCase()).includes(requiredPermission.toLowerCase()))) {
        return <>{<AccessDenied />}</>;
    }

    // Access Granted
    return <>{children}</>;
};
