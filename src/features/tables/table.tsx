"use client";

import { Button } from "@/components/ui/button";
import { en } from "@/languages/en";
import React from "react";
import TableList from "./table-list";
import { useSheet } from "@/stores/useSheet";

function Table() {
  const { openSheet } = useSheet();

  const onAddTable = () => {
    openSheet({});
  };

  return (
    <div className="p-6">
      <section className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Manage Tables</h1>

        <Button onClick={onAddTable}>{en.BUTTON.ADD_TABLE}</Button>
      </section>
      <TableList />
    </div>
  );
}

export default Table;
