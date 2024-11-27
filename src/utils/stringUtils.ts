export function convertToPascalCase(componentName: string): string {
  return componentName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}
