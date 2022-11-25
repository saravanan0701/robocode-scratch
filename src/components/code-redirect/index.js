import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiUrls from "../../common/apiUrls";
import { TOKEN_NAME } from "../../utils";

export default function CodeRedirect() {
	const [loading, setLoading] = useState(true);

	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const subscribed = useRef(true);

	useEffect(() => {
		subscribed.current = true;

		return () => {
			subscribed.current = false;
		};
	}, []);

	useEffect(() => {
		setLoading(true);

		if (searchParams.has("code")) {
			let token = searchParams.get("code");
			token = token ? decodeURIComponent(token) : null;

			if (token) {
				const getActivityData = async () => {
					try {
						const { data: responseData } = await axios.post(`${apiUrls.CONSUME_ACTIVITY}`, {
							token,
						});

						if (responseData && responseData.success === true) {
							const data = responseData.data;

							localStorage.setItem(TOKEN_NAME, data.accessToken);

							return data.activity;
						}
						return null;
					} catch (error) {
						console.log(error);
						return null;
					}
				};

				getActivityData().then((activityData) => {
					if (subscribed.current)
						if (activityData) {
							navigate(`/${activityData}`);
						} else {
							navigate("/");
						}
				});

				return;
			}
		}

		if (subscribed.current) navigate("/");
	}, [navigate, searchParams]);

	if (loading) return <>Loading ...</>;

	return null;
}
