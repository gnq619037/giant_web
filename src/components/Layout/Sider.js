import React, { Component } from 'react';
import { Icon, Badge } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './Sider.less';

class Sider extends Component {
  constructor(props) {
    super(props);
    const { defaultSelectedKeys, childMenus } = this.props;
    const openKeys = this.getOpenKeys(childMenus);
    this.state = {
      openKeys,
      selectedKeys: defaultSelectedKeys,
      isIconChange: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { isIconChange } = this.state;
    const { defaultSelectedKeys, childMenus } = nextProps;

    if (isIconChange) {
      this.setState({
        selectedKeys: defaultSelectedKeys,
      });
    } else {
      const openKeys = this.getOpenKeys(childMenus);
      this.setState({
        selectedKeys: defaultSelectedKeys,
        openKeys,
      });
    }
  }

  getOpenKeys = (childMenus) => {
    const openKeys = [];
    if (childMenus !== undefined) {
      for (let i = 0; i < childMenus.length; i += 1) {
        const item = childMenus[i];
        if ((item.children instanceof Array) && item.children.length > 0) {
          openKeys.push(item.key);
        }
      }
    }
    return openKeys;
  }

  getChildMenu = (childMenus) => {
    const { openKeys, selectedKeys } = this.state;
    const result = [];
    if (!childMenus) {
      return;
    }
    for (let i = 0; i < childMenus.length; i += 1) {
      const item = childMenus[i];
      if ((item.children instanceof Array) && item.children.length > 0) {
        const fatherKey = item.key;
        let isOpen = false;
        if (openKeys.includes(fatherKey)) {
          isOpen = true;
        }
        const subResult = [];
        for (let j = 0; j < item.children.length; j += 1) {
          const subItem = item.children[j];
          subResult.push(<li
            className={selectedKeys.includes(subItem.key) ? styles.subli_selected : styles.subli}
            key={subItem.key}
            onClick={() => { this.handleSelect(subItem.key, subItem.path, subItem.query); }}
          >
            <span>{subItem.label}</span>

            {subItem.sum === undefined ? '' : <span className={styles.badge}>
              <Badge
                count={subItem.sum}
                showZero
                style={{ backgroundColor: '#d9d9d9', boxShadow: '0 0 0 1px #d9d9d9 inset', color: '#fff', marginLeft: 12 }}
              />
            </span>}

          </li>);
        }
        const subMenus = (<li key={item.key}>
          <div
            className={selectedKeys.includes(fatherKey) ? styles.siderli_selected : styles.subdiv}
            onClick={() => { this.handleSelect(fatherKey, item.path, item.query); }}
          >
            <span>{item.label}</span>
            { isOpen ? <Icon className={styles.li_icon} type="up" onClick={() => { this.handleCloseSub(fatherKey); }} /> :
            <Icon className={styles.li_icon} type="down" onClick={() => { this.handleOpenSub(fatherKey); }} />}</div>
          { isOpen && <ul>{subResult}</ul>}
        </li>);

        result.push(subMenus);
      } else {
        result.push(<li
          className={selectedKeys.includes(item.key) ? styles.siderli_selected : styles.siderli}
          key={item.key}
          onClick={() => { this.handleSelect(item.key, item.path, item.query); }}
        >
          <span>{item.label}</span>
        </li>);
      }
    }
    return result;
  }

  handleOpenSub = (fatherKey) => {
    const { openKeys } = this.state;
    if (!openKeys.includes(fatherKey)) {
      this.setState({
        openKeys: [fatherKey, ...openKeys],
        isIconChange: true,
      });
    }
  }

  handleCloseSub = (fatherKey) => {
    const { openKeys } = this.state;
    if (openKeys.includes(fatherKey)) {
      openKeys.splice(openKeys.findIndex(value => value === fatherKey), 1);
      this.setState({
        openKeys,
        isIconChange: true,
      });
    }
  }

  handleSelect = (liKey, liPath, liQuery) => {
    const { selectedKeys } = this.state;
    if (selectedKeys !== undefined && !selectedKeys.includes(liKey)) {
      const { dispatch } = this.props;
      dispatch(routerRedux.push({
        pathname: liPath,
        query: liQuery,
      }));
      this.setState({
        selectedKeys: [liKey],
      });
    }
  }

  hideSider = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/updateState',
      payload: {
        siderFold: true,
      },
    });
  }

  showSider = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'app/updateState',
      payload: {
        siderFold: false,
      },
    });
  }

  render() {
    const { mainMenu, childMenus, isBack, handleBack, app } = this.props;
    const { mainKey, mainText } = mainMenu;
    const { siderFold } = app;


    return (
      <div className={siderFold ? styles.siderFold : styles.sider}>
        { !siderFold &&
        <div style={{ width: 210, height: 68 }}>
          { isBack && <div className={styles.backcss} onClick={handleBack}><Icon type="enter" />
            <span style={{ paddingLeft: 13 }}>返回上级</span></div>}
          { !isBack && <div className={styles.maincss} key={mainKey} >{mainText}</div>}
          <div className={styles.ssbtn} onClick={this.hideSider}>
            <img src="/left.png" role="presentation" />
          </div>
        </div>}

        { siderFold &&
          <div>
            <div className={styles.ssbtn} onClick={this.showSider}>
              <img src="/right.png" role="presentation" />
            </div>
          </div>
        }

        { !siderFold &&
          <ul style={{ width: 210, outline: 'line', marginBottom: 0, paddingLeft: 0, listStyle: 'none' }}>
            {this.getChildMenu(childMenus)}</ul>
         }
      </div>
    );
  }

}

export default connect(app => app)(Sider);
