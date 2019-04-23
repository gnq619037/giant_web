import React from 'react';
import { Button, Popconfirm } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import AjaxTable from '../../../components/DataTable/AjaxTable';
import Modal from './groupModal';
import TransferModal from '../../../components/System/TransferModal';
import styles from '../index.less';
import appStyles from '../../app.less';

function GroupMgt({ system, dispatch }) {
  const { groupModalType, currentGroupRecord, groupModalVisible, reloadGroup, resetGroupFuzzy,
    allStrategys, groupTransferModalVisible, allUsers, groupUsers, gstModalVisible } = system;
  const columns = [
    {
      title: '组名称',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createDatestr',
      key: 'createDatestr',
      width: '30%',
      sorter: true,
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
                pathname: '/system/groupinfocheck',
                query: {
                  id: record.id,
                },
              }));
            }}
          >管理</a>
          <a onClick={() => { handleAuthorize(record); }} style={{ marginLeft: 5 }}>授权</a>
          <Popconfirm title={'确定删除该群组吗?'} placement="left" onConfirm={() => { handleDeleteGroup(record); }}>
            <a style={{ marginLeft: 5 }}>删除</a>
          </Popconfirm>
          <a onClick={() => { handleEditUser(record); }} style={{ marginLeft: 5 }}>编辑组成员</a>
        </div>);
      },
    },
  ];

  function handleAuthorize(record) {
    dispatch({
      type: 'system/getAllStrategys',
    });
    dispatch({
      type: 'system/updateState',
      payload: {
        currentGroupRecord: record,
        groupTransferModalVisible: true,
      },
    });
  }

  function handleEditUser(record) {
    dispatch({
      type: 'system/getAllGroupUsers',
      payload: {
        id: record.id,
      },
    });
    dispatch({
      type: 'system/updateState',
      payload: {
        currentGroupRecord: record,
        gstModalVisible: true,
      },
    });
  }

  function handleDeleteGroup(record) {
    dispatch({
      type: 'system/deleteGroup',
      payload: {
        id: record.id,
        resetGroupFuzzy: false,
        reloadGroup: true,
      },
    });
  }

  function createGroupModal() {
    dispatch({
      type: 'system/updateState',
      payload: {
        groupModalVisible: true,
        groupModalType: 'createGroup',
      },
    });
  }

  function freshGroup() {
    dispatch({
      type: 'system/updateState',
      payload: {
        resetGroupFuzzy: true,
        reloadGroup: true,
      },
    });
  }

  const modalProps = {
    item: groupModalType === 'createGroup' ? {} : currentGroupRecord,
    visible: groupModalVisible,
    maskClosable: false,
    title: `${groupModalType === 'createGroup' ? '新增群组界面' : '编辑群组页面'}`,
    onOk(data) {
      dispatch({
        type: 'system/createOrUpdateGroup',
        payload: data,
      });
    },
    onCancel() {
      dispatch({
        type: 'system/updateState',
        payload: {
          groupModalVisible: false,
          reloadGroup: false,
        },
      });
    },
  };

  const targetKeys = [];
  if (currentGroupRecord !== undefined && currentGroupRecord.strategys) {
    for (let i = 0; i < currentGroupRecord.strategys.length; i += 1) {
      targetKeys.push(`${currentGroupRecord.strategys[i].id}`);
    }
  }

  const strategyTransferModalProps = {
    dataSource: allStrategys,
    targetKeys,
    titles: ['可选策略', '已选择的策略'],
    modalProps: {
      item: currentGroupRecord,
      visible: groupTransferModalVisible,
      maskClosable: false,
      title: '编辑群组授权策略',
      onOk(data) {
        dispatch({
          type: 'system/updateGroupStrategy',
          payload: data,
        });
      },
      onCancel() {
        dispatch({
          type: 'system/updateState',
          payload: {
            groupTransferModalVisible: false,
            reloadGroup: false,
          },
        });
      },
    },
  };

  const userDataSource = [];
  const usertargetKeys = [];
  if (allUsers !== undefined) {
    for (let i = 0; i < allUsers.length; i += 1) {
      const user = {
        key: `${allUsers[i].id}`,
        title: allUsers[i].name,
      };
      userDataSource.push(user);
    }
  }
  if (groupUsers !== undefined) {
    for (let i = 0; i < groupUsers.length; i += 1) {
      usertargetKeys.push(`${groupUsers[i].id}`);
    }
  }

  const userTransferModalProps = {
    dataSource: userDataSource,
    targetKeys: usertargetKeys,
    titles: ['可加入的组成员', '已选择的组成员'],
    modalProps: {
      item: currentGroupRecord,
      visible: gstModalVisible,
      maskClosable: false,
      title: '编辑组成员',
      onOk(data) {
        dispatch({
          type: 'system/updateGroupUser',
          payload: data,
        });
      },
      onCancel() {
        dispatch({
          type: 'system/updateState',
          payload: {
            gstModalVisible: false,
            reloadGroup: false,
          },
        });
      },
    },
  };

  function afterLoad() {
    dispatch({
      type: 'system/updateState',
      payload: {
        reloadGroup: false,
      },
    });
  }

  return (
    <div>
      <div className={styles.mtitle}>
        <span>群组管理</span>
        <Button type="default" style={{ position: 'absolute', marginRight: 10, right: 59 }} onClick={createGroupModal} >创建群组</Button>
        <div className={appStyles.nav_freshBtn}>
          <Button style={{ position: 'absolute', marginRight: 10, right: 14 }} onClick={freshGroup} />
        </div>
      </div>
      <div className={styles.contentdiv}>
        <AjaxTable
          ajaxUrl="/system/getGroup"
          columns={columns}
          isCompare isfuzzy
          pagination
          getdataway="groups"
          gettotalway="total"
          fuzzytip="组名称"
          reload={reloadGroup}
          resetfuzzy={resetGroupFuzzy}
          afterLoad={afterLoad}
        />
      </div>
      {groupModalVisible && <Modal {...modalProps} />}
      {groupTransferModalVisible && <TransferModal {...strategyTransferModalProps} />}
      {gstModalVisible && <TransferModal {...userTransferModalProps} />}
    </div>
  );
}

export default connect(system => system)(GroupMgt);
