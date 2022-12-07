import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
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
	const { id } = useParams();

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
