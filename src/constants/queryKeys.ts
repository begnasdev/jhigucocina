export const tableKeys = {
  all: ["tables"] as const,
  detail: (id: string) => [...tableKeys.all, id] as const,
};

export const restaurantKeys = {
  all: ["restaurants"] as const,
  detail: (id: string) => [...restaurantKeys.all, id] as const,
};
