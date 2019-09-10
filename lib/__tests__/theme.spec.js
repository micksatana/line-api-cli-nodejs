import theme from '../theme';

test('theme', () => {
  expect(theme).toEqual({
    silly: 'rainbow',
    input: 'grey',
    prompt: 'grey',
    data: 'grey',
    verbose: 'white',
    info: 'white',
    code: 'cyan',
    help: 'green',
    warn: 'yellow',
    error: 'red'
  });
});
