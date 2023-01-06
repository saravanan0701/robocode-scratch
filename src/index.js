import React, { Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";

import styles from "./styles/index.css";
import "./styles/global.css";

// import HomePage from "./components/home-page";

import store from ".//third-party/scratch-gui/lib/new/store";
import CodeRedirect from "./components/code-redirect";
import { TOKEN_NAME } from "./utils";
import NotFound from "./components/not-found";
import api from "./common/api";
import apiUrls from "./common/apiUrls";
import { useDispatch } from "react-redux";
import { setAuthData } from "./third-party/scratch-gui/reducers/new/main-reducer";
import HomePage from "./components/home-page";
import Loader from "./components/common/loader.jsx";
import { ToastContainer } from "react-toastify";
import Logout from "./components/logout";

const ScratchGUI = React.lazy(() => import("./components/scratch-gui"));
const appTarget = document.getElementById("root");

if (appTarget) {
	appTarget.className = styles.app;

	document.body.appendChild(appTarget);

	const root = ReactDOM.createRoot(appTarget);

	const App = () => {
		useEffect(() => {
			const unmountLoadingDiv = () => {
				document.body.style.overflow = "auto";

				const loadingRoot = document.getElementById("loading-root");
				const logoutScript = document.getElementById("logout-script");

				if (loadingRoot) {
					document.body.removeChild(loadingRoot);
				}

				if (logoutScript) {
					document.head.removeChild(logoutScript);
				}
			};

			const handleMessageEvent = (ev) => {
				try {
					if (ev.origin === process.env.REACT_APP_DASHBOARD_HOST) {
						const data = ev.data ? JSON.parse(ev.data) : null;

						if (data) {
							if (data.eventName === "SCRATCH_LOGOUT") {
								localStorage.removeItem(TOKEN_NAME);

								window.close();
							}
						}
					}
				} catch (error) {}
			};

			const handleStorageEvent = (event) => {
				if (!event) return;

				let authChange = false;

				if (event.key === "userdetail") {
					authChange = true;
				} else if (event.key === null && event.newValue === null) {
					authChange = true;
				}

				if (authChange) {
					window.location.href = "/";
				}
			};

			unmountLoadingDiv();

			window.onstorage = handleStorageEvent;

			window.addEventListener("message", handleMessageEvent);

			return () => {
				window.removeEventListener("message", handleMessageEvent);
				window.onstorage = null;
			};
		}, []);

		return (
			<React.Fragment>
				<Suspense fallback={<Loader />}>
					<Provider store={store}>
						<InnerApp />
					</Provider>
				</Suspense>

				<ToastContainer autoClose={3000} position="top-center" theme="colored" />
			</React.Fragment>
		);
	};

	function InnerApp() {
		const [loading, setLoading] = useState(true);
		const dispatch = useDispatch();

		useEffect(() => {
			const getData = async () => {
				try {
					setLoading(true);

					const token = localStorage.getItem(TOKEN_NAME);

					if (token) {
						const profileRes = await api.doFetch("GET", `${apiUrls.STUDENT_PROFILE}`);

						if (profileRes.success) {
							dispatch(setAuthData(profileRes.data));
						}
					}
				} catch (error) {
				} finally {
					setLoading(false);
				}
			};

			getData();
		}, [dispatch]);

		if (loading) return <Loader />;

		return (
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/redirect" element={<CodeRedirect />} />
					<Route path="/notfound" element={<NotFound />} />
					<Route path="/logout" element={<Logout />} />
					<Route path="/:id" element={<ScratchGUI />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		);
	}

	root.render(<App />);
}
