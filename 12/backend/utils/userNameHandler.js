/**
 * User name handler utility function.
 * @param {string} name - user name
 * @returns {string}
 */
module.exports = (name) => {
  if (typeof name !== 'string') return '';

  // '  jIMI de HENDrix   '
  const handledUserNameArray = name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z]/g, ' ')
    .split(' ');

  // ['jimi', 'de', '', 'hendrix']

  const resultArray = [];

  for (const item of handledUserNameArray) {
    if (item) resultArray.push(item.charAt(0).toUpperCase() + item.slice(1));
  }

  return resultArray.join(' ');
};
