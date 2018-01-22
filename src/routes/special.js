import React,{Component} from 'react';
import PropTypes from 'prop-types';
import styles from './special.less';
import style from './common.less';
import request from '../utils/request';
import { hashHistory } from 'dva/router';
import { Flex,Popup, List, Button, InputItem,Icon} from 'antd-mobile';
import SpecialList from '../components/SpecialList'

class Special extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
  
    };
  }
  // goBack = () =>{
  //   window.history.go(-1)
  // }
  
  render() {
    return (
      <div>
          <div className={style.headerT}>
             <span className={style.headL}></span>
             <span className={style.headM}>专项能力培训</span>
             <span className={style.headR}></span>
             <SpecialList />
          </div> 
      </div>
    );
  }
}

export default Special;



