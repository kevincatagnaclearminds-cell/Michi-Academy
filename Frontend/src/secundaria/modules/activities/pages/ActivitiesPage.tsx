import React, { useEffect } from 'react';
import { useSessionTimeout } from '../../../shared/hooks/useSessionTimeout';
import { ActivitiesMenu, GameItem } from '../../../../shared/components/ActivitiesMenu';
import { authService } from '../../../../shared/auth/services/authService';

export const ActivitiesPage: React.FC = () => {
    useSessionTimeout(1);
    const userGrade = authService.getUserGrade();

    useEffect(() => {
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = '#f4f4f4';
        
        return () => {
            document.body.style.backgroundImage = '';
        };
    }, []);

    // Lista de juegos disponibles para Secundaria
    const allSecundariaGames: GameItem[] = [
        {
            id: 'videos',
            name: 'Videos Educativos',
            description: 'Aprende con videos interactivos y contenido avanzado',
            icon: '🎥',
            route: '/secundaria/games/videos',
            available: true,
            // Preparado para filtrado por grado (aún no activo)
            // minGrade: 7,
            // maxGrade: 12,
        },
        {
            id: 'detectives-financieros',
            name: 'Detectives Financieros',
            description: 'Resuelve casos financieros y aprende sobre economía',
            icon: '🔍',
            route: '/secundaria/games/detectives-financieros',
            available: true,
        },
        {
            id: 'quiz-individual',
            name: 'Quiz Individual',
            description: 'Pon a prueba tus conocimientos con preguntas avanzadas',
            icon: '❓',
            route: '/secundaria/games/quiz-individual',
            available: true,
        },
        {
            id: 'juego-bolsa',
            name: 'Juego de Bolsa',
            description: 'Aprende sobre inversiones y mercado de valores',
            icon: '📈',
            route: '/secundaria/games/juego-bolsa',
            available: true,
        },
        {
            id: 'michilandia',
            name: 'Michilandia',
            description: 'Juego educativo avanzado de Michilandia',
            icon: '🎮',
            route: '/secundaria/games/michilandia',
            available: true,
        },
        {
            id: 'michiaventura',
            name: 'MichiAventura',
            description: 'Aventuras educativas avanzadas con Michi',
            icon: '🗺️',
            route: '/secundaria/games/michiaventura',
            available: true,
        },
        {
            id: 'packman',
            name: 'Packman',
            description: 'Juego clásico educativo',
            icon: '👾',
            route: '/secundaria/games/packman',
            available: true,
        },
        {
            id: 'kahoot',
            name: 'Kahoot',
            description: 'Juegos de preguntas y respuestas avanzadas',
            icon: '🏆',
            route: '/secundaria/games/kahoot',
            available: true,
        },
    ];

    // Juegos ocultos: videos, quiz-individual
    const hiddenGameIds = ['videos', 'quiz-individual'];
    const secundariaGames = allSecundariaGames.filter(game => !hiddenGameIds.includes(game.id));

    return (
        <ActivitiesMenu
            title="Menú de Actividades - Secundaria"
            games={secundariaGames}
            userGrade={userGrade}
            filterByGrade={false} // Por ahora mostrar todos, preparado para futuro
        />
    );
}