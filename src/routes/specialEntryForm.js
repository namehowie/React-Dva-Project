import React,{Component} from 'react';
import PropTypes from 'prop-types';
import styles from './specialEntryForm.less';
import style from './common.less';
import request from '../utils/request';
import { hashHistory } from 'dva/router';
import { Icon, WhiteSpace, Result} from 'antd-mobile';

class SpecialEntryForm extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      name: '',
      userName: '',
      userCard: '',
      userPhone: '',
      unitName: '',
      unitAddress: '',
      faceteachName: '',
      faceteachId: '',
      trainStarttime: '',
      trainEndtime: '',
      trainPlace: '',
      specialBtn: ''
    };
    this.cvSetId = this.props.location.state.cvSetId;
    this.faceteachId = this.props.location.state.faceteachId;
    this.returnUrl = this.props.location.state.returnUrl;
  }

  goBack = () =>{
    hashHistory.go(-1)
  }

  requestDetail = () =>{
    let cvSetId = this.cvSetId;
    let faceteachId = this.faceteachId;
    console.log(cvSetId);
    console.log(faceteachId);
    let userId = localStorage.userId;
    request(`getSignUp?userId=${userId}&cvSetId=${cvSetId}&faceteachId=${faceteachId}`).then((value)=>{
      console.log(value);
      this.setState({
        name: value.data.name,
        userName: value.data.userName,
        userCard: value.data.userCard,
        userPhone: value.data.userPhone,
        unitName: value.data.unitName,
        unitAddress: value.data.unitAddress,
        faceteachName: value.data.faceteachName,
        faceteachId: value.data.faceteachId,
        trainStarttime: value.data.trainStarttime,
        trainEndtime: value.data.trainEndtime,
        trainPlace: value.data.trainPlace
      });
    });
  }

  componentDidMount() {
   this.requestDetail();
   window.scrollTo(0,0);
   console.log(this.returnUrl);
   if (this.returnUrl != undefined) { //如果returnUrl存在
     this.setState({
       specialBtn: '返回专项'
      })
    }else {
      this.setState({
       specialBtn: ''
      })
    }
  }

  goBackSpecial = () =>{
    let returnUrl = this.returnUrl;
    window.location.href = decodeURIComponent(returnUrl); //URI解码
  }
  
  render() {
    const name = this.state.name;
    const userName = this.state.userName;
    const userCard = this.state.userCard;
    const userPhone = this.state.userPhone;
    const unitName = this.state.unitName;
    const unitAddress = this.state.unitAddress;
    const faceteachName = this.state.faceteachName;
    // const faceteachId = this.state.faceteachId;
    const trainStarttime = this.state.trainStarttime;
    const trainEndtime = this.state.trainEndtime;
    const trainPlace = this.state.trainPlace;
    const specialBtn = this.state.specialBtn;

    return (
      <div>
          <div className={style.headerT}>
             <span className={style.headL} onClick={this.goBack}><Icon type='left'/></span>
             <span className={style.headM}>报名表</span>
             <span className={style.headR} onClick={this.goBackSpecial}>{specialBtn}</span>
          </div>
          <Result
            img={<Icon type="check-circle" className={styles.spe} />}
            className='result'
            title="提交成功"
            message="您已提交报名，以下是您的电子报名表，为增大您的报名成功率，请您与举办机构联系确认。"
          />
          <div className={styles.formWrap}>
            <h3 className={styles.formTitle}>报名表</h3>
            <p className={styles.formP}><span>姓名：</span><span>{userName}</span></p>
            <p className={styles.formP}><span>身份证号：</span><span>{userCard}</span></p>
            <p className={styles.formP}><span>手机号：</span><span>{userPhone}</span></p>
            <p className={styles.formP}><span>单位名称：</span><span>{unitName}</span></p>
            <p className={styles.formP}><span>单位地址：</span><span>{unitAddress}</span></p>
            <p className={styles.formP}><span>项目名称：</span><span>{name}</span></p>
            <p className={styles.formP}><span>培训班次：</span><span>期数 {faceteachName}</span></p>
            <p className={styles.formP}><span>培训时间：</span><span>{trainStarttime} ~ {trainEndtime}</span></p>
            <p className={styles.formP}><span>培训地址：</span><span>{trainPlace}</span></p>
          </div> 
      </div>
    );
  }
}

export default SpecialEntryForm;



