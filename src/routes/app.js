import React, { Component } from 'react';
import { connect } from 'dva';
import { TopMenu } from '../components/Layout';
import styles from './app.less';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isPermission: true,
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.checkSession(),
      30000,
    );
  }

  componentWillReceiveProps(nextProps) {
    const { app } = nextProps;
    const { locationPathname, allMenuPaths, menuPaths } = app;
    if (locationPathname === '/noRight' || (allMenuPaths.includes(locationPathname) && !menuPaths.includes(locationPathname))) {
      this.setState({
        isPermission: false,
      });
    } else {
      this.setState({
        isPermission: true,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { isPermission } = nextState;
    return isPermission;
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  checkSession = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'app/checkSession' });
  }

  render() {
    const { dispatch, app } = this.props;
    const { showname, menus, winHeight, isTokenPass, passwordModalVisible, userMassage } = app;
    let allMenus = [];
    if (menus.children !== undefined && menus.children !== null) {
      allMenus = menus.children;
    }

    // 修改密码模态框props
    const passwordModalProps = {
      item: userMassage,
      visible: passwordModalVisible,
      title: '密码修改',
      onOk(data) {
        dispatch({
          type: 'app/editPassword',
          payload: data,
        });
      },
      onCancel() {
        dispatch({
          type: 'app/updateState',
          payload: {
            passwordModalVisible: false,
          },
        });
      },
    };

    const headerProps = {
      passwordModalVisible,
      passwordModalProps,
      allMenus,
      width: winHeight,
      user: {
        showname,
      },
      logout() {
        dispatch({ type: 'app/logout' });
      },
      editPassword() {
        dispatch({
          type: 'app/updateState',
          payload: {
            passwordModalVisible: true,
            isLogoutShow: false,
          },
        });
      },
    };


    return (<div className={styles.nav}>
      { isTokenPass && <TopMenu {...headerProps} />}
      { isTokenPass &&
        <div className={styles.nav_body}>
          {this.props.children}
        </div>
      }
    </div>);
  }
}

export default connect(app => app)(App);
