import { routerRedux } from 'dva/router';
import { saveAd, getAd, showTip, deleteStrategy, getallMenus, createOrUpdateStrategy, createOrUpdateGroup,
  deleteGroup, getAllStrategys, updateGroupStrategy, getAllGroupUsers, updateGroupUser, getGroupById,
  deleteUser, createOrUpdateUser, updateUserStrategy, getAllGroups, updateUserGroup, getUserById, getOverview,
  getLdapTree, updateLdapInfos, editPassword } from '../services/system';

export default {
  namespace: 'system',
  state: {
    ad: {},
    allMenus: {},
    groupModalVisible: false,
    groupTransferModalVisible: false,
    gstModalVisible: false,
    userModalVisible: false,
    ustModalVisible: false,
    ugtModalVisible: false,
    adUserModalVisible: false,
    strategyModalVisible: false,
    passwordModalVisible: false,
    userNum: 0,
    groupNum: 0,
    strategyNum: 0,
    ldapTree: [],
    treeValiStatus: '',
    firstOpen: true,
    reloadUser: false,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const { pathname, query = {} } = location;
        if (pathname.indexOf('system') > -1) {
          dispatch({
            type: 'query',
            payload: {
              pathname,
              query,
            },
          });
        }
      });
    },
  },
  effects: {
    * query({ payload }, { put, select }) {
      const { pathname, query = {} } = payload;
      if (pathname === '/system/' || pathname === '/system' || pathname === 'system') {
        const { menuPaths } = yield select(_ => _.app);
        let indexPath = '';
        if (menuPaths.includes('/system/overview')) {
          indexPath = '/system/overview';
        } else if (menuPaths.includes('/system/usermgt')) {
          indexPath = '/system/usermgt';
        } else if (menuPaths.includes('/system/groupmgt')) {
          indexPath = '/system/groupmgt';
        } else if (menuPaths.includes('/system/strategymgt')) {
          indexPath = '/system/strategymgt';
        } else {
          indexPath = '/system/setting';
        }
        yield put(routerRedux.push({
          pathname: indexPath,
        }));
      }
      if (pathname === '/system/setting') {
        yield put({ type: 'getAd' });
      }
      if (pathname === '/system/strategymgt') {
        yield put({ type: 'getallMenus' });
      }
      if (pathname === '/system/groupinfocheck') {
        yield put({ type: 'getGroupById', payload: query });
      }
      if (pathname === '/system/overview' || pathname === '/system') {
        yield put({ type: 'getOverview' });
      }
      if (pathname === '/system/userinfocheck' ||
        pathname === '/system/usergroupcheck' ||
        pathname === '/system/userstrategycheck') {
        yield put({ type: 'updateState', payload: { reloadUser: false } });
        yield put({ type: 'getUserById', payload: query });
      }
      if (pathname === '/system/groupinfocheck' ||
        pathname === '/system/groupstrategycheck' ||
        pathname === '/system/groupusercheck') {
        yield put({ type: 'updateState', payload: { reloadGroup: false } });
      }
    },

    * saveAd({ payload }, { call }) {
      const { success, fetchSuccess } = yield call(saveAd, payload);
      let result = {};
      if (success) {
        result = {
          tip: 'AD信息保存成功',
          type: 'success',
        };
      } else if (fetchSuccess === true) {
        result = {
          tip: 'AD信息保存失败',
          type: 'error',
        };
      } else {
        result = {
          tip: 'AD信息保存请求失败',
          type: 'error',
        };
      }
      yield call(showTip, result);
    },

    * getAd({ payload }, { call, put }) {
      const { success, ad } = yield call(getAd);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            ad,
          },
        });
      }
    },

    * getallMenus({ payload }, { call, put }) {
      const { success, allMenus } = yield call(getallMenus);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            allMenus,
          },
        });
      }
    },

    *createOrUpdateStrategy({ payload }, { call, put }) {
      const { success, msg } = yield call(createOrUpdateStrategy, payload);
      let isClose = true;
      if (success) {
        let result = {};
        if (msg === 'save') {
          result = {
            tip: '策略保存成功',
            type: 'success',
          };
        } else {
          result = {
            tip: '策略名称重复',
            type: 'error',
          };
          isClose = false;
        }
        yield call(showTip, result);
      } else {
        const result = {
          tip: '策略保存失败',
          type: 'error',
        };
        yield call(showTip, result);
      }
      if (isClose) {
        yield put({
          type: 'updateState',
          payload: {
            strategyModalVisible: false,
            reloadStrategy: true,
            firstOpen: true,
          },
        });
      }
    },

    *deleteStrategy({ payload }, { call, put }) {
      const { success } = yield call(deleteStrategy, payload);
      if (success) {
        const result = {
          tip: '删除策略成功',
          type: 'success',
        };
        yield call(showTip, result);
        yield put({
          type: 'updateState',
          payload: {
            reloadStrategy: true,
          },
        });
      } else {
        const result = {
          tip: '删除策略失败',
          type: 'error',
        };
        yield call(showTip, result);
      }
    },

    *createOrUpdateGroup({ payload }, { call, put, select }) {
      const { success, msg } = yield call(createOrUpdateGroup, payload);
      let isClose = true;
      if (success) {
        let result = {};
        if (msg === 'save') {
          const { groupModalType } = yield select(_ => _.system);
          result = {
            tip: '群组保存成功',
            type: 'success',
          };
          if (groupModalType === 'editGroup') {
            const { id } = payload;
            const { success: gsuccess, theGroup } = yield call(getGroupById, { id: `${id}` });
            if (gsuccess) {
              yield put({
                type: 'updateState',
                payload: {
                  currentGroupRecord: theGroup,
                },
              });
            }
          }
        } else {
          isClose = false;
          result = {
            tip: '群组名称重复',
            type: 'error',
          };
        }
        yield call(showTip, result);
      } else {
        const result = {
          tip: '群组保存失败',
          type: 'error',
        };
        yield call(showTip, result);
      }
      if (isClose) {
        yield put({
          type: 'updateState',
          payload: {
            groupModalVisible: false,
            reloadGroup: true,
          },
        });
      }
    },

    *deleteGroup({ payload }, { call, put }) {
      const { success } = yield call(deleteGroup, payload);
      if (success) {
        const result = {
          tip: '删除群组成功',
          type: 'success',
        };
        yield call(showTip, result);
        yield put({
          type: 'updateState',
          payload: {
            reloadGroup: true,
          },
        });
      } else {
        const result = {
          tip: '删除群组失败',
          type: 'error',
        };
        yield call(showTip, result);
      }
    },

    * getAllStrategys({ payload }, { call, put }) {
      const { success, allStrategys } = yield call(getAllStrategys);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            allStrategys,
          },
        });
      }
    },

    * updateGroupStrategy({ payload }, { call, put }) {
      const { success } = yield call(updateGroupStrategy, payload);
      if (success) {
        const result = {
          tip: '群组授权信息保存成功',
          type: 'success',
        };
        yield call(showTip, result);
      } else {
        const result = {
          tip: '群组授权信息保存失败',
          type: 'error',
        };
        yield call(showTip, result);
      }
      yield put({
        type: 'updateState',
        payload: {
          groupTransferModalVisible: false,
          reloadGroup: true,
        },
      });
    },

    * getAllGroupUsers({ payload }, { call, put }) {
      const { id } = payload;
      const iid = Number(id);
      const { success, allUsers, groupUsers } = yield call(getAllGroupUsers, { id: iid });
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            allUsers,
            groupUsers,
          },
        });
      }
    },

    * updateGroupUser({ payload }, { call, put }) {
      const { success } = yield call(updateGroupUser, payload);
      if (success) {
        const result = {
          tip: '编辑组成员保存成功',
          type: 'success',
        };
        yield call(showTip, result);
      } else {
        const result = {
          tip: '编辑组成员保存失败',
          type: 'error',
        };
        yield call(showTip, result);
      }
      yield put({
        type: 'updateState',
        payload: {
          gstModalVisible: false,
          reloadGroup: true,
        },
      });
    },

    * getGroupById({ payload }, { call, put }) {
      const { success, theGroup } = yield call(getGroupById, payload);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            currentGroupRecord: theGroup,
          },
        });
      }
    },

    *deleteUser({ payload }, { call, put }) {
      const { success, msg } = yield call(deleteUser, payload);
      if (success) {
        const result = {
          tip: '删除用户成功',
          type: 'success',
        };
        yield call(showTip, result);
        yield put({
          type: 'updateState',
          payload: {
            reloadUser: true,
          },
        });
      } else {
        const result = {
          tip: msg,
          type: 'error',
        };
        yield call(showTip, result);
      }
    },

    *createOrUpdateUser({ payload }, { call, put, select }) {
      const { success, msg } = yield call(createOrUpdateUser, payload);
      let isClose = true;
      if (success) {
        let result = {};
        if (msg === 'save') {
          const { userModalType } = yield select(_ => _.system);
          result = {
            tip: '用户信息保存成功',
            type: 'success',
          };
          if (userModalType === 'editUser') {
            const { id } = payload;
            const { success: usuccess, theUser } = yield call(getUserById, { id: Number(id) });
            if (usuccess) {
              yield put({
                type: 'updateState',
                payload: {
                  currentUserRecord: theUser,
                },
              });
            }
          }
        } else {
          isClose = false;
          result = {
            tip: '用户名重复',
            type: 'error',
          };
        }
        yield call(showTip, result);
      } else {
        const result = {
          tip: '用户信息保存失败',
          type: 'error',
        };
        yield call(showTip, result);
      }
      if (isClose) {
        yield put({
          type: 'updateState',
          payload: {
            userModalVisible: false,
            reloadUser: true,
          },
        });
      }
    },

    * updateUserStrategy({ payload }, { call, put }) {
      const { reloadId, ...uss } = payload;
      const { success } = yield call(updateUserStrategy, uss);
      if (reloadId) {
        yield put({
          type: 'getUserById',
          payload: {
            id: reloadId,
          },
        });
      }
      if (success) {
        const result = {
          tip: '用户授权信息保存成功',
          type: 'success',
        };
        yield call(showTip, result);
      } else {
        const result = {
          tip: '用户授权信息保存失败',
          type: 'error',
        };
        yield call(showTip, result);
      }
      yield put({
        type: 'updateState',
        payload: {
          ustModalVisible: false,
          reloadUser: true,
        },
      });
    },

    * getAllGroups({ payload }, { call, put }) {
      const { success, allGroups } = yield call(getAllGroups);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            allGroups,
          },
        });
      }
    },

    * updateUserGroup({ payload }, { call, put }) {
      const { reloadId, ...ugs } = payload;
      const { success } = yield call(updateUserGroup, ugs);
      if (reloadId) {
        yield put({
          type: 'getUserById',
          payload: {
            id: reloadId,
          },
        });
      }
      if (success) {
        const result = {
          tip: '加入组信息保存成功',
          type: 'success',
        };
        yield call(showTip, result);
      } else {
        const result = {
          tip: '加入组信息保存失败',
          type: 'error',
        };
        yield call(showTip, result);
      }
      yield put({
        type: 'updateState',
        payload: {
          ugtModalVisible: false,
          reloadUser: true,
        },
      });
    },

    * getUserById({ payload }, { call, put }) {
      const { id } = payload;
      const { success, theUser } = yield call(getUserById, { id: Number(id) });
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            currentUserRecord: theUser,
          },
        });
      }
    },

    * getOverview({ payload }, { call, put }) {
      const { success, userNum, groupNum, strategyNum } = yield call(getOverview);
      if (success) {
        yield put({
          type: 'updateState',
          payload: {
            userNum,
            groupNum,
            strategyNum,
          },
        });
      }
    },

    * getLdapTree({ payload }, { call, put }) {
      const { success, errormsg, ldapTree } = yield call(getLdapTree, payload);
      if (errormsg !== undefined) {
        const result = {
          tip: errormsg,
          type: 'error',
        };
        yield call(showTip, result);
      } else if (success) {
        yield put({
          type: 'updateState',
          payload: {
            ldapTree,
          },
        });
        yield put({ type: 'getAllGroups' });
        yield put({
          type: 'updateState',
          payload: {
            ugsModalVisible: true,
          },
        });
      }
    },

    * updateLdapInfos({ payload }, { call, put }) {
      const { success } = yield call(updateLdapInfos, payload);
      if (success) {
        const result = {
          tip: 'AD信息同步成功',
          type: 'success',
        };
        yield call(showTip, result);
      } else {
        const result = {
          tip: 'AD信息同步失败',
          type: 'error',
        };
        yield call(showTip, result);
      }
      yield put({
        type: 'updateState',
        payload: {
          ugsModalVisible: false,
          adUserModalVisible: false,
          reloadUser: true,
        },
      });
    },

    // 修改用户密码
    * editPassword({ payload }, { call, put }) {
      const { success } = yield call(editPassword, payload);
      if (success) {
        const result = {
          tip: '密码修改成功',
          type: 'success',
        };
        yield call(showTip, result);
        yield put({
          type: 'updateState',
          payload: {
            passwordModalVisible: false,
          },
        });
      } else {
        const result = {
          tip: '密码修改失败',
          type: 'error',
        };
        yield call(showTip, result);
      }
    },

  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
