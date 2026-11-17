import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { validatePack } from "../scripts/validate-skills.mjs";

function fixture(t, overrides = {}) {
  const root = mkdtempSync(join(tmpdir(), "skill pack fixture "));
  t.after(() => {
    assert.equal(dirname(root), resolve(tmpdir()));
    rmSync(root, { recursive: true, force: true });
  });
  const files = {
    "README.md": "# Pack\n[Catalog](skills/README.md)\n",
    "skills/README.md": "# Catalog\n| [alpha](alpha/SKILL.md) | Example |\n",
    "skills/alpha/SKILL.md":
      "---\nname: alpha\ndescription: Use when testing a skill pack.\n---\n# Alpha\n\nCheck inputs.\n",
    ...overrides,
  };
  for (const [relative, content] of Object.entries(files)) {
    const file = join(root, relative);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
  return root;
}

test("accepts a valid pack and folded YAML with CRLF line endings", (t) => {
  const root = fixture(t, {
    "skills/alpha/SKILL.md":
      "---\r\nname: alpha\r\ndescription: >\r\n  Use when testing\r\n  a skill pack.\r\n---\r\n# Alpha\r\n\r\nCheck inputs.\r\n",
  });
  const result = validatePack(root);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(
    result.skills.map((skill) => skill.name),
    ["alpha"],
  );
});

test("reports malformed YAML and non-string descriptions", (t) => {
  for (const header of ["name: [", "name: alpha\ndescription: true"]) {
    const root = fixture(t, {
      "skills/alpha/SKILL.md": `---\n${header}\n---\n# Alpha\n`,
    });
    assert.ok(validatePack(root).errors.length > 0);
  }
});

test("rejects duplicate names and directory/name mismatches", (t) => {
  const root = fixture(t, {
    "skills/beta/SKILL.md":
      "---\nname: alpha\ndescription: Another skill.\n---\n# Beta\n",
  });
  const errors = validatePack(root).errors.join("\n");
  assert.match(errors, /duplicate.*alpha/i);
  assert.match(errors, /directory/i);
});

test("rejects missing frontmatter, empty bodies, and oversized descriptions", (t) => {
  for (const content of [
    "# No metadata",
    "---\nname: alpha\ndescription: Example\n---\n",
    `---\nname: alpha\ndescription: ${"x".repeat(1025)}\n---\n# Alpha`,
  ]) {
    const root = fixture(t, { "skills/alpha/SKILL.md": content });
    assert.ok(validatePack(root).errors.length > 0);
  }
});

test("checks nested references and skill-contained file paths", (t) => {
  const root = fixture(t, {
    "skills/alpha/SKILL.md":
      "---\nname: alpha\ndescription: Example\n---\n# Alpha\n[Details](references/details.md)\n",
    "skills/alpha/references/details.md": "# Details\n[Missing](missing.md)\n",
  });
  assert.match(validatePack(root).errors.join("\n"), /missing\.md/i);
  writeFileSync(
    join(root, "skills/alpha/references/details.md"),
    "# Details\n[Outside](../../../README.md)\n",
  );
  assert.match(validatePack(root).errors.join("\n"), /outside.*skill/i);
});

test("checks bare Markdown file references and catalog completeness", (t) => {
  const root = fixture(t, {
    "skills/README.md": "# Catalog\n",
    "skills/alpha/SKILL.md":
      "---\nname: alpha\ndescription: Example\n---\n# Alpha\nRead `missing.md`.\n",
  });
  const errors = validatePack(root).errors.join("\n");
  assert.match(errors, /missing\.md/);
  assert.match(errors, /catalog.*alpha/i);
});

test("checks titled inline links including paths with spaces", (t) => {
  const root = fixture(t, {
    "skills/alpha/SKILL.md": '---\nname: alpha\ndescription: Example\n---\n# Alpha\n[Missing](<missing file.md> "Details")\n[Outside](../../README.md \'Details\')\n',
  });
  const errors = validatePack(root).errors.join("\n");
  assert.match(errors, /missing file\.md/);
  assert.match(errors, /outside.*skill/i);
});

test("rejects extra mislabeled catalog entries even when correct rows exist", (t) => {
  const root = fixture(t, {
    "skills/README.md": "# Catalog\n| [alpha](alpha/SKILL.md) | Example |\n| [beta](beta/SKILL.md) | Example |\n| [alpha](beta/SKILL.md) | Wrong |\n",
    "skills/beta/SKILL.md": "---\nname: beta\ndescription: Another skill.\n---\n# Beta\n",
  });
  assert.ok(validatePack(root).errors.length > 0);
});

test("reports missing companion skills documented in catalog", (t) => {
  const root = fixture(t, {
    "skills/README.md":
      "# Catalog\n| [alpha](alpha/SKILL.md) | Example |\n\n## Companion skills\n| `alpha` | `missing-companion` |\n",
  });
  assert.match(
    validatePack(root).errors.join("\n"),
    /companion.*missing-companion/i,
  );
});

test("rejects absolute local references without fetching external links", (t) => {
  const root = fixture(t, {
    "skills/alpha/SKILL.md":
      "---\nname: alpha\ndescription: Example\n---\n# Alpha\n[External](https://example.invalid/guide.md)\n[Local](C:/private/guide.md)\n",
  });
  const errors = validatePack(root).errors;
  assert.equal(errors.length, 1);
  assert.match(errors[0], /absolute reference/);
});

test("fails on an empty skill directory", (t) => {
  const root = fixture(t);
  rmSync(join(root, "skills/alpha/SKILL.md"));
  assert.match(validatePack(root).errors.join("\n"), /SKILL\.md/);
});

test("CLI supports JSON output, help, and rejects unknown options", () => {
  const cli = fileURLToPath(
    new URL("../scripts/validate-skills.mjs", import.meta.url),
  );
  const json = spawnSync(process.execPath, [cli, "--json"], {
    encoding: "utf8",
  });
  assert.equal(json.status, 0, json.stderr + json.stdout);
  assert.equal(JSON.parse(json.stdout).errors.length, 0);
  const help = spawnSync(process.execPath, [cli, "--help"], {
    encoding: "utf8",
  });
  assert.equal(help.status, 0);
  assert.match(help.stdout, /Usage:/);
  const invalid = spawnSync(process.execPath, [cli, "--fix"], {
    encoding: "utf8",
  });
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stderr, /Unknown option/);
});
