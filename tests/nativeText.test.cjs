const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const parser = require('@babel/parser');
const types = require('@babel/types');

test('native containers and fragments have no raw JSX text children', () => {
  const errors = [];
  const nameOf = name => name?.type === 'JSXMemberExpression' ? `${nameOf(name.object)}.${nameOf(name.property)}` : name?.name;
  function inspect(node, file) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
      const name = nameOf(node.openingElement?.name) || 'Fragment';
      // Expo Link renders text by default; native Text is the other valid host.
      if (!['Text', 'Animated.Text', 'Link'].includes(name)) {
        for (const child of types.react.buildChildren(node)) {
          if (child.type === 'StringLiteral' && child.value) errors.push(`${file}:${node.loc.start.line} <${name}> contains ${JSON.stringify(child.value)}`);
        }
      }
    }
    for (const [key, value] of Object.entries(node)) {
      if (['loc', 'start', 'end'].includes(key)) continue;
      if (Array.isArray(value)) value.forEach(child => inspect(child, file));
      else if (value && typeof value === 'object') inspect(value, file);
    }
  }
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (file.endsWith('.js')) inspect(parser.parse(fs.readFileSync(file, 'utf8'), { sourceType: 'module', plugins: ['jsx'] }), file);
    }
  }
  visit('app'); visit('components');
  assert.deepEqual(errors, [], 'Text (including inline spaces) must be inside <Text>.');
});
