import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Sider } from '../../components/Layout';
import appStyles from '../app.less';

function System({ app, children, location, dispatch }) {
  const { menus, locationPathname, siderFold } = app;

  function getSystemMenus(data) {
    if (data === undefined || data === null) {
      const sysMenus = {
        key: '',
        label: '',
        children: [],
      };
      return sysMenus;
    }
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];
      if (item.path === 'system' || item.path === '/system') {
        return item;
      }
      if (item.children && item.children.length > 0 && item.path !== 'system' && item.path !== '/system') {
        const sysMenus = getSystemMenus(item.children);
        if (sysMenus !== undefined) {
          return sysMenus;
        }
      }
    }
  }

  let systemMenus = {};
  const defaultSelectedKeys = [];
  let isBack = false;
  let isUserPath = false;
  if (locationPathname === '/system/groupinfocheck' ||
    locationPathname === '/system/groupstrategycheck' ||
    locationPathname === '/system/groupusercheck'
  ) {
    const { query } = location;
    isBack = true;
    systemMenus = {
      key: 'groupmgt',
      label: '群组管理',
      children: [
        {
          key: 'groupinfocheck',
          label: '群组管理详情',
          path: '/system/groupinfocheck',
          query,
        },
        {
          key: 'groupstrategycheck',
          label: '群组策略详情',
          path: '/system/groupstrategycheck',
          query,
        },
        {
          key: 'groupusercheck',
          label: '群组成员详情',
          path: '/system/groupusercheck',
          query,
        },
      ],
    };
  } else if (locationPathname === '/system/userinfocheck' ||
    locationPathname === '/system/userstrategycheck' ||
    locationPathname === '/system/usergroupcheck') {
    const { query } = location;
    isBack = true;
    isUserPath = true;
    systemMenus = {
      key: 'usermgt',
      label: '用户管理',
      children: [
        {
          key: 'userinfocheck',
          label: '用户管理详情',
          path: '/system/userinfocheck',
          query,
        },
        {
          key: 'userstrategycheck',
          label: '用户授权策略',
          path: '/system/userstrategycheck',
          query,
        },
        {
          key: 'usergroupcheck',
          label: '用户加入的组',
          path: '/system/usergroupcheck',
          query,
        },
      ],
    };
  } else {
    systemMenus = getSystemMenus(menus.children);
  }

  const mainMenu = {
    mainKey: systemMenus.key,
    mainText: systemMenus.label,
  };

  if (systemMenus.children.length > 0) {
    if (locationPathname === '/system' || locationPathname === 'system') {
      defaultSelectedKeys.push(`${systemMenus.children[0].key}`);
    } else {
      for (let j = 0; j < systemMenus.children.length; j += 1) {
        const item = systemMenus.children[j];
        if (item.path === locationPathname) {
          defaultSelectedKeys.push(`${item.key}`);
          break;
        }
      }
    }
  }

  const siderProps = {
    isBack,
    mainMenu,
    childMenus: systemMenus.children,
    defaultSelectedKeys,
    handleBack() {
      if (isBack) {
        if (isUserPath) {
          dispatch(routerRedux.push({
            pathname: '/system/usermgt',
          }));
        } else {
          dispatch(routerRedux.push({
            pathname: '/system/groupmgt',
          }));
        }
      }
    },
  };
  return (
    <div className={appStyles.nav_cotent}>
      <Sider {...siderProps} />
      <div
        style={{ width: 'auto',
          position: 'absolute',
          left: (siderFold ? 20 : 210),
          top: 0,
          right: 0,
          botttom: 0,
          overflow: 'hidden',
        }}
      >
        {children || ''}
      </div>
    </div>
  );
}

export default connect(({ app, system }) => ({ app, system }))(System);
