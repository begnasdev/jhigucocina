import { create } from "zustand";
import type React from "react";

export interface DialogStore {
  isOpen: boolean;
  title?: string;
  description?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  openDialog: (options: {
    title?: string;
    description?: string;
    content?: React.ReactNode;
    footer?: React.ReactNode;
  }) => void;
  closeDialog: () => void;
}

export const useDialog = create<DialogStore>((set) => ({
  isOpen: false,
  title: undefined,
  description: undefined,
  content: undefined,
  footer: undefined,
  openDialog: ({ title, description, content, footer }) =>
    set({
      isOpen: true,
      title,
      description,
      content,
      footer,
    }),
  closeDialog: () =>
    set({
      isOpen: false,
      title: undefined,
      description: undefined,
      content: undefined,
      footer: undefined,
    }),
}));
