export const getRequestParam = (
  params: Record<string, string | string[]>,
  paramName: string
): string => {
  const value = params[paramName];

  return Array.isArray(value) ? value[0] : value;
};
