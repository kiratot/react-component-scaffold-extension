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
    defaultComponentType: "defaultComponentType",
    promptForComponentType: "promptForComponentType",
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

  private readonly PROMPT_FOR_COMPONENT_TYPE_ITEMS: ReadonlyArray<
    vscode.QuickPickItem & { value: boolean }
  > = [
    { label: "Yes, ask me every time", value: true },
    { label: "No, use default", value: false },
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
      defaultComponentType: this.context.globalState.get<ComponentType>(
        this.CONFIG_KEYS.defaultComponentType
      ),
      promptForComponentType: this.context.globalState.get<boolean>(
        this.CONFIG_KEYS.promptForComponentType
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
        config.defaultComponentType !== undefined &&
        config.promptForComponentType !== undefined &&
        config.projectType !== undefined
    );
  }

  private async promptForConfiguration(): Promise<ScaffoldConfig> {
    const useTypeScript = await this.promptForTypeScript();
    const projectType = await this.promptForProjectType();
    const defaultComponentType = await this.promptForComponentType(
      "Choose the default component type"
    );
    const promptForComponentType = await this.promptForComponentTypeOption();
    const styleExtension =
      projectType === "React" ? await this.promptForStyleExtension() : "styles";

    return {
      useTypeScript,
      styleExtension,
      defaultComponentType,
      promptForComponentType,
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

  private async promptForComponentType(prompt: string): Promise<ComponentType> {
    const choice = await vscode.window.showQuickPick(
      this.COMPONENT_TYPE_ITEMS,
      {
        placeHolder: prompt,
        ignoreFocusOut: true,
      }
    );

    if (!choice) {
      throw new Error("Component type selection was cancelled");
    }

    return choice.value;
  }

  private async promptForComponentTypeOption(): Promise<boolean> {
    const choice = await vscode.window.showQuickPick(
      this.PROMPT_FOR_COMPONENT_TYPE_ITEMS,
      {
        placeHolder:
          "Do you want to choose component type for each new component?",
        ignoreFocusOut: true,
      }
    );

    if (!choice) {
      throw new Error("Component type prompt selection was cancelled");
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
        this.CONFIG_KEYS.defaultComponentType,
        config.defaultComponentType
      ),
      this.context.globalState.update(
        this.CONFIG_KEYS.promptForComponentType,
        config.promptForComponentType
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
        `${config.defaultComponentType} components for ${config.projectType} with ${config.styleExtension} styles`
    );
  }
}
