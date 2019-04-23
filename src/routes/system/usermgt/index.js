import React from 'react';
import { connect } from 'dva';
import { Button, Popconfirm } from 'antd';
import { routerRedux } from 'dva/router';
import AjaxTable from '../../../components/DataTable/AjaxTable';
import Modal from './userModal';
import TransferModal from '../../../components/System/TransferModal';
import ADUserModal from './adUserModal';
import AdUserGroupSyn from './adUserGroupSyn';
import PassWordModal from './passwordModal';
import styles from '../index.less';
import appStyles from '../../app.less';

function UserMgt({ system, dispatch }) {
  const { reloadUser, resetUserFuzzy, userModalVisible, userModalType, currentUserRecord,
    ustModalVisible, allStrategys, allGroups, ugtModalVisible, adUserModalVisible, ldapTree,
    ugsModalVisible, passwordModalVisible } = system;
  const columns = [
    {
      title: '用户名/显示名',
      dataIndex: 'joinname',
      key: 'joinname',
      width: '25%',
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdatestr',
      key: 'createdatestr',
      width: '25%',
      sorter: true,
    },
    {
      title: '用户组',
      dataIndex: 'groupNames',
      key: 'groupNames',
      width: '25%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: '40%',
      render: (text, record) => {
        return (<div>
          <a
            onClick={() => {
              dispatch(routerRedux.push({
                pathname: '/system/userinfocheck',
                query: {
                  id: record.id,
                },
              }));
            }}
          >管理</a>
          <a onClick={() => { handleAuthorize(record); }} style={{ marginLeft: 5 }}>授权</a>
          <Popconfirm title={'确定删除该用户吗?'} placement="left" onConfirm={() => { handleDeleteUser(record); }}>
            <a style={{ marginLeft: 5 }}>删除</a>
          </Popconfirm>
          <a onClick={() => { handleAddGroup(record); }} style={{ marginLeft: 5 }}>加入组</a>
          <a onClick={() => { handleEidtPassWord(record); }} style={{ marginLeft: 5 }}>修改密码</a>
        </div>);
      },
    },
  ];

  // 打开修改密码模态框
  function handleEidtPassWord(record) {
    dispatch({
      type: 'system/updateState',
      payload: {
        currentUserRecord: record,
        passwordModalVisible: true,
      },
    });
  }

  function handleAuthorize(record) {
    dispatch({
      type: 'system/getAllStrategys',
    });
    dispatch({
      type: 'system/updateState',
      payload: {
        currentUserRecord: record,
        ustModalVisible: true,
      },
    });
  }

  function handleDeleteUser(record) {
    dispatch({
      type: 'system/deleteUser',
      payload: {
        id: record.id,
        resetUserFuzzy: false,
        reloadUser: true,
      },
    });
  }

  function handleAddGroup(record) {
    dispatch({
      type: 'system/getAllGroups',
      payload: {
        id: record.id,
      },
    });
    dispatch({
      type: 'system/updateState',
      payload: {
        currentUserRecord: record,
        ugtModalVisible: true,
      },
    });
  }

  function freshUser() {
    dispatch({
      type: 'system/updateState',
      payload: {
        resetUserFuzzy: true,
        reloadUser: true,
      },
    });
  }

  function createUserModal() {
    dispatch({
      type: 'system/updateState',
      payload: {
        userModalType: 'createUser',
        userModalVisible: true,
      },
    });
  }

  const modalProps = {
    item: userModalType === 'createUser' ? {} : currentUserRecord,
    visible: userModalVisible,
    maskClosable: false,
    userModalType,
    title: `${userModalType === 'createUser' ? '创建用户界面' : '编辑用户页面'}`,
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

  const targetKeys = [];
  if (currentUserRecord !== undefined && currentUserRecord.strategys) {
    for (let i = 0; i < currentUserRecord.strategys.length; i += 1) {
      targetKeys.push(`${currentUserRecord.strategys[i].id}`);
    }
  }

  const ustModalProps = {
    dataSource: allStrategys,
    targetKeys,
    titles: ['可选策略', '已选择的策略'],
    modalProps: {
      item: currentUserRecord,
      visible: ustModalVisible,
      maskClosable: false,
      title: '编辑个人授权策略',
      onOk(data) {
        dispatch({
          type: 'system/updateUserStrategy',
          payload: data,
        });
      },
      onCancel() {
        dispatch({
          type: 'system/updateState',
          payload: {
            ustModalVisible: false,
            reloadUser: false,
          },
        });
      },
    },
  };

  const selectedGroups = [];
  if (currentUserRecord !== undefined && currentUserRecord.strategys) {
    for (let i = 0; i < currentUserRecord.groups.length; i += 1) {
      selectedGroups.push(`${currentUserRecord.groups[i].id}`);
    }
  }

  const ugtModalProps = {
    dataSource: allGroups,
    targetKeys: selectedGroups,
    titles: ['可加入的组', '已加入的组'],
    modalProps: {
      item: currentUserRecord,
      visible: ugtModalVisible,
      maskClosable: false,
      title: '编辑用户组',
      onOk(data) {
        dispatch({
          type: 'system/updateUserGroup',
          payload: {
            ...data,
          },
        });
      },
      onCancel() {
        dispatch({
          type: 'system/updateState',
          payload: {
            ugtModalVisible: false,
            reloadUser: false,
          },
        });
      },
    },
  };

  function handleAd() {
    dispatch({
      type: 'system/updateState',
      payload: {
        adUserModalVisible: true,
      },
    });
  }

  const adUserModalProps = {
    visible: adUserModalVisible,
    maskClosable: false,
    title: '同步AD用户',
    onOk(data) {
      dispatch({
        type: 'system/getLdapTree',
        payload: {
          ...data,
        },
      });
    },
    onCancel() {
      dispatch({
        type: 'system/updateState',
        payload: {
          adUserModalVisible: false,
        },
      });
    },
  };

  const allAdGroups = [];
  if (allGroups !== undefined) {
    for (let i = 0; i < allGroups.length; i += 1) {
      allAdGroups.push({ key: allGroups[i].key,
        value: allGroups[i].key,
        label: allGroups[i].title,
      });
    }
  }

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

  const adugsModalProps = {
    visible: ugsModalVisible,
    maskClosable: false,
    adtreeData: ldapTree === undefined ? [] : ldapTree,
    grouptreeData: allAdGroups,
    title: 'AD同步用户群组选择界面',
    onOk(data) {
      dispatch({
        type: 'system/updateLdapInfos',
        payload: data,
      });
    },
    onCancel() {
      dispatch({
        type: 'system/updateState',
        payload: {
          ugsModalVisible: false,
        },
      });
    },
  };

  function afterLoad() {
    dispatch({
      type: 'system/updateState',
      payload: {
        reloadUser: false,
      },
    });
  }

  return (
    <div>
      <div className={styles.mtitle}>
        <span>用户管理</span>
        <Button type="default" style={{ position: 'absolute', marginRight: 10, right: 144 }} onClick={createUserModal} >创建用户</Button>
        <Button type="default" style={{ position: 'absolute', marginRight: 10, right: 59 }} onClick={handleAd}>AD同步</Button>
        <div className={appStyles.nav_freshBtn}>
          <Button style={{ position: 'absolute', marginRight: 10, right: 14 }} onClick={freshUser} />
        </div>
      </div>
      <div className={styles.contentdiv}>
        <AjaxTable
          ajaxUrl="/system/getUsers"
          columns={columns}
          isCompare isfuzzy
          pagination
          getdataway="users"
          gettotalway="total"
          fuzzytip="用户名或显示名"
          reload={reloadUser}
          resetfuzzy={resetUserFuzzy}
          afterLoad={afterLoad}
        />
      </div>
      {userModalVisible && <Modal {...modalProps} />}
      {ustModalVisible && <TransferModal {...ustModalProps} />}
      {ugtModalVisible && <TransferModal {...ugtModalProps} />}
      {adUserModalVisible && <ADUserModal {...adUserModalProps} />}
      {ugsModalVisible && <AdUserGroupSyn {...adugsModalProps} />}
      {passwordModalVisible && <PassWordModal {...passwordModalProps} />}
    </div>
  );
}

export default connect(system => system)(UserMgt);
