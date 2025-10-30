const HOSTS = ['192.168.18.7','172.16.0.28','172.16.0.227'];
const INDEX = 0; // Change this index to switch between different hosts
const API_HOST = `http://${HOSTS[INDEX]}`;
const API_PORT = '3000';
export const API_URL = `${API_HOST}:${API_PORT}`;
