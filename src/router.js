import React from 'react';
import { Router } from 'dva/router';
import App from './routes/app';
import Base from './routes/base';
import Login from './routes/login';
import NotFound from './routes/error/notFound';
import NoRight from './routes/error/noRight';

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model);
  }
};

function RouterConfig({ history, app }) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/dashboard'));
          cb(null, { component: require('./routes/dashboard/') });
        }, 'dashboard');
      },
      childRoutes: [
        {
          path: 'dashboard',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/dashboard'));
              cb(null, require('./routes/dashboard/'));
            }, 'dashboard');
          },
        },
        // {
        //   path: 'sysconfig',
        //   getComponent(nextState, cb) {
        //     require.ensure([], (require) => {
        //       registerModel(app, require('./models/sysconfig'));
        //       cb(null, require('./routes/sysconfig/'));
        //     }, 'sysconfig');
        //   },
        //   childRoutes: [
        //     {
        //       path: 'timetrigger',
        //       getComponent(nextState, cb) {
        //         require.ensure([], (require) => {
        //           cb(null, require('./routes/sysconfig/timetrigger/'));
        //         }, 'timetrigger');
        //       },
        //     },
        //   ],
        // },
        {
          path: 'system',
          getComponent(nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/system'));
              cb(null, require('./routes/system/'));
            }, 'system');
          },
          childRoutes: [
            {
              path: 'overview',
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  cb(null, require('./routes/system/overview/'));
                }, 'overview');
              },
            },
            // {
            //   path: 'usermgt',
            //   getComponent(nextState, cb) {
            //     require.ensure([], (require) => {
            //       cb(null, require('./routes/system/usermgt/'));
            //     }, 'usermgt');
            //   },
            // },
            {
              path: 'userinfocheck',
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  cb(null, require('./routes/system/usermgtdetail/userInfoCheck'));
                }, 'userinfocheck');
              },
            },
            {
              path: 'userstrategycheck',
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  cb(null, require('./routes/system/usermgtdetail/userStrategyCheck'));
                }, 'userstrategycheck');
              },
            },
            {
              path: 'usergroupcheck',
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  cb(null, require('./routes/system/usermgtdetail/userGroupCheck'));
                }, 'usergroupcheck');
              },
            },
            {
              path: 'groupmgt',
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  cb(null, require('./routes/system/groupmgt/'));
                }, 'groupmgt');
              },
            },
            {
              path: 'groupinfocheck',
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  cb(null, require('./routes/system/groupmgtdetail/groupInfoCheck'));
                }, 'groupinfocheck');
              },
            },
            {
              path: 'groupstrategycheck',
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  cb(null, require('./routes/system/groupmgtdetail/groupStrategyCheck'));
                }, 'groupstrategycheck');
              },
            },
            {
              path: 'groupusercheck',
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  cb(null, require('./routes/system/groupmgtdetail/groupUserCheck'));
                }, 'groupusercheck');
              },
            },
            {
              path: 'strategymgt',
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  cb(null, require('./routes/system/strategymgt/'));
                }, 'strategymgt');
              },
            },
            {
              path: 'setting',
              getComponent(nextState, cb) {
                require.ensure([], (require) => {
                  cb(null, require('./routes/system/setting/'));
                }, 'setting');
              },
            },
          ],
        },
      ],
    }, {
      path: '/',
      component: Base,
      childRoutes: [
        {
          path: 'login',
          component: Login,
        },
        {
          path: 'noRight',
          component: NoRight,
        },
        {
          path: '*',
          component: NotFound,
        },
      ],
    },
  ];

  return <Router history={history} routes={routes} />;
}

export default RouterConfig;
