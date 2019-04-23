import React from 'react';
import { connect } from 'dva';
import { Button, Tooltip } from 'antd';
import styles from '../index.less';
import Modal from '../usermgt/userModal';
import PassWordModal from '../usermgt/passwordModal';


function UserInfoCheck({ app, system, dispatch }) {
  const { winWidth } = app;
  const { userModalVisible, currentUserRecord, passwordModalVisible } = system;
  let item = {};
  if (currentUserRecord !== undefined) {
    item = currentUserRecord;
  }

  const avgWidth = (winWidth - 210 - (24 * 2) - (65 * 3)) / 3;

  const modalProps = {
    item,
    visible: userModalVisible,
    maskClosable: false,
    title: '编辑用户页面',
    onOk(data) {
      dispatch({
        type: 'system/createOrUpdateUser',
        payload: data,
      });
    },
    onCancel() {
      dispatch({
        type: 'system/updateState',
        payload: {
          userModalVisible: false,
          reloadUser: false,
        },
      });
    },
  };

  // 修改密码模态框props
  const passwordModalProps = {
    item: currentUserRecord,
    visible: passwordModalVisible,
    title: '密码修改',
    onOk(data) {
      dispatch({
        type: 'system/editPassword',
        payload: data,
      });
    },
    onCancel() {
      dispatch({
        type: 'system/updateState',
        payload: {
          passwordModalVisible: false,
        },
      });
    },
  };

  // 打开修改密码模态框
  function editPasswordModal() {
    dispatch({
      type: 'system/updateState',
      payload: {
        passwordModalVisible: true,
      },
    });
  }

  function editUserModal() {
    dispatch({
      type: 'system/updateState',
      payload: {
        userModalVisible: true,
        userModalType: 'editUser',
      },
    });
  }

  return (
    <div className={styles.ufcheck}>
      <div className={styles.mtitle}>
        <span>基本信息</span>
        <Tooltip title="修改密码">
          <Button
            ghost
            type="primary"
            icon="lock"
            style={{ position: 'absolute', marginRight: 10, right: 54, fontSize: 18 }}
            onClick={editPasswordModal}
          />
        </Tooltip>
        <Tooltip title="编辑基本信息">
          <Button
            ghost
            type="primary"
            icon="edit"
            style={{ position: 'absolute', marginRight: 10, right: 14, fontSize: 18 }}
            onClick={editUserModal}
          />
        </Tooltip>
      </div>
      <div className={styles.contentdiv}>
        <table className={styles.uftable} cellSpacing="0">
          <tbody>
            <tr>
              <td className={styles.oddtd}>用户名</td>
              <td className={styles.eventd} style={{ width: avgWidth }}>{item.username}</td>
              <td className={styles.oddtd}>显示名</td>
              <td className={styles.eventd} style={{ width: avgWidth }}>{item.name}</td>
              <td className={styles.oddtd}>电话</td>
              <td className={styles.eventd} style={{ width: avgWidth }}>{item.phone}</td>
            </tr>
            <tr>
              <td className={styles.oddtd}>邮箱</td>
              <td className={styles.eventd}>{item.email}</td>
              <td className={styles.oddtd}>微信</td>
              <td className={styles.eventd}>{item.wechat}</td>
              <td className={styles.oddtd}>创建时间</td>
              <td className={styles.eventd}>{item.createdatestr}</td>
            </tr>
            <tr>
              <td className={styles.oddtd}>登录类型</td>
              <td className={styles.eventd}>{item.logintype === 0 ? '本地认证' : 'AD认证'}</td>
              <td className={styles.oddtd}>状态</td>
              <td colSpan="3" className={styles.eventd}>{item.isactive === 0 ? '禁用' : '启用'}</td>
            </tr>
            <tr>
              <td className={styles.oddbtd}>备注</td>
              <td colSpan="5" className={styles.evenbtd}>{item.description}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {userModalVisible && <Modal {...modalProps} />}
      {passwordModalVisible && <PassWordModal {...passwordModalProps} />}
    </div>
  );
}

export default connect(({ system, app }) => ({ system, app }))(UserInfoCheck);
