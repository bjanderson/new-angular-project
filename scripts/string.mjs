/**
 * Get a string. Eliminate null and invalid types.
 */
export function getString(value, defaultValue = '') {
  let str = value || defaultValue;

  if (typeof value !== 'string') {
    str = defaultValue;
  }

  if (str != null) {
    str = str.toString();
  }

  return str;
}

/**
 * Convert value string to all lowercase.
 */
export function lowerize(value) {
  return getString(value).toLocaleLowerCase();
}

/**
 * Convert the value to all uppercase.
 */
export function upperize(value) {
  return getString(value).toLocaleUpperCase();
}

/**
 * Convert the first character of the value to lowercase.
 */
export function lowercaseFirst(value) {
  const str = getString(value);
  return `${lowerize(str.charAt(0))}${str.slice(1)}`;
}

/**
 * Convert the first character of the value to uppercase.
 */
export function uppercaseFirst(value) {
  const str = getString(value);
  return `${upperize(str.charAt(0))}${str.slice(1)}`;
}

/**
 * Convert a kabob-case or PascalCase string to camelCase.
 */
export function camelFromKabobOrPascal(value) {
  const str = lowercaseFirst(value);
  const parts = str.split('-');
  let camel = parts.shift();
  parts.forEach((part) => {
    camel += uppercaseFirst(part);
  });
  return camel;
}

/**
 * Convert a kabob-case or camelCase string to PascalCase.
 */
export function pascalFromKabobOrCamel(value) {
  const str = camelFromKabobOrPascal(value);
  return uppercaseFirst(str);
}

/**
 * Convert a kabob-case string to capitalized SNAKE_CASE.
 */
export function snakeFromKabob(value) {
  const str = getString(value).replace(/-/g, '_');
  return upperize(str);
}

/**
 * Convert a kabob-case string to Title Case.
 */
export function titleFromKabob(value) {
  const str = getString(value);
  const parts = str.split('-');
  let title = uppercaseFirst(parts.shift());
  parts.forEach((part) => {
    title += ` ${uppercaseFirst(part)}`;
  });
  return title;
}
