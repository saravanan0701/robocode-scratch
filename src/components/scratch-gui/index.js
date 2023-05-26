import React, { useEffect, useRef, useState } from "react";
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
import Loader from "../common/loader.jsx";
import { checkNewProject } from "../../utils/constants.js";
import { TOKEN_NAME } from "../../utils/index.js";

const WrappedGui = compose(AppStateHOC, HashParserHOC)(GUI);

const onClickLogo = () => {
	window.location = "/";
};

export default function ScratchGUI() {
	const { classroomId, id, studentActivityId } = useParams();
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
	const [loading, setLoading] = useState(false);
	const [notfound, setNotfound] = useState(false);

	const [newEmptyProject, setNewEmptyProject] = useState(false);

	useEffect(() => {
		let emptyProject = checkNewProject();

		if (
			(!id || !search) 
			&& 
			!emptyProject
			&&
			!studentActivityId
		) {
			navigate('/notfound')
		}

		if(!localStorage.getItem(TOKEN_NAME)) {
			window.location.href = `${process.env.REACT_APP_DASHBOARD_HOST}/auth/student/login`;
		}

		setNewEmptyProject(emptyProject);

		const getData = async () => {
			try {
				const searchData = queryString.parse(search);
				searchData.activityType = "scratch";

				const query = queryString.stringify(searchData);

				let url = `${apiUrls.LOAD_ACTIVITY}/${classroomId}/${id}`;

				if (studentActivityId) {
					url = `${apiUrls.LOAD_ACTIVITY}/${studentActivityId}`;
				}

				if (query) {
					url += "?" + query;
				}

				setLoading(true);
				const activityRes = await Api.doFetch("POST", url, {});

				if (activityRes?.success) {
					const { data } = activityRes;

					dispatch(setActivityData(data));
				} else if (!activityRes?.success && activityRes?.error_code === 1055) {
					setNotfound(true);
				} else {
					setNotfound(true);
				}
				setLoading(false);
			} catch (error) {
				console.log(error);
			}
		};

		if (!emptyProject) {
			getData();
		}
		
	}, [dispatch, navigate, id, search]);

	// if (loading) return <Loader />;

	// if (notfound) {
	// 	return <>404</>
	// }

	return (
		<WrappedGui
			loading = {loading}
			notfound = {notfound}
			canEditTitle={false} 
			canSave={false} 
			onClickLogo={onClickLogo} 
			newEmptyProject = {newEmptyProject}
			search = {search}
		/>
	);
}
