import { getTablesByRestaurant } from "@/lib/supabase/api/tables";
import { getUserRestaurantContext } from "@/lib/supabase/api/user";
import TableList from "@/features/tables/table-list";

export default async function TablesPage() {
  const restaurantContext = await getUserRestaurantContext();

  if (!restaurantContext) {
    return <div>Error: Could not determine restaurant context.</div>;
  }

  const tables = await getTablesByRestaurant(restaurantContext.restaurant_id!);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Tables</h1>
      <TableList
        tables={tables}
        restaurantId={restaurantContext.restaurant_id!}
      />
    </div>
  );
}
