// eslint-disable-next-line import/prefer-default-export
export function rcss2hcss(style) {
  return Object.keys(style).reduce((prev, key) => {
    const val = style[key];
    let newKey = '';
    key.split('').forEach(k => {
      if (/[A-Z]/.test(k)) {
        newKey += `-${k.toLowerCase()}`;
      } else {
        newKey += k;
      }
    });
    return `${prev}${newKey}:${val};`;
  }, '');
}
