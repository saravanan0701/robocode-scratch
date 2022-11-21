import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import styles from "./styles/index.css";

import HomePage from "./components/home-page";
const ScratchGUI = React.lazy(() => import("./components/scratch-gui"));

import store from ".//third-party/scratch-gui/lib/new/store";

const appTarget = document.createElement("div");
appTarget.className = styles.app;

document.body.appendChild(appTarget);

const root = ReactDOM.createRoot(appTarget);

root.render(
	<React.Fragment>
		<Suspense fallback={<div>Loading ...</div>}>
			<Provider store={store}>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/code" element={<ScratchGUI />} />
					</Routes>
				</BrowserRouter>
			</Provider>
		</Suspense>
	</React.Fragment>
);
