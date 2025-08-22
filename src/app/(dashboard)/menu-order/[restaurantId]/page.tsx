import MenuOrder from "@/features/menu-order/menu-order";

type MenuOrderPageProps = {
  params: {
    restaurantId: string;
  };
  searchParams: {
    table?: string;
  };
};

const MenuOrderPage = ({ params, searchParams }: MenuOrderPageProps) => {
  const { restaurantId } = params;

  return <MenuOrder restaurantId={restaurantId} />;
};

export default MenuOrderPage;
