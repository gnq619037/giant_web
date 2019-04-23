import React from 'react';
import { Button, Popconfirm } from 'antd';
import { connect } from 'dva';
import AjaxTable from '../../../components/DataTable/AjaxTable';
import Modal from './strategyModal';
import styles from '../index.less';
import appStyles from '../../app.less';

function StrategyMgt({ system, dispatch }) {
  const { strategyModalType, currentStrategyRecord, strategyModalVisible, reloadStrategy, resetStrategyFuzzy, allMenus, treeValiStatus, firstOpen } = system;
  const columns = [
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      sorter: true,
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
      width: '20%',
      sorter: true,
    },
    {
      title: '策略类型',
      dataIndex: 'type',
      key: 'type',
      width: '20%',
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
      width: '20%',
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: '20%',
      render: (text, record) => {
        if (record.type === 0) {
          return (<div>
            <a
              onClick={() => {
                dispatch({
                  type: 'system/updateState',
                  payload: {
                    strategyModalType: 'checkStrategy',
                    currentStrategyRecord: record,
                    strategyModalVisible: true,
                  },
                });
              }}
            >查看</a>
          </div>);
        } else {
          return (<div>
            <a
              onClick={() => {
                dispatch({
                  type: 'system/updateState',
                  payload: {
                    strategyModalType: 'checkStrategy',
                    currentStrategyRecord: record,
                    strategyModalVisible: true,
                  },
                });
              }}
            >查看</a>
            <a
              onClick={() => {
                dispatch({
                  type: 'system/updateState',
                  payload: {
                    strategyModalType: 'editStrategy',
                    currentStrategyRecord: record,
                    strategyModalVisible: true,
                  },
                });
              }} style={{ marginLeft: 5 }}
            >编辑</a>
            <Popconfirm title={'确定删除该条策略吗?'} placement="left" onConfirm={() => { handleDeleteStrategy(record); }}>
              <a style={{ marginLeft: 5 }}>删除</a>
            </Popconfirm>
          </div>);
        }
      },
    },
  ];

  function handleDeleteStrategy(record) {
    dispatch({
      type: 'system/deleteStrategy',
      payload: {
        id: record.id,
        resetStrategyFuzzy: false,
        reloadStrategy: true,
      },
    });
  }

  function freshStrategy() {
    dispatch({
      type: 'system/updateState',
      payload: {
        resetStrategyFuzzy: true,
        reloadStrategy: true,
      },
    });
  }

  function createStrategyModal() {
    dispatch({
      type: 'system/updateState',
      payload: {
        strategyModalVisible: true,
        strategyModalType: 'createStrategy',
      },
    });
  }

  const modalProps = {
    item: strategyModalType === 'createStrategy' ? {} : currentStrategyRecord,
    visible: strategyModalVisible,
    treeValiStatus: firstOpen ? (strategyModalType === 'createStrategy' || currentStrategyRecord === undefined
      || currentStrategyRecord.menus.length === 0 ? '' : 'success') : treeValiStatus,
    maskClosable: false,
    isDisabled: strategyModalType === 'checkStrategy',
    treeData: allMenus === undefined ? [] : allMenus.children,
    title: `${strategyModalType === 'createStrategy' ? '新增策略界面' :
      strategyModalType === 'editStrategy' ? '修改策略页面' : '查看策略页面'}`,
    onOk(data) {
      if (strategyModalType === 'createStrategy' || strategyModalType === 'editStrategy') {
        dispatch({
          type: 'system/createOrUpdateStrategy',
          payload: data,
        });
      } else {
        dispatch({
          type: 'system/updateState',
          payload: {
            strategyModalVisible: false,
            reloadStrategy: false,
            firstOpen: true,
          },
        });
      }
    },
    onCancel() {
      dispatch({
        type: 'system/updateState',
        payload: {
          strategyModalVisible: false,
          reloadStrategy: false,
          firstOpen: true,
        },
      });
    },
    onChange(payload) {
      dispatch({
        type: 'system/updateState',
        payload,
      });
    },
  };

  function afterLoad() {
    dispatch({
      type: 'system/updateState',
      payload: {
        reloadStrategy: false,
      },
    });
  }

  return (
    <div>
      <div className={styles.mtitle}>
        <span>策略管理</span>
        <Button type="default" style={{ position: 'absolute', marginRight: 10, right: 59 }} onClick={createStrategyModal}>创建策略</Button>
        <div className={appStyles.nav_freshBtn}>
          <Button style={{ position: 'absolute', marginRight: 10, right: 14 }} onClick={freshStrategy} />
        </div>
      </div>
      <div className={styles.contentdiv}>
        <AjaxTable
          ajaxUrl="/system/getStrategy"
          columns={columns}
          isCompare isfuzzy
          pagination
          getdataway="strategys"
          gettotalway="total"
          fuzzytip="策略名或备注"
          reload={reloadStrategy}
          resetfuzzy={resetStrategyFuzzy}
          afterLoad={afterLoad}
        />
      </div>
      {strategyModalVisible && <Modal {...modalProps} />}
    </div>
  );
}

export default connect(system => system)(StrategyMgt);
