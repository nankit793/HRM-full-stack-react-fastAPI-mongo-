import { useEffect, useState } from "react";
import {
    TrashIcon,
    PlusIcon,
    ExclamationTriangleIcon,
    CalendarDaysIcon,
} from "@heroicons/react/24/outline";

const EMPLOYEE_API =
    "https://hrm-full-stack-react-fastapi-mongo.onrender.com/employees";
const ATTENDANCE_API =
    "https://hrm-full-stack-react-fastapi-mongo.onrender.com/attendance";

export default function EmployeeTable() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* -------------------- ADD EMPLOYEE -------------------- */
    const [showAddModal, setShowAddModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formData, setFormData] = useState({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
    });

    /* -------------------- DELETE EMPLOYEE -------------------- */
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [deleting, setDeleting] = useState(false);


    /* -------------------- ATTENDANCE -------------------- */
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
            if (!res.ok) throw new Error("Failed to fetch employees");
            const data = await res.json();
            setEmployees(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    /* -------------------- CREATE -------------------- */
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

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "Failed to create employee");
            }

            setEmployees((prev) => [...prev, formData]);
            setShowAddModal(false);
            setFormData({
                employee_id: "",
                full_name: "",
                email: "",
                department: "",
            });
        } catch (err) {
            setFormError(err.message);
        } finally {
            setCreating(false);
        }
    };

    /* -------------------- DELETE -------------------- */
    const confirmDelete = async () => {
        try {
            setDeleting(true);
            const res = await fetch(
                `${EMPLOYEE_API}/${selectedEmployee.employee_id}`,
                { method: "DELETE" }
            );

            if (!res.ok) throw new Error("Delete failed");

            setEmployees((prev) =>
                prev.filter(
                    (emp) => emp.employee_id !== selectedEmployee.employee_id
                )
            );
            setShowDeleteModal(false);
        } catch (err) {
            alert(err.message);
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

    /* -------------------- UI STATES -------------------- */
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-4 space-y-4">
            {/* Add Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    <PlusIcon className="h-5 w-5" />
                    Add Employee
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg shadow bg-white">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left">Employee ID</th>
                            <th className="px-6 py-3 text-left">Name</th>
                            <th className="px-6 py-3 text-left">Email</th>
                            <th className="px-6 py-3 text-left">Department</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {employees?.length === 0 && "No empployees record found"}
                        {employees.map((emp) => (
                            <tr key={emp.employee_id} className="group hover:bg-gray-50">
                                <td className="px-6 py-4">{emp.employee_id}</td>
                                <td className="px-6 py-4">{emp.full_name}</td>
                                <td className="px-6 py-4">{emp.email}</td>
                                <td className="px-6 py-4">{emp.department}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition">
                                        <button
                                            onClick={() => openAttendanceModal(emp)}
                                            className="text-green-600 hover:text-green-800"
                                            title="Mark Attendance"
                                        >
                                            <CalendarDaysIcon className="h-5 w-5" />
                                        </button>

                                        <button
                                            onClick={() => {
                                                setSelectedEmployee(emp);
                                                setShowDeleteModal(true);
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                            title="Delete"
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

            {/* -------------------- ADD MODAL -------------------- */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <form
                        onSubmit={handleCreateEmployee}
                        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4"
                    >
                        <h2 className="text-lg font-semibold">Add Employee</h2>

                        {formError && (
                            <div className="text-red-600 text-sm">{formError}</div>
                        )}

                        {["employee_id", "full_name", "email", "department"].map(
                            (field) => (
                                <input
                                    key={field}
                                    required
                                    placeholder={field.replace("_", " ").toUpperCase()}
                                    value={formData[field]}
                                    onChange={(e) =>
                                        setFormData({ ...formData, [field]: e.target.value })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                />
                            )
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={creating}
                                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                            >
                                {creating ? "Creating..." : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

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
                                    {attendanceList?.length === 0 && "No attendance record found"}
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

            {/* -------------------- DELETE MODAL -------------------- */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center gap-2 mb-4">
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
                            <h2 className="font-semibold">Delete Employee</h2>
                        </div>

                        <p className="mb-6">
                            Delete{" "}
                            <span className="font-semibold">
                                {selectedEmployee?.full_name}
                            </span>
                            ?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
