const path = require('path');

const kebabToCC = (input) => {
  let str = input.replace(/-./g, (match) => match[1].toUpperCase());
  str = str[0].toUpperCase() + str.substring(1);
  return str;
};

const getDynamicFileNames = ({ camelCaseModuleName }) => ({
  // main component
  'RootComponent.jsx': `${camelCaseModuleName}.jsx`,
  // unit test for main component
  'RootComponent.spec.jsx': `${camelCaseModuleName}.spec.jsx`,
  // browser test for main component
  'RootComponent.spec.js': `${camelCaseModuleName}.spec.js`,
});

const createAdditionalTemplateData = (templateValues) => ({
  camelCaseModuleName: kebabToCC(templateValues.moduleName),
  rootModuleName: templateValues.rootModuleName || templateValues.moduleName,
  isRootModule: !templateValues.rootModuleName,
});

const getIgnoredFileNames = (templateValues) => {
  const ignoredFiles = [];

  if (!templateValues.isRootModule) {
    ignoredFiles.push('appConfig.js');
    ignoredFiles.push('appConfig.spec.js');
    ignoredFiles.push('csp.js');
    ignoredFiles.push('childRoutes.jsx');
  }

  return ignoredFiles;
};

const getTemplateOptions = async (baseData, prompts) => {
  let templateValues = {
    ...baseData,
    ...await prompts([
      {
        type: 'text',
        name: 'description',
        message: 'Enter module description:',
        initial: '',
      },
      {
        type: 'text',
        name: 'rootModuleName',
        message: 'Enter the name of your root module (leave blank for this module to be root):',
        initial: '',
      },
      {
        type: 'text',
        name: 'moduleMapUrl',
        message: 'Enter the url for your dev environment module map:',
        initial: '',
      },
    ]),
  };

  templateValues = {
    ...templateValues,
    ...createAdditionalTemplateData(templateValues),
  };

  return {
    templateValues,
    dynamicFileNames: getDynamicFileNames(templateValues),
    ignoredFileNames: getIgnoredFileNames(templateValues),
  };
};

const getTemplatePaths = () => [path.resolve(__dirname, './template')];

module.exports = {
  getTemplateOptions,
  getTemplatePaths,
};
