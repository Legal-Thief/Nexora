

function Avatar({ user, size = "md" }) {
  const sizeClass = {
    sm: "avatar avatar-sm",
    md: "avatar",
    lg: "avatar avatar-lg",
    xl: "avatar avatar-xl",
  }[size] || "avatar";

  
  const initials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  if (user?.avatar) {
    return (
      <div className={sizeClass}>
        <img src={user.avatar} alt={user.name} />
      </div>
    );
  }

  return <div className={sizeClass}>{initials}</div>;
}

export default Avatar;
