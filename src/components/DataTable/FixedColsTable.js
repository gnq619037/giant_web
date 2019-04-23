import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LocalTable from './LocalTable';

/* 非HOC.封装LocalTable，实现固定列完美显示(需设定列宽和表class) */
class FixedColsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: this.getColumns(props.columns),
      resizing: false,
      colsTotalWidth: props.columns.map(a => a.width).reduce((a, b) => a + b),
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);

    // 避免初次mount时没有dom，无法计算宽度
    this.forceUpdate(() => {
      this.setState({ columns: this.getColumns(this.props.columns) });
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      columns: this.getColumns(nextProps.columns),
      colsTotalWidth: nextProps.columns.map(a => a.width).reduce((a, b) => a + b),
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    if (!this.state.resizing) {
      requestAnimationFrame(this.update);
    }

    this.setState({ resizing: true, columns: this.getColumns(this.props.columns) });
  }

  getColumns = (cols) => {
    /*
      因setState并不一定立即执行，故此处仍需手动获取colsTotalWidth，而不是通过this.setState
      也可以使用setState的callback，确定colsTotalWidth更新后再getColumns
     */
    const colsTotalWidth = cols.map(a => a.width).reduce((a, b) => a + b);
    const curtable = document.getElementsByClassName(this.props.className)[0];
    const tableWidth = curtable && curtable.scrollWidth;

    const columns = tableWidth > colsTotalWidth ?
      cols.slice().map((col) => {
        if (col.fixed) {
          /* 注意此处对象深拷贝: immute */
          // delete Object.create(col).fixed;
          return { ...col, fixed: false };
        }
        return col;
      })
      : cols;

    return columns;
  }

  update = () => {
    /* Reset the tick so we can capture the next onScroll */
    this.setState({ resizing: false });
  }

  render() {
    const { columns, scroll, ...tableProps } = this.props;

    return (
      <LocalTable
        columns={this.state.columns}
        scroll={scroll.x && { x: this.state.colsTotalWidth }}
        {...tableProps}
      />);
  }
}

FixedColsTable.propTypes = {
  columns: PropTypes.array.isRequired,
};

export default FixedColsTable;
