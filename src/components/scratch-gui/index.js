import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { compose } from "redux";
import debounce from "lodash.debounce";
import queryString from "query-string";

import Api from "../../common/api.js";
import apiUrls from "../../common/apiUrls.js";

import GUI from "../../third-party/scratch-gui/containers/gui.jsx";
import AppStateHOC from "../../third-party/scratch-gui/lib/app-state-hoc.jsx";
import HashParserHOC from "../../third-party/scratch-gui/lib/hash-parser-hoc.jsx";
import { setActivityData } from "../../third-party/scratch-gui/reducers/new/main-reducer.js";

const WrappedGui = compose(AppStateHOC, HashParserHOC)(GUI);

const onClickLogo = () => {
	window.location = "/";
};

export default function ScratchGUI() {
	const { id } = useParams();
	const { search } = useLocation();
	const navigate = useNavigate();

	const dispatch = useDispatch();

	// const vm = useSelector((state) => state?.scratchGui?.vm);

	const subscribed = useRef(true);

	useEffect(() => {
		subscribed.current = true;

		return () => {
			subscribed.current = false;
		};
	}, []);

	// useEffect(() => {
	// 	vm.blockListener = debounce(function (ev) {
	// 		console.log(JSON.stringify(vm.toJSON()).length);
	// 	}, 2000);
	// }, [vm]);

	useEffect(() => {
		if (!id || !search) {
			navigate('/notfound')
		}

		const getData = async () => {
			try {
				const searchData = queryString.parse(search);
				searchData.activityType = "scratch";

				const query = queryString.stringify(searchData);

				let url = `${apiUrls.LOAD_ACTIVITY}/${id}`;

				if (query) {
					url += "?" + query;
				}

				const activityRes = await Api.doFetch("POST", url, {});

				if (activityRes?.success) {
					const { data } = activityRes;

					dispatch(setActivityData(data));
				}
			} catch (error) {
				console.log(error);
			}
		};

		getData();
	}, [dispatch, navigate, id, search]);

	return <WrappedGui canEditTitle={false} canSave={false} onClickLogo={onClickLogo} />;
}
