import TableList from "@/features/tables/table-list";

export default async function TablesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Tables</h1>
      <TableList />
    </div>
  );
}
