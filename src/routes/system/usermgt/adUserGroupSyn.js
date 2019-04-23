import React from 'react';
import { Form, Modal, TreeSelect } from 'antd';

const FormItem = Form.Item;

function AdUserGroupSyn({ adtreeData,
  grouptreeData,
  onOk,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
  ...modalProps
 }) {
  const handleOk = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      onOk(values);
    });
  };

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  };

  const formItemLayout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 18,
    },
  };

  const adProps = {
    treeData: adtreeData,
    multiple: true,
    treeDefaultExpandAll: true,
    treeCheckable: true,
    searchPlaceholder: '请选择',
  };

  const groupProps = {
    treeData: grouptreeData,
    multiple: true,
    treeDefaultExpandAll: true,
    treeCheckable: true,
    searchPlaceholder: '请选择',
  };

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="AD节点" {...formItemLayout}>
          {getFieldDecorator('adNodes', {
            rules: [
              {
                required: true,
                message: '请选择要同步的AD节点',
              },
            ],
          })(<TreeSelect dropdownStyle={{ maxHeight: 200, overflow: 'auto' }} {...adProps} />)}
        </FormItem>
        <FormItem label="加入的用户组" {...formItemLayout}>
          {getFieldDecorator('addGroups', {
            rules: [
              {
                required: true,
                message: '请选择要加入的用户组',
              },
            ],
          })(<TreeSelect dropdownStyle={{ maxHeight: 200, overflow: 'auto' }} {...groupProps} />)}
        </FormItem>
      </Form>
    </Modal>
  );
}

export default Form.create()(AdUserGroupSyn);
