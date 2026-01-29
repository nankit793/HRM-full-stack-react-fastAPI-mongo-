import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import EmployeeList from "./components/EmployeeList";
// import EmployeeForm from "./components/EmployeeForm";

export default function App({ setAuth }) {
  const [employees, setEmployees] = useState([]);

  return (
    <div>
      <Navbar setAuth={setAuth} />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">Employees</h2>
        {/* <EmployeeForm setEmployees={setEmployees} /> */}
        <EmployeeList />
      </div>
    </div>
  );
}
