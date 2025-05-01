'use client';

import * as React from "react";
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from "@/shared/utils/utils";

// First, let's install the dependencies we need
// npm install class-variance-authority clsx tailwind-merge

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-red-600 text-white hover:bg-red-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-700",
        subtle: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
        link: "bg-transparent underline-offset-4 hover:underline text-red-600 hover:text-red-700",
        primary: "bg-red-600 text-white hover:bg-red-700",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean; // Add loading prop to support loading state
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, href, leftIcon, rightIcon, loading, children, disabled, ...props }, ref) => {
    if (href && !loading && !disabled) {
      return (
        <Link
          href={href}
          className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        >
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </Link>
      );
    }
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export default Button;
