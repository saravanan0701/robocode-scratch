export const HOST = process.env.REACT_APP_API_HOST;
export const BASE_API = "/api/v1/";

export const API_URL = `${HOST}${BASE_API}`;

const apiUrls = {
    CONSUME_ACTIVITY: `${API_URL}redirectToken/consume`,
}

export default apiUrls;