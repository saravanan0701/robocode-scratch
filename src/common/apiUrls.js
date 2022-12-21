export const HOST = process.env.REACT_APP_API_HOST;
export const BASE_API = "/api/v1/";

export const API_URL = `${HOST}${BASE_API}`;

console.log({
	API_URL,
	HOST,
});
const apiUrls = {
	CONSUME_REDIRECT: `${API_URL}redirectToken/consume`,
	LOAD_ACTIVITY: `${API_URL}activity/student/load`,
	SAVE_ACTIVITY: `${API_URL}activity/student/save`,
	SAVE_NEW_ACTIVITY: `${API_URL}activity/student/save-new`,
	STUDENT_PROFILE: `${API_URL}student/profile`,
};

export default apiUrls;
