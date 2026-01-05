import React, { useEffect } from 'react';
import { useSessionTimeout } from '../../../shared/hooks/useSessionTimeout';

export const ActivitiesPage: React.FC = () => {
    useSessionTimeout(1);

    useEffect(() => {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = '#f4f4f4';
        
        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    return (
        <div style={{ 
            padding: '50px', 
            textAlign: 'center',
            minHeight: '100vh',
            color: '#040201'
            }}
        >
            <h1>Bienvenido al Menú de Actividades de Secundaria</h1>
        </div>
    )
}