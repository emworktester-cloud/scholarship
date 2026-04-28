"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-auto items-center justify-start gap-2 rounded-none p-0 bg-transparent border-b border-gray-200",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200",
        // Default state
        "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80",
        // Active state - gradient background with border
        "data-[state=active]:text-blue-700 data-[state=active]:bg-gradient-to-b data-[state=active]:from-blue-50 data-[state=active]:to-white",
        // Border bottom indicator for active
        "border-b-2 border-transparent data-[state=active]:border-blue-600",
        // Hover shadow
        "hover:shadow-sm",
        // Focus state
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-t-lg",
        // Disabled state
        "disabled:pointer-events-none disabled:opacity-50",
        // Icon size
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none mt-4", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };