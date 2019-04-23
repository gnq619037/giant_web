import { routerRedux } from 'dva/router';
import { login } from '../services/login';
import { checkSession } from '../services/app';

export default {
  namespace: 'login',
  state: {
    errormsg: '',
  },
  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/login') {
          dispatch({
            type: 'checkIsLogin',
          });
        }
      });
    },
    setup({ dispatch }) {
      dispatch({ type: 'updateHeight' });
      window.onresize = () => {
        dispatch({ type: 'updateHeight' });
      };
    },
  },
  effects: {
    * login({ payload }, { put, call }) {
      yield put({
        type: 'updateState',
        payload: {
          errormsg: '',
        },
      });
      const data = yield call(login, payload);
      const { success, token } = data;
      if (success) {
        window.localStorage.setItem('Eccom-Token', token);
        yield put({ type: 'app/query' });
        yield put(routerRedux.push('/dashboard'));
      } else if (data.fetchSuccess === true) {
        yield put({
          type: 'updateState',
          payload: {
            errormsg: data.errormsg,
          },
        });
      } else {
        yield put({
          type: 'updateState',
          payload: {
            errormsg: '登录请求失败，请联系管理员',
          },
        });
      }
    },

    * checkIsLogin({ payload }, { call, put }) {
      const { status } = yield call(checkSession);
      if (status === 'normal') {
        yield put(routerRedux.push({
          pathname: '/dashboard',
        }));
      }
    },

    * updateHeight({ payload }, { put }) {
      let winHeight = 0;
      if (window.innerHeight) {
        winHeight = window.innerHeight;
      } else if ((document.body) && (document.body.clientHeight)) {
        winHeight = document.body.clientHeight;
      } else {
        winHeight = document.documentElement.clientHeight;
      }
      yield put({
        type: 'updateState',
        payload: {
          winHeight,
        },
      });
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
