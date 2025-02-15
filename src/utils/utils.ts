export function detach_property<T, K extends keyof T>(array: T[], key: K) {
  if (!array.length) return { total: 0, results: [] };
  const seperated_values = array.map((item) => {
    const { [key]: detachedValue, ...rest } = item;
    return rest;
  });

  const detached_val = array[0][key];

  return { total: detached_val, results: seperated_values };
}
