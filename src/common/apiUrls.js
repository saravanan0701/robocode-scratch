export const HOST = process.env.REACT_APP_API_HOST;
export const BASE_API = "/api/v1/";

export const API_URL = `${HOST}${BASE_API}`;

const apiUrls = {
    LOGIN: `${API_URL}auth/login`,
}

export default apiUrls;