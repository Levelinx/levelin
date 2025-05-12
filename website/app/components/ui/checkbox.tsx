import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  disabled?: boolean;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked, disabled, ...props }, ref) => (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        checked && "bg-primary text-primary-foreground",
        className
      )}
      {...props}
    >
      {checked && (
        <span className={cn("flex items-center justify-center text-current")}>
          <Check className="h-4 w-4" />
        </span>
      )}
    </button>
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
