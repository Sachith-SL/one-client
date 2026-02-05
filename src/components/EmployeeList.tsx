import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Employee } from "../types/Employee";
import { deleteEmployee, getAllEmployees } from "../services/EmployeeService";
import { getAllDepartments } from "../services/DepartmentService";
import type { Department } from "../types/Department";
import { useAuth } from "../context/AuthContext";

function EmployeeList() {
  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const { roles } = useAuth();

  const isAdmin = roles.includes("ROLE_ADMIN");

  useEffect(() => {
    try {
      const fetchEmployeeData = async () => {
        const data = await getAllEmployees();
        setEmployeeList(data);
      };
      const fetchDepartments = async () => {
        const res = await getAllDepartments();
        setDepartments(res);
      };
      fetchDepartments();
      fetchEmployeeData();
    } catch (error) {}
  }, []);

  const departmentMap = useMemo<Record<number, string>>(() => {
    return departments.reduce(
      (acc, dep) => {
        acc[dep.id] = dep.name;
        return acc;
      },
      {} as Record<number, string>,
    );
  }, [departments]);

  const deleteEmp = async (id: number) => {
    try {
      await deleteEmployee(id);
      alert("Employee deleted successfully");
      // Refresh the employee list after deletion
      const data = await getAllEmployees();
      setEmployeeList(data);
    } catch (error) {
      alert("Error deleting employee");
    }
  };

  return (
    <>
      <h2 className="text-center">EmployeeList</h2>

      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">name</th>
            <th scope="col">Department Name</th>
            <th scope="col">Salary</th>
            {isAdmin && (
              <>
                <th scope="col">Details</th>
                <th scope="col">Delete</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {employeeList.map((employee) => (
            <tr key={employee.id}>
              <th scope="row">{employee.id}</th>
              <td>{employee.name}</td>
              <td>{departmentMap[employee.departmentId] ?? "N/A"}</td>
              <td>{employee.salary}</td>
              {isAdmin && (
                <>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => navigate(`/employee/${employee.id}`)}
                    >
                      Details
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        deleteEmp(employee.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default EmployeeList;
