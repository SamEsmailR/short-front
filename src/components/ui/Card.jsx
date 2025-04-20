// src/components/ui/Card.jsx
const Card = ({ children, className = '', title }) => {
    return (
      <div className={`card ${className}`}>
        {title && <h3 className="mb-4">{title}</h3>}
        {children}
      </div>
    );
  };
  
  export default Card;