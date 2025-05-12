"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {children}
    </div>
  )
);
Accordion.displayName = "Accordion";

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-b", className)}
      data-value={value}
      {...props}
    >
      {children}
    </div>
  )
);
AccordionItem.displayName = "AccordionItem";

interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => (
  <div className="flex">
    <button
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </button>
  </div>
));
AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </div>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
