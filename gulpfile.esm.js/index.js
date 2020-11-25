import gulp from 'gulp';
import { cleanTask } from './tasks/clean';
import { buildTask } from './tasks/build';

export default async function () {
  return gulp.series(cleanTask)();
}

export async function build() {
  return gulp.series(cleanTask, buildTask)();
}
