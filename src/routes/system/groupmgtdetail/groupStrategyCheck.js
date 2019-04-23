import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
import AjaxTable from '../../../components/DataTable/AjaxTable';
import TransferModal from '../../../components/System/TransferModal';
import styles from '../index.less';
import appStyles from '../../app.less';

function GroupStrategyCheck({ system, location, dispatch }) {
  const { reloadGroup, resetGroupFuzzy, groupTransferModalVisible, allStrategys, currentGroupRecord } = system;
  const { query = {} } = location;
  const aoData = [];
  aoData.push(query);
  const columns = [
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      sorter: true,
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
      width: '25%',
      sorter: true,
    },
    {
      title: '策略类型',
      dataIndex: 'type',
      key: 'type',
      width: '25%',
      sorter: true,
      render: (text) => {
        if (text === 0) {
          return '系统';
        } else if (text === 1) {
          return '自定义';
        } else {
          return '';
        }
      },
    },
    {
      title: '被引用次数',
      dataIndex: 'num',
      key: 'num',
      width: '25%',
      sorter: true,
    },
  ];

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

  function handleAuthorize() {
    dispatch({
      type: 'system/getAllStrategys',
    });
    dispatch({
      type: 'system/getGroupById',
      payload: query,
    });
    dispatch({
      type: 'system/updateState',
      payload: {
        groupTransferModalVisible: true,
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
        <span>授权策略</span>
        <Button type="default" style={{ position: 'absolute', marginRight: 10, right: 59 }} onClick={handleAuthorize}>编辑授权策略</Button>
        <div className={appStyles.nav_freshBtn}>
          <Button style={{ position: 'absolute', marginRight: 10, right: 14 }} onClick={freshGroup} />
        </div>
      </div>
      <div className={styles.contentdiv}>
        <AjaxTable
          ajaxUrl="/system/getAllGroupStrategys"
          columns={columns}
          isCompare isfuzzy
          pagination
          getdataway="strategys"
          gettotalway="total"
          fuzzytip="策略名称"
          reload={reloadGroup}
          resetfuzzy={resetGroupFuzzy}
          aoData={aoData}
          afterLoad={afterLoad}
        />
      </div>
      {groupTransferModalVisible && <TransferModal {...strategyTransferModalProps} />}
    </div>
  );
}

export default connect(system => system)(GroupStrategyCheck);
