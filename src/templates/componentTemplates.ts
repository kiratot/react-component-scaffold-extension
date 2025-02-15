import { ScaffoldConfig } from "../types/config";
import {
  getReactFunctionalTemplate,
  getReactClassTemplate,
} from "./reactTemplates";
import {
  getReactNativeFunctionalTemplate,
  getReactNativeClassTemplate,
} from "./reactNativeTemplates";
import { getTypesTemplate } from "./typeTemplates";

export {
  getComponentTemplate,
  getStyleTemplate,
  getIndexTemplate,
  getTypesTemplate,
};

function getComponentTemplate(
  pascalCaseName: string,
  styleFileName: string,
  config: ScaffoldConfig
): string {
  if (config.projectType === "React Native") {
    return config.defaultComponentType === "Functional"
      ? getReactNativeFunctionalTemplate(pascalCaseName, config)
      : getReactNativeClassTemplate(pascalCaseName, config);
  } else {
    return config.defaultComponentType === "Functional"
      ? getReactFunctionalTemplate(pascalCaseName, styleFileName, config)
      : getReactClassTemplate(pascalCaseName, styleFileName, config);
  }
}

function getStyleTemplate(config: ScaffoldConfig): string {
  if (config.projectType === "React Native") {
    return "";
  }
  return `.container {
}`;
}

function getIndexTemplate(pascalCaseName: string): string {
  return `export { default } from './${pascalCaseName}';`;
}
