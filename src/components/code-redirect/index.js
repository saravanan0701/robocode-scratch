import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import qs from "query-string";

import api from "../../common/api";
import apiUrls from "../../common/apiUrls";
import store from "../../third-party/scratch-gui/lib/new/store";
import { setAuthData } from "../../third-party/scratch-gui/reducers/new/main-reducer";
import { TOKEN_NAME } from "../../utils";

export default function CodeRedirect() {
	const [loading, setLoading] = useState(true);

	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

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
						const { data: responseData } = await axios.post(`${apiUrls.CONSUME_REDIRECT}`, {
							token,
						});

						if (responseData && responseData.success === true) {
							const data = responseData.data;

							localStorage.setItem(TOKEN_NAME, data.accessToken);

							const authData = store.getState()?.main?.authData;

							if (!authData) {
								const profileRes = await api.doFetch("GET", `${apiUrls.STUDENT_PROFILE}`);

								if (profileRes.success) {
									dispatch(setAuthData(profileRes.data));
								}
							}

							const { redirectId, redirectType, redirectData } = data;

							return {
								redirectId,
								redirectType,
								redirectData,
							};
						}
						return null;
					} catch (error) {
						console.log(error);
						return null;
					}
				};

				getActivityData().then((activityData) => {
					if (subscribed.current) {
						if (activityData?.redirectId) {
							const { redirectData } = activityData;

							if (redirectData) {
								const { type, activity_type: activityType } = redirectData;
								const searchString = qs.stringify({ type, activityType });

								return navigate(`/${activityData.redirectId}?${searchString}`, { replace: true });
							}
						}
						navigate("/");
					}
				});

				return;
			}
		}

		if (subscribed.current) navigate("/");
	}, [navigate, dispatch, searchParams]);

	if (loading) return <>Loading ...</>;

	return null;
}