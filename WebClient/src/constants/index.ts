import axios from 'axios';

export const host = 'http://127.0.0.1:3001';

export const axiosClient = axios.create({
    baseURL: `${host}`
});

export enum LocalStorageKey {
    TOKEN = "TOKEN",
}
