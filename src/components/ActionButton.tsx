interface ActionButtonProps {
  onClick: () => void;
  label: string;
  variant?: "positive" | "negative" | "default";
  className?: string;
}

const buttonStyle = {
  positive: "bg-green-600 text-green-50 hover:bg-green-700",
  negative: "bg-red-600 text-red-50 hover:bg-red-700",
  default: "bg-amber-600 text-amber-50 hover:bg-amber-700",
};

const ActionButton = ({
  onClick,
  label,
  variant = "default",
  className,
}: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${buttonStyle[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default ActionButton;
