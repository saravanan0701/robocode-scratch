import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function HomePage() {
	const { authData, authLoading } = useSelector((state) => state.main);

	useEffect(() => {
		if (!authLoading) {
			if (authData) {
				window.location.href = `${process.env.REACT_APP_DASHBOARD_HOST}/dashboard`;
			} else {
				window.location.href = `${process.env.REACT_APP_DASHBOARD_HOST}/auth/student/login`;
			}
		}
	}, [authData]);

	return null;
}
