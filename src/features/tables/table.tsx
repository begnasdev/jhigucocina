"use client";

import { Button } from "@/components/ui/button";
import { en } from "@/languages/en";
import React from "react";
import TableList from "./table-list";
import { useSheet } from "@/stores/useSheet";
import { TableForm } from "./table-form";

function Table() {
  const { openSheet, closeSheet } = useSheet();

  const onAddTable = () => {
    openSheet({
      title: en.FORM.TABLE.ADD_TITLE,
      content: (
        <TableForm
          restaurant_id="b075da2b-d9c5-47e9-ad96-ab3f6bee3ce6"
          onSuccess={() => closeSheet()}
        />
      ),
    });
  };

  return (
    <div className="p-6">
      <section className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{en.PAGE.MANAGE_TABLES}</h1>

        <Button onClick={onAddTable}>{en.BUTTON.ADD_TABLE}</Button>
      </section>

      <TableList />
    </div>
  );
}

export default Table;
