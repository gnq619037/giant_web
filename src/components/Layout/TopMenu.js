import { connect } from 'dva';
import React, { Component } from 'react';
import { Link, routerRedux } from 'dva/router';
import PassWordModal from '../../routes/system/usermgt/passwordModal';
import styles from './TopMenu.less';


class TopMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { isLogoutShow: false,
      dropWin: <div />,
      visible: false,
      activeMenuKey: 0 };
  }

  componentDidMount() {
    document.body.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleClick, false);
  }

  getAllMenus = () => {
    const { isLogoutShow, dropWin, visible } = this.state;
    const { allMenus, user, logout, passwordModalVisible, passwordModalProps } = this.props;
    const menusdiv = this.getMenus(allMenus);

    return (
      <div>
        <div className={styles.logosuper}>
          <div className={styles.logo} />
          <div className={styles.logintitle}>网络自动化平台</div>
          <div className={styles.rightWarpper}>
            <div
              className={styles.nav_user}
              onClick={() => { this.changeLogWin(); }}
            >
              <img className={styles.nav_img} src="/user.png" role="presentation" />
              <span className={styles.logouser}>{user.showname}</span>
            </div>
            { isLogoutShow &&
              <div className={styles.bubble}>
                <div onClick={() => this.handleEditPassWord()}>
                  <div className={styles.bubble_div}>
                    <span >修改密码</span>
                  </div>
                </div>
                <div onClick={logout}>
                  <div className={styles.bubble_div}>
                    <span >退出</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
        <div className={styles.menuBar}>
          <div className={styles.menudash}>
            <Link to="/dashboard">首页</Link>
          </div>
          {menusdiv}
          {visible && dropWin}
        </div>
        {passwordModalVisible && <PassWordModal {...passwordModalProps} />}
      </div>
    );
  }

  getMenus = (data) => {
    const mdivs = [];
    for (let i = 1; i <= data.length; i += 1) {
      const item = data[i - 1];
      let childMenus = [];
      if (item.children) {
        childMenus = item.children;
      }
      mdivs.push(<div className={styles.menurest} key={item.key} onClick={() => { this.showMenu(i, childMenus, item.key); }}>
        <span >{item.label} <img style={{ marginLeft: 12 }} src="/triangle.png" role="presentation" /></span>
      </div>);
    }
    return mdivs;
  }

  getChildMenuDiv = (childMenus, left) => {
    return (
      <div className={styles.childmenu} style={{ left }} >
        <ul className="childli">
          {
            childMenus.map((item) => {
              return <li key={item.key} onClick={() => { this.goPatch(item.path); }}>{item.label}</li>;
            })
          }
        </ul>
      </div>
    );
  }

  // 关闭下拉框并打开编辑密码模态框
  handleEditPassWord = () => {
    const { editPassword } = this.props;
    this.changeLogWin();
    editPassword();
  }

  handleClick = (e) => {
    if (e.target &&
      (e.target.className.includes('menurest') ||
      e.target.parentNode.className.includes('menurest')
    )) {
      return;
    }
    if (e.target && e.target.parentNode.className.includes('childli')) {
      return;
    }
    if (e.target &&
      (e.target.className.includes('bubble_div') ||
      e.target.parentNode.className.includes('bubble_div'))) {
      return;
    }
    if (e.target &&
      (e.target.className.includes('nav_user') ||
      e.target.className.includes('nav_img') ||
      e.target.className.includes('logouser')
    )) {
      return;
    }
    this.setState({
      visible: false,
      isLogoutShow: false,
    });
  }

  showMenu = (num, childMenus, menuKey) => {
    const { visible, activeMenuKey } = this.state;
    const cmus = [];
    childMenus.map((item) => {
      return cmus.push(<li key={item.key}>{item.label}</li>);
    });
    const allDivs = document.getElementsByTagName('div');
    const menuDivs = [];
    let menuDivWidth = 0;
    for (let m = 0; m < allDivs.length; m += 1) {
      if (allDivs[m].className.includes('menurest')) {
        menuDivs.push(allDivs[m]);
      }
    }
    for (let n = 1; n <= num - 1; n += 1) {
      menuDivWidth += menuDivs[n - 1].clientWidth;
    }

    const left = (63 + 50 + (104 * num) + menuDivWidth) - 5;
    const dropWin = this.getChildMenuDiv(childMenus, left);
    if (activeMenuKey === 0) {
      this.setState({
        visible: true,
        activeMenuKey: menuKey,
        dropWin,
      });
    } else if (activeMenuKey === menuKey) {
      this.setState({
        visible: !visible,
      });
    } else {
      this.setState({
        visible: true,
        activeMenuKey: menuKey,
        dropWin,
      });
    }
  }

  changeLogWin = () => {
    const { isLogoutShow: status } = this.state;
    this.setState({
      isLogoutShow: !status,
    });
  }

  goPatch = (path) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: path,
    }));
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <div style={{ width: '100%' }}>
        {this.getAllMenus()}
      </div>
    );
  }
}

export default connect()(TopMenu);
