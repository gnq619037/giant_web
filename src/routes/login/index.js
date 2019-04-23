import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Form, Input, Row, Col } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;

function Login({ dispatch, login,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  } }) {
  const { errormsg, winHeight } = login;

  function handleOk() {
    validateFieldsAndScroll((errors, values) => {
      if ((values.username === undefined || values.username.trim() === '') &&
        (values.password === undefined || values.password.trim() === '')
      ) {
        dispatch({
          type: 'login/updateState',
          payload: {
            errormsg: '账号及密码不能为空',
          },
        });
        return;
      }
      if (values.username === undefined || values.username.trim() === '') {
        dispatch({
          type: 'login/updateState',
          payload: {
            errormsg: '账号不能为空',
          },
        });
        return;
      }
      if (values.password === undefined || values.password.trim() === '') {
        dispatch({
          type: 'login/updateState',
          payload: {
            errormsg: '密码不能为空',
          },
        });
        return;
      }
      dispatch({ type: 'login/login', payload: values });
    });
  }

  function toPassWord() {
    document.getElementById('password').focus();
  }

  return (
    <div className={styles.login} style={{ height: winHeight }}>
      <Row>
        <Col className={styles.logoTop}>
          <img src="/login/logo.png" alt="logo" />
        </Col>
      </Row>
      <Row>
        <Col span={24} className={styles.loginTop}>
          <div className={styles.logindiv}>
            <div style={{ textAlign: 'center', fontSize: 24, letterSpacing: 3 }}>欢迎登录</div>
            <div style={{ marginTop: 46 }}>
              <form>
                <FormItem >
                  {getFieldDecorator('username', {})(<Input prefix={<img src="/login/user.png" alt="user" />} onPressEnter={toPassWord} size="large" placeholder="请输入账号" />)}
                </FormItem>
                <FormItem >
                  {getFieldDecorator('password', {})(<Input id="password" prefix={<img src="/login/lock.png" alt="lock" />} onPressEnter={handleOk} type="password" size="large" placeholder="请输入密码" />)}
                </FormItem>
                <FormItem style={{ marginBottom: 8 }}>
                  <div style={{ height: 25, textAlign: 'center' }}><span className={styles.warn}>{errormsg}</span></div>
                </FormItem>
                <FormItem wrapperCol={{ span: 8 }}>
                  <div style={{ cursor: 'pointer' }} onClick={handleOk}><img src="/login/button.png" alt="button" /></div>
                </FormItem>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

Login.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func,
};

export default connect(login => login)(Form.create()(Login));
