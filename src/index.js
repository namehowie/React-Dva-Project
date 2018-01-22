import dva from 'dva';
import { hashHistory } from 'dva/router';
import './index.less';

// 1. Initialize
const browserHistory = hashHistory;
const app = dva({  history: hashHistory,});

// 2. Model
// app.model(require('./models/example'));

// 3. Router
app.router(require('./router.js'));

// 4. Start
app.start('#root');
