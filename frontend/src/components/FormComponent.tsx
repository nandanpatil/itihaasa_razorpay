import React, { useState } from 'react';
import './FormComponent.css'; // Import the CSS file

// Define the prop types for the FormComponent
interface FormComponentProps {
  onSubmit: (formData: { name: string; phone: string; email: string; number: number }) => void;
}

const FormComponent: React.FC<FormComponentProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    number: '' as string | number, // Allow the initial value to be a string for the input field
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 1 && value <= 20) {
      setFormData({ ...formData, number: value });
    } else {
      setFormData({ ...formData, number: '' }); // Reset the number if out of range
    }
  };
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedFormData = {
      ...formData,
      number: Number(formData.number), // Ensure the number is of type 'number'
    };
    onSubmit(parsedFormData); // Pass parsed data to onSubmit
  };

  return (
    <div className="form-container">
      <h2>Form Component</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone"
            pattern="[0-9]{10}"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Number (1 to 20):</label>
          <input
            type="number"
            name="number"
            value={formData.number}
            onChange={handleNumberChange}
            min="1"
            max="20"
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FormComponent;
