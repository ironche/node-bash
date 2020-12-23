import fs from 'fs';
import { grep } from './grep';

describe('grep', () => {
  const files = [
    { path: './style1.css', info: { isFile: () => true } },
    { path: './style2.css', info: { isFile: () => true } },
    { path: './style3.css', info: { isFile: () => true } },
  ];

  beforeEach(() => {
    spyOn(fs, 'readFileSync')
      .withArgs('./style1.css', 'utf8')
      .and.returnValue(`.a { background-color: #fff; }`)
      .withArgs('./style2.css', 'utf8')
      .and.returnValue(`.b { color: #fff; }`)
      .withArgs('./style3.css', 'utf8')
      .and.returnValue(`.c { color: #000; }`);
  });

  it('should return empty array if arguments are not set', () => {
    const result = grep();

    expect(result).toEqual([]);
  });

  it('should return empty array if files are not supplied', () => {
    const result = grep(/color/);

    expect(result).toEqual([]);
  });

  it('should return empty array if patterns are not supplied', () => {
    const result = grep(null, files);

    expect(result.length).toBe(0);
  });

  it('should return empty array if zero files contain wanted string', () => {
    const result = grep(/#aaa/, files);

    expect(result.length).toBe(0);
  });

  it('should return files that contain wanted string', () => {
    const result = grep(/#fff/, files);

    expect(result.length).toBe(2);
  });

  it('should return files that contain wanted strings', () => {
    const result = grep([/\.[bc]/, /#000/], files);

    expect(result.length).toBe(2);
  });
});
