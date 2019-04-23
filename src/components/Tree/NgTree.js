import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, Input, Icon } from 'antd';
import styles from './NgTree.css';

const Search = Input.Search;
const TreeNode = Tree.TreeNode;

class NgTree extends Component {
  constructor(props) {
    super(props);
    this.state = { allkey: [],
      autoExpandParent: this.props.autoExpandParent,
      curNode: {},
      checkedKeys: this.props.checkedKeys,
      expandedKeys: this.props.expandedKeys,
      rMenu: [],
      rLeft: 0,
      rTop: 0,
      rMenuDispaly: 'hidden',
      searchValue: '',
      selectedKeys: this.props.selectedKeys,
      trdata: this.props.data,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { expand } = nextProps;
    if (expand) {
      const allKeys = this.getAllKeys(this.state.trdata, []);
      this.setState({ expandedKeys: allKeys });
    } else {
      this.setState({ expandedKeys: [] });
    }
  }

  /**
   * [getAllKeys description]
   * 获取所有树节点的key结合，用于全选中
   * @param  {[type]} data    [description]
   * @param  {[type]} allkeys [description]
   * @return {[type]}         [description]
   */
  getAllKeys = (data, allkeys) => {
    data.map((item) => {
      allkeys.push(item.key);
      if (item.children) {
        this.getAllKeys(item.children, allkeys);
      }
      return allkeys;
    });
    return allkeys;
  }

  /**
   * [getTreeData description]
   * 根据data、模糊查询等，加载树节点
   * @param  {[type]} data      [description]
   * @param  {[type]} level     [description]
   * @param  {[type]} parentKey [description]
   * @return {[type]}           [description]
   */
  getTreeData = (data, level, parentKey) => data.map((item) => {
    const { key: ikey, title: ititle, ...treeProps } = item;
    const { searchValue, hoverId, selectId } = this.state;
    const { bJudge } = this.props;

    const index = ititle.search(searchValue);
    const beforeStr = ititle.substr(0, index);
    const afterStr = ititle.substr(index + searchValue.length);

    let rtitle = [];
    const sTitle = (index > -1 ? (<span key="restspan">{beforeStr}<span key="searchspan" style={{ color: '#f50' }}>{searchValue}</span>{afterStr}</span>)
      : <span key="totalspan">{item.title}</span>);

    if (((hoverId && item.key === hoverId) || (selectId && item.key === selectId)) && (bJudge && bJudge.showStyle === 'horizontal')) {
      const u = this.getButtons(item);
      rtitle = [sTitle, ...u];
    } else {
      rtitle.push(sTitle);
    }
    if (item.children) {
      return (
        <TreeNode key={ikey} title={rtitle} defaultTitle={ititle} level={level} isParent parentKey={parentKey} {...treeProps}>
          {this.getTreeData(item.children, level + 1, ikey)}
        </TreeNode>
      );
    }
    return <TreeNode key={ikey} title={rtitle} defaultTitle={ititle} level={level} isParent={false} parentKey={parentKey} {...treeProps} />;
  })

  /**
   * [getButtons description]
   * 获取树节点的操作按钮栏
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  getButtons = (data) => {
    const { bJudge, buttonEvensts } = this.props;
    const { curNode } = this.state;
    const { key } = data;
    const result = [];
    const treeType = data[bJudge.field];

    if (buttonEvensts === undefined) {
      return result;
    }
    buttonEvensts.map((e) => {
      if (e.type === treeType) {
        let i = 0;
        e.buttons.map((b) => {
          const bkey = `rbdom${key}${i}`;
          if (b.graphIcon) {
            const cssMd = this.getButtonIcons(b.graphIcon);
            const showMsg = (i === 0 ? <span key={bkey} onClick={() => { b.event(curNode); }} className={cssMd} style={{ marginLeft: 10 }} title={b.title} /> :
            <span key={bkey} onClick={() => { b.event(curNode); }} className={cssMd} title={b.title} />);
            result.push(showMsg);
          } else {
            let icon = '';
            if (b.icon && b.icon.type) {
              icon = <Icon type={b.icon.type} spin={b.icon.spin === undefined ? false : b.icon.spin} style={b.icon.style === undefined ? {} : b.icon.style} />;
            }
            const showMsg = (i === 0 ? <span key={bkey} onClick={() => { b.event(curNode); }} style={{ marginLeft: 10 }} title={b.title}>{icon}</span> :
            <span key={bkey} onClick={() => { b.event(curNode); }} title={b.title}>{icon}</span>);
            result.push(showMsg);
          }
          i += 1;
          return result;
        });
      }
      return result;
    });
    return result;
  }

  /**
   * [getButtonIcons description]
   * 获取树节点操作栏中按钮的图案样式
   * @param  {[type]} icon [description]
   * @return {[type]}      [description]
   */
  getButtonIcons = (icon) => {
    let cssMd;
    if (icon === 'add') {
      cssMd = styles.add;
    }
    if (icon === 'addnode') {
      cssMd = styles.addnode;
    }
    if (icon === 'adddiv') {
      cssMd = styles.adddiv;
    }
    if (icon === 'move') {
      cssMd = styles.move;
    }
    if (icon === 'edit') {
      cssMd = styles.edit;
    }
    if (icon === 'update') {
      cssMd = styles.update;
    }
    if (icon === 'remove') {
      cssMd = styles.remove;
    }
    return cssMd;
  }

  /**
   * [getRightMenu description]
   * 获取操作下拉菜单的内容
   * @return {[type]} [description]
   */
  getRightMenu=() => {
    const { bJudge, buttonEvensts } = this.props;
    const { curNode } = this.state;
    const result = [];
    const key = curNode.node.props.eventKey;

    if (bJudge && buttonEvensts && bJudge.field && bJudge.showStyle === 'vertical') {
      const treeType = curNode.node.props[bJudge.field];
      buttonEvensts.map((e) => {
        if (e.type === treeType) {
          let i = 0;
          e.buttons.map((b) => {
            const bkey = `rbdom${key}${i}`;
            const showMsg = <li key={bkey} onClick={() => { b.event(curNode); }} className={styles.rmculli}><a className={styles.rmcullia}><span>{b.title}</span></a></li>;
            result.push(showMsg);
            i += 1;
            return result;
          });
        }
        return result;
      });
    }
    return result;
  }

  /**
   * [handleSearch description]
   * 模糊查询对应的oninput事件
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  handleSearch = (e) => {
    this.setState({ searchValue: e.target.value });
  }

  /**
   * [handleMouseEnter description]
   * @param  {[type]} event [description]
   * @param  {[type]} node  [description]
   * @return {[type]}       [description]
   */
  handleMouseEnter=({ event, node }) => {
    this.setState({ hoverId: node.props.eventKey,
      curNode: { event, node } });
    if (this.props.onEvents && this.props.onEvents.onMouseEnter) {
      this.props.onEvents.onMouseEnter({ event, node });
    }
  }

  /**
   * [handleMouseLeave description]
   * @param  {[type]} event [description]
   * @param  {[type]} node  [description]
   * @return {[type]}       [description]
   */
  handleMouseLeave=({ event, node }) => {
    this.setState({ hoverId: '' });
    if (this.props.onEvents && this.props.onEvents.onMouseLeave) {
      this.props.onEvents.onMouseLeave({ event, node });
    }
  }

  /**
   * [handleSelect description]
   * @param  {[type]} selectedKeys [description]
   * @param  {[type]} e            [description]
   * @return {[type]}              [description]
   */
  handleSelect=(selectedKeys, e) => {
    const eventKey = e.node.props.eventKey;
    if (selectedKeys.length === 0 || selectedKeys.length > 1) {
      if (selectedKeys.length > 1) {
        selectedKeys = [];
      }
      selectedKeys.push(eventKey);
      e.selectedNodes.push(e.node);
      e.selected = true;
    }
    /* 以上操作是为了默认只选择一个树节点，且多次点击同一节点也会保持选中的状态*/

    this.setState({ selectId: selectedKeys[0], selectedKeys, rMenuDispaly: 'hidden' });
    if (this.props.onEvents && this.props.onEvents.onSelect) {
      this.props.onEvents.onSelect(selectedKeys, e);
    }
  }

  /**
   * [handleExpand description]
   * @param  {[type]} expandedKeys [description]
   * @param  {[type]} e            [description]
   * @return {[type]}              [description]
   */
  handleExpand=(expandedKeys, e) => {
    this.setState({ rMenuDispaly: 'hidden', expandedKeys, autoExpandParent: false });
    if (this.props.onEvents && this.props.onEvents.onExpand) {
      this.props.onEvents.onExpand(expandedKeys, e);
    }
  }

  /**
   * [handleCheck description]
   * @param  {[type]} checkedKeys [description]
   * @param  {[type]} e           [description]
   * @return {[type]}             [description]
   */
  handleCheck=(checkedKeys, e) => {
    this.setState({ rMenuDispaly: 'hidden', checkedKeys });
    if (this.props.onEvents && this.props.onEvents.onCheck) {
      this.props.onEvents.onCheck(checkedKeys, e);
    }
  }

  /**
   * [handleFilterTreeNode description]
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  handleFilterTreeNode=(node) => {
    if (this.props.onEvents && this.props.onEvents.filterTreeNode) {
      this.props.onEvents.filterTreeNode(node);
    }
  }

  /**
   * [handleRightClick description]
   * @param  {[type]} event [description]
   * @param  {[type]} node  [description]
   * @return {[type]}       [description]
   */
  handleRightClick=({ event, node }) => {
    if (this.props.onEvents && this.props.onEvents.onRightClick) {
      this.props.onEvents.onRightClick({ event, node });
    }
    const rmenus = this.getRightMenu();
    if (rmenus.length === 0) {
      this.setState({ rMenu: rmenus, rLeft: event.pageX, rTop: event.pageY, rMenuDispaly: 'hidden' });
    } else {
      this.setState({ rMenu: rmenus, rLeft: event.pageX, rTop: event.pageY, rMenuDispaly: 'visible' });
    }
  }

  handleRMenuClick = () => {
    this.setState({ rMenuDispaly: 'hidden' });
  }

  /**
   * [handleDragStart description]
   * @param  {[type]} event [description]
   * @param  {[type]} node  [description]
   * @return {[type]}       [description]
   */
  handleDragStart=({ event, node }) => {
    this.setState({ rMenuDispaly: 'hidden' });
    if (this.props.onEvents && this.props.onEvents.onDragStart) {
      this.props.onEvents.onDragStart({ event, node });
    }
  }

  /**
   * [handleDragEnter description]
   * @param  {[type]} event        [description]
   * @param  {[type]} node         [description]
   * @param  {[type]} expandedKeys [description]
   * @return {[type]}              [description]
   */
  handleDragEnter=({ event, node, expandedKeys }) => {
    this.setState({ rMenuDispaly: 'hidden' });
    if (this.props.onEvents && this.props.onEvents.onDragEnter) {
      this.props.onEvents.onDragEnter({ event, node, expandedKeys });
    }
  }

  /**
   * [handleDragOver description]
   * @param  {[type]} event [description]
   * @param  {[type]} node  [description]
   * @return {[type]}       [description]
   */
  handleDragOver=({ event, node }) => {
    this.setState({ rMenuDispaly: 'hidden' });
    if (this.props.onEvents && this.props.onEvents.onDragOver) {
      this.props.onEvents.onDragEnter({ event, node });
    }
  }

  /**
   * [handleDragLeave description]
   * @param  {[type]} event [description]
   * @param  {[type]} node  [description]
   * @return {[type]}       [description]
   */
  handleDragLeave=({ event, node }) => {
    this.setState({ rMenuDispaly: 'hidden' });
    if (this.props.onEvents && this.props.onEvents.onDragLeave) {
      this.props.onEvents.onDragLeave({ event, node });
    }
  }

  /**
   * [handleDragEnd description]
   * @param  {[type]} event [description]
   * @param  {[type]} node  [description]
   * @return {[type]}       [description]
   */
  handleDragEnd=({ event, node }) => {
    this.setState({ rMenuDispaly: 'hidden' });
    if (this.props.onEvents && this.props.onEvents.onDragEnd) {
      this.props.onEvents.onDragEnd({ event, node });
    }
  }

  /**
   * [handleDrop description]
   * @param  {[type]} event         [description]
   * @param  {[type]} node          [description]
   * @param  {[type]} dragNode      [description]
   * @param  {[type]} dragNodesKeys [description]
   * @return {[type]}               [description]
   */
  handleDrop=({ event, node, dragNode, dragNodesKeys }) => {
    this.setState({ rMenuDispaly: 'hidden' });
    if (this.props.onEvents && this.props.onEvents.onDragEnd) {
      this.props.onEvents.onDragEnd({ event, node, dragNode, dragNodesKeys });
    }
  }

  render() {
    const { selectedKeys, expandedKeys, checkedKeys, autoExpandParent, maxWidth, maxHeight, ...treeProps } = this.props;
    const { selectedKeys: sselectedKeys, expandedKeys: sexpandedKeys, checkedKeys: scheckedKeys,
      autoExpandParent: sautoExpandParent, rMenu, rLeft, rTop, rMenuDispaly } = this.state;

    return (
      <div>
        <Search style={{ width: 300, marginTop: 5, marginLeft: 5 }} placeholder="Search" onInput={this.handleSearch} /><br />
        <div
          className={styles.rmc} style={{ left: `${rLeft}px`, top: `${rTop}px`, visibility: `${rMenuDispaly}` }}
          onClick={this.handleRMenuClick}
        ><ul className={styles.rmcul}>{rMenu}</ul></div>
        <div
          style={{ maxWidth,
            maxHeight,
            overflow: 'auto',
            borderTopWidth: 1,
            borderTopStyle: 'solid',
            borderTopColor: '#F1F1F1',
            borderLeftWidth: 1,
            borderLeftStyle: 'solid',
            borderLeftColor: '#F1F1F1',
            marginLeft: 5,
            marginTop: 2 }}
        >
          <Tree
            selectedKeys={sselectedKeys}
            expandedKeys={sexpandedKeys}
            checkedKeys={scheckedKeys}
            autoExpandParent={sautoExpandParent}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            onSelect={this.handleSelect}
            onExpand={this.handleExpand}
            onCheck={this.handleCheck}
            filterTreeNode={this.handleFilterTreeNode}
            onRightClick={this.handleRightClick}
            onDragStart={this.handleDragStart}
            onDragEnter={this.handleDragEnter}
            onDragOver={this.handleDragOver}
            onDragLeave={this.handleDragLeave}
            onDragEnd={this.handleDragEnd}
            onDrop={this.handleDrop}
            {...treeProps}
          >
            {this.getTreeData(this.state.trdata, 0)}
          </Tree>
        </div>
      </div>
    );
  }
}

NgTree.propTypes = {
  autoExpandParent: PropTypes.bool,
  checkable: PropTypes.bool,
  data: PropTypes.array.isRequired,
  defaultExpandAll: PropTypes.bool,
  defaultCheckkeys: PropTypes.array,
  defaultExpandedkeys: PropTypes.array,
  expandkeys: PropTypes.array,
  selectedkeys: PropTypes.array,
  showLine: PropTypes.bool,
  showIcon: PropTypes.bool,
  bJudge: PropTypes.object,
};

NgTree.defaultProps = {
  autoExpandParent: true,
  data: [],
  checkedKeys: [],
  expandedKeys: [],
  selectedKeys: [],
  onEvents: {},
  maxWidth: 300,
  maxHeight: 900,
};

export default NgTree;
