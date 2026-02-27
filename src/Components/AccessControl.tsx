import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AccessDenied from './AccessDenied';

export const AccessControl = ({
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
        return <Navigate to="/login" replace />;
    }

    // Check Role
    if (
        requiredRole &&
        user.role?.toLowerCase() !== requiredRole.toLowerCase()
    ) {
        return <AccessDenied />;
    }

    // Check Permission
    if (
        requiredPermission &&
        (!user.permissions || !user.permissions[requiredPermission])
    ) {
        return <AccessDenied />;
    }

    // Access Granted
    return <>{children}</>;
};