const userNameHandler = require('../userNameHandler');

// Simple test case.
const calc = (a, b) => a + b;

// Test suit:
describe('Calc test example', () => {
  // Test one
  test('test calc return sum 2+2=4', () => {
    expect(calc(2, 2)).toBe(4);
  });

  // Test two
  it('should returns 7', () => {
    // expect(calc(3, 3)).toBe(7);
    expect(calc(3, 3)).toBe(6);
  });
});

const testingData = [
  { input: 'Jimi Hendrix', output: 'Jimi Hendrix' },
  { input: 'jimi hendrix', output: 'Jimi Hendrix' },
  { input: 'jimi Hendrix', output: 'Jimi Hendrix' },
  { input: '   Jimi  hendriX ', output: 'Jimi Hendrix' },
  { input: 'Jimi_Hendrix', output: 'Jimi Hendrix' },
  { input: 'jimi.hendrix', output: 'Jimi Hendrix' },
  { input: 'jimi@hend@rix', output: 'Jimi Hend Rix' },
  { input: '_jimi * hendrix', output: 'Jimi Hendrix' },
  { input: 'jimi hèndrix__', output: 'Jimi Hendrix' },
  { input: 'jimi中村hèndrix__', output: 'Jimi Hendrix' },
  { input: 'jimi de Hèndrix__', output: 'Jimi De Hendrix' },
  { input: '中村哲二', output: '' },
  { input: undefined, output: '' },
  { input: null, output: '' },
  { input: true, output: '' },
];

describe('User names hanler test cases', () => {
  test('test all cases', () => {
    for (const item of testingData) {
      const normalizedUserName = userNameHandler(item.input);

      expect(normalizedUserName).toBe(item.output);
    }
  });

  it('should returns Jimi Hendrix', () => {
    expect(userNameHandler(testingData[0].input)).toBe(testingData[0].output);
  });
});
