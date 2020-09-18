import axios from "axios"

const uri = "http://127.0.0.1:4000"

export function del (path,opts) {
    return axios.delete(uri + path, {withCredentials: true, ...opts})
}

export function get (path,opts) {
    return axios.get(uri + path, {withCredentials: true, ...opts})
}

export function post (path,data,opts) {
    return axios.post(uri + path, data, {withCredentials:true, ...opts})
}