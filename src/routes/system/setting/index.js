import React from 'react';
import { connect } from 'dva';
import { Form, Input, Tabs, Button } from 'antd';
import styles from '../index.less';
import appStyles from '../../app.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
};

function Setting({ dispatch, system,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  } }) {
  const { ad } = system;
  const handlesave = () => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      dispatch({ type: 'system/saveAd', payload: values });
    });
  };

  return (
    <div className={styles.setting}>
      <div className={styles.mtitle}>设置</div>
      <Tabs defaultActiveKey="1" className={styles.contentdiv}>
        <TabPane tab="AD设置" key="1">
          <div className={styles.title}>AD服务器信息</div>
          <Form layout="horizontal">
            <FormItem label="服务器IP地址:" {...formItemLayout} >
              {getFieldDecorator('adserver', {
                initialValue: ad.adserver,
                rules: [
                  {
                    required: true,
                    message: '请输入服务器IP地址',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem label="服务器端口" {...formItemLayout}>
              {getFieldDecorator('adport', {
                initialValue: ad.adport,
                rules: [
                  {
                    required: true,
                    message: '请输入服务器端口',
                  },
                ],
              })(<Input placeholder="默认389" />)}
            </FormItem>
            <FormItem label="服务器域名" {...formItemLayout}>
              {getFieldDecorator('addomain', {
                initialValue: ad.addomain,
                rules: [
                  {
                    required: true,
                    message: '请输入服务器域名',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <div className={styles.title}>AD服务器同步节点定位</div>
            <FormItem label="同步节点" {...formItemLayout}>
              {getFieldDecorator('addn', {
                initialValue: ad.addn,
              })(<Input placeholder="请输入，默认ou=ComNetWork,ou=Accounts" />)}
            </FormItem>
            <FormItem label="用户过滤条件" {...formItemLayout}>
              {getFieldDecorator('adfilter', {
                initialValue: ad.adfilter,
              })(<Input placeholder="请输入，默认cn=*" />)}
            </FormItem>
            <FormItem label="部门过滤条件" {...formItemLayout}>
              {getFieldDecorator('adorgfilter', {
                initialValue: ad.adorgfilter,
              })(<Input placeholder="请输入，默认objectClass=organizationalUnit" />)}
            </FormItem>
            <div className={styles.title}>AD信息映射表</div>
            <FormItem label="用户唯一ID" {...formItemLayout}>
              {getFieldDecorator('matchingusername', {
                initialValue: ad.matchingusername,
              })(<Input placeholder="请输入，默认userPrincipalName" />)}
            </FormItem>
            <FormItem label="用户名" {...formItemLayout}>
              {getFieldDecorator('matchingname', {
                initialValue: ad.matchingname,
              })(<Input placeholder="请输入，默认cn" />)}
            </FormItem>
            <FormItem label="邮箱" {...formItemLayout}>
              {getFieldDecorator('matchingemail', {
                initialValue: ad.matchingemail,
              })(<Input placeholder="请输入，默认mail" />)}
            </FormItem>
            <FormItem label="电话" {...formItemLayout}>
              {getFieldDecorator('matchingphone', {
                initialValue: ad.matchingphone,
              })(<Input placeholder="请输入，默认mobile" />)}
            </FormItem>
            <FormItem wrapperCol={{ span: 8, offset: 10 }}>
              <div className={appStyles.nav_btn}>
                <Button onClick={handlesave}>
                  保存
                </Button>
              </div>
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default connect(system => system)(Form.create()(Setting));
