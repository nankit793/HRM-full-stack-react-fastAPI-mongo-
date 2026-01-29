import { useEffect, useState } from "react";
import {
    TrashIcon,
    PlusIcon,
    ExclamationTriangleIcon,
    CalendarDaysIcon,
    EyeIcon,
} from "@heroicons/react/24/outline";

const EMPLOYEE_API =
    "https://hrm-full-stack-react-fastapi-mongo.onrender.com/employees";
const ATTENDANCE_API =
    "https://hrm-full-stack-react-fastapi-mongo.onrender.com/attendance";

export default function EmployeeTable() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* ---------------- ADD EMPLOYEE ---------------- */
    const [showAddModal, setShowAddModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
    });

    /* ---------------- DELETE ---------------- */
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [deleting, setDeleting] = useState(false);

    /* ---------------- ATTENDANCE ---------------- */
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);
    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const [attendanceError, setAttendanceError] = useState(null);
    const [attendanceData, setAttendanceData] = useState({
        employee_id: "",
        date: "",
        status: "present",
    });

    const [attendanceList, setAttendanceList] = useState([]);
    const [attendanceTableLoading, setAttendanceTableLoading] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await fetch(EMPLOYEE_API);
            const data = await res.json();
            setEmployees(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- CREATE ---------------- */
    const handleCreateEmployee = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            setCreating(true);
            const res = await fetch(EMPLOYEE_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Create failed");
            const newEmp = await res.json();
            setEmployees((p) => [...p, newEmp]);
            setShowAddModal(false);
        } catch (err) {
            setFormError(err.message);
        } finally {
            setCreating(false);
        }
    };

    /* ---------------- DELETE ---------------- */
    const confirmDelete = async () => {
        try {
            setDeleting(true);
            await fetch(
                `${EMPLOYEE_API}/${selectedEmployee.employee_id}`,
                { method: "DELETE" }
            );
            setEmployees((p) =>
                p.filter(
                    (e) => e.employee_id !== selectedEmployee.employee_id
                )
            );
            setShowDeleteModal(false);
        } finally {
            setDeleting(false);
        }
    };

    /* ---------------- ATTENDANCE ---------------- */
    const openAttendanceModal = async (emp) => {
        setAttendanceError(null);
        setAttendanceData({
            employee_id: emp.employee_id,
            date: "",
            status: "present",
        });
        setShowAttendanceModal(true);
        fetchAttendance(emp.employee_id);
    };

    const fetchAttendance = async (employeeId) => {
        try {
            setAttendanceTableLoading(true);
            const res = await fetch(`${ATTENDANCE_API}/${employeeId}`);
            const data = await res.json();
            setAttendanceList(data);
        } finally {
            setAttendanceTableLoading(false);
        }
    };

    const submitAttendance = async (e) => {
        e.preventDefault();
        try {
            setAttendanceLoading(true);
            await fetch(ATTENDANCE_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(attendanceData),
            });
            await fetchAttendance(attendanceData.employee_id);
            setAttendanceData({ ...attendanceData, date: "" });
        } catch (err) {
            setAttendanceError(err.message);
        } finally {
            setAttendanceLoading(false);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center h-64 items-center">
                <div className="h-8 w-8 animate-spin border-4 border-gray-300 border-t-blue-600 rounded-full" />
            </div>
        );

    return (
        <div className="p-4 space-y-4">
            {/* Add Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" /> Add Employee
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow rounded">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left">ID</th>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Email</th>
                            <th className="px-6 py-3 text-left">Department</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {employees.map((emp) => (
                            <tr key={emp.employee_id} className="group hover:bg-gray-50">
                                <td className="px-6 py-4">{emp.employee_id}</td>
                                <td className="px-6 py-4">{emp.full_name}</td>
                                <td className="px-6 py-4">{emp.email}</td>
                                <td className="px-6 py-4">{emp.department}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100">
                                        <button
                                            onClick={() => openAttendanceModal(emp)}
                                            className="text-blue-600"
                                            title="View Attendance"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => openAttendanceModal(emp)}
                                            className="text-green-600"
                                            title="Mark Attendance"
                                        >
                                            <CalendarDaysIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedEmployee(emp);
                                                setShowDeleteModal(true);
                                            }}
                                            className="text-red-600"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ---------------- ATTENDANCE MODAL ---------------- */}
            {showAttendanceModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl space-y-4">
                        <h2 className="font-semibold text-lg">
                            Attendance – {attendanceData.employee_id}
                        </h2>

                        {/* Mark Attendance */}
                        <form onSubmit={submitAttendance} className="flex gap-3">
                            <input
                                type="date"
                                required
                                value={attendanceData.date}
                                onChange={(e) =>
                                    setAttendanceData({
                                        ...attendanceData,
                                        date: e.target.value,
                                    })
                                }
                                className="border px-3 py-2 rounded"
                            />
                            <select
                                value={attendanceData.status}
                                onChange={(e) =>
                                    setAttendanceData({
                                        ...attendanceData,
                                        status: e.target.value,
                                    })
                                }
                                className="border px-3 py-2 rounded"
                            >
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                            </select>
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                {attendanceLoading ? "Saving..." : "Mark"}
                            </button>
                        </form>

                        {/* Attendance Table */}
                        {attendanceTableLoading ? (
                            <p>Loading attendance...</p>
                        ) : (
                            <table className="w-full border mt-4">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-4 py-2">Date</th>
                                        <th className="border px-4 py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceList.map((a, i) => (
                                        <tr key={i}>
                                            <td className="border px-4 py-2">
                                                {new Date(a.date).toDateString()}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {a.status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        <div className="text-right">
                            <button
                                onClick={() => setShowAttendanceModal(false)}
                                className="mt-4 px-4 py-2 border rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE MODAL stays SAME */}
        </div>
    );
}
