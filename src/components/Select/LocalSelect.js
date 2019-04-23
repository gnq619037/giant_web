import React, { Component } from 'react';
import { Select } from 'antd';

const Option = Select.Option;

class AjaxSelect extends Component {
  // 构造函数
  constructor(props) {
    super(props);
    const { selectOptions } = this.props;
    this.state = {
      data: selectOptions, // 下拉框显示的数据
      value: '', // 选中的数据
      sSearch: '', // 查询用的参数
    };
  }

  // 组件挂载时执行的函数
  componentDidMount() {
  }


  // option选中时或或 input 的 value 变化时调用
  handleChange = () => {
  }
  // 获取焦点时
  handleFocus = () => {
  }

  // 根据查询词过滤选项，为防止传入的选项为数字，因此option.props.children+""
  handleFilter = (input, option) => {
    return (`${option.props.children}`).toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  // 根据查询词到远程查询相关数据
  handleSearch = (input) => {
    this.setState({
      sSearch: input,
    });
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
        onChange={this.handleChange}
        onFocus={this.handleFocus}
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
