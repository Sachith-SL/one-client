import { useEffect, useState } from "react";
import { assignRole, getAllUsers } from "../../services/AdminService";

type User = {
  id: number;
  username: string;
  roles: string[];
};

const AdminUsersPage = () => {
const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getAllUsers().then(setUsers);
  }, []);

  const handleRoleChange = async (userId: number, role: string) => {
    await assignRole(userId, role);
    alert("Role updated");
  };
  return (
        <div>
      <h2>User Management</h2>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Username</th>
            <th>Roles</th>
            <th>Assign Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.roles.join(", ")}</td>
              <td>
                <select className="btn btn-sm btn-outline"
                  onChange={(e) =>
                    handleRoleChange(user.id, e.target.value)
                  }
                  defaultValue=""
                >
                  <option className="dropdown-item" value="" disabled>Select</option>
                  <option className="dropdown-item" value="USER">USER</option>
                  <option className="dropdown-item" value="ADMIN">ADMIN</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminUsersPage