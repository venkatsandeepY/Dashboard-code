import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from 'react-feather';

const CustomDatePicker = ({ 
  selected, 
  onChange, 
  placeholder = "MM-DD-YYYY",
  error = false,
  disabled = false,
  className = "",
  ...props 
}) => {
  // Convert string to Date object if needed
  const selectedDate = selected ? (typeof selected === 'string' ? new Date(selected) : selected) : null;

  const handleChange = (date) => {
    if (onChange) {
      // Convert Date object to YYYY-MM-DD string format for consistency
      const dateString = date ? date.toISOString().split('T')[0] : '';
      onChange(dateString);
    }
  };

  return (
    <div className="relative">
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="MM-dd-yyyy"
        placeholderText={placeholder}
        isClearable
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10 ${
          error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
        {...props}
      />
      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
};

export default CustomDatePicker;