import MenuOrder from "@/features/menu-order/menu-order";

type PageProps = {
  searchParams: Promise<{ restaurantId: string; tableId: string }>;
};

async function MenuOrderPage(props: PageProps) {
  const { restaurantId, tableId } = await props.searchParams;

  return <MenuOrder restaurantId={restaurantId} />;
}

export default MenuOrderPage;
