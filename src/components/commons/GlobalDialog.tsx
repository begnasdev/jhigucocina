"use client";

import { useDialog } from "@/stores/useDialog";
import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

export const GlobalDialog = () => {
  const { isOpen, title, description, content, closeDialog, footer } =
    useDialog();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      closeDialog();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={closeDialog}>
      <AlertDialogContent className="" onKeyDown={handleKeyDown} tabIndex={-1}>
        <AlertDialogHeader>
          {title && <AlertDialogTitle className="">{title}</AlertDialogTitle>}
          {description && (
            <AlertDialogDescription className="">
              {description}
            </AlertDialogDescription>
          )}
          {content}
        </AlertDialogHeader>
        <AlertDialogFooter>{footer}</AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
