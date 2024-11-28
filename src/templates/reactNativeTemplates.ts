import { ScaffoldConfig } from "../types/config";

export function getReactNativeFunctionalTemplate(
  pascalCaseName: string,
  config: ScaffoldConfig
): string {
  return `import React from 'react';
import { View, StyleSheet } from 'react-native';
${
  config.useTypeScript
    ? `import type { ${pascalCaseName}Props } from './types';`
    : ""
}

const ${pascalCaseName}${
    config.useTypeScript ? `: React.FC<${pascalCaseName}Props>` : ""
  } = () => {
    return (
        <View style={styles.container}>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ${pascalCaseName};`;
}

export function getReactNativeClassTemplate(
  pascalCaseName: string,
  config: ScaffoldConfig
): string {
  return `import React from 'react';
import { View, StyleSheet } from 'react-native';
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
            <View style={styles.container}>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ${pascalCaseName};`;
}
