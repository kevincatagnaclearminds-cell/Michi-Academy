export interface User {
    id: string;
    email: string;
    username?: string;
    name?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    username?: string;
    confirmPassword?: string;
}

export interface LoginResponse {
    user: string;
    token: string;
    refresToken?: string;
}

export interface AuthError {
    message: string;
    code?: string;
}

