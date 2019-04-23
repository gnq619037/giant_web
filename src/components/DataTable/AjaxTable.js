import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Input } from 'antd';
import { getData } from '../../services/ajaxServer';

class AjaxTable extends Component {
  constructor(props) {
    super(props);
    const { defaultPageSize, pagination, columns, expandAll, isfuzzy, sSearch: sh } = this.props;
    const sSearch = isfuzzy === false ? sSearch : sh;
    this.state = { columns,
      data: [],
      loading: true,
      page: 1,
      pageSize: pagination === false ? -1 : defaultPageSize,
      sSearch,
      sortColumn: '',
      sortOrder: '',
      expandAll,
      isFirstLoad: true,
      expandedRowKeys: [],
    };
  }

  componentDidMount() {
    if (this.state.columns !== undefined) {
      this.fetchData();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { sSearch: sh } = this.state;
    let resSearch = '';
    const { reload, resetfuzzy, isfuzzy, sSearch } = nextProps;
    resSearch = isfuzzy === false ? sSearch : sh;
    if (reload) {
      if (resetfuzzy) {
        this.setState({
          sSearch: '',
          loading: true,
          page: sSearch !== this.state.sSearch ? 1 : this.state.page,
        }, () => { this.fetchData(); });
      } else {
        this.setState({
          loading: true,
          sSearch: resSearch,
          page: sSearch !== this.state.sSearch ? 1 : this.state.page,
        }, () => { this.fetchData(); });
      }
    } else {
      this.setState({
        sSearch: resSearch,
      });
    }
  }

  onSearch = (e) => {
    const searchText = e.target.value;
    this.setState({
      sSearch: searchText,
      loading: true,
      page: 1,
    }, () => { this.fetchData(); });
  }

  fetchData = () => {
    if (this.props.ajaxUrl !== undefined) {
      const { ajaxUrl, aoData, getdataway, gettotalway, rowKey, afterLoad } = this.props;
      const { page, pageSize, sortColumn, sortOrder, sSearch, expandAll } = this.state;
      let params = {
        page,
        pageSize,
        sortColumn,
        sortOrder,
        sSearch,
      };
      if (aoData !== undefined && aoData !== null) {
        aoData.map((data) => {
          params = { ...data, ...params };
          return params;
        });
      }
      const ajaxData = getData(ajaxUrl, params);
      ajaxData.then((json) => {
        const resultData = json[getdataway];
        const expandkeys = [];
        if (expandAll) {
          const rowkey = rowKey === undefined ? 'id' : rowKey;
          resultData.map((item) => {
            expandkeys.push(item[rowkey]);
            return expandkeys;
          });
          if (afterLoad !== undefined && typeof afterLoad === 'function') {
            afterLoad();
          }
          this.setState({
            data: json[getdataway],
            loading: false,
            isFirstLoad: false,
            totalNums: json[gettotalway],
            expandedRowKeys: expandkeys,
          });
        } else {
          if (afterLoad !== undefined && typeof afterLoad === 'function') {
            afterLoad();
          }
          this.setState({
            data: json[getdataway],
            loading: false,
            isFirstLoad: false,
            totalNums: json[gettotalway],
          });
        }
      }).catch((error) => {
        if (afterLoad !== undefined && typeof afterLoad === 'function') {
          afterLoad();
        }
        this.setState({
          data: [],
          loading: false,
          totalNums: 0,
          error,
        });
      });
    } else {
      this.setState({
        data: [],
        loading: false,
        totalNums: 0,
      });
    }
  }

  handleChange = (pagination, filters, sorter) => {
    if (this.props.onEvents && this.props.onEvents.onChange) {
      this.props.onEvents.onChange(pagination, filters, sorter);
    }
    if (sorter.columnKey && sorter.order) {
      const columns = this.updateColumns(sorter);
      this.setState({
        sortColumn: sorter.columnKey,
        sortOrder: sorter.order,
        columns,
      }, () => { this.fetchData(); });
    }
  }

  updateColumns = (sortedInfo) => {
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
    return columns;
  }

  handleExpandedRowsChange = (expandedRows) => {
    if (this.props.onEvents && this.props.onEvents.onExpandedRowsChange) {
      this.props.onEvents.onExpandedRowsChange(expandedRows);
    }
  }

  handleExpand = (expanded, record) => {
    const { expandedRowKeys } = this.state;
    const { rowKey } = this.props;
    const rowkey = rowKey === undefined ? 'id' : rowKey;
    const expandKeys = expandedRowKeys;
    if (expanded) {
      expandKeys.push(record[rowkey]);
    } else {
      for (let i = 0; i < expandKeys.length; i += 1) {
        if (expandKeys[i] === record[rowkey]) {
          expandKeys.splice(i, 1);
          break;
        }
      }
    }
    this.setState({
      expandedRowKeys: expandKeys,
    });
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
    const { columns, rowClassName, defaultPageSize, pagination, isfuzzy,
      fuzzytip, tipText, extendButtons, bottomButtons, showTotal, pageSizeOptions, pageSetStyle, tableStyle, afterLoad, ...tableProps } = this.props;
    const { totalNums, data, columns: scolumns, loading, sSearch, expandedRowKeys, isFirstLoad, page: curPage } = this.state;

    const locale = {
      emptyText: '暂无数据',
    };

    const defaultPageSet = {
      current: curPage,
      defaultPageSize,
      showSizeChanger: true,
      showTotal,
      pageSizeOptions,
      style: pageSetStyle,
      total: totalNums,
      onChange: (page, pageSize) => {
        this.setState({ page, pageSize }, () => { this.fetchData(); });
      },
      onShowSizeChange: (current, size) => {
        this.setState({ page: current, pageSize: size }, () => { this.fetchData(); });
      },
    };

    return (<div style={tableStyle}>{ (isfuzzy || isfuzzy === undefined) ? <Input addonBefore="搜索" onInput={this.onSearch} style={{ width: 266 }} placeholder={fuzzytip} value={sSearch} /> : ''}
      {extendButtons}
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
          dataSource={data}
          columns={scolumns}
          rowKey={record => record.id}
          pagination={pagination === false ? false : defaultPageSet}
          loading={loading}
          expandedRowKeys={expandedRowKeys}
          {...tableProps}
        />
        { totalNums !== 0 && !isFirstLoad && bottomButtons}
      </div></div>);
  }
}

AjaxTable.propTypes = {
  columns: PropTypes.array.isRequired,
};

AjaxTable.defaultProps = {
  columns: [],
  defaultPageSize: 10,
  pageSetStyle: {},
  tableStyle: {},
  pageSizeOptions: ['10', '25', '50', '100'],
  showTotal: (total, range) => `显示第${range[0]}至${range[1]}项结果，共${total}项`,
};

export default AjaxTable;
