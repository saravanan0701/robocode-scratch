import { Button } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Styles from "./main.css";

export default function HomePage() {
	const { authData, authLoading } = useSelector((state) => state.main);

	if (!authData)
		return (
			<div className={Styles.homePage}>
				<div className={Styles.homePage_Button}>Please login to continue</div>
				<Button href={process.env.REACT_APP_DASHBOARD_HOST}>Login</Button>
			</div>
		);

	return (
		<div>
			<div>Hi, {authData.name}</div>

			<Button href={process.env.REACT_APP_DASHBOARD_HOST}>Dashboard</Button>
		</div>
	);
}
