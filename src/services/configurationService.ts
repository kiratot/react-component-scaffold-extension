import * as vscode from "vscode";
import {
  ScaffoldConfig,
  ComponentType,
  ProjectType,
  PartialConfig,
} from "../types/config";

export class ConfigurationService {
  private readonly CONFIG_KEYS = {
    useTypeScript: "useTypeScript",
    styleExtension: "styleExtension",
    componentType: "componentType",
    projectType: "projectType",
  } as const;

  private readonly PROJECT_TYPE_ITEMS: ReadonlyArray<
    vscode.QuickPickItem & { value: ProjectType }
  > = [
    { label: "React", value: "React" },
    { label: "React Native", value: "React Native" },
  ];

  private readonly COMPONENT_TYPE_ITEMS: ReadonlyArray<
    vscode.QuickPickItem & { value: ComponentType }
  > = [
    { label: "Functional", value: "Functional" },
    { label: "Class", value: "Class" },
  ];

  private readonly LANGUAGE_TYPE_ITEMS: ReadonlyArray<
    vscode.QuickPickItem & { value: boolean }
  > = [
    { label: "TypeScript", value: true },
    { label: "JavaScript", value: false },
  ];

  constructor(private context: vscode.ExtensionContext) {}

  async getConfiguration(forceReset: boolean = false): Promise<ScaffoldConfig> {
    const currentConfig: PartialConfig = {
      useTypeScript: this.context.globalState.get<boolean>(
        this.CONFIG_KEYS.useTypeScript
      ),
      styleExtension: this.context.globalState.get<string>(
        this.CONFIG_KEYS.styleExtension
      ),
      componentType: this.context.globalState.get<ComponentType>(
        this.CONFIG_KEYS.componentType
      ),
      projectType: this.context.globalState.get<ProjectType>(
        this.CONFIG_KEYS.projectType
      ),
    };

    if (forceReset || !this.isConfigComplete(currentConfig)) {
      const newConfig = await this.promptForConfiguration();
      await this.saveConfiguration(newConfig);
      return newConfig;
    }

    if (this.isConfigComplete(currentConfig)) {
      return currentConfig;
    }

    throw new Error("Configuration is incomplete");
  }

  private isConfigComplete(config: PartialConfig): config is ScaffoldConfig {
    return Boolean(
      config.useTypeScript !== undefined &&
        config.styleExtension !== undefined &&
        config.componentType !== undefined &&
        config.projectType !== undefined
    );
  }

  private async promptForConfiguration(): Promise<ScaffoldConfig> {
    const useTypeScript = await this.promptForTypeScript();
    const projectType = await this.promptForProjectType();
    const componentType = await this.promptForComponentType();
    const styleExtension =
      projectType === "React" ? await this.promptForStyleExtension() : "styles";

    return {
      useTypeScript,
      styleExtension,
      componentType,
      projectType,
    };
  }

  private async promptForTypeScript(): Promise<boolean> {
    const choice = await vscode.window.showQuickPick(this.LANGUAGE_TYPE_ITEMS, {
      placeHolder: "Choose the language for your components",
      ignoreFocusOut: true,
    });

    if (!choice) {
      throw new Error("Language selection was cancelled");
    }

    return choice.value;
  }

  private async promptForProjectType(): Promise<ProjectType> {
    const choice = await vscode.window.showQuickPick(this.PROJECT_TYPE_ITEMS, {
      placeHolder: "Choose your project type",
      ignoreFocusOut: true,
    });

    if (!choice) {
      throw new Error("Project type selection was cancelled");
    }

    return choice.value;
  }

  private async promptForComponentType(): Promise<ComponentType> {
    const choice = await vscode.window.showQuickPick(
      this.COMPONENT_TYPE_ITEMS,
      {
        placeHolder: "Choose the component type",
        ignoreFocusOut: true,
      }
    );

    if (!choice) {
      throw new Error("Component type selection was cancelled");
    }

    return choice.value;
  }

  private async promptForStyleExtension(): Promise<string> {
    const extension = await vscode.window.showInputBox({
      prompt: "Enter style extension (e.g., scss, sass, css)",
      placeHolder: "scss",
      ignoreFocusOut: true,
      validateInput: (value): string | null => {
        if (!value || !/^[a-z]+$/.test(value)) {
          return "Please enter a valid file extension (lowercase letters only)";
        }
        return null;
      },
    });
    if (!extension) {
      throw new Error("Style extension selection was cancelled");
    }
    return extension;
  }

  private async saveConfiguration(config: ScaffoldConfig): Promise<void> {
    await Promise.all([
      this.context.globalState.update(
        this.CONFIG_KEYS.useTypeScript,
        config.useTypeScript
      ),
      this.context.globalState.update(
        this.CONFIG_KEYS.styleExtension,
        config.styleExtension
      ),
      this.context.globalState.update(
        this.CONFIG_KEYS.componentType,
        config.componentType
      ),
      this.context.globalState.update(
        this.CONFIG_KEYS.projectType,
        config.projectType
      ),
    ]);

    vscode.window.showInformationMessage(
      `Configuration saved! Using ${
        config.useTypeScript ? "TypeScript" : "JavaScript"
      }, ` +
        `${config.componentType} components for ${config.projectType} with ${config.styleExtension} styles`
    );
  }
}
