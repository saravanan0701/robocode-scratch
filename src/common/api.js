import axios from "axios";
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

/** @type { (res: import('axios').AxiosResponse ) => void } */
const handleResponse = res => {
    return {}
};

const handleErrors = res => {
    return {}
};

function API() {
	const doFetch = async (method, url, data = {}, options = {}) => {
		try {
			method = sanitizeMethod(method);

			return axios({
				method,
				url,
				data,
				...options,
			}).then(handleResponse).catch(handleErrors);
		} catch (error) {
			console.log(error);
		}
	};

	return {
		doFetch,
	};
}

const api = API();

export default api;
