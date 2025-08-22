import MenuOrder from "@/features/menu-order/menu-order";

type PageProps = { params: Promise<{ restaurantId: string }> };

async function MenuOrderPage(props: PageProps) {
  const { restaurantId } = await props.params;

  return <MenuOrder restaurantId={restaurantId} />;
}

export default MenuOrderPage;
