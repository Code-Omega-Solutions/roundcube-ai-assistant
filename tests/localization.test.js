const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const localizationDirectory = path.join(root, "localization");
const localeNames = fs
  .readdirSync(localizationDirectory)
  .filter((name) => name.endsWith(".inc"))
  .map((name) => path.basename(name, ".inc"));
const jsPath = path.join(root, "ai_assistant.js");
const jsSource = fs.readFileSync(jsPath, "utf8");
const phpSource = fs.readFileSync(path.join(root, "ai_assistant.php"), "utf8");

function readCatalog(locale) {
  const contents = fs.readFileSync(
    path.join(root, "localization", `${locale}.inc`),
    "utf8",
  );
  const labels = new Map();
  const entryPattern = /'((?:\\'|[^'])*)'\s*=>\s*'((?:\\'|[^'])*)'/g;

  for (const match of contents.matchAll(entryPattern)) {
    labels.set(
      match[1].replace(/\\'/g, "'").replace(/\\\\/g, "\\"),
      match[2].replace(/\\'/g, "'").replace(/\\\\/g, "\\"),
    );
  }

  return labels;
}

function readFallbackMap() {
  const match = jsSource.match(
    /var englishFallback = (\{[\s\S]*?\n  \});/,
  );
  assert.ok(match, "JavaScript must define an English fallback map");
  return new Map(
    Object.entries(vm.runInNewContext(`(${match[1]})`)),
  );
}

function createTextHelpers(translations) {
  const instrumented = jsSource.replace(
    /\n\}\)\(\);\s*$/,
    "\n  window.__localizedText = localizedText;\n" +
      "  window.__resultErrorText = resultErrorText;\n" +
      "  window.__promptForInstructions = promptForInstructions;\n})();",
  );
  assert.notEqual(instrumented, jsSource, "JavaScript IIFE must be found");

  const window = {
    rcmail: {
      gettext(key) {
        return Object.hasOwn(translations, key) ? translations[key] : key;
      },
      addEventListener() {},
    },
  };
  vm.runInNewContext(instrumented, { window });

  return {
    localizedText: window.__localizedText,
    resultErrorText: window.__resultErrorText,
    promptForInstructions: window.__promptForInstructions,
  };
}

test("maintained locale catalogs contain identical, non-empty keys", () => {
  assert.ok(localeNames.includes("en_US"), "English source catalog must exist");
  const english = readCatalog("en_US");
  assert.ok(english.size > 0, "English source catalog must not be empty");

  for (const locale of localeNames.filter((name) => name !== "en_US")) {
    const catalog = readCatalog(locale);
    assert.deepEqual(
      [...catalog.keys()].sort(),
      [...english.keys()].sort(),
      `${locale}.inc must contain exactly the English source keys`,
    );

    for (const [key, value] of catalog) {
      assert.notEqual(value.trim(), "", `${locale}.${key} must not be empty`);
    }
  }
});

test("English JavaScript fallback matches the English source catalog", () => {
  const english = readCatalog("en_US");
  const fallback = readFallbackMap();

  assert.deepEqual(
    [...fallback.entries()].sort(),
    [...english.entries()].sort(),
    "JavaScript fallback entries must match localization/en_US.inc",
  );
});

test("all catalog strings are requested through the localization helper", () => {
  const keys = new Set(
    [...jsSource.matchAll(/localizedText\(["']([^"']+)["']\)/g)].map(
      (match) => match[1],
    ),
  );
  const errorMap = jsSource.match(/var errorLabels = \{([\s\S]*?)\n  \};/);
  assert.ok(errorMap, "JavaScript must define an AJAX error map");
  const errorKeys = new Set(
    [...errorMap[1].matchAll(/:\s*"([a-z0-9_]+)"/g)].map(
      (match) => match[1],
    ),
  );
  const english = readCatalog("en_US");

  for (const key of english.keys()) {
    const usedByToolbar = key === "ai_draft_button" &&
      /'label'\s*=>\s*'ai_draft_button'/.test(phpSource);
    assert.ok(
      keys.has(key) || errorKeys.has(key) || usedByToolbar,
      `${key} must be used by the assistant UI`,
    );
  }
});

test("Roundcube translations override English and missing values fall back", () => {
  const english = readCatalog("en_US");
  const german = readCatalog("de_DE");
  const { localizedText } = createTextHelpers({
    ai_draft_button: german.get("ai_draft_button"),
    ai_assistant_heading: "",
  });

  assert.equal(localizedText("ai_draft_button"), german.get("ai_draft_button"));
  assert.equal(
    localizedText("ai_assistant_heading"),
    english.get("ai_assistant_heading"),
    "empty translations must use English",
  );
  assert.equal(
    localizedText("close"),
    english.get("close"),
    "missing translations must use English",
  );
});

test("unknown AJAX errors use the generic localized request failure", () => {
  const english = readCatalog("en_US");
  const { resultErrorText } = createTextHelpers({});

  assert.equal(
    resultErrorText("unexpected_error"),
    english.get("error_request_failed"),
  );

  const german = readCatalog("de_DE");
  const localizedErrors = createTextHelpers({
    error_too_long: german.get("error_too_long"),
  });
  assert.equal(
    localizedErrors.resultErrorText("too_long"),
    german.get("error_too_long"),
  );
});

test("localized instruction hint does not change the default model prompt", () => {
  const english = readCatalog("en_US");
  const { promptForInstructions } = createTextHelpers({});

  assert.equal(
    promptForInstructions(""),
    english.get("default_instructions"),
    "an untouched field must send the canonical English default",
  );
  assert.equal(
    promptForInstructions("  Write a short reply.  "),
    "Write a short reply.",
    "user-entered instructions must be trimmed and preserved",
  );
  assert.match(
    jsSource,
    /instructions\.placeholder\s*=\s*localizedText\("default_instructions"\)/,
  );
});

test("PHP returns only error identifiers handled by the browser", () => {
  const serverErrors = [
    ...phpSource.matchAll(/\['error'\s*=>\s*'([^']+)'\]/g),
  ].map((match) => match[1]);
  const clientErrors = [...jsSource.matchAll(/^\s{4}([a-z_]+): "error_[a-z_]+",$/gm)]
    .map((match) => match[1]);

  assert.deepEqual(
    [...new Set(serverErrors)].sort(),
    [...new Set(clientErrors)].sort(),
    "server and client AJAX error identifiers must match",
  );
});
