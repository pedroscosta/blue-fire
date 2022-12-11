import * as XLSX from 'xlsx';

export function readXLSX(buffer) {
  const workbook = XLSX.read(buffer);

  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  const dataArray = XLSX.utils
    .sheet_to_json(worksheet, {
      header: 1,
    })
    .filter((row: any) => row.length > 0);

  const columns = dataArray[0];

  const data = dataArray.slice(1).map((r: any) =>
    r.reduce((acc, x, i) => {
      acc[dataArray[0][i]] = x;
      return acc;
    }, {}),
  );

  return [columns, data];
}
