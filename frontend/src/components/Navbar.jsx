import React from "react";

export default function Navbar({ setAuth }) {
    const logout = () => {
        localStorage.removeItem("token");
        setAuth(false);
    };

    return (
        <nav className="bg-blue-600 p-4 text-white flex justify-between">
            <h1 className="font-bold text-lg">Employee Attendance</h1>

        </nav>
    );
}
