import React from 'react';
import { connect } from 'dva';
import { Button, Tabs } from 'antd';
import AjaxTable from '../../../components/DataTable/AjaxTable';
import LocalTable from '../../../components/DataTable/LocalTable';
import TransferModal from '../../../components/System/TransferModal';
import styles from '../index.less';
import appStyles from '../../app.less';

const TabPane = Tabs.TabPane;

function UserStrategyCheck({ system, app, location, dispatch }) {
  const { showname } = app;
  const { reloadUser, resetUserFuzzy, ustModalVisible, currentUserRecord, allStrategys, activeTabKey } = system;
  const { query = {} } = location;
  const { id } = query;
  const aoData = [];
  aoData.push(query);

  const usColumns = [
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      sorter: activeTabKey !== '2',
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
      sorter: activeTabKey !== '2',
    },
    {
      title: '策略类型',
      dataIndex: 'type',
      key: 'type',
      width: '20%',
      sorter: activeTabKey !== '2',
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
      width: '20%',
      sorter: activeTabKey !== '2',
    },
  ];

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
            ustModalVisible: false,
            reloadUser: false,
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
      type: 'system/updateState',
      payload: {
        ustModalVisible: true,
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

  const ugColumns = [
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

  function ugsTable(record) {
    return (
      <LocalTable
        columns={usColumns}
        dataSource={record.strategys}
        pagination={false}
        isfuzzy={false}
      />
    );
  }

  function afterLoad() {
    dispatch({
      type: 'system/updateState',
      payload: {
        reloadUser: false,
      },
    });
  }

  function TabChange(key) {
    dispatch({
      type: 'system/updateState',
      payload: {
        activeTabKey: key,
      },
    });
  }

  return (
    <div>
      <div className={styles.mtitle}>
        <span>{showname}的授权策略</span>
        <Button type="default" style={{ position: 'absolute', marginRight: 10, right: 59 }} onClick={handleAuthorize} >编辑授权策略</Button>
        <div className={appStyles.nav_freshBtn}>
          <Button style={{ position: 'absolute', marginRight: 10, right: 14 }} onClick={freshUser} />
        </div>
      </div>
      <div className={styles.contentdiv}>
        <Tabs onChange={TabChange}>
          <TabPane tab="个人授权策略" key="1">
            <AjaxTable
              ajaxUrl="/system/getUserStrategys"
              columns={usColumns}
              isCompare isfuzzy
              pagination
              getdataway="strategys"
              gettotalway="total"
              fuzzytip="策略名称"
              reload={reloadUser}
              resetfuzzy={resetUserFuzzy}
              aoData={aoData}
              afterLoad={afterLoad}
            />
          </TabPane>
          <TabPane tab="加入组的授权策略" key="2" >
            <AjaxTable
              ajaxUrl="/system/getUserGroups"
              columns={ugColumns}
              isCompare
              isfuzzy={false}
              pagination
              getdataway="groups"
              gettotalway="total"
              fuzzytip="组名称"
              reload={reloadUser}
              resetfuzzy={resetUserFuzzy}
              aoData={aoData}
              expandedRowRender={ugsTable}
              afterLoad={afterLoad}
            />
          </TabPane>
        </Tabs>
      </div>
      {ustModalVisible && <TransferModal {...ustModalProps} />}
    </div>
  );
}

export default connect(({ system, app }) => ({ system, app }))(UserStrategyCheck);
