import { src, dest } from 'gulp';
import uglify from 'gulp-uglify';
import babel from 'gulp-babel';
import config from '../config';

export function buildTask() {
  return src([`${config.srcPath}/**/*.js`, `!${config.srcPath}/**/*.spec.js`])
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(uglify())
    .pipe(dest(config.distPath));
}

export function copyMetaTask() {
  return src([`package.json`, `*.md`]).pipe(dest(config.distPath));
}
