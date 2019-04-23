import React from 'react';
import { Form, Input, Modal, TreeSelect } from 'antd';

const FormItem = Form.Item;

function StrategyModal({ item,
  onOk,
  onChange,
  treeData,
  isDisabled,
  treeValiStatus,
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

  const menuIds = [];
  if (item !== undefined && item.menus) {
    for (let i = 0; i < item.menus.length; i += 1) {
      const menu = item.menus[i];
      menuIds.push(`${menu.id}`);
    }
  }

  const handleValiTree = (rule, value, callback) => {
    treeValiStatus = value.length > 0 ? 'success' : '';

    onChange({ treeValiStatus, firstOpen: false });
    callback();
  };


  const treeProps = {
    treeData,
    multiple: true,
    disabled: isDisabled,
    treeDefaultExpandAll: true,
    treeCheckable: true,
    searchPlaceholder: isDisabled ? '' : '请选择',
  };

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="策略名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [
              {
                required: true,
                message: '请输入策略名称',
              },
              {
                max: 64,
                message: '策略名称过长',
              },
            ],
          })(<Input placeholder={isDisabled ? '' : '请输入'} disabled={isDisabled} />)}
        </FormItem>
        <FormItem label="权限菜单" {...formItemLayout} validateStatus={treeValiStatus}>
          {getFieldDecorator('menus', {
            initialValue: menuIds,
            validateTrigger: 'onChange',
            rules: [
              {
                // required: true,
                // message: '请输入策略名称',
                type: 'array',
                validator: handleValiTree,
              },
            ],
          })(<TreeSelect dropdownStyle={{ maxHeight: 200, overflow: 'auto' }} {...treeProps} />)}
        </FormItem>
        <FormItem label="备注" {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
          })(<Input placeholder={isDisabled ? '' : '请输入'} disabled={isDisabled} />)}
        </FormItem>
      </Form>
    </Modal>
  );
}

export default Form.create()(StrategyModal);
