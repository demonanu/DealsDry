import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("http://localhost:5004/api/employees");
      setEmployees(response.data);
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5004/api/employees/${id}`);
    setEmployees(employees.filter((employee) => employee._id !== id));
  };

  const handleEdit = (id) => {
    navigate(`/edit-employee/${id}`);
  };

  return (
    <div>
      <h2>Employee List</h2>
      <table>
        <thead>
          <tr>
            <th>Unique Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile No</th>
            <th>Designation</th>
            <th>Gender</th>
            <th>Course</th>
            <th>Image</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee._id}>
              <td>{index + 1}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.mobile}</td>
              <td>{employee.designation}</td>
              <td>{employee.gender}</td>
              <td>{employee.courses.join(", ")}</td>
              <td>
                <img
                  src={`http://localhost:5004/uploads/${employee.image}`}
                  alt={employee.name}
                  width="50"
                />
              </td>
              <td>
                {employee.createdAt
                  ? format(new Date(employee.createdAt), "dd/MM/yyyy")
                  : "N/A"}
              </td>{" "}
              {/* Ensure correct date format */}
              <td>
                <button onClick={() => handleEdit(employee._id)}>Edit</button>
                <button onClick={() => handleDelete(employee._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
