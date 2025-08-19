import { create } from "zustand";
import type React from "react";

type SheetStore = {
  title?: string;
  description?: string;
  isOpen: boolean;
  content: React.ReactNode | null;
  openSheet: (options: {
    content: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
  }) => void;
  closeSheet: () => void;
  className?: string;
};

export const useSheet = create<SheetStore>((set) => ({
  title: undefined,
  description: undefined,
  className: undefined,
  isOpen: false,
  content: null,
  openSheet: ({ content, className, title, description }) =>
    set({ isOpen: true, content, className, title, description }),
  closeSheet: () => set({ isOpen: false, content: null }),
}));
