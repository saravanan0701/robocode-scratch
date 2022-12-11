import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { compose } from "redux";
import Api from "../../common/api.js";
import apiUrls from "../../common/apiUrls.js";

import GUI from "../../third-party/scratch-gui/containers/gui.jsx";
import AppStateHOC from "../../third-party/scratch-gui/lib/app-state-hoc.jsx";
import HashParserHOC from "../../third-party/scratch-gui/lib/hash-parser-hoc.jsx";
import { setActivityData } from "../../third-party/scratch-gui/reducers/new/main-reducer.js";
import { TOKEN_NAME } from "../../utils/index.js";

const WrappedGui = compose(AppStateHOC, HashParserHOC)(GUI);

const onClickLogo = () => {
	window.location = "/";
};

export default function ScratchGUI() {
	const { id } = useParams();
	const dispatch = useDispatch();

	const subscribed = useRef(true);

	useEffect(() => {
		subscribed.current = true;

		return () => {
			subscribed.current = false;
		};
	}, []);

	
	useEffect(() => {
		const getData = async () => {
			try {
				const activityRes = await Api.doFetch(
					"GET",
					`${apiUrls.LOAD_ACTIVITY}/6390380b65a824e67bcc988f?type=scratch`,
					null
				);

				if (activityRes?.success) {
					const { data } = activityRes;

					dispatch(setActivityData(data));
				}
			} catch (error) {
				console.log(error);
			}
		};

		getData();
	}, [dispatch, id]);

	return <WrappedGui canEditTitle={false} canSave={false} onClickLogo={onClickLogo} />;
}
