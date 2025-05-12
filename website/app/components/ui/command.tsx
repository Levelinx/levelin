import * as React from "react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/app/components/ui/dialog"; // Fixed import path

// Define the exact props interface that CommandPrimitive expects
interface CommandProps {
  // CMDK specific props
  label?: string;
  shouldFilter?: boolean;
  filter?: (value: string, search: string) => number;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  loop?: boolean;
  disablePointerSelection?: boolean;
  vimBindings?: boolean;
  // Plus common HTML div props
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive
      ref={ref}
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
        className
      )}
      {...props}
    />
  )
);
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

// Define the exact props that CommandPrimitive.Input expects
interface CommandInputProps {
  // Input-specific props
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  // Plus common HTML input props
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  [key: string]: any;
}

const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, ...props }, ref) => (
    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  )
);
CommandInput.displayName = CommandPrimitive.Input.displayName;

// Define the exact props that CommandPrimitive.List expects
interface CommandListProps {
  // List-specific props
  // Plus common HTML div props
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.List
      ref={ref}
      className={cn(
        "max-h-[300px] overflow-y-auto overflow-x-hidden",
        className
      )}
      {...props}
    />
  )
);
CommandList.displayName = CommandPrimitive.List.displayName;

// Define the exact props that CommandPrimitive.Empty expects
interface CommandEmptyProps {
  // Empty-specific props
  // Plus common HTML div props
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Empty
      ref={ref}
      className={cn("py-6 text-center text-sm", className)}
      {...props}
    />
  )
);
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

// Define the exact props that CommandPrimitive.Group expects
interface CommandGroupProps {
  // Group-specific props
  heading?: React.ReactNode;
  value?: string;
  filter?: (value: string, search: string) => number;
  // Plus common HTML div props
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Group
      ref={ref}
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
CommandGroup.displayName = CommandPrimitive.Group.displayName;

// Define the exact props that CommandPrimitive.Separator expects
interface CommandSeparatorProps {
  // Separator-specific props
  // Plus common HTML div props
  className?: string;
  [key: string]: any;
}

const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  CommandSeparatorProps
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

// Define the exact props that CommandPrimitive.Item expects
interface CommandItemProps {
  // Item-specific props
  disabled?: boolean;
  onSelect?: (value: string) => void;
  value?: string;
  // Plus common HTML div props
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, ...props }, ref) => (
    <CommandPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
        className
      )}
      {...props}
    />
  )
);
CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
