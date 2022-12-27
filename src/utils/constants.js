export const Capitalize = (text) => {
	try {
		return text ? text[0].toUpperCase() + text.slice(1) : "";
	} catch (e) {
		return "";
	}
};