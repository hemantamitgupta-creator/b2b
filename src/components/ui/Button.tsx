import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none text-center";

    const variantStyles = {
      primary:
        "bg-[#006061] text-white hover:bg-[#004d4e] focus:ring-[#006061] shadow-sm",
      secondary:
        "bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-700 shadow-sm",
      outline:
        "border border-[#006061] bg-white text-[#006061] hover:bg-[#006061] hover:text-white focus:ring-[#006061]",
      destructive:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
      ghost:
        "text-slate-700 hover:bg-slate-100 focus:ring-slate-400",
    };

    const sizeStyles = {
      sm: "min-h-[36px] px-3 py-1.5 text-xs gap-1.5",
      md: "min-h-[44px] px-4 py-2 text-sm gap-2",
      lg: "min-h-[48px] px-6 py-3 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
