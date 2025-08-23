import MenuOrder from "@/features/menu-order/menu-order";

type PageProps = {
  searchParams: Promise<{ restaurantId: string; tableId: string }>;
};

async function MenuOrderPage(props: PageProps) {
  const { restaurantId, tableId } = await props.searchParams;

  console.log(restaurantId, tableId);

  return <MenuOrder restaurantId={restaurantId} />;
}

export default MenuOrderPage;
