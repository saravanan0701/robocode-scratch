import React, { useEffect } from "react";
import api from "../../common/api";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Logout() {

	const navigate = useNavigate();

	useEffect(() => {
        api.logout();
    }, [navigate]);

	return null;
}
