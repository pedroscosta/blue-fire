/* eslint-disable import/prefer-default-export */

export function convertDataToTableData(tableData) {
  return [
    tableData.columns.map((head) => ({ name: head, label: head })),
    tableData.data,
  ];
}
