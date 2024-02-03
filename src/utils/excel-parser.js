import exportFromJSON from 'export-from-json';

export const excelParser = (nameFile) => {
  function exportDataFromJSON(data, newFileName, fileExportType) {
    if (!data) return;
    try {
      const fileName = newFileName || nameFile;
      const exportType = exportFromJSON.types[fileExportType || 'xls'];
      exportFromJSON({ data, fileName, exportType });
    } catch (e) {
      throw new Error('Parsing failed!');
    }
  }

  return {
    exportDataFromJSON,
  };
};
