import React, { useState } from "react";

// ==================== CORRECT APPROACH ====================
// ✅ Define InputField component OUTSIDE parent component
// This prevents it from being recreated on every render

const InputField = ({ value, onChange, name, placeholder, type = "text" }) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
  />
);

// ==================== MAIN COMPONENT ====================
const FixedFormComponent = () => {
  // State for all form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
  });

  // ✅ CORRECT: Single handler for all inputs
  // Uses event.target.name to identify which field changed
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert(JSON.stringify(formData, null, 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Fixed Form</h2>
          <p className="text-gray-600 text-sm">
            This form won't lose focus when typing
          </p>
        </div>

        {/* First Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <InputField
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <InputField
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <InputField
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="10-digit phone number"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <InputField
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition duration-200 shadow-lg transform hover:scale-105"
        >
          Submit Form
        </button>

        {/* Display Current Values */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            Current Values:
          </p>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </form>

      {/* Explanation Box */}
      <div className="max-w-md mx-auto mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
        <h3 className="text-lg font-bold text-blue-800 mb-3">
          ✅ Why This Works:
        </h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>
            <strong>1.</strong> InputField is defined OUTSIDE the component
          </li>
          <li>
            <strong>2.</strong> Single handleChange function for all inputs
          </li>
          <li>
            <strong>3.</strong> Uses `name` attribute to identify fields
          </li>
          <li>
            <strong>4.</strong> State updated immutably with spread operator
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FixedFormComponent;
