import axios from 'axios';

// const API_URL = 'https://chronex-backend.onrender.com/'
const API_URL = 'http://localhost:8000/'
export const axiosInstance = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});
