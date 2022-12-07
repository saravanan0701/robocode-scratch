import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
	return (
		<div>
			<h2>HomePage</h2>
			<hr />
			<Link to="/">Home</Link>
			<br />
			<Link to="/code">Code</Link>
			<br />
		</div>
	);
}
