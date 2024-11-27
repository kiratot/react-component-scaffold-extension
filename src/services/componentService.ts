import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { ScaffoldConfig } from "../types/config";
import { convertToPascalCase } from "../utils/stringUtils";
import {
  getComponentTemplate,
  getStyleTemplate,
  getIndexTemplate,
} from "../templates/componentTemplates";

export class ComponentService {
  async createComponent(config: ScaffoldConfig): Promise<void> {
    const workspaceFolder = this.getWorkspaceFolder();
    if (!workspaceFolder) {
      throw new Error("Please open a workspace first");
    }

    const componentName = await this.promptForComponentName();
    if (!componentName) {
      return;
    }

    const pascalCaseName = convertToPascalCase(componentName);
    const componentDir = this.createComponentDirectory(
      workspaceFolder,
      componentName
    );
    await this.createComponentFiles(componentDir, pascalCaseName, config);

    vscode.window.showInformationMessage(
      `Component ${pascalCaseName} created successfully!`
    );
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
    workspaceFolder: vscode.WorkspaceFolder,
    componentName: string
  ): string {
    const componentDir = path.join(workspaceFolder.uri.fsPath, componentName);
    fs.mkdirSync(componentDir, { recursive: true });
    return componentDir;
  }

  private async createComponentFiles(
    componentDir: string,
    pascalCaseName: string,
    config: ScaffoldConfig
  ): Promise<void> {
    const componentExt = config.useTypeScript ? "tsx" : "jsx";
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
}
