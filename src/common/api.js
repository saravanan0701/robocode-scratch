import axios from "axios";
import { TOKEN_NAME } from "../utils";
import { HOST } from "./apiUrls";

export const axiosApi = axios.create({
	baseURL: HOST,
});

const apiMethods = {
	get: "get",
	post: "post",
	put: "put",
	patch: "patch",
	delete: "delete",
};

const sanitizeMethod = (method) => {
	method = apiMethods[method && method.trim().toLowerCase()] || null;

	if (!method)
		throw new Error(
			"Method should be one of: " +
				Object.keys(apiMethods).reduce((pv, cv) => {
					return pv + (pv ? ", " + cv.toUpperCase() : cv.toUpperCase());
				}, "")
		);

	return method;
};

const getToken = () => {
	return localStorage.getItem(TOKEN_NAME) || null;
};

/** @type { (res: import('axios').AxiosResponse ) => ({}) } } */
const handleResponse = (res) => {
	return res.data;
};

const handleErrors = (res) => {
	return { error: "Pending" };
};

function API() {
	const doFetch = async (method, url, data = {}, options = {}) => {
		try {
			method = sanitizeMethod(method);

			if (typeof options !== "object") {
				options = {};
			}

			const token = localStorage.getItem(TOKEN_NAME);

			options.headers = {
				"x-auth-token": token,
			};

			return axios({
				method,
				url,
				data,
				...options,
			})
				.then(handleResponse)
				.catch(handleErrors);
		} catch (error) {
			console.log(error);
		}
	};

	const logout = () => {
		localStorage.removeItem(TOKEN_NAME);
	};

	return {
		doFetch,
		logout,
	};
}

const api = API();

export default api;
