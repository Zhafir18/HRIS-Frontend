export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
}) {
  const base = "px-4 py-2 rounded-lg text-white transition flex items-center justify-center gap-2 font-medium";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 shadow-sm",
    success: "bg-green-600 hover:bg-green-700 shadow-sm",
    danger: "bg-red-600 hover:bg-red-700 shadow-sm",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${base} ${variants[variant]} ${
        isDisabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      )}
      {children}
    </button>
  );
}
