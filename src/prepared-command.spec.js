import { PreparedCommand } from './prepared-command';

describe('PreparedCommand', () => {
  let cmd;

  beforeEach(() => {
    cmd = new PreparedCommand();
  });

  it('should create', () => {
    expect(cmd).toBeDefined();
  });

  it('should append pipe', () => {
    cmd.pipe();

    expect(cmd.toString()).toBe('|');
  });

  it('should append xargs', () => {
    cmd.xargs();

    expect(cmd.toString()).toBe('xargs');
  });

  it('should append grep', () => {
    const pattern = '\\-?\\d*\\.?\\d+rem';
    cmd.grep(pattern);

    expect(cmd.toString()).toBe(`grep -lE "${pattern}"`);
  });

  describe('find()', () => {
    let args;

    beforeEach(() => {
      args = ['src', 'f', '*.scss', ['.git', 'node_modules']];
    });

    it('should append find', () => {
      cmd.find(...args);

      expect(cmd.toString()).toBe('find src -path ".git" -prune -o -path "node_modules" -prune -o -type f -name "*.scss" -print');
    });

    it('should use default value if startPath is missing', () => {
      args[0] = null;
      cmd.find(...args);

      expect(cmd.toString()).toBe('find . -path ".git" -prune -o -path "node_modules" -prune -o -type f -name "*.scss" -print');
    });

    it('should use default value if descriptor is missing or invalid', () => {
      const res = 'find src -path ".git" -prune -o -path "node_modules" -prune -o -type f -name "*.scss" -print';

      args[1] = null;
      cmd.begin().find(...args);

      expect(cmd.toString()).toBe(res);

      args[1] = 'abc';
      cmd.begin().find(...args);

      expect(cmd.toString()).toBe(res);
    });

    it('should allow only f and d as descriptor values', () => {
      args = [null, 'd'];
      cmd.begin().find(...args);

      expect(cmd.toString()).toBe('find . -type d -name "*" -print');

      args = [null, 'f'];
      cmd.begin().find(...args);

      expect(cmd.toString()).toBe('find . -type f -name "*" -print');
    });

    it('should use default value if pattern is missing', () => {
      args[2] = null;
      cmd.find(...args);

      expect(cmd.toString()).toBe('find src -path ".git" -prune -o -path "node_modules" -prune -o -type f -name "*" -print');
    });

    it('should omit folders if ignoredFolders is missing', () => {
      args[3] = null;
      cmd.find(...args);

      expect(cmd.toString()).toBe('find src -type f -name "*.scss" -print');
    });

    it('should accept pattern array', () => {
      args[2] = ['readme.md', '*.json'];
      args[3] = null;
      cmd.find(...args);

      expect(cmd.toString()).toBe('find src -type f "(" -name "readme.md" -o -name "*.json" ")" -print');
    });
  });

  it('should append sed', () => {
    cmd.sed('main.scss', ' 1rem', ' 16px');

    expect(cmd.toString()).toBe('sed -i \'\' -e "s/ 1rem/ 16px/g" main.scss');
  });

  it('should chain commands', () => {
    cmd.find('.', 'f', '*.scss').pipe().xargs().grep('padding');

    expect(cmd.toString()).toBe('find . -type f -name "*.scss" -print | xargs grep -lE "padding"');
  });

  it('should reset command if begin is used', () => {
    cmd.find('.', 'f', '*.scss').begin();

    expect(cmd.toString()).toBe('');
  });
});
