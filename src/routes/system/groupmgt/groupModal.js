import React from 'react';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;

function GroupModal({ item,
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
      const data = {
        ...values,
        id: item.id === undefined ? 0 : item.id,
      };
      onOk(data);
    });
  };

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  };

  const formItemLayout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 18,
    },
  };

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="组名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: '请输入组名称',
              },
              {
                max: 64,
                message: '组名称过长',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Form>
    </Modal>
  );
}

export default Form.create()(GroupModal);
