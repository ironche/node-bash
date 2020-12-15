import fs from 'fs';
import { find } from './find';

describe('find', () => {
  beforeEach(() => {
    spyOn(fs, 'readdirSync')
      .withArgs('.', 'utf8')
      .and.returnValue(['src', '.eslintignore', '.eslintrc.json', '.gitignore', 'package.json'])
      .withArgs('./src', 'utf8')
      .and.returnValue(['assets', 'index.css', 'index.html', 'index.js', 'test.js'])
      .withArgs('./src/assets', 'utf8')
      .and.returnValue(['assets.css', 'background1.jpg', 'background2.jpg', 'user1.svg', 'user2.svg']);

    spyOn(fs, 'statSync').and.callFake((path) => ({
      isDirectory: () => /(src|assets)$/.test(path),
    }));
  });

  describe('in current folder', () => {
    it('should find all files and folders', () => {
      const result = find();

      expect(result.length).not.toBe(15);
    });

    it('should find all files', () => {
      const result = find(null, 'f');

      expect(result.length).toBe(13);
    });

    it('should find all folders', () => {
      const result = find(null, 'd');

      expect(result.length).toBe(2);
    });
  });

  describe('in specified folder', () => {
    it('should find all files and folders from given folder', () => {
      const result = find('./src');

      expect(result.length).toBe(10);
    });

    it('should find all files from given folder', () => {
      const result = find('./src', 'f');

      expect(result.length).toBe(9);
    });

    it('should find all folders from given folder', () => {
      const result = find('./src', 'd');

      expect(result.length).toBe(1);
    });
  });

  describe('respecting name patterns', () => {
    it('should find all files and folders having name pattern', () => {
      const result = find(null, null, /assets/);

      expect(result.length).toBe(2);
    });

    it('should find all files having name pattern', () => {
      const result = find(null, 'f', /assets/);

      expect(result.length).toBe(1);
    });

    it('should find all folders having name pattern', () => {
      const result = find(null, 'd', /assets/);

      expect(result.length).toBe(1);
    });

    it('should find all files having certain extensions', () => {
      const result = find(null, 'f', /\.(css|js)$/);

      expect(result.length).toBe(4);
    });

    it('should find all files from given folder having certain extensions', () => {
      const result = find('./src/assets', 'f', /\.(css|js)$/);

      expect(result.length).toBe(1);
    });
  });

  describe('respecting exclude folders', () => {
    it('should find all files and folders except in excluded folders', () => {
      const result = find('.', '*', null, /assets/);

      expect(result.length).toBe(9);
    });

    it('should find all files having certain extensions except in excluded folders', () => {
      const result = find('.', 'f', [/\.css$/, /\.js$/], /assets/);

      expect(result.length).toBe(3);
    });
  });

  describe('respecting traverse depth', () => {
    it('should find all files and folders on a root level only', () => {
      const result = find(null, null, null, null, 0);

      expect(result.length).toBe(5);
    });

    it('should find all files and folders down to one level', () => {
      const result = find(null, null, null, null, 1);

      expect(result.length).toBe(10);
    });

    it('should find all files and folders with unlimited depth', () => {
      const result = find();

      expect(result.length).toBe(15);
    });
  });

  describe('combining multiple calls', () => {
    it('should append results', () => {
      const result1 = find('./src', '*', null, /assets/);
      const result2 = find('./src', '*', null, /assets/, null, [...result1]);

      expect(result2.length).toBe(result1.length * 2);
    });
  });
});
