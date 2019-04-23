import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import AjaxTable from '../../../components/DataTable/AjaxTable';
import TransferModal from '../../../components/System/TransferModal';
import styles from '../index.less';
import appStyles from '../../app.less';

function GroupUserCheck({ system, location, dispatch }) {
  const { reloadGroup, resetGroupFuzzy, gstModalVisible, allUsers, groupUsers } = system;
  const { query = {} } = location;
  const { id } = query;
  const aoData = [];
  aoData.push(query);

  const columns = [
    {
      title: '用户名/显示名',
      dataIndex: 'joinname',
      key: 'joinname',
      width: '50%',
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdatestr',
      key: 'createdatestr',
      width: '50%',
      sorter: true,
    },
  ];

  function freshGroup() {
    dispatch({
      type: 'system/updateState',
      payload: {
        resetGroupFuzzy: true,
        reloadGroup: true,
      },
    });
  }

  function handleEditUser() {
    dispatch({
      type: 'system/getAllGroupUsers',
      payload: query,
    });
    dispatch({
      type: 'system/updateState',
      payload: {
        gstModalVisible: true,
      },
    });
  }

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
      item: {
        id: Number(id),
      },
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
        <span>群组成员</span>
        <Button type="default" style={{ position: 'absolute', marginRight: 10, right: 59 }} onClick={handleEditUser}>编辑组成员</Button>
        <div className={appStyles.nav_freshBtn}>
          <Button style={{ position: 'absolute', marginRight: 10, right: 14 }} onClick={freshGroup} />
        </div>
      </div>
      <div className={styles.contentdiv}>
        <AjaxTable
          ajaxUrl="/system/getGroupUsers"
          columns={columns}
          isCompare isfuzzy
          pagination
          getdataway="users"
          gettotalway="total"
          fuzzytip="用户名或显示名"
          reload={reloadGroup}
          resetfuzzy={resetGroupFuzzy}
          aoData={aoData}
          afterLoad={afterLoad}
        />
      </div>
      {gstModalVisible && <TransferModal {...userTransferModalProps} />}
    </div>
  );
}

export default connect(system => system)(GroupUserCheck);
