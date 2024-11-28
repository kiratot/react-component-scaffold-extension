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
    ? `import type { ${pascalCaseName}Props } from './types';`
    : ""
}

const ${pascalCaseName}${
    config.useTypeScript ? `: React.FC<${pascalCaseName}Props>` : ""
  } = () => {
    return (
        <div className={styles.container}>
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
    ? `import type { ${pascalCaseName}Props, ${pascalCaseName}State } from './types';`
    : ""
}

class ${pascalCaseName} extends React.Component${
    config.useTypeScript
      ? `<${pascalCaseName}Props, ${pascalCaseName}State>`
      : ""
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
            </div>
        );
    }
}

export default ${pascalCaseName};`;
}
