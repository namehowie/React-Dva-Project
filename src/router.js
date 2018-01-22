import React from 'react';
import {Router} from 'dva/router';
import PropTypes from 'prop-types'


function RouterConfig({ history, app }) {
  const routes = [
    {
      path: '/mine',
      name: 'mine',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require(`./routes/mine`));
        });
      },
    },
    {
      path: '/',
      name: 'index',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require(`./routes/mine`));
        });
      },
    },
    {
      path: '/register',
      name: 'register',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require(`./routes/register`));
        });
      },
    },
    {
      path: '/special',
      name: 'special',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require(`./routes/special`));
        });
      }
    },
    {
      path: '/specialDetail',
      name: 'specialDetail',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require(`./routes/specialDetail`));
        });
      }
    },
    {
      path: '/specialEntryForm',
      name: 'specialEntryForm',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require(`./routes/specialEntryForm`));
        });
      }
    },
    {
      path: '/broadcast',
      name: 'broadcast',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require(`./routes/broadcast`));
        });
      },
    },
    {
      path: '/beforegobroad',
      name: 'beforegobroad',
      getComponent(nextState, cb) {
        require.ensure([], (require) => {
          cb(null, require(`./routes/beforegobroad`));
        });
      },
    }
    
  ];

  return <Router history={history} routes={routes} />;
}

RouterConfig.propTypes = {
  history: PropTypes.object.isRequired
};

export default RouterConfig;




