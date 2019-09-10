import theme from '../theme';

test('theme', () => {
  expect(theme).toEqual({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'white',
    help: 'cyan',
    warn: 'yellow',
    code: 'blue',
    error: 'red'
  });
});
