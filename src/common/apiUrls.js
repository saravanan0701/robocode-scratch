export const HOST = process.env.REACT_APP_API_HOST;
export const BASE_API = "/api/v1/";

export const API_URL = `${HOST}${BASE_API}`;

const apiUrls = {
	CONSUME_REDIRECT: `${API_URL}redirectToken/consume`,
	LOAD_ACTIVITY: `${API_URL}activity/student/load`,
	SAVE_ACTIVITY: `${API_URL}activity/student/save`,
	SAVE_NEW_ACTIVITY: `${API_URL}activity/student/save-new`,
	SAVE_EMPTY_PROJECT: `${API_URL}activity/student/save-empty-project`,
	STUDENT_PROFILE: `${API_URL}auth/profile`,
	UPLOAD_FILE: `${API_URL}upload/documents`,
};

export default apiUrls;
