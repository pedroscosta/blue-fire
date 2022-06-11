/* eslint-disable import/prefer-default-export */
import * as XLSX from 'xlsx';

export function readXLSX(buffer) {
  const workbook = XLSX.read(buffer);

  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const dataArray = XLSX.utils
    .sheet_to_json(worksheet, {
      header: 1,
    })
    .filter((row) => row.length > 0);

  // const cols = dataArray[0];
  // const headers = cols.map((head) => ({ name: head, label: head }));
  const columns = dataArray[0];

  const data = dataArray.slice(1).map((r) =>
    r.reduce((acc, x, i) => {
      acc[dataArray[0][i]] = x;
      return acc;
    }, {})
  );

  return [columns, data];
}
