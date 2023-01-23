import React from "react";
import Styles from "./module.css";

const NotFound = () => {
	return (
		<div 
			className={Styles.notfound_container} 
		>
			<div>
				<h1 
					className={Styles.notfound_text1}
				>
					404
				</h1>
				<p 
					className={Styles.notfound_text2}
				>
					OOPS! Something went wrong here
				</p>
			</div>
		</div>
	);
};

export default NotFound;