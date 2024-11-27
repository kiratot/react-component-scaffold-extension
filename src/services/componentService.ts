import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { ComponentType, ScaffoldConfig } from "../types/config";
import { convertToPascalCase } from "../utils/stringUtils";
import {
  getComponentTemplate,
  getStyleTemplate,
  getIndexTemplate,
} from "../templates/componentTemplates";

export class ComponentService {
  constructor() {}

  async createComponent(
    config: ScaffoldConfig,
    targetUri?: vscode.Uri
  ): Promise<void> {
    const baseDir = this.getTargetDirectory(targetUri);

    if (!baseDir) {
      throw new Error("Please open a workspace first");
    }

    const componentName = await this.promptForComponentName();
    if (!componentName) {
      return;
    }

    const componentType = await this.determineComponentType(config);
    const pascalCaseName = convertToPascalCase(componentName);
    const componentDir = this.createComponentDirectory(baseDir, componentName);

    await this.createComponentFiles(componentDir, pascalCaseName, {
      ...config,
      defaultComponentType: componentType,
    });

    vscode.window.showInformationMessage(
      `Component ${pascalCaseName} created successfully!`
    );
  }

  private getTargetDirectory(uri?: vscode.Uri): string | undefined {
    if (!uri) {
      return this.getWorkspaceFolder()?.uri.fsPath;
    }

    const stat = fs.statSync(uri.fsPath);
    if (stat.isDirectory()) {
      return uri.fsPath;
    }

    return path.dirname(uri.fsPath);
  }

  private getWorkspaceFolder(): vscode.WorkspaceFolder | undefined {
    return vscode.workspace.workspaceFolders?.[0];
  }

  private async promptForComponentName(): Promise<string | undefined> {
    return vscode.window.showInputBox({
      prompt: "Enter component name (kebab-case)",
      validateInput: (value: string) => {
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
          return "Please use kebab-case (e.g., my-component)";
        }
        return null;
      },
    });
  }

  private createComponentDirectory(
    baseDir: string,
    componentName: string
  ): string {
    const componentDir = path.join(baseDir, componentName);
    fs.mkdirSync(componentDir, { recursive: true });
    return componentDir;
  }

  private async createComponentFiles(
    componentDir: string,
    pascalCaseName: string,
    config: ScaffoldConfig
  ): Promise<void> {
    const componentExt = config.useTypeScript ? "tsx" : "js";
    const indexExt = config.useTypeScript ? "ts" : "js";
    const styleFileName =
      config.projectType === "React" ? `.module.${config.styleExtension}` : "";

    const files = new Map<string, string>();

    // Add component file
    files.set(
      `${pascalCaseName}.${componentExt}`,
      getComponentTemplate(pascalCaseName, styleFileName, config)
    );

    // Add index file
    files.set(`index.${indexExt}`, getIndexTemplate(pascalCaseName));

    // Add style file only for React projects
    if (config.projectType === "React") {
      files.set(`${pascalCaseName}${styleFileName}`, getStyleTemplate(config));
    }

    // Write all files
    for (const [fileName, content] of files) {
      const filePath = path.join(componentDir, fileName);
      await fs.promises.writeFile(filePath, content);
    }
  }

  private async determineComponentType(
    config: ScaffoldConfig
  ): Promise<ComponentType> {
    if (!config.promptForComponentType) {
      return config.defaultComponentType;
    }

    const choice = await vscode.window.showQuickPick<
      vscode.QuickPickItem & { value: ComponentType }
    >(
      [
        { label: "Functional", value: "Functional" },
        { label: "Class", value: "Class" },
      ],
      {
        placeHolder: "Choose the component type for this component",
        ignoreFocusOut: true,
      }
    );

    if (!choice) {
      throw new Error("Component type selection was cancelled");
    }

    return choice.value;
  }
}
