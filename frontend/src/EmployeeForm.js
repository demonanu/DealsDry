import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EmployeeForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    courses: [],
    image: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const { courses } = formData;

    if (checked) {
      setFormData({
        ...formData,
        courses: [...courses, value],
      });
    } else {
      setFormData({
        ...formData,
        courses: courses.filter((course) => course !== value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("mobile", formData.mobile);
    data.append("designation", formData.designation);
    data.append("gender", formData.gender);
    data.append("courses", formData.courses.join(","));
    data.append("image", formData.image);

    await axios.post("http://localhost:5004/api/employees", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    navigate("/employee-list");
  };

  return (
    <div>
      <h2>Employee Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mobile No</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Designation</label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
          >
            <option value="">Select Designation</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div>
          <label>Gender</label>
          <input
            type="radio"
            name="gender"
            value="M"
            checked={formData.gender === "M"}
            onChange={handleChange}
            required
          />{" "}
          Male
          <input
            type="radio"
            name="gender"
            value="F"
            checked={formData.gender === "F"}
            onChange={handleChange}
            required
          />{" "}
          Female
        </div>
        <div>
          <label>Course</label>
          <input
            type="checkbox"
            name="courses"
            value="MCA"
            checked={formData.courses.includes("MCA")}
            onChange={handleCheckboxChange}
          />{" "}
          MCA
          <input
            type="checkbox"
            name="courses"
            value="BCA"
            checked={formData.courses.includes("BCA")}
            onChange={handleCheckboxChange}
          />{" "}
          BCA
          <input
            type="checkbox"
            name="courses"
            value="BSC"
            checked={formData.courses.includes("BSC")}
            onChange={handleCheckboxChange}
          />{" "}
          BSC
        </div>
        <div>
          <label>Img Upload</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default EmployeeForm;
