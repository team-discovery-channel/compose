/* Based on code from https://github.com/jasonrute/modulize
 * */
export const getModulesFromImport = (line: string): string[] => {
  let imports: string[] = [];
  line.trim();
  if (line.startsWith('from ')) {
    line = line.substr(5).trim();
    const tempStr = line.split(' import ');
    const mod = tempStr[0].trim();
    imports = imports.concat(mod);
    for (const name of tempStr[1].split(',')) {
      imports = imports.concat(mod + '.' + name.trim());
    }
  } else if (line.startsWith('import ')) {
    line = line.substr(7).trim();
    for (const mod of line.split(',')) {
      imports = imports.concat(mod.trim());
    }
  }
  return imports;
};

export const parseImportStructure = (
  files: { [index: string]: string[] },
  file: string
): { [index: string]: string[] } => {
  let moduleList: { [index: string]: string[] } = {};
  const dependancies = new Set();
  for (const line of files[file]) {
    for (const mod of getModulesFromImport(line)) {
      const modulePrefix: string[] = [];
      const moduleParts = mod.split('.');
      for (const part of moduleParts) {
        modulePrefix.push(part);
        const checkFile = modulePrefix.join('/');
        if (checkFile + '.py' in files) {
          moduleList = Object.assign(
            {},
            moduleList,
            parseImportStructure(files, checkFile + '.py')
          );
          dependancies.add(modulePrefix.join('.'));
        } else if (checkFile + '/__init__.py' in files) {
          moduleList = Object.assign(
            {},
            moduleList,
            parseImportStructure(files, checkFile + '/__init__.py')
          );
          dependancies.add(modulePrefix.join('.'));
        }
      }
    }
  }
  const a: any = {};
  a[file] = [...dependancies];
  return Object.assign({}, moduleList, a);
};

export const fileToModule = (file: string, mainfile: string): string[] => {
  let moduleType = '';
  let name = '';
  if (file === mainfile) {
    moduleType = 'main';
    name = file.replace('.py', '').replace('/', '.');
  } else if (file.endsWith('/__init__.py')) {
    moduleType = 'package';
    name = file.replace('/__init__.py', '').replace('/', '.');
  } else {
    moduleType = 'module';
    name = file.replace('.py', '').replace('/', '.');
  }
  return [moduleType, name];
};

export const block = (
  file: string,
  mod: string[],
  textblock: string,
  dependencies: string[]
): string => {
  const modType = mod[0];
  const modName = mod[1];
  const modArray = modName.split('.');
  const shortName = modArray[modArray.length - 1];
  const text = '    ' + textblock.split('\n').join('\n    ');
  if (modType === 'main') {
    return `\n
def ${shortName}():
    #Begin ${file}
${text}
    #End ${file}
${shortName}()
`;
  } else if (modType === 'module' || modType === 'package') {
    let dependencyText = '';
    if (dependencies.length > 0) {
      dependencyText = ', dependencies= (' + dependencies.join(', ') + ')';
    } else {
      dependencyText = '';
    }
    return `
@modulize('${modName}'${dependencyText})
def _${shortName}(__name__):
    #Begin ${file}
${text}
    #End ${file}
    return locals()
`;
  }
  return '';
};
