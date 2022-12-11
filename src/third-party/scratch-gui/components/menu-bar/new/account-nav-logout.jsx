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

		setTimeout(() => {
			location.href = "/";
		}, 150);
	};

	return <div onClick={handleLogoutClick}>Logout</div>;
}
