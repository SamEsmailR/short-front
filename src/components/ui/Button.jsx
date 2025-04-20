// src/components/ui/Button.jsx
const Button = ({ 
    children, 
    type = 'button', 
    variant = 'primary', 
    className = '', 
    onClick,
    disabled = false 
  }) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    
    return (
      <button
        type={type}
        className={`${baseClass} ${variantClass} ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  };
  
  export default Button;