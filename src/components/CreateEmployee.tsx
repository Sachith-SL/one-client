import { useNavigate } from "react-router-dom";
import type { Department } from "../types/Department";
import { useEffect, useState } from "react";
import type { EmployeeRequest } from "../types/EmployeeRequest";
import { getAllDepartments } from "../services/DepartmentService";
import { createEmployee } from "../services/EmployeeService";

function CreateEmployee() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);

  const [form, setForm] = useState<EmployeeRequest>({
    name: "",
    salary: 0,
    departmentId: 0,
  });

  useEffect(() => {
    // Fetch departments for the dropdown
    try {
      const fetchDepartments = async () => {
        const res = await getAllDepartments();
        setDepartments(res.data);
      };
      fetchDepartments();
    } catch (error) {}
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      await createEmployee({
        ...form,
        name: String(form.name),
        salary: Number(form.salary),
        departmentId: Number(form.departmentId),
      });
      alert("Employee created successfully");
      navigate("/");
    } catch (error) {
      alert("Failed to create employee");
    }
  };

  return (
    <>
    <div className="card">
        <div className="card-body">
      <div>Create Employee</div>

      <div className="mb-3">
        <label>Name</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={form.name}
          onChange={handleChange}
        />
      </div>

            {/* DEPARTMENT DROPDOWN */}
      <div className="mb-3">
        <label>Department</label>
        <select
          name="departmentId"
          className="form-control"
          value={form.departmentId}
          onChange={handleChange}
        >
          <option value="">-- Select Department --</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* SALARY */}
      <div className="mb-3">
        <label>Salary</label>
        <input
          type="number"
          name="salary"
          className="form-control"
          value={form.salary}
          onChange={handleChange}
        />
              {/* BUTTON */}
      <button className="btn btn-success me-2" onClick={handleSubmit}>
        Create Employee
      </button>

      <button className="btn btn-secondary" onClick={() => navigate("/")}>
        Cancel
      </button>
      </div>
      </div>
      </div>

    </>
  );
}

export default CreateEmployee;
