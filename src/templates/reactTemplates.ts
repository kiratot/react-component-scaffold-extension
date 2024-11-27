import { ScaffoldConfig } from "../types/config";

export function getReactFunctionalTemplate(
  pascalCaseName: string,
  styleFileName: string,
  config: ScaffoldConfig
): string {
  return `import React from 'react';
import styles from './${pascalCaseName}${styleFileName}';

${
  config.useTypeScript
    ? `interface ${pascalCaseName}Props {
    // Add your props here
}

const ${pascalCaseName}: React.FC<${pascalCaseName}Props>`
    : `const ${pascalCaseName}`
} = () => {
    return (
        <div className={styles.container}>
            {/* Add your component content here */}
        </div>
    );
};

export default ${pascalCaseName};`;
}

export function getReactClassTemplate(
  pascalCaseName: string,
  styleFileName: string,
  config: ScaffoldConfig
): string {
  return `import React from 'react';
import styles from './${pascalCaseName}${styleFileName}';

${
  config.useTypeScript
    ? `interface ${pascalCaseName}Props {
    // Add your props here
}

interface ${pascalCaseName}State {
    // Add your state here
}

class ${pascalCaseName} extends React.Component<${pascalCaseName}Props, ${pascalCaseName}State>`
    : `class ${pascalCaseName} extends React.Component`
} {
    ${
      config.useTypeScript
        ? `constructor(props: ${pascalCaseName}Props) {
        super(props);
        this.state = {};
    }`
        : `constructor(props) {
        super(props);
        this.state = {};
    }`
    }

    render() {
        return (
            <div className={styles.container}>
                {/* Add your component content here */}
            </div>
        );
    }
}

export default ${pascalCaseName};`;
}
