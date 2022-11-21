import React from "react";
import { compose } from "redux";

import GUI from "../../third-party/scratch-gui/containers/gui.jsx";
import AppStateHOC from "../../third-party/scratch-gui/lib/app-state-hoc.jsx";
import HashParserHOC from "../../third-party/scratch-gui/lib/hash-parser-hoc.jsx";

const WrappedGui = compose(AppStateHOC, HashParserHOC)(GUI);

// TODO a hack for testing the backpack, allow backpack host to be set by url param
const backpackHostMatches = window.location.href.match(/[?&]backpack_host=([^&]*)&?/);
const backpackHost = backpackHostMatches ? backpackHostMatches[1] : null;

const onClickLogo = () => {
    window.location = 'https://scratch.mit.edu';
};

export default function ScratchGUI() {
	return (
		<WrappedGui
			canEditTitle
			backpackVisible
			backpackHost={backpackHost}
			canSave={false}
			onClickLogo={onClickLogo}
		/>
	);
}
