import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { compose } from "redux";

import GUI from "../../third-party/scratch-gui/containers/gui.jsx";
import AppStateHOC from "../../third-party/scratch-gui/lib/app-state-hoc.jsx";
import HashParserHOC from "../../third-party/scratch-gui/lib/hash-parser-hoc.jsx";
import { TOKEN_NAME } from "../../utils/index.js";

const WrappedGui = compose(AppStateHOC, HashParserHOC)(GUI);

const onClickLogo = () => {
	window.location = "/";
};

export default function ScratchGUI() {
	const [loading, setLoading] = useState(true);

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
				const token = localStorage.getItem(TOKEN_NAME);
				
				if (!token) return null;

				axios.get("");
				
			} catch (error) {
				console.log(error);
			}
		};

		getData();
	}, [id])

	return <WrappedGui canEditTitle canSave={false} onClickLogo={onClickLogo} />;
}
