import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../../../common/api";
import { resetActivityData, resetAuthData,  } from "../../../reducers/new/main-reducer";

export default function AccountNavLogout() {

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleLogoutClick = (e) => {
		dispatch(resetAuthData());
		dispatch(resetActivityData());

		api.logout();
		navigate("/");
		// window.location.href = `${process.env.REACT_APP_DASHBOARD_HOST}/logout`
	};

	return <div onClick={handleLogoutClick}>Logout</div>;
}
