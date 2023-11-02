import axios from 'axios';

export const host = 'http://127.0.0.1:3001';

export const axiosClient = axios.create({
    baseURL: `${host}`
});

export enum LocalStorageKey {
    TOKEN = "TOKEN",
}

export const ratingListLimit = 10

export const orderListLimit = 10

export const dateFormat = 'YYYY/MM/DD';
