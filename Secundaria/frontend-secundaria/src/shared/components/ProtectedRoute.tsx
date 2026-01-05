import React from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const token = localStorage.getItem('token');

    if(!token) {
        return <Navigate to='/secundaria/login' />
    }

    return <>{ children }</>
}