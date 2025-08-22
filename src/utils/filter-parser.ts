import { URLSearchParams } from "url";

// Define the types of parsing we support
type ParserType = "string" | "number" | "boolean";

// The config object will map keys of our filter object to a parser type
export type FilterConfig<T> = {
  [K in keyof T]?: ParserType;
};

/**
 * Parses filters from URLSearchParams based on a provided configuration.
 * @param searchParams The URLSearchParams object from the request.
 * @param config A configuration object mapping filter keys to their expected type.
 * @returns A type-safe, partially constructed filter object.
 */
export function parseFilters<T extends Record<string, any>>(
  searchParams: URLSearchParams,
  config: FilterConfig<T>
): Partial<T> {
  const filters: Partial<T> = {};

  for (const key in config) {
    if (searchParams.has(key)) {
      const rawValue = searchParams.get(key)!;
      const parserType = config[key as keyof T];
      let parsedValue: any;

      switch (parserType) {
        case "number":
          parsedValue = Number(rawValue);
          // Only add the filter if it's a valid number
          if (!isNaN(parsedValue)) {
            filters[key as keyof T] = parsedValue;
          }
          break;
        case "boolean":
          filters[key as keyof T] = (rawValue === "true") as any;
          break;
        case "string":
        default:
          filters[key as keyof T] = rawValue as any;
          break;
      }
    }
  }

  return filters;
}
