import { ScaffoldConfig } from "../types/config";

export function getTypesTemplate(
  pascalCaseName: string,
  config: ScaffoldConfig
): string {
  return `export type ${pascalCaseName}Props = {
};
${
  config.defaultComponentType === "Class"
    ? `\nexport type ${pascalCaseName}State = {
};`
    : ""
}`;
}
