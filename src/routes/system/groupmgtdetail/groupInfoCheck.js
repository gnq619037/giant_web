import React from 'react';
import { connect } from 'dva';
import { Button, Tooltip } from 'antd';
import styles from '../index.less';
import Modal from '../groupmgt/groupModal';

function GroupInfoCheck({ system, dispatch }) {
  const { groupModalVisible, currentGroupRecord } = system;
  let item = {};
  if (currentGroupRecord !== undefined) {
    item = currentGroupRecord;
  }

  const modalProps = {
    item,
    visible: groupModalVisible,
    maskClosable: false,
    title: '编辑群组页面',
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

  function editGroupModal() {
    dispatch({
      type: 'system/updateState',
      payload: {
        groupModalVisible: true,
        groupModalType: 'editGroup',
      },
    });
  }

  return (
    <div className={styles.gfcheck}>
      <div className={styles.mtitle}>
        <span>基本信息</span>
        <Tooltip title="编辑基本信息">
          <Button
            ghost
            type="primary"
            icon="edit"
            style={{ position: 'absolute', marginRight: 10, right: 14, fontSize: 18 }}
            onClick={editGroupModal}
          />
        </Tooltip>
      </div>
      <div className={styles.contentdiv}>
        <table className={styles.gftable} cellSpacing="0">
          <tbody>
            <tr>
              <td className={styles.btd}>
                <span className={styles.oddspan}>组名称</span>
                <span className={styles.evenspan}>{item.name}</span>
              </td>
              <td className={styles.btd}>
                <span className={styles.oddspan}>创建时间</span>
                <span className={styles.evenspan}>{item.createDatestr}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {groupModalVisible && <Modal {...modalProps} />}
    </div>
  );
}

export default connect(system => system)(GroupInfoCheck);
