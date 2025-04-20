// src/components/ui/ProgressBar.jsx
const ProgressBar = ({ percentage, className = '' }) => {
  return (
    <div className="w-full bg-dark-100 rounded-full h-2">
      <div 
        className={`h-2 rounded-full ${className || 'bg-primary-600'}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;