const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const metadata = JSON.parse(
  fs.readFileSync(path.join(root, "composer.json"), "utf8"),
);
const phpSource = fs.readFileSync(path.join(root, "ai_assistant.php"), "utf8");
const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
const license = fs.readFileSync(path.join(root, "LICENSE"), "utf8");
const repository =
  "https://github.com/Code-Omega-Solutions/roundcube-ai-assistant";

test("package preserves Roundcube plugin identity and autoloading", () => {
  assert.equal(metadata.name, "code-omega-solutions/ai_assistant");
  assert.equal(metadata.type, "roundcube-plugin");
  assert.deepEqual(metadata.autoload.classmap, ["ai_assistant.php"]);
  assert.equal(metadata.require["roundcube/plugin-installer"], "~0.3.5");
  assert.equal(metadata.require.php, ">=7.4");
  assert.equal(metadata.require["ext-curl"], "*");
  assert.equal(metadata.require["ext-json"], "*");
});

test("semantic version is consistent across package, plugin, and README", () => {
  assert.match(metadata.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
  assert.equal(phpSource.match(/@version\s+(\S+)/)?.[1], metadata.version);
  assert.ok(readme.includes(`Plugin version: **${metadata.version}**`));
});

test("source and issue references point to the plugin repository", () => {
  assert.equal(metadata.homepage, repository);
  assert.equal(metadata.support.source, repository);
  assert.equal(metadata.support.issues, `${repository}/issues`);
  assert.ok(phpSource.includes(`@link ${repository}`));
  assert.ok(readme.includes(repository));
});

test("MIT licensing metadata and terms are consistent", () => {
  assert.equal(metadata.license, "MIT");
  assert.match(phpSource, /@license MIT See LICENSE/);
  assert.match(readme, /\*\*MIT License\*\*/);
  assert.match(license, /^MIT License/);
  assert.match(license, /Copyright \(c\) 2026 Roundcube AI Assistant contributors/);
  assert.match(license, /Permission is hereby granted, free of charge/);
  assert.match(license, /this permission notice shall be included/);
  assert.match(license, /THE SOFTWARE IS PROVIDED "AS IS"/);
  assert.match(readme, /Third-party materials retain their own licenses/);
});
