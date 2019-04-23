import React, { Component } from 'react';
import { Select } from 'antd';
import { getOptions } from '../../services/ajaxServer';

const Option = Select.Option;

class AjaxSelect extends Component {
  // 构造函数
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 下拉框显示的数据
      value: '', // 选中的数据
      sSearch: '', // 查询用的参数
    };
  }

  // 组件挂载时执行的函数
  componentDidMount() {
    this.fetchData();
  }

  onSelect = (value, option) => {
    const { onSelectChange } = this.props;
    if (onSelectChange !== undefined && typeof onSelectChange === 'function') {
      onSelectChange(value, option);
    }
  }

  // 获取焦点时
  handleFocus = () => {
    this.fetchData();
  }

  // 根据查询词过滤选项，为防止传入的选项为数字，因此option.props.children+""
  handleFilter = (input, option) => {
    return (`${option.props.children}`).toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  // 根据查询词到远程查询相关数据
  handleSearch = (input) => {
    this.setState({
      sSearch: input,
    }, () => { this.fetchData(); });
  }

  // 用于获取远程数据的函数
  fetchData = () => {
    if (this.props.ajaxUrl !== undefined) {
      // 请求用的url与从props传入的参数
      const { ajaxUrl, aoData } = this.props;
      // 查询用的参数
      const { sSearch } = this.state;
      let params = {
        sSearch,
      };
      // 如果有其它的参数需要传入，在此一同组装成url的查询参数
      if (aoData !== undefined && aoData !== null) {
        aoData.map((data) => {
          params = { ...data, ...params };
          return params;
        });
      }
      // 查询数据
      const ajaxData = getOptions(ajaxUrl, params);
      // 将查到的数据放在state里
      ajaxData.then((json) => {
        // console.log(json);
        this.setState({
          data: json.options,
        });
      }).catch((error) => {
        // 查询失败设置为空
        this.setState({
          data: [],
          error,
        });
      });
    } else {
      // URl为空不查询
      this.setState({
        data: [],
      });
    }
  }

  render() {
    // placeholder:选择框默认文字;optiontext:选项显示的文字;optionkey:选项的key值;
    const { placeholder, optiontext, optionkey, selectWidth, ...otherProps } = this.props;
    // 将state里的数据组装成option
    const options = this.state.data.map(d => <Option key={d[optionkey]}>{d[optiontext]}</Option>);
    return (
      <Select
        showSearch
        style={{ width: selectWidth }}
        placeholder={placeholder}
        optionFilterProp="children"
        onFocus={this.handleFocus}
        onSelect={this.onSelect}
        onPressEnter={this.handlePressEnter}
        onBlur={this.handleBlur}
        onSearch={input => this.handleSearch(input)}
        filterOption={(input, option) => this.handleFilter(input, option)}
        {...otherProps}
      >
        {options}
      </Select>
    );
  }
}

export default AjaxSelect;
