import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useSessionTimeout = (timeoutInMinutes: number = 10) => {
    const navigate = useNavigate();

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        const logout = () => {
            localStorage.removeItem('token');
            navigate('secundaria/login');
            alert('Tu sesión ha expirado por inactividad')
        }

        const resetTimer = () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(logout, timeoutInMinutes * 60 * 1000);
        }

        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        window.addEventListener('click', resetTimer);

        resetTimer();

        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('click', resetTimer);
        };
    }), [navigate, timeoutInMinutes]
}