import fs from 'node:fs';
import path from 'node:path';
import { hexToRgb } from './hexToRgb.mjs';

/**
 * Process a template file with Mustache-style placeholders and write the result
 * to destination file.
 *
 * @param {string} templatePath - Path to the template file
 * @param {string} destPath - Path to the destination file
 * @param {Object} context - Object with key-value pairs for substitution
 */
export function processTemplate(templatePath, destPath, context) {
  const template = fs.readFileSync(templatePath, 'utf8');
  const result = renderTemplate(template, context, templatePath);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, result);
}

/**
 * Render a template string with Mustache-style placeholders.
 *
 * Supports basic transformation functions:
 * - rgb: returns color as RGB instead of HEX (`{{icon | rgb}}`)
 *
 * @param {string} template - Template string
 * @param {Object} context - Object with key-value pairs for substitution
 * @param {string} templatePath - Path to template file (for error messages)
 * @returns {string} Rendered template
 */
export function renderTemplate(template, context, templatePath) {
  return template.replaceAll(
    /\{\{([:\w]+)(?:\s*\|\s*(\w+))?\}\}/g,
    (match, key, func, offset) => {
      if (key in context === false) {
        // Key not found
        const lines = template.slice(0, Math.max(0, offset)).split('\n');
        const lineNumber = lines.length;
        const columnNumber = lines.at(-1).length + 1;

        // Get surrounding context (3 lines before and after)
        const allLines = template.split('\n');
        const startLine = Math.max(0, lineNumber - 4);
        const endLine = Math.min(allLines.length, lineNumber + 2);
        const snippet = allLines
          .slice(startLine, endLine)
          .map((line, i) => {
            const actualLineNum = startLine + i + 1;
            const marker = actualLineNum === lineNumber ? '> ' : '  ';
            const lineText = `${marker}${actualLineNum.toString().padStart(4, ' ')} | ${line}`;
            // Add error pointer on the next line for the error line
            if (actualLineNum === lineNumber) {
              // 2 (marker) + 4 (line num) + 3 (" | ")
              const padding = ' '.repeat(9 + columnNumber);
              return `${lineText}\n${padding}^`;
            }

            return lineText;
          })
          .join('\n');

        throw new Error(
          `Template error in ${templatePath}:${lineNumber}:${columnNumber}\n` +
            `Missing key '${key}'\n\n` +
            `${snippet}\n`,
        );
      }

      const color = context[key];

      if (func) {
        if (func === 'rgb') {
          return hexToRgb(color).join(', ');
        } else {
          console.error(`🦀 Unknown function '${func}'`);
          return '';
        }
      }

      return color;
    },
  );
}

/**
 * Apply a template from a Markdown file and update a specific code block.
 *
 * Searches for a template definition in HTML comments and applies it to a code
 * block marked with a specific apply marker.
 *
 * The file should contain:
 * - A template definition: `<!-- template\n...\n-->`
 * - An apply marker: `<!-- apply:name -->`
 * - A code block immediately after the marker
 *
 * @param {string} filepath - Path to the markdown file to process
 * @param {string} name - Name of the apply marker to find (used in <!-- apply:name -->)
 * @param {Object} context - Object with key-value pairs for template substitution
 */
export function applyReadmeTemplate(filepath, name, context) {
  const content = fs.readFileSync(filepath, 'utf8');

  // Read the template
  const templateMatch = content.match(/<!--\s*template\s*\n([\s\S]*?)\n-->/);
  if (templateMatch === false) {
    throw new Error(`No template comment found in ${filepath}`);
  }
  const template = templateMatch[1].trim();

  // Find the apply marker
  const marker = `<!-- apply:${name} -->`;
  const markerIndex = content.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(`Marker "${marker}" not found in ${filepath}`);
  }

  // Find the code block after the marker
  const afterMarker = content.slice(markerIndex + marker.length);
  const codeBlockStart = afterMarker.search(/```(\w+)?/);
  if (codeBlockStart === -1) {
    throw new Error(`No code block found after "${marker}" in ${filepath}`);
  }

  // Find the end of the code block (skip opening ```, find closing ```)
  const codeBlockContentStart = afterMarker.indexOf('\n', codeBlockStart) - 1;
  const codeBlockEnd = afterMarker.indexOf('```', codeBlockContentStart);
  if (codeBlockEnd === -1) {
    throw new Error(`Unclosed code block after "${marker}" in ${filepath}`);
  }

  const rendered = renderTemplate(template, context, filepath);

  // Reconstruct the file with the new content
  const before = content.slice(
    0,
    markerIndex + marker.length + codeBlockStart + codeBlockContentStart,
  );

  const after = content.slice(markerIndex + marker.length + codeBlockEnd);
  const newContent = before + rendered + '\n' + after;

  fs.writeFileSync(filepath, newContent);
}
