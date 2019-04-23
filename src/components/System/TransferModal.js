import React, { Component } from 'react';
import { Transfer, Modal } from 'antd';

class TransferModal extends Component {
  constructor(props) {
    super(props);
    const { targetKeys } = this.props;
    this.state = { targetKeys,
      selectedKeys: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { targetKeys } = nextProps;
    this.setState({ targetKeys });
  }

  handleChange= (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
  }

  handleSelectChange= (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  }

  handleOk = () => {
    const { targetKeys } = this.state;
    const { modalProps } = this.props;
    const { item, onOk } = modalProps;
    const data = {
      targetKeys,
      id: item.id,
    };
    onOk(data);
  };

  render() {
    const { modalProps, dataSource, titles } = this.props;
    const { targetKeys, selectedKeys } = this.state;
    const { onOk, ...modalOpts } = modalProps;

    return (
      <Modal width="680" onOk={this.handleOk} {...modalOpts}>
        <Transfer
          listStyle={{
            width: 300,
            height: 300,
            overflow: 'auto',
          }}
          showSearch
          dataSource={dataSource}
          titles={titles}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={this.handleChange}
          onSelectChange={this.handleSelectChange}
          render={item => item.title}
        />
      </Modal>
    );
  }
}

export default TransferModal;
