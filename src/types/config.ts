export type ComponentType = "Functional" | "Class";
export type ProjectType = "React" | "React Native";

export interface ScaffoldConfig {
  useTypeScript: boolean;
  styleExtension: string;
  defaultComponentType: ComponentType;
  promptForComponentType: boolean;
  projectType: ProjectType;
}

export type PartialConfig = Partial<ScaffoldConfig>;
