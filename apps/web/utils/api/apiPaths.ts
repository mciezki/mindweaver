export const PUBLIC_API = {
    register: '/auth/register',
    login: '/auth/login',
    logout: '/auth/logout',
    activate: '/auth/activate',
    request_password_reset: '/auth/request-password-reset',
    reset_password: '/auth/reset-password',
    refresh: '/auth/refresh'
}

export const PRIVATE_API = {
    update: '/auth/profile/update',
}