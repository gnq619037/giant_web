import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';

function NotFound() {
  return (
    <div style={{ height: '100%' }}>
      <div className={styles.error}>
        <Icon style={{ fontSize: 18 }} type="frown-o" />
        <h1>404 Not Found</h1>
      </div>
    </div>
  );
}

export default NotFound;
