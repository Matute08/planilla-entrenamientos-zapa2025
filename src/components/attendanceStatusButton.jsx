import React from 'react';
import { FaCheck, FaTimes, FaUserSlash, FaQuestion } from 'react-icons/fa';

const AttendanceStatusButton = ({ 
  status, 
  onStatusChange, 
  disabled = false, 
  className = "" 
}) => {
  const getStatusConfig = (currentStatus) => {
    switch (currentStatus) {
      case 'present':
        return {
          icon: <FaCheck className="text-green-600" />,
          bgColor: 'bg-green-100 hover:bg-green-200',
          borderColor: 'border-green-300',
          title: 'Asistió y entrenó',
          nextStatus: 'attended_no_trained'
        };
      case 'attended_no_trained':
        return {
          icon: <FaUserSlash className="text-orange-600" />,
          bgColor: 'bg-orange-100 hover:bg-orange-200',
          borderColor: 'border-orange-300',
          title: 'Asistió pero no entrenó',
          nextStatus: 'absent'
        };
      case 'absent':
        return {
          icon: <FaTimes className="text-red-600" />,
          bgColor: 'bg-red-100 hover:bg-red-200',
          borderColor: 'border-red-300',
          title: 'No asistió',
          nextStatus: 'present'
        };
      default:
        return {
          icon: <FaQuestion className="text-gray-600" />,
          bgColor: 'bg-gray-100 hover:bg-gray-200',
          borderColor: 'border-gray-300',
          title: 'Sin registrar',
          nextStatus: 'present'
        };
    }
  };

  const config = getStatusConfig(status);

  const handleClick = () => {
    if (!disabled) {
      onStatusChange(config.nextStatus);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      title={config.title}
      className={`
        w-8 h-8 rounded-full border-2 flex items-center justify-center
        transition-all duration-200 ease-in-out
        ${config.bgColor}
        ${config.borderColor}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      aria-label={`Cambiar estado a: ${config.title}`}
    >
      {config.icon}
    </button>
  );
};

export default AttendanceStatusButton; 