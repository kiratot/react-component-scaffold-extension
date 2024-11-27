import * as vscode from "vscode";
import { ConfigurationService } from "./services/configurationService";
import { ComponentService } from "./services/componentService";

export function activate(context: vscode.ExtensionContext) {
  console.log("React Component Scaffold is now active!");

  const configService = new ConfigurationService(context);
  const componentService = new ComponentService();

  const resetConfigDisposable = vscode.commands.registerCommand(
    "react-component-scaffold.resetConfig",
    async () => {
      await configService.getConfiguration(true);
    }
  );

  const createComponentDisposable = vscode.commands.registerCommand(
    "react-component-scaffold.createComponent",
    async () => {
      const config = await configService.getConfiguration();
      await componentService.createComponent(config);
    }
  );

  context.subscriptions.push(createComponentDisposable, resetConfigDisposable);
}

export function deactivate() {}
