

function Button({ variant = "primary", onClick, disabled, children, type = "button", style }) {
  const className = {
    primary: "primary-button",
    secondary: "secondary-button",
    danger: "danger-button",
    icon: "icon-button",
  }[variant] || "primary-button";

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;
