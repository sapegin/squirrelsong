import fs from 'node:fs';
import path from 'node:path';
import { hexToRgb } from './hexToRgb.ts';
import { stripJsonComments } from './stripJsonComments.ts';
import { createNSKeyedArchiverColor } from './terminal-app.ts';

export type TemplateContext = Record<string, string>;

/** Minimalistic check is a given string is a JSON object. */
function isJson(string: string): boolean {
  return string.startsWith('{');
}

/**
 * Process a template file with Mustache-style placeholders and write the result
 * to destination file.
 */
export function processTemplate(
  templatePath: string,
  destPath: string,
  context: TemplateContext
): void {
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
 */
export function renderTemplate(
  template: string,
  context: TemplateContext,
  templatePath: string
): string {
  // Strip JSON comments if a template is JSON
  const cleanTemplate = isJson(template)
    ? stripJsonComments(template)
    : template;

  return cleanTemplate.replaceAll(
    /\{\{([:\w]+)(?:\s*\|\s*(\w+))?\}\}/g,
    (match, key: string, func: string | undefined, offset: number) => {
      if (key in context === false) {
        // Key not found
        const lines = template.slice(0, Math.max(0, offset)).split('\n');
        const lineNumber = lines.length;
        const columnNumber = (lines.at(-1)?.length ?? 0) + 1;

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
            `${snippet}\n`
        );
      }

      const color = context[key];

      if (func) {
        switch (func) {
          case 'rgb': {
            return hexToRgb(color).join(', ');
          }
          case 'r': {
            return String(hexToRgb(color)[0] / 255);
          }
          case 'g': {
            return String(hexToRgb(color)[1] / 255);
          }
          case 'b': {
            return String(hexToRgb(color)[2] / 255);
          }
          case 'nskeyed': {
            return createNSKeyedArchiverColor(color);
          }
          default: {
            console.error(`🦀 Unknown function '${func}'`);
            return '';
          }
        }
      }

      return color;
    }
  );
}

/**
 * Apply a template from a Markdown file and update a specific code block.
 *
 * Searches for a template definition in HTML comments and applies it to a code
 * block marked with a specific apply marker.
 *
 * The file should contain:
 *
 * - A template definition: `<!-- template\n...\n-->`
 * - An apply marker: `<!-- apply:name -->`
 * - A code block immediately after the marker
 */
export function applyReadmeTemplate(
  filepath: string,
  name: string,
  context: TemplateContext
): void {
  const content = fs.readFileSync(filepath, 'utf8');

  // Read the template
  const templateMatch = content.match(/<!--\s*template\s*\n([\s\S]*?)\n-->/);
  if (!templateMatch) {
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
    markerIndex + marker.length + codeBlockStart + codeBlockContentStart
  );

  const after = content.slice(markerIndex + marker.length + codeBlockEnd);
  const newContent = before + rendered + '\n' + after;

  fs.writeFileSync(filepath, newContent);
}
