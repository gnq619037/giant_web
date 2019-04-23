import React from 'react';
import AjaxTable from './AjaxTable';
import LocalTable from './LocalTable';
import styles from './table.less';

function ComplexTable({ isAjax, childColumns, childDsField, columns, rowSelection, childRowKey, ...tableprops }) {
  function getChildTable(record) {
    let dataSource = [];
    if (record && record[childDsField]) {
      dataSource = [...record[childDsField]];
    }

    const lastData = {};
    lastData[childRowKey] = 'lastrecord';
    lastData.id = 'lastrecord';
    dataSource.push(lastData);

    let dl = 0;
    if (record[childDsField] !== undefined) {
      dl = record[childDsField].length;
    }
    dataSource[0].sublen = dl;

    return (
      <LocalTable
        rowKey={childRowKey}
        showHeader={false}
        columns={childColumns}
        dataSource={dataSource}
        pagination={false}
        isfuzzy={false}
      />
    );
  }

  return (
    <div className={styles.cp_table}>
      <div style={{ paddingLeft: 2 }}>
        <table className={styles.headt}>
          <tbody>
            <tr>
              { rowSelection && <td style={{ minWidth: '30px' }} /> }
              {
                columns.map((column) => {
                  return (<td
                    key={column.key}
                    style={{ width: column.width,
                      paddingLeft: 8,
                      paddingRight: 8,
                      textAlign: column.textAlign === undefined ? 'left' : column.textAlign }}
                  >{column.title}
                  </td>);
                })
              }
            </tr>
          </tbody>
        </table>
      </div>
      <AjaxTable
        showHeader={false}
        columns={columns}
        expandedRowRender={getChildTable}
        expandAll
        isfuzzy={false}
        rowSelection={rowSelection}
        {...tableprops}
      />
    </div>
  );
}

export default ComplexTable;
