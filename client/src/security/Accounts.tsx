import axios from 'axios'
import { setCookie, getCookie } from 'cookies-next'

const accRegisterFunc = async (userName: string, userEmail: string, password: string, repeatedPassword: string) => {
    if (password !== repeatedPassword) {
        console.log('object')
        return false
    }

    const res = await axios.post(`http://192.168.72.81:7000/api/user-account/register-account`, {
        userName,
        userEmail,
        password
    })

    if (!res.data.error && res.data.userprivateToken != null) {
        setCookie('userToken', res.data.userprivateToken, { maxAge: 60 * 6 * 24 })
        return true
    }

    return false
}

const accLoginFunc = async (userEmail: string, password: string) => {
    const res = await axios.post(`${process.env.SERVER_BACKEND}/user-account/login-account`, {
        userEmail,
        password
    })
    console.log(res.data)
    if (!res.data.error && res.data.userprivateToken != null) {
        setCookie('userToken', res.data.userprivateToken, { maxAge: 60 * 6 * 24 })
        return true
    }

    if (res.data.userprivateToken === null) {
        window.alert('incorect credentials!')
    }

    return false
}

const AccLogout = () => {
    try {
    } catch (e) {
        console.log(`is logged in error ${e}`)
    }
}

const isLoggedIn = async () => {
    if (typeof window === 'undefined') {
        // server side
        const { cookies } = await import('next/headers')

        //* server-side
        const nextCookies = cookies() // Get cookies object
        const userTokenSSR = nextCookies.get('userToken') // Find cookie

        if (userTokenSSR != undefined) {
            return true
        } else {
            return false
        }
    } else {
        //* client-side
        const userToken = getCookie('userToken')
        if (userToken != undefined) {
            return true
        } else {
            return false
        }
    }
}

export { accRegisterFunc, accLoginFunc, AccLogout, isLoggedIn }
