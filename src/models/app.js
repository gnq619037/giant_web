import { routerRedux } from 'dva/router';
import { showTip, checkSession, getUserRelateInfos, logout, serverError,
  editPassword } from '../services/app';

export default {
  namespace: 'app',
  state: {
    showname: '',
    menus: {},
    isTokenPass: false,
    isMenuPass: false,
    menuPaths: [],
    allMenuPaths: [],
    siderFold: true,
    passwordModalVisible: false,
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
          },
        });
      });
    },

    setup({ dispatch }) {
      dispatch({ type: 'updateWidth' });
      dispatch({ type: 'query' });
      window.onresize = () => {
        dispatch({ type: 'updateWidth' });
      };
    },
  },
  effects: {
    * query({ payload }, { call, put, select }) {
      const token = window.localStorage.getItem('Eccom-Token');
      if (token === null || token === '') {
        yield put(routerRedux.push({
          pathname: '/login',
        }));
      } else {
        const { success, showname, menus, menuPaths, allMenuPaths,
        userMassage } = yield call(getUserRelateInfos);
        if (success) {
          const { locationPathname } = yield select(_ => _.app);
          yield put({
            type: 'updateState',
            payload: {
              showname,
              menus,
              isTokenPass: true,
              menuPaths,
              allMenuPaths,
              userMassage,
            },
          });
          if (allMenuPaths.includes(locationPathname) && !menuPaths.includes(locationPathname)) {
            window.location.href = '/noRight';
          }
        } else {
          yield call(serverError);
          yield put(routerRedux.push('/login'));
        }
      }
    },

    * checkSession({ payload }, { call, put }) {
      const { status } = yield call(checkSession);
      if (status === 'out') {
        window.localStorage.removeItem('Eccom-Token');
        yield put(routerRedux.push({
          pathname: '/login',
        }));
      }
    },

    * logout({ payload }, { put, call }) {
      yield call(logout);
      window.localStorage.removeItem('Eccom-Token');
      yield put(routerRedux.push('/login'));
    },

    * updateWidth({ payload }, { put }) {
      let winWidth = 0;
      if (window.innerWidth) {
        winWidth = window.innerWidth;
      } else if ((document.body) && (document.body.clientWidth)) {
        winWidth = document.body.clientWidth;
      } else {
        winWidth = document.documentElement.clientWidth;
      }
      yield put({
        type: 'updateState',
        payload: {
          winWidth,
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
