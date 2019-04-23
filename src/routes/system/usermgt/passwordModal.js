import React from 'react';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;

function PasswordModal({ item,
  onOk,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldValue,
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

  function checkPassword(rule, value, callback) {
    if (value && value !== getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  };

  const formItemLayout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 17,
    },
  };

  // 密码格式正则校验
  const regex = new RegExp('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,15}');

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="用户名" {...formItemLayout}>
          {getFieldDecorator('username', {
            initialValue: item.username,
          })(<Input disabled />)}
        </FormItem>
        <FormItem label="新密码" {...formItemLayout}>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码',
              },
              {
                max: 15,
                message: '密码的长度为8~15位',
              },
              {
                min: 8,
                message: '密码的长度为8~15位',
              },
              {
                pattern: regex,
                message: '密码必须包含大小写字母,数字以及特殊字符',
              },
            ],
          })(<Input type="password" placeholder={'请输入该用户的新登录密码'} />)}
        </FormItem>
        <FormItem label="确认新密码" {...formItemLayout}>
          {getFieldDecorator('passwordTwice', {
            rules: [
              {
                required: true,
                message: '请再次确认该用户的登录密码',
              },
              {
                validator: checkPassword,
              },
            ],
          })(<Input type="password" placeholder="请再次确认该用户的登录密码" />)}
        </FormItem>
      </Form>
    </Modal>
  );
}

export default Form.create()(PasswordModal);
