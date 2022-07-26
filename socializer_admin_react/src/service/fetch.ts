import axios from 'axios';
import {consoleLog} from "utils";

const requestInstance = axios.create({
    baseURL: '/',
});

requestInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

requestInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default requestInstance;
