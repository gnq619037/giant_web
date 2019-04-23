import React from 'react';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;

function ADUserModal({ onOk,
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
      span: 4,
    },
    wrapperCol: {
      span: 18,
    },
  };

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="用户名" {...formItemLayout}>
          {getFieldDecorator('adusername', {
            rules: [
              {
                required: true,
                message: '请输入用户名',
              },
            ],
          })(<Input placeholder="请输入用户名" />)}
        </FormItem>
        <FormItem label="密码" {...formItemLayout}>
          {getFieldDecorator('adpassword', {
            rules: [
              {
                required: true,
                message: '请输入密码',
              },
            ],
          })(<Input type="password" placeholder="请输入密码" />)}
        </FormItem>
      </Form>
    </Modal>
  );
}

export default Form.create()(ADUserModal);
