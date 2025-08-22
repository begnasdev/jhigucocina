export const tableKeys = {
  all: ["tables"] as const,
  detail: (id: string) => [...tableKeys.all, id] as const,
};

export const restaurantKeys = {
  all: ["restaurants"] as const,
  detail: (id: string) => [...restaurantKeys.all, id] as const,
};

export const menuItemKeys = {
  all: ["menuItems"] as const,
  list: (filters: object) => [...menuItemKeys.all, { filters }] as const,
  detail: (id: string) => [...menuItemKeys.all, id] as const,
};

export const orderKeys = {
  all: ["orders"] as const,
  detail: (id: string) => [...orderKeys.all, id] as const,
};
