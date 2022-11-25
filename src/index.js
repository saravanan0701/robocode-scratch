import React, { Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import styles from "./styles/index.css";

import HomePage from "./components/home-page";

import store from ".//third-party/scratch-gui/lib/new/store";
import CodeRedirect from "./components/code-redirect";
import { TOKEN_NAME } from "./utils";
import NotFound from "./components/not-found";

const ScratchGUI = React.lazy(() => import("./components/scratch-gui"));
const appTarget = document.getElementById("root");
appTarget.className = styles.app;

document.body.appendChild(appTarget);

const root = ReactDOM.createRoot(appTarget);

const App = () => {
	useEffect(() => {
		const handleMessageEvent = (ev) => {
			if (ev.origin === process.env.REACT_APP_DASHBOARD_HOST) {
				const data = ev.data ? JSON.parse(ev.data) : null;

				if (data) {
					if (data.eventName === "SCRATCH_LOGOUT") {
						localStorage.removeItem(TOKEN_NAME);

						window.close();
					}
				}
			}
		};

		window.addEventListener("message", handleMessageEvent);

		return () => {
			window.removeEventListener("message", handleMessageEvent);
		};
	}, []);

	return (
		<React.Fragment>
			<Suspense fallback={<div>Loading ...</div>}>
				<Provider store={store}>
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<HomePage />} />
							<Route path="/redirect" element={<CodeRedirect />} />
							<Route path="/notfound" element={<NotFound />} />
							<Route path="/:id" element={<ScratchGUI />} />
							<Route path="*" element={<NotFound />} />
						</Routes>
					</BrowserRouter>
				</Provider>
			</Suspense>
		</React.Fragment>
	);
};

root.render(<App />);
