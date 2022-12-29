import React from "react";
import { useDispatch } from "react-redux";
import { TOKEN_NAME } from "../../../../../utils";
import { resetActivityData, resetAuthData,  } from "../../../reducers/new/main-reducer";

export default function AccountNavLogout() {
	const dispatch = useDispatch();

	const handleLogoutClick = (e) => {
		dispatch(resetAuthData());
		dispatch(resetActivityData());

		localStorage.removeItem(TOKEN_NAME);

		location.href = `${process.env.REACT_APP_DASHBOARD_HOST}/logout`;

		// const messageData = JSON.stringify({
		// 	eventName: "LOGOUT_FROM_SCRATCH",
		// });

		// setTimeout(() => {
		// 	windowPortal.postMessage(messageData, process.env.REACT_APP_DASHBOARD_HOST);
		// }, 150);
	};

	return <div onClick={handleLogoutClick}>Logout</div>;
}
