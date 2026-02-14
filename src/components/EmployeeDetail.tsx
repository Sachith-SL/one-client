import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getEmployeeByIdApi,
  updateEmployeeApi,
} from "../services/EmployeeService";
import type { Employee } from "../types/Employee";
import type { Department } from "../types/Department";
import { getAllDepartmentsApi } from "../services/DepartmentService";

function EmployeeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    // Fetch employee details using the id
    try {
      const fetchDepartments = async () => {
        const res = await getAllDepartmentsApi();
        setDepartments(res);
      };

      const fetchEmployee = async () => {
        const data = await getEmployeeByIdApi(id as any);
        setEmployee(data);
      };

      fetchDepartments();
      fetchEmployee();
    } catch (error) {}
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (!employee) return;

    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!employee) return;

    try {
      await updateEmployeeApi(employee.id, employee);
      setReadOnly(true);
      alert("Employee updated successfully");
    } catch (error) {
      alert("Error updating employee");
    }
  };

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h2 className="text-center">Employee Detail ID: {id}</h2>

          <div className="mb-2 row">
            <label htmlFor="staticName" className="col-sm-2 col-form-label">
              Name
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                name="name"
                readOnly={readOnly}
                className="form-control"
                id="staticName"
                value={employee?.name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-2 row">
            <label className="col-sm-2 col-form-label">Department</label>
            <div className="col-sm-10">
              <select
                className="form-control"
                name="departmentId"
                disabled={readOnly}
                value={employee?.departmentId}
                onChange={handleChange}
              >
                <option value="">-- Select Department --</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-2 row">
            <label htmlFor="staticSalary" className="col-sm-2 col-form-label">
              Salary
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                name="salary"
                readOnly={readOnly}
                className="form-control"
                id="staticSalary"
                value={employee?.salary}
                onChange={handleChange}
              />
            </div>
          </div>
          <br></br>

          {readOnly ? (
            <button
              className="btn btn-sm btn-outline-warning me-2"
              onClick={() => setReadOnly(false)}
            >
              Edit
            </button>
          ) : (
            <button
              className="btn btn-sm btn-outline-success me-2"
              onClick={handleSave}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default EmployeeDetail;
