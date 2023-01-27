export const Capitalize = (text) => {
	try {
		return text ? text[0].toUpperCase() + text.slice(1) : "";
	} catch (e) {
		return "";
	}
};

export const checkNewProject = () => {
	return window.location?.pathname === "/new" || location?.pathname === "/new/" ? true : false
}

export const generateProfileInitials = (name) => {
	try {
		if (typeof name === "string" && name.length > 0) {
			const usernameSplit = name.trim().split(" ");

			const firstInitial = usernameSplit[0];

			if (usernameSplit.length > 1) {
				// const lastInitial = usernameSplit[usernameSplit.length - 1];
				const lastInitial = usernameSplit[1];

				return (firstInitial[0] + lastInitial[0]).toUpperCase();
			}

			return firstInitial[0].toUpperCase();
		}

		return "";
	} catch (e) {
		return "";
	}
};

export const CapitalizeWord = (text) => {
	try {

		let convertedText = "";

		if (text) {
			const words = text.split(" ");

			for (let i = 0; i < words.length; i++) {
				if (convertedText) {
					convertedText += " ";
				}
				convertedText += words[i][0].toUpperCase() + words[i].substr(1);
			}

		}
		return convertedText;
	} catch (e) {
		return "";
	}
};