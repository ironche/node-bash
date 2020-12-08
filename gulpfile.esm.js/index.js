import gulp from 'gulp';
import { cleanTask } from './tasks/clean';
import { buildTask, copyMetaTask } from './tasks/build';
import { changelogTask } from './tasks/changelog';

export default async function () {
  return gulp.series(cleanTask)();
}

export async function build() {
  return gulp.series(cleanTask, buildTask, copyMetaTask)();
}

export async function version() {
  return gulp.series(changelogTask, copyMetaTask)();
}
