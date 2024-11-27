import { ScaffoldConfig } from "../types/config";

export function getReactNativeFunctionalTemplate(
  pascalCaseName: string,
  config: ScaffoldConfig
): string {
  return `import React from 'react';
import { View, StyleSheet } from 'react-native';

${
  config.useTypeScript
    ? `type ${pascalCaseName}Props ={

}

const ${pascalCaseName}: React.FC<${pascalCaseName}Props>`
    : `const ${pascalCaseName}`
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
    ? `type ${pascalCaseName}Props = {
}

type ${pascalCaseName}State = {
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
