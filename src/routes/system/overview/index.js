import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from '../index.less';

function Overview({ system, app, dispatch }) {
  const { userNum, groupNum, strategyNum } = system;
  const { menuPaths } = app;

  function linkToMenu(menu) {
    if (menu === 'user' && menuPaths.includes('/system/usermgt')) {
      dispatch(routerRedux.push({
        pathname: '/system/usermgt',
      }));
    }
    if (menu === 'group' && menuPaths.includes('/system/groupmgt')) {
      dispatch(routerRedux.push({
        pathname: '/system/groupmgt',
      }));
    }
    if (menu === 'strategy' && menuPaths.includes('/system/strategymgt')) {
      dispatch(routerRedux.push({
        pathname: '/system/strategymgt',
      }));
    }
  }

  return (
    <div>
      <div className={styles.mtitle}>概览</div>
      <div style={{ marginTop: 20 }}>
        <section className={styles.section} onClick={() => { linkToMenu('user'); }}>
          <div className={styles.boxtitle}>
            <span>用户概览</span>
          </div>
          <div className={styles.content}>
            <div style={{ marginTop: 125 }}>当前有{userNum}个用户</div>
          </div>
        </section>
        <section className={styles.section} onClick={() => { linkToMenu('group'); }} >
          <div className={styles.boxtitle}>
            <span >群组概览</span>
          </div>
          <div className={styles.content} >
            <div style={{ marginTop: 125 }}>当前有{groupNum}个群组</div>
          </div>
        </section>
        <section className={styles.section} onClick={() => { linkToMenu('strategy'); }}>
          <div className={styles.boxtitle}>
            <span>策略概览</span>
          </div>
          <div className={styles.content}>
            <div style={{ marginTop: 125 }}>当前有{strategyNum}个权限</div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default connect(({ system, app }) => ({ system, app }))(Overview);
