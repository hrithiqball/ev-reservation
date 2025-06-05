import axios from 'axios'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL: `${serverUrl}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})
