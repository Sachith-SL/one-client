import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Employee } from "../types/Employee";
import { deleteEmployee, getAllEmployees } from "../services/EmployeeService";

function EmployeeList() {
  const navigate = useNavigate();
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const data = await getAllEmployees();
        setEmployeeList(data.data);
      };
      fetchData();
    } catch (error) {}
  }, []);

    const deleteEmp = async (id: number) => {
      try {
        await deleteEmployee(id);
        alert("Employee deleted successfully");
        // Refresh the employee list after deletion
        const data = await getAllEmployees();
        setEmployeeList(data.data);
      } catch (error) {
        alert("Error deleting employee");
      }
    };

  return (
    <>
      <div>EmployeeList</div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">name</th>
            <th scope="col">Department Name</th>
            <th scope="col">Salary</th>
            <th scope="col">Details</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {employeeList.map((employee) => (
            <tr key={employee.id}>
              <th scope="row">{employee.id}</th>
              <td>{employee.name}</td>
              <td>{employee.department.name}</td>
              <td>{employee.salary}</td>
              <td><button className="btn btn-primary" onClick={() => navigate(`/employee/${employee.id}`)}>Details</button></td>
              <td><button className="btn btn-danger" onClick={() => {deleteEmp(employee.id)}}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
      <button className="btn btn-info" onClick={() => navigate("/")}>
        Home
      </button>
    </>
  );
}

export default EmployeeList;
