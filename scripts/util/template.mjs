import fs from 'node:fs';

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
  fs.writeFileSync(destPath, result);
}

/**
 * Render a template string with Mustache-style placeholders.
 *
 * @param {string} template - Template string
 * @param {Object} context - Object with key-value pairs for substitution
 * @param {string} templatePath - Path to template file (for error messages)
 * @returns {string} Rendered template
 */
export function renderTemplate(template, context, templatePath) {
  return template.replaceAll(/\{\{(\w+)\}\}/g, (match, key, offset) => {
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

    return context[key];
  });
}
