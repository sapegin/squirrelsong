export function stripJsonComments(json: string): string {
  return (
    json
      // Remove /* */ comments
      .replaceAll(/\/\*[\s\S]*?\*\//g, '')
      // Remove // comments (but not in URLs)
      .replaceAll(/(?<!:)\/\/.*/g, '')
  );
}
