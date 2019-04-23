import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Input, Button } from 'antd';

class LocalTable extends Component {
  constructor(props) {
    super(props);
    const { extendButtons: buttons, columns, dataSource } = props;
    const etdBtns = this.getExtendBtns(buttons);
    this.state = { columns,
      data: dataSource,
      loading: false,
      extendButtons: etdBtns,
    };
  }

  componentWillReceiveProps(nextProps) {
    // //console.log(nextProps);
    this.setState({
      data: nextProps.dataSource,
      columns: nextProps.columns,
    });
  }

  onSearch = (e) => {
    this.setState({ loading: true });
    const { isCompare, dataSource: data } = this.props;
    let searchText = e.target.value;
    const newData = [];

    data.map((record) => {
      for (const key of Object.keys(record)) {
        let dvalue = record[key].toString();
        if (isCompare && !isCompare) {
          dvalue = dvalue.toLowerCase();
          searchText = searchText.toLowerCase();
        }
        if (dvalue.indexOf(searchText) > -1) {
          newData.push(record);
          break;
        }
      }
      return newData;
    });

    this.setState({
      data: newData,
      loading: false,
    });
  }

  getExtendBtns = (buttons) => {
    const extendButtons = [];
    if (buttons) {
      buttons.map((button) => {
        extendButtons.push(<Button type="primary" key={button.key} style={{ marginTop: 5, marginLeft: 5 }} onClick={button.event}>{button.name}</Button>);
        return extendButtons;
      });
    }
    return extendButtons;
  }

  handleChange = (pagination, filters, sorter) => {
    if (this.props.onEvents && this.props.onEvents.onChange) {
      this.props.onEvents.onChange(pagination, filters, sorter);
    }
    this.updateColumns(sorter, filters);
  }

  updateColumns = (sortedInfo, filteredInfo) => {
    const { columns } = this.state;
    if (sortedInfo && sortedInfo !== null) {
      columns.map((column) => {
        const cns = Object.keys(column);
        if (cns.includes('sorter')) {
          const sortname = column.key === undefined ? column.dataIndex : column.key;
          column.sortOrder = sortedInfo.columnKey === sortname && sortedInfo.order;
        }
        return column;
      });
    }

    if (filteredInfo && filteredInfo !== null) {
      columns.map((column) => {
        const cns = Object.keys(column);
        if (cns.includes('onFilter')) {
          column.filteredValue = filteredInfo.name || null;
        }
        return column;
      });
    }
    this.setState({ columns });
  }

  handleExpandedRowsChange = (expandedRows) => {
    if (this.props.onEvents && this.props.onEvents.onExpandedRowsChange) {
      this.props.onEvents.onExpandedRowsChange(expandedRows);
    }
  }

  handleExpand = (expanded, record) => {
    if (this.props.onEvents && this.props.onEvents.onExpand) {
      this.props.onEvents.onExpand(expanded, record);
    }
  }

  handleRowClick = (record, index, event) => {
    if (this.props.onEvents && this.props.onEvents.onRowClick) {
      this.props.onEvents.onRowClick(record, index, event);
    }
  }

  handleRowDoubleClick=(record, index, event) => {
    if (this.props.onEvents && this.props.onEvents.onRowDoubleClick) {
      this.props.onEvents.onRowDoubleClick(record, index, event);
    }
  }

  handleRowMouseEnter=(record, index, event) => {
    if (this.props.onEvents && this.props.onEvents.onRowMouseEnter) {
      this.props.onEvents.onRowMouseEnter(record, index, event);
    }
  }

  handleRowMouseLeave=(record, index, event) => {
    if (this.props.onEvents && this.props.onEvents.onRowMouseLeave) {
      this.props.onEvents.onRowMouseLeave(record, index, event);
    }
  }

  handleFooter=(currentPageData) => {
    if (this.props.onEvents && this.props.onEvents.footer) {
      this.props.onEvents.footer(currentPageData);
    }
  }

  handleTitle=(currentPageData) => {
    if (this.props.onEvents && this.props.onEvents.title) {
      this.props.onEvents.title(currentPageData);
    }
  }

  render() {
    const { dataSource, columns, pagination, defaultPageSize, showTotal, pageSizeOptions, rowClassName, tipText, isfuzzy, ...tableProps } = this.props;
    const { data, columns: scolumns, loading } = this.state;

    const defaultPageSet = {
      defaultPageSize,
      showSizeChanger: true,
      showTotal,
      pageSizeOptions,
    };

    const locale = {
      emptyText: '暂无数据',
    };

    return (<div>{ (isfuzzy || isfuzzy === undefined) ? <Input addonBefore="搜索" onInput={this.onSearch} style={{ marginTop: 5, width: 266 }} /> : ''}
      {this.state.extendButtons}
      <div title={tipText}>
        <Table
          rowClassName={rowClassName}
          onChange={this.handleChange}
          onExpandedRowsChange={this.handleExpandedRowsChange}
          onExpand={this.handleExpand}
          onRowClick={this.handleRowClick}
          onRowDoubleClick={this.handleRowDoubleClick}
          onRowMouseEnter={this.handleRowMouseEnter}
          onRowMouseLeave={this.handleRowMouseLeave}
          locale={locale}
          columns={scolumns}
          dataSource={data}
          rowKey={record => record.id}
          pagination={pagination === false ? false : defaultPageSet}
          loading={loading}
          {...tableProps}
        />
      </div></div>);
  }
}

LocalTable.propTypes = {
  columns: PropTypes.array.isRequired,
};

LocalTable.defaultProps = {
  columns: [],
  dataSource: [],
  defaultPageSize: 10,
  pageSizeOptions: ['10', '25', '50', '100'],
  showTotal: (total, range) => `显示第${range[0]}至${range[1]}项结果，共${total}项`,
};

export default LocalTable;
