/*
NOTE: this file only temporarily resides in scratch-gui.
Nearly identical code appears in scratch-www, and the two should
eventually be consolidated.
*/

import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import dropdownCaret from "./dropdown-caret.svg";

import styles from "./account-nav.css";
import { useSelector } from "react-redux";
import { Button, Dropdown } from "antd";
import AccountNavLogout from "./new/account-nav-logout.jsx";
import { CapitalizeWord, generateProfileInitials } from "../../../../utils/constants";

const AccountNavComponent = ({ className }) => {
	const { authData } = useSelector((state) => state.main);

	console.log(authData, "authData");

	if (!authData) return null;

	return (
		<React.Fragment>
			<div style={{ paddingRight: 6 }}>
				<Dropdown
					className="profile-dropdown"
					menu={{
						items: [
							{
								key: "1",
								label: <a>Profile</a>,
								onClick: () => {
									window.open(process.env.REACT_APP_DASHBOARD_HOST + "/profile");
								}
							},
							{
								key: "2",
								label: <AccountNavLogout />,
							},
						],
					}}
					placement="bottomRight"
					arrow={false}>
					<Button
						className={classNames(styles.userInfo, className)}
						type="ghost"
						style={{ color: "#fff", fontWeight: 600, borderRadius: 0 }}
					>
						<span className={styles.profileName}>
							Hi, {CapitalizeWord(authData?.name)}
						</span>
						<div className="avatar_container">
						{
							authData?.avatar ?
							<img
								src={authData?.avatar}
								alt="profile"
								style={{
									width: "35px",
									height: "35px",
									borderRadius: "0.42rem"
								}}
							/>
							:
							<span className="symbol symbol-35 symbol-light-robocode">
								<span className="symbol-label font-size-h5 font-weight-bold">
									<span
										// style = {{
										// 	fontWeight: 500,
										// 	fontSize: "16px"
										// }}
									>
										{generateProfileInitials(authData?.name)}
									</span>
								</span>
							</span>
						}
						</div>
						{/* <div className={styles.dropdownCaretPosition}>
							<img className={styles.dropdownCaretIcon} src={dropdownCaret} />
						</div> */}
					</Button>
				</Dropdown>
			</div>
		</React.Fragment>
	);
};

AccountNavComponent.propTypes = {
	className: PropTypes.string,
	classroomId: PropTypes.string,
	isEducator: PropTypes.bool,
	isOpen: PropTypes.bool,
	isRtl: PropTypes.bool,
	isStudent: PropTypes.bool,
	menuBarMenuClassName: PropTypes.string,
	onClick: PropTypes.func,
	onClose: PropTypes.func,
	onLogOut: PropTypes.func,
	profileUrl: PropTypes.string,
	thumbnailUrl: PropTypes.string,
	username: PropTypes.string,
};

export default AccountNavComponent;
