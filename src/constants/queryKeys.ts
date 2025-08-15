export const tableKeys = {
  all: ["tables"] as const,
  detail: (id: string) => [...tableKeys.all, id] as const,
};
