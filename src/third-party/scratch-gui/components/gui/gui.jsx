import classNames from "classnames";
import omit from "lodash.omit";
import PropTypes from "prop-types";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { defineMessages, FormattedMessage, injectIntl, intlShape } from "react-intl";
import { connect } from "react-redux";
import MediaQuery from "react-responsive";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import tabStyles from "react-tabs/style/react-tabs.css";
import VM from "scratch-vm";
import Renderer from "scratch-render";

import Blocks from "../../containers/blocks.jsx";
import CostumeTab from "../../containers/costume-tab.jsx";
import TargetPane from "../../containers/target-pane.jsx";
import SoundTab from "../../containers/sound-tab.jsx";
import StageWrapper from "../../containers/stage-wrapper.jsx";
import Loader from "../loader/loader.jsx";
import Box from "../box/box.jsx";
import MenuBar from "../menu-bar/menu-bar.jsx";
import CostumeLibrary from "../../containers/costume-library.jsx";
import BackdropLibrary from "../../containers/backdrop-library.jsx";
import Watermark from "../../containers/watermark.jsx";

import Backpack from "../../containers/backpack.jsx";
import WebGlModal from "../../containers/webgl-modal.jsx";
import TipsLibrary from "../../containers/tips-library.jsx";
import Cards from "../../containers/cards.jsx";
import Alerts from "../../containers/alerts.jsx";
import DragLayer from "../../containers/drag-layer.jsx";
import ConnectionModal from "../../containers/connection-modal.jsx";
import TelemetryModal from "../telemetry-modal/telemetry-modal.jsx";

import layout, { STAGE_SIZE_MODES } from "../../lib/layout-constants";
import { resolveStageSize } from "../../lib/screen-utils";

import styles from "./gui.css";
import cardStyles from "./guiCard.css";

import addExtensionIcon from "./icon--extensions.svg";
import documentIcon from "./icon--document.svg";
import codeIcon from "./icon--code.svg";
import costumesIcon from "./icon--costumes.svg";
import soundsIcon from "./icon--sounds.svg";
import { useSelector } from "react-redux";
import ReactDocViewer, { DocViewerRenderers } from "react-doc-viewer";
import { Modal } from "antd";

import rightArrow from "../cards/icon--next.svg";
import leftArrow from "../cards/icon--prev.svg";

import closeIcon from "../cards/icon--close.svg";
import debounce from "lodash.debounce";
import ReactPlayer from "react-player";

import Draggable from 'react-draggable';

const messages = defineMessages({
	addExtension: {
		id: "gui.gui.addExtension",
		description: "Button to add an extension in the target pane",
		defaultMessage: "Add Extension",
	},
});

// Cache this value to only retrieve it once the first time.
// Assume that it doesn't change for a session.
let isRendererSupported = null;

const GUIComponent = (props) => {
	const {
		accountNavOpen,
		activeTabIndex,
		alertsVisible,
		authorId,
		authorThumbnailUrl,
		authorUsername,
		basePath,
		backdropLibraryVisible,
		backpackHost,
		backpackVisible,
		blocksTabVisible,
		cardsVisible,
		canChangeLanguage,
		canCreateNew,
		canEditTitle,
		canManageFiles,
		canRemix,
		canSave,
		canCreateCopy,
		canShare,
		canUseCloud,
		children,
		connectionModalVisible,
		costumeLibraryVisible,
		costumesTabVisible,
		enableCommunity,
		intl,
		isCreating,
		isFullScreen,
		isPlayerOnly,
		isRtl,
		isShared,
		isTelemetryEnabled,
		loading,
		logo,
		renderLogin,
		onClickAbout,
		onClickAccountNav,
		onCloseAccountNav,
		onLogOut,
		onOpenRegistration,
		onToggleLoginOpen,
		onActivateCostumesTab,
		onActivateSoundsTab,
		onActivateTab,
		onClickLogo,
		onExtensionButtonClick,
		onProjectTelemetryEvent,
		onRequestCloseBackdropLibrary,
		onRequestCloseCostumeLibrary,
		onRequestCloseTelemetryModal,
		onSeeCommunity,
		onShare,
		onShowPrivacyPolicy,
		onStartSelectingFileUpload,
		onTelemetryModalCancel,
		onTelemetryModalOptIn,
		onTelemetryModalOptOut,
		showComingSoon,
		soundsTabVisible,
		stageSizeMode,
		targetIsStage,
		telemetryModalVisible,
		tipsLibraryVisible,
		vm,
		...componentProps
	} = omit(props, "dispatch");
	const activityData = useSelector((state) => state.main.activityData);
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);

	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
	}
	if (children) {
		return <Box {...componentProps}>{children}</Box>;
	}

	const tabClassNames = {
		tabs: styles.tabs,
		tab: classNames(tabStyles.reactTabsTab, styles.tab),
		tabList: classNames(tabStyles.reactTabsTabList, styles.tabList),
		tabPanel: classNames(tabStyles.reactTabsTabPanel, styles.tabPanel),
		tabPanelSelected: classNames(tabStyles.reactTabsTabPanelSelected, styles.isSelected),
		tabSelected: classNames(tabStyles.reactTabsTabSelected, styles.isSelected),
	};

	if (isRendererSupported === null) {
		isRendererSupported = Renderer.isSupported();
	}

	useEffect(() => {
		if (activityData?.documents && activityData?.documents.length > 0 && !isModalOpen) {
			setIsModalOpen(true);
		} else if (activityData?.documents && activityData?.documents.length === 0) {
			let element = document.getElementsByClassName('blocklyToolboxDiv');

			if (element && element.length > 0) {
				element = element[0]
				console.log(element.classList, element.className);
				element.className += " no_document"
				// element.classList.add("my-class");
			}
		}
	}, [activityData])

	return (
		<MediaQuery minWidth={layout.fullSizeMinWidth}>
			{(isFullSize) => {
				const stageSize = resolveStageSize(stageSizeMode, isFullSize);

				return isPlayerOnly ? (
					<StageWrapper
						isFullScreen={isFullScreen}
						isRendererSupported={isRendererSupported}
						isRtl={isRtl}
						loading={loading}
						stageSize={STAGE_SIZE_MODES.large}
						vm={vm}>
						{alertsVisible ? <Alerts className={styles.alertsContainer} /> : null}
					</StageWrapper>
				) : (
					<Box className={styles.pageWrapper} dir={isRtl ? "rtl" : "ltr"} {...componentProps}>
						{telemetryModalVisible ? (
							<TelemetryModal
								isRtl={isRtl}
								isTelemetryEnabled={isTelemetryEnabled}
								onCancel={onTelemetryModalCancel}
								onOptIn={onTelemetryModalOptIn}
								onOptOut={onTelemetryModalOptOut}
								onRequestClose={onRequestCloseTelemetryModal}
								onShowPrivacyPolicy={onShowPrivacyPolicy}
							/>
						) : null}
						{loading ? <Loader /> : null}
						{isCreating ? <Loader messageId="gui.loader.creating" /> : null}
						{isRendererSupported ? null : <WebGlModal isRtl={isRtl} />}
						{tipsLibraryVisible ? <TipsLibrary /> : null}
						{cardsVisible ? <Cards /> : null}
						{alertsVisible ? <Alerts className={styles.alertsContainer} /> : null}
						{connectionModalVisible ? <ConnectionModal vm={vm} /> : null}
						{costumeLibraryVisible ? <CostumeLibrary vm={vm} onRequestClose={onRequestCloseCostumeLibrary} /> : null}
						{backdropLibraryVisible ? (
							<BackdropLibrary vm={vm} onRequestClose={onRequestCloseBackdropLibrary} />
						) : null}
						<MenuBar
							accountNavOpen={accountNavOpen}
							authorId={authorId}
							authorThumbnailUrl={authorThumbnailUrl}
							authorUsername={authorUsername}
							canChangeLanguage={canChangeLanguage}
							canCreateCopy={canCreateCopy}
							canCreateNew={canCreateNew}
							canEditTitle={canEditTitle}
							canManageFiles={canManageFiles}
							canRemix={canRemix}
							canSave={canSave}
							canShare={canShare}
							className={styles.menuBarPosition}
							enableCommunity={enableCommunity}
							isShared={isShared}
							logo={logo}
							renderLogin={renderLogin}
							showComingSoon={showComingSoon}
							onClickAbout={onClickAbout}
							onClickAccountNav={onClickAccountNav}
							onClickLogo={onClickLogo}
							onCloseAccountNav={onCloseAccountNav}
							onLogOut={onLogOut}
							onOpenRegistration={onOpenRegistration}
							onProjectTelemetryEvent={onProjectTelemetryEvent}
							onSeeCommunity={onSeeCommunity}
							onShare={onShare}
							onStartSelectingFileUpload={onStartSelectingFileUpload}
							onToggleLoginOpen={onToggleLoginOpen}
						/>
						<Box className={styles.bodyWrapper}>
							<Box className={styles.flexWrapper}>
								<Box className={styles.editorWrapper}>
									<Tabs
										forceRenderTabPanel
										className={tabClassNames.tabs}
										selectedIndex={activeTabIndex}
										selectedTabClassName={tabClassNames.tabSelected}
										selectedTabPanelClassName={tabClassNames.tabPanelSelected}
										onSelect={onActivateTab}>
										<TabList className={tabClassNames.tabList}>
											<Tab className={tabClassNames.tab}>
												<img draggable={false} src={codeIcon} />
												<FormattedMessage
													defaultMessage="Code"
													description="Button to get to the code panel"
													id="gui.gui.codeTab"
												/>
											</Tab>
											<Tab className={tabClassNames.tab} onClick={onActivateCostumesTab}>
												<img draggable={false} src={costumesIcon} />
												{targetIsStage ? (
													<FormattedMessage
														defaultMessage="Backdrops"
														description="Button to get to the backdrops panel"
														id="gui.gui.backdropsTab"
													/>
												) : (
													<FormattedMessage
														defaultMessage="Costumes"
														description="Button to get to the costumes panel"
														id="gui.gui.costumesTab"
													/>
												)}
											</Tab>
											<Tab className={tabClassNames.tab} onClick={onActivateSoundsTab}>
												<img draggable={false} src={soundsIcon} />
												<FormattedMessage
													defaultMessage="Sounds"
													description="Button to get to the sounds panel"
													id="gui.gui.soundsTab"
												/>
											</Tab>
										</TabList>
										<TabPanel className={tabClassNames.tabPanel}>
											<Box className={styles.blocksWrapper}>
												<Blocks
													canUseCloud={canUseCloud}
													grow={1}
													isVisible={blocksTabVisible}
													options={{
														media: `${basePath}static/blocks-media/`,
													}}
													stageSize={stageSize}
													vm={vm}
												/>
											</Box>

											{activityData?.documents && (
												<DocumentViewerCard
													isModalOpen={isModalOpen}
													setIsModalOpen={setIsModalOpen}
													documents={activityData?.documents?.map((d) => ({
														_id: d?._id,
														data: d?.data,
														title: d?.title,
														uri: d.url,
														fileType: d.documentType,
													}))}
												/>
											)}

											{
												activityData?.documents && activityData?.documents.length > 0 &&
												<Box className={styles.viewerButtonContainer}>
													<button
														className={styles.extensionButton}
														title={intl.formatMessage(messages.addExtension)}
														onClick={() => setIsModalOpen(true)}>
														<img
															className={styles.extensionButtonIcon}
															draggable={false}
															src={documentIcon}
														/>
													</button>
												</Box>
											}
											<Box className={styles.extensionButtonContainer}>
												<button
													className={styles.extensionButton}
													title={intl.formatMessage(messages.addExtension)}
													onClick={onExtensionButtonClick}>
													<img
														className={styles.extensionButtonIcon}
														draggable={false}
														src={addExtensionIcon}
													/>
												</button>
											</Box>
											<Box className={styles.watermark}>
												<Watermark />
											</Box>
										</TabPanel>
										<TabPanel className={tabClassNames.tabPanel}>
											{costumesTabVisible ? <CostumeTab vm={vm} /> : null}
										</TabPanel>
										<TabPanel className={tabClassNames.tabPanel}>
											{soundsTabVisible ? <SoundTab vm={vm} /> : null}
										</TabPanel>
									</Tabs>
									{backpackVisible ? <Backpack host={backpackHost} /> : null}
								</Box>

								<Box className={classNames(styles.stageAndTargetWrapper, styles[stageSize])}>
									<StageWrapper
										isFullScreen={isFullScreen}
										isRendererSupported={isRendererSupported}
										isRtl={isRtl}
										stageSize={stageSize}
										vm={vm}
									/>
									<Box className={styles.targetWrapper}>
										<TargetPane stageSize={stageSize} vm={vm} />
									</Box>
								</Box>
							</Box>
						</Box>
						<DragLayer />
					</Box>
				);
			}}
		</MediaQuery>
	);
};

GUIComponent.propTypes = {
	accountNavOpen: PropTypes.bool,
	activeTabIndex: PropTypes.number,
	authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
	authorThumbnailUrl: PropTypes.string,
	authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // can be false
	backdropLibraryVisible: PropTypes.bool,
	backpackHost: PropTypes.string,
	backpackVisible: PropTypes.bool,
	basePath: PropTypes.string,
	blocksTabVisible: PropTypes.bool,
	canChangeLanguage: PropTypes.bool,
	canCreateCopy: PropTypes.bool,
	canCreateNew: PropTypes.bool,
	canEditTitle: PropTypes.bool,
	canManageFiles: PropTypes.bool,
	canRemix: PropTypes.bool,
	canSave: PropTypes.bool,
	canShare: PropTypes.bool,
	canUseCloud: PropTypes.bool,
	cardsVisible: PropTypes.bool,
	children: PropTypes.node,
	costumeLibraryVisible: PropTypes.bool,
	costumesTabVisible: PropTypes.bool,
	enableCommunity: PropTypes.bool,
	intl: intlShape.isRequired,
	isCreating: PropTypes.bool,
	isFullScreen: PropTypes.bool,
	isPlayerOnly: PropTypes.bool,
	isRtl: PropTypes.bool,
	isShared: PropTypes.bool,
	loading: PropTypes.bool,
	logo: PropTypes.string,
	onActivateCostumesTab: PropTypes.func,
	onActivateSoundsTab: PropTypes.func,
	onActivateTab: PropTypes.func,
	onClickAccountNav: PropTypes.func,
	onClickLogo: PropTypes.func,
	onCloseAccountNav: PropTypes.func,
	onExtensionButtonClick: PropTypes.func,
	onLogOut: PropTypes.func,
	onOpenRegistration: PropTypes.func,
	onRequestCloseBackdropLibrary: PropTypes.func,
	onRequestCloseCostumeLibrary: PropTypes.func,
	onRequestCloseTelemetryModal: PropTypes.func,
	onSeeCommunity: PropTypes.func,
	onShare: PropTypes.func,
	onShowPrivacyPolicy: PropTypes.func,
	onStartSelectingFileUpload: PropTypes.func,
	onTabSelect: PropTypes.func,
	onTelemetryModalCancel: PropTypes.func,
	onTelemetryModalOptIn: PropTypes.func,
	onTelemetryModalOptOut: PropTypes.func,
	onToggleLoginOpen: PropTypes.func,
	renderLogin: PropTypes.func,
	showComingSoon: PropTypes.bool,
	soundsTabVisible: PropTypes.bool,
	stageSizeMode: PropTypes.oneOf(Object.keys(STAGE_SIZE_MODES)),
	targetIsStage: PropTypes.bool,
	telemetryModalVisible: PropTypes.bool,
	tipsLibraryVisible: PropTypes.bool,
	vm: PropTypes.instanceOf(VM).isRequired,
};
GUIComponent.defaultProps = {
	backpackHost: null,
	backpackVisible: false,
	basePath: "./",
	canChangeLanguage: true,
	canCreateNew: false,
	canEditTitle: false,
	canManageFiles: true,
	canRemix: false,
	canSave: false,
	canCreateCopy: false,
	canShare: false,
	canUseCloud: false,
	enableCommunity: false,
	isCreating: false,
	isShared: false,
	loading: false,
	showComingSoon: false,
	stageSizeMode: STAGE_SIZE_MODES.large,
};

const mapStateToProps = (state) => ({
	// This is the button's mode, as opposed to the actual current state
	stageSizeMode: state.scratchGui.stageSize.stageSize,
});

export default injectIntl(connect(mapStateToProps)(GUIComponent));

const CardHeader = ({ title, onClose }) => (
	<div className={cardStyles.headerButtons}>
		<p className={cardStyles.helper_tour_header}>
			{title}
		</p>
		{/* <div className={cardStyles.allButton}></div> */}

		<div className={cardStyles.headerButtonsRight}>
			{/* <div className={cardStyles.shrinkExpandButton}></div> */}
			<div className={cardStyles.removeButton} onClick={onClose}>
				<img className={cardStyles.closeIcon} src={closeIcon} />
				<FormattedMessage
					defaultMessage="Close"
					description="Title for button to close how-to card"
					id="gui.cards.close"
				/>
			</div>
		</div>
	</div>
);

const NextPrevButtons = ({ onNextStep, onPrevStep }) => {
	return (
		<React.Fragment>
			{onNextStep ? (
				<div>
					<div className={cardStyles.rightCard} />
					<div className={cardStyles.rightButton} onClick={onNextStep}>
						<img draggable={false} src={rightArrow} />
					</div>
				</div>
			) : null}

			{onPrevStep ? (
				<div>
					<div className={cardStyles.leftCard} />
					<div className={cardStyles.leftButton} onClick={onPrevStep}>
						<img draggable={false} src={leftArrow} />
					</div>
				</div>
			) : null}
		</React.Fragment>
	);
};

function DocumentViewerCard({ isModalOpen = false, setIsModalOpen = () => { }, documents = [] }) {
	const [documentIndex, setDocumentIndex] = useState(0);

	const onBack = useMemo(
		() =>
			debounce(() => {
				setDocumentIndex((s) => s - 1);
			}, 250),
		[]
	);

	const onNext = useMemo(
		() =>
			debounce(() => {
				setDocumentIndex((s) => s + 1);
			}, 250),
		[]
	);

	const currentDoc = useMemo(() => {
		if (documentIndex > -1 && documentIndex < documents.length) {
			return documents[documentIndex];
		}

		return null;
	}, [documents, documentIndex]);

	const draggleRef = useRef(null);
	const [bounds, setBounds] = useState({
		left: 0,
		top: 0,
		bottom: 0,
		right: 0,
	});

	const onStart = (_event, uiData) => {
		const { clientWidth, clientHeight } = window.document.documentElement;
		const targetRect = draggleRef.current?.getBoundingClientRect();
		if (!targetRect) {
			return;
		}
		setBounds({
			left: -targetRect.left + uiData.x,
			right: clientWidth - (targetRect.right - uiData.x),
			top: -targetRect.top + uiData.y,
			bottom: clientHeight - (targetRect.bottom - uiData.y),
		});
	};

	const cardHorizontalDragOffset = 400; // ~80% of card width
    const cardVerticalDragOffset = 0; // ~80% of card height, if expanded
    const menuBarHeight = 48; // TODO: get pre-calculated from elsewhere?
    const wideCardWidth = 500;

	if (!isModalOpen || documents.length === 0 || currentDoc === null) return null;

	return (
		<div
            className={cardStyles.cardContainerOverlay}
            style={{
                // width: `${window.innerWidth + (2 * cardHorizontalDragOffset)}px`,
                // height: `${window.innerHeight - menuBarHeight + cardVerticalDragOffset}px`,
                // top: `${menuBarHeight}px`,
                // left: `${-cardHorizontalDragOffset}px`
				left: "35%",
				top: "20%"
            }}
        >
			<Draggable
				bounds={bounds}
				onStart={(event, uiData) => onStart(event, uiData)}
			>
				<div ref={draggleRef}>
					<div className={cardStyles.cardContainer}>
						<div className={cardStyles.card}>
							<CardHeader
								onClose={() => setIsModalOpen(false)}
								title={currentDoc?.title}
							/>
							<div className={cardStyles.stepBody} >
								<DocumentViewer currentDoc={currentDoc} />
							</div>
							<NextPrevButtons
								onPrevStep={documentIndex > 0 ? onBack : null}
								onNextStep={documentIndex < documents.length - 1 ? onNext : null}
							/>
						</div>
					</div>
				</div>
			</Draggable>
		</div>
	)

	return (
		<Modal
			centered
			width="40vw"
			open={isModalOpen}
			// onCancel={() => setIsModalOpen(false)}
			// destroyOnClose={true}
			footer={null}
			className="ant-modal-documents"
			bodyStyle={{
				margin: "-20px -24px",
				overflow: "hidden",
				borderRadius: 8,
				boxShadow: " 0px 0px 30px -2px rgba(0,0,0,0.49)",
				height: "400px"
			}}
			closable={false}
			mask={false}
			modal={false}
			modalRender={(modal) => (
				<Draggable
					bounds={bounds}
					onStart={(event, uiData) => onStart(event, uiData)}
				>
					<div ref={draggleRef}>{modal}</div>
				</Draggable>
			)}
		>
			<div className={cardStyles.cardModalWrapper}>
				<CardHeader
					onClose={() => setIsModalOpen(false)}
					title={currentDoc?.title}
				/>
				<div className={cardStyles.cardModalBody}>
					<DocumentViewer currentDoc={currentDoc} />
				</div>
			</div>
			<NextPrevButtons
				onPrevStep={documentIndex > 0 ? onBack : null}
				onNextStep={documentIndex < documents.length - 1 ? onNext : null}
			/>
		</Modal>
	);
}

const reactPlayerConfig = {
	youtube: {
		embedOptions: {
			host: "https://www.youtube-nocookie.com",
		},
		playerVars: {
			modestbranding: 1,
			fs: 1,
			iv_load_policy: 3,
			autohide: 0,
			autoplay: 0,
		},
	},
};

function areEqual(prevProps, nextProps) {
	if (prevProps?.currentDoc?._id === nextProps?.currentDoc?._id) {
		return true;		
	}
	return false;
}

const DocumentViewer = React.memo(({ currentDoc }) => {

	if (!currentDoc) return null;

	switch (currentDoc.fileType) {
		case "HTML":
		case "HTML Content":
			return (
				<div
					dangerouslySetInnerHTML={{ __html: currentDoc.data }}
					className={cardStyles.helper_tour_html_container}
				/>
			);
		case "image":
			return (
				<div className={cardStyles.cardImageWrapper}>
					<img className={cardStyles.cardImageWrapperImg} src={currentDoc.uri} alt="currentDoc-image" />
				</div>
			);
		case "video":
			return (
				<div className={cardStyles.cardVideoWrapper}>
					<ReactPlayer width="100%" height="100%" url={currentDoc.uri} config={reactPlayerConfig} />
				</div>
			);
		default:
			return (
				<div 
					key={currentDoc?._id}
					style={{ height: "350px" }}
				>
					<ReactDocViewer
						documents={[currentDoc]}
						pluginRenderers={DocViewerRenderers}
						config={{ header: { disableHeader: true, disableFileName: true } }}
						style={{ height: "100%" }}
					/>
				</div>
			);
	}
}, areEqual)
