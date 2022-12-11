import React from "react";
import { Spin } from "antd";

export default function Loader() {
	return (
		<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw" }}>
			<Spin size="large" />
		</div>
	);
}
