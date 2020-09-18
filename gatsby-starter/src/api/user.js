import { del, post, get } from "."

export function logout () {
    return del('/logout')
}

export function login (data) {
    return post('/login',data)
}

export function register (data) {
    return post('/register',data)
}

export function auth () {
    return get('/auth')
}