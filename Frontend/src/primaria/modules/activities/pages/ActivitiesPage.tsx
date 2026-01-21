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

    // Lista de juegos disponibles para Primaria
    const primariaGames: GameItem[] = [
        {
            id: 'videos',
            name: 'Videos Educativos',
            description: 'Aprende con videos interactivos y divertidos',
            icon: '🎥',
            route: '/primaria/games/videos',
            available: true,
            // Preparado para filtrado por grado (aún no activo)
            // minGrade: 1,
            // maxGrade: 6,
        },
        {
            id: 'fabulas',
            name: 'Fábulas',
            description: 'Disfruta de fábulas educativas y aprende valores',
            icon: '📚',
            route: '/primaria/games/fabulas',
            available: true,
        },
        {
            id: 'quiz-individual',
            name: 'Quiz Individual',
            description: 'Pon a prueba tus conocimientos con preguntas',
            icon: '❓',
            route: '/primaria/games/quiz-individual',
            available: true,
        },
        {
            id: 'ordena-frase',
            name: 'Ordena la Frase',
            description: 'Ordena palabras para formar frases correctas',
            icon: '🔤',
            route: '/primaria/games/ordena-frase',
            available: true,
        },
        {
            id: 'michilandia-ninos',
            name: 'Michilandia',
            description: 'Juego educativo interactivo de Michilandia',
            icon: '🎮',
            route: '/primaria/games/michilandia-ninos',
            available: true,
        },
        {
            id: 'michiaventura-ninos',
            name: 'MichiAventura',
            description: 'Aventuras educativas con Michi',
            icon: '🗺️',
            route: '/primaria/games/michiaventura-ninos',
            available: true,
        },
        {
            id: 'colorear',
            name: 'Colorear',
            description: 'Actividades de colorear y creatividad',
            icon: '🎨',
            route: '/primaria/games/colorear',
            available: true,
        },
        {
            id: 'rompecabezas',
            name: 'Rompecabezas',
            description: 'Armar rompecabezas educativos',
            icon: '🧩',
            route: '/primaria/games/rompecabezas',
            available: true,
        },
        {
            id: 'ordena-cancion',
            name: 'Ordena la Canción',
            description: 'Ordena las partes de una canción',
            icon: '🎵',
            route: '/primaria/games/ordena-cancion',
            available: true,
        },
        {
            id: 'kahoot',
            name: 'Kahoot',
            description: 'Juegos de preguntas y respuestas',
            icon: '🏆',
            route: '/primaria/games/kahoot',
            available: true,
        },
    ];

    return (
        <ActivitiesMenu
            title="Menú de Actividades - Primaria"
            games={primariaGames}
            userGrade={userGrade}
            filterByGrade={false} // Por ahora mostrar todos, preparado para futuro
        />
    );
}