import { createStore, compose, combineReducers } from "redux";
import locales from "scratch-l10n";
import { ScratchPaintReducer } from "scratch-paint";

import guiReducer, { guiInitialState, guiMiddleware } from "../../reducers/gui";
import { mainReducer, mainReducerInitialState } from "../../reducers/new/main-reducer";

import localesReducer, { initLocale, localesInitialState } from "../../reducers/locales";
import { detectLocale } from "../detect-locale";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let initializedLocales = localesInitialState;

const locale = detectLocale(Object.keys(locales));

if (locale !== "en") initializedLocales = initLocale(initializedLocales, locale);

// You are right, this is gross. But it's necessary to avoid importing unneeded code that will crash unsupported browsers.
const initializedGui = guiInitialState;

const reducers = {
	locales: localesReducer,
	main: mainReducer,
	scratchGui: guiReducer,
	scratchPaint: ScratchPaintReducer,
};

const initialState = {
	locales: initializedLocales,
	main: mainReducerInitialState,
	scratchGui: initializedGui,
};

const enhancer = composeEnhancers(guiMiddleware);

const reducer = combineReducers(reducers);

const store = createStore(reducer, initialState, enhancer);

export default store;
