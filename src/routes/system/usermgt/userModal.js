import React from 'react';
import { Form, Input, Modal, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

function UserModal({ item,
  onOk,
  userModalType,
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
      span: 4,
    },
    wrapperCol: {
      span: 18,
    },
  };

  const regex = new RegExp('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,15}');

  const phoneRegex = new RegExp(/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/);

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="用户名" {...formItemLayout}>
          {getFieldDecorator('username', {
            initialValue: item.username,
            rules: [
              {
                required: true,
                message: '请输入用户名',
              },
              {
                max: 64,
                message: '用户名过长',
              },
            ],
          })(<Input placeholder="请输入需要添加的用户名" disabled={userModalType !== 'createUser'} />)}
        </FormItem>
        {userModalType === 'createUser' &&
          <div>
            <FormItem label={userModalType === 'createUser' ? '密码' : '新密码'} {...formItemLayout}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: userModalType === 'createUser',
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
                    message: '密码必须包含大写字母,小写字母,数字以及特殊字符',
                  },
                ],
              })(<Input type="password" placeholder={userModalType === 'createUser' ? '请输入该用户的登录密码' : '请输入该用户的新登录密码'} />)}
            </FormItem>
            <FormItem label="密码确认" {...formItemLayout}>
              {getFieldDecorator('passwordTwice', {
                rules: [
                  {
                    required: userModalType === 'createUser',
                    message: '请输入确认密码',
                  },
                  {
                    validator: checkPassword,
                  },
                ],
              })(<Input type="password" placeholder="密码确认" />)}
            </FormItem>
          </div>
        }
        <FormItem label="显示名" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
          })(<Input placeholder="请输入姓名" />)}
        </FormItem>
        <FormItem label="电话" {...formItemLayout}>
          {getFieldDecorator('phone', {
            initialValue: item.phone,
            rules: [
              {
                pattern: phoneRegex,
                message: '请输入正确的手机号码、或固定电话',
              },
            ],
          })(<Input placeholder="请输入电话" />)}
        </FormItem>
        <FormItem label="邮箱" {...formItemLayout}>
          {getFieldDecorator('email', {
            initialValue: item.email,
          })(<Input placeholder="请输入邮箱" />)}
        </FormItem>
        <FormItem label="微信" {...formItemLayout}>
          {getFieldDecorator('wechat', {
            initialValue: item.wechat,
          })(<Input placeholder="请输入微信" />)}
        </FormItem>
        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
          })(<TextArea style={{ resize: 'none' }} placeholder="请输入备注" />)}
        </FormItem>
        <FormItem label="登录类型" {...formItemLayout}>
          {getFieldDecorator('logintype', {
            initialValue: item.logintype === undefined ? '0' : `${item.logintype}`,
          })(<Select >
            <Option value="0">本地认证</Option>
            <Option value="1">AD认证</Option>
          </Select>)}
        </FormItem>
        <FormItem label="状态" {...formItemLayout}>
          {getFieldDecorator('isactive', {
            initialValue: item.isactive === undefined ? '1' : `${item.isactive}`,
          })(<Select >
            <Option value="0">禁用</Option>
            <Option value="1">启用</Option>
          </Select>)}
        </FormItem>
      </Form>
    </Modal>
  );
}

export default Form.create()(UserModal);
