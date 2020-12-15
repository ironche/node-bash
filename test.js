import Jasmine from 'jasmine';
import fs from 'fs-extra';

(function () {
  const jasmine = new Jasmine();

  jasmine.loadConfig({
    spec_dir: 'src',
    spec_files: ['**/*.spec.js'],
    helpers: ['../node_modules/esm'],
    stopSpecOnExpectationFailure: true,
    random: true,
  });

  jasmine.addReporter(new SpecReporter('test-output.xml'));
  jasmine.execute();
})();

function SpecReporter(file) {
  this.output = fs.createWriteStream(file, 'utf8');
  this.suites = [];
}

SpecReporter.prototype.jasmineStarted = function () {
  this.output.write(`<?xml version="1.0" encoding="UTF-8" ?>\n<testsuites>\n`);
};

SpecReporter.prototype.suiteStarted = function () {
  this.suites.push({
    specs: [],
  });
};

SpecReporter.prototype.specStarted = function () {};

SpecReporter.prototype.specDone = function (result) {
  const suite = this.suites[this.suites.length - 1];
  const spec = {
    name: result.description,
    time: result.duration,
    failures: [],
  };
  for (const i of result.failedExpectations) {
    spec.failures.push({
      message: i.message,
      stack: i.stack,
    });
  }
  suite.specs.push(spec);
};

SpecReporter.prototype.suiteDone = function (result) {
  const suite = this.suites.pop();
  let tests = suite.specs.length;
  let failures = 0;
  let out = '';

  if (tests) {
    for (const i of suite.specs) {
      out += `    <testcase name="${i.name}" time="${i.time / 1000}">`;
      if (i.failures.length) {
        // tests--;
        failures++;
        for (const e of i.failures) {
          out += `\n      <failure message="${e.message}" type="ERROR"></failure>\n    `;
        }
      }
      out += `</testcase>\n`;
    }
    out = `  <testsuite name="${result.fullName}" tests="${tests}" failures="${failures}" time="${result.duration / 1000}">\n${out}`;
    out += `  </testsuite>\n`;
    this.output.write(out);
  }
};

SpecReporter.prototype.jasmineDone = function () {
  this.output.write(`</testsuites>\n`);
  this.output.end();
};
