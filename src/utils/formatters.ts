export const formatObjectToCamelCase = (obj: any) => {
  const newObj: any = {};

  Object.keys(obj).forEach((originalKey) => {
    let key = originalKey;

    // Convert all-uppercase words to lowercase (except when it’s a single or two-letter key like 'DV')
    if (key.length > 2 && key === key.toUpperCase()) {
      key = key.toLowerCase();
    }

    // Replace spaces with underscores to unify handling
    key = key.replace(/\s+/g, "_");

    // Replace underscores and handle camelCase formatting
    let newKey = key
      .trim()
      .toLowerCase()
      .replace(/_([a-z0-9])/g, (g) => g[1].toUpperCase());

    // Ensure the first character is lowercase
    newKey = newKey.charAt(0).toLowerCase() + newKey.slice(1);

    // Assign the value, trimming strings if necessary
    const value = obj[originalKey];
    newObj[newKey] = typeof value === "string" ? value.trim() : value;
  });

  return newObj;
};

export const convertEmptyStringsToNull = (obj: any) => {
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    newObj[key] = value === "" ? null : value;
  });
  return newObj;
};
