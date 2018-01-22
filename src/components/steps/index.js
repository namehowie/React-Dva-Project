import React, {Component} from 'react';
import styles from './style.less';
import style from '../../routes/common.less';
import {browserHistory} from 'dva/router';


class Steps extends Component {
  constructor(props) {
    super(props);
    console.log(props.current);
    this.state = {
      current: props.current || 1
    };
  }

  componentWillMount() {
    
  }
  componentDidMount() {
    
  }
  componentWillUpdate() {
    
  }
  componentDidUpdate() {
    
  }

  componentWillReceiveProps(newstate){
    this.setState({
      current: newstate.current
    })
  }
  render() {
    const t = this;
    const {state} = t;
    return (
      <div>
        <div className={styles['steps-container']}>
          <div className={state.current === 1 ? styles['step-blue'] : styles['step-gray']}>1</div>
          <span className={state.current === 1 ? styles['step-blue'] : styles['step-gray']}></span>
          <span className={state.current === 2 ? styles['step-blue'] : styles['step-gray']}></span>
          <div className={state.current === 2 ? styles['step-blue'] : styles['step-gray']}>2</div>
        </div>
        <div className={styles['steps-title']}>
          <span className={state.current === 1 ? styles['title-blue'] : styles['title-gray']}>工作信息</span>
          <span className={state.current === 2 ? styles['title-blue'] : styles['title-gray']}>账号验证</span>
        </div>
      </div>
    );
  }
}

export default Steps;
