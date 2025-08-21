"use client";

import React from "react";
import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetClose,
} from "../ui/sheet";
import { cn } from "@/lib/utils";
import { useSheet } from "@/stores/useSheet";

export const GlobalSheet = () => {
  const {
    isOpen,
    content,
    className,
    title,
    description,
    closeSheet: close,
  } = useSheet();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      close();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={close}>
      <SheetContent
        autoFocus={false}
        onKeyDown={handleKeyDown}
        className={cn("min-w-max flex flex-col h-full shadow-lg")}
      >
        <section className="px-4 pt-4">
          <div className="flex items-center justify-between">
            {title && <SheetTitle className="">{title}</SheetTitle>}
            <SheetClose onClick={close}>
              <X className="w-5 h-5 cursor-pointer" />
            </SheetClose>
          </div>

          {description && (
            <SheetDescription className="mt-1">{description}</SheetDescription>
          )}
        </section>

        <div className={cn("overflow-y-auto flex-1 p-4", className)}>
          {content}
        </div>
      </SheetContent>
    </Sheet>
  );
};
