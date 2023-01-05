import { useEffect } from "react";
import api from "../../common/api";

export default function Logout() {
	useEffect(() => {
		api.logout();
	}, []);

	return null;
}
