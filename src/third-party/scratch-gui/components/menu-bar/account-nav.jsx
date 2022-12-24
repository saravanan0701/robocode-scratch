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

const AccountNavComponent = ({ className }) => {
	const { authData } = useSelector((state) => state.main);

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
						style={{ color: "#fff", fontWeight: 600, borderRadius: 0 }}>
						<span className={styles.profileName}>Hi, {authData.name}</span>
						<div className={styles.dropdownCaretPosition}>
							<img className={styles.dropdownCaretIcon} src={dropdownCaret} />
						</div>
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
