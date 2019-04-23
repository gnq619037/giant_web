import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import AjaxTable from '../../../components/DataTable/AjaxTable';
import TransferModal from '../../../components/System/TransferModal';
import styles from '../index.less';
import appStyles from '../../app.less';

function UserGroupCheck({ system, location, dispatch }) {
  const { reloadUser, resetUserFuzzy, ugtModalVisible, allGroups, currentUserRecord } = system;
  const { query = {} } = location;
  const { id } = query;
  const aoData = [];
  aoData.push(query);

  const columns = [
    {
      title: '组名称',
      dataIndex: 'name',
      key: 'name',
      width: '35%',
      sorter: true,
    },
    {
      title: '授权策略数',
      dataIndex: 'snum',
      key: 'snum',
      width: '35%',
    },
    {
      title: '创建时间',
      dataIndex: 'createDatestr',
      key: 'createDatestr',
      width: '30%',
      sorter: true,
    },
  ];

  function freshGroup() {
    dispatch({
      type: 'system/updateState',
      payload: {
        resetUserFuzzy: true,
        reloadUser: true,
      },
    });
  }

  function handleEditGroup() {
    dispatch({
      type: 'system/getAllGroups',
    });
    dispatch({
      type: 'system/updateState',
      payload: {
        ugtModalVisible: true,
      },
    });
  }

  const targetKeys = [];
  if (currentUserRecord !== undefined && currentUserRecord.strategys) {
    for (let i = 0; i < currentUserRecord.groups.length; i += 1) {
      targetKeys.push(`${currentUserRecord.groups[i].id}`);
    }
  }

  const ugtModalProps = {
    dataSource: allGroups,
    targetKeys,
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
            reloadId: Number(id),
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
        <span>加入的组</span>
        <Button type="default" style={{ position: 'absolute', marginRight: 10, right: 59 }} onClick={handleEditGroup}>编辑用户组</Button>
        <div className={appStyles.nav_freshBtn}>
          <Button style={{ position: 'absolute', marginRight: 10, right: 14 }} onClick={freshGroup} />
        </div>
      </div>
      <div className={styles.contentdiv}>
        <AjaxTable
          ajaxUrl="/system/getUserGroups"
          columns={columns}
          isCompare isfuzzy
          pagination
          getdataway="groups"
          gettotalway="total"
          fuzzytip="组名称"
          reload={reloadUser}
          resetfuzzy={resetUserFuzzy}
          aoData={aoData}
          afterLoad={afterLoad}
        />
      </div>
      {ugtModalVisible && <TransferModal {...ugtModalProps} />}
    </div>
  );
}

export default connect(system => system)(UserGroupCheck);
