import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function HomePage() {
    const stt = useSelector(state => state.main);
    
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
