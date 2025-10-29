export function stripJsonComments(json) {
  return (
    json
      // Remove /* */ comments
      .replaceAll(/\/\*[\s\S]*?\*\//g, '')
      // Remove // comments (but not in URLs)
      .replaceAll(/(?<!:)\/\/.*/g, '')
  );
}
