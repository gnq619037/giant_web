import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';

function NoRight() {
  return (
    <div style={{ height: '100%' }}>
      <div className={styles.error}>
        <Icon style={{ fontSize: 18 }} type="frown-o" />
        <h1>当前页面，您无权限查看</h1>
      </div>
    </div>
  );
}

export default NoRight;
