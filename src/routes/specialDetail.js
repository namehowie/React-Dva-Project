import React,{Component} from 'react';
import PropTypes from 'prop-types';
import styles from './specialDetail.less';
import style from './common.less';
import request from '../utils/request';
import requestZxnl from '../utils/requestZxnl';
import { hashHistory } from 'dva/router';
import { Flex,Popup, List, Button, InputItem, Icon, WhiteSpace, Toast} from 'antd-mobile';

class SpecialDetail extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      name:'',
      code:'',
      scode:'',
      teacher:'',
      institutions:'',
      address:'',
      startDate:'',
      endDate:'',
      lists:[],
      courseLists:[],
      SignUpBtn: 'inline-block',
      noSignUpBtn: 'none',
      faceteachId: 1,
      faceteachName: 1,
      arr: []
    };
    this.xmId = this.props.location.state.xmId;
    this.returnUrl = this.props.location.state.returnUrl;
  }

  goBack = () =>{
    hashHistory.go(-1)
  }

  requestDetail = () =>{
    let xmId = this.xmId;
    console.log(xmId)
    console.log(this.returnUrl)
    let userId = localStorage.userId;
    request(`specialDetail?userId=${userId}&id=${xmId}`).then((value)=>{
      console.log(value);
      let listArr = value.data.list;
      let arr = [];
      let faceteachId;
      let faceteachName;
      let trainStatue;
      for(let i=0;i<listArr.length;i++){
        if(listArr[i].timeStatue == 0){    //当循环到第一个未过期时
          arr[listArr[i].faceteachName]=true;  //对应唯一标示设为 true
          faceteachName = listArr[i].faceteachName;  //当前对应 faceteachName
          faceteachId = listArr[i].faceteachId;  //当前对应 faceteachId
          if (listArr[i].trainStatue == 1) {  //当前报名状态
            this.setState({
              SignUpBtn: 'none',
              noSignUpBtn: 'inline-block'
            })     
          }else {
            this.setState({
              SignUpBtn: 'inline-block',
              noSignUpBtn: 'none'
            })
          }
          break;   //退出循环
        }else {
          this.setState({
            SignUpBtn: 'none',
            noSignUpBtn: 'none'
          })
        }
      }
      this.setState({
        name: value.data.name,
        code: value.data.code,
        scode: value.data.scode,
        teacher: value.data.teacher,
        institutions: value.data.institutions,
        address: value.data.address,
        startDate: value.data.startDate,
        endDate: value.data.endDate,
        lists: value.data.list,
        courseLists: value.data.courseList,
        arr: arr,
        faceteachName: faceteachName,
        faceteachId: faceteachId
      });
    });

  }

  qsChoose = (v) =>{
    console.log(v);
    let arr=[];
    arr[v.faceteachName]=true;  //当前选中的对应唯一标识设为 true
    this.setState({
      faceteachName: v.faceteachName,
      faceteachId: v.faceteachId,
      arr: arr
    });
    if (v.trainStatue == 1) {
      this.setState({
        SignUpBtn: 'none',
        noSignUpBtn: 'inline-block'
      })     
    }else {
      this.setState({
        SignUpBtn: 'inline-block',
        noSignUpBtn: 'none'
      })
    }
  }

  signUp = () =>{
    
    let faceteachId = this.state.faceteachId;
    let cvSetId = this.xmId;
    let accountName = localStorage.accountName;
    let userId = localStorage.userId;
    request(`mine?userId=${userId}&accountName=${accountName}`).then((value)=>{
      console.log(value);
      let accountInfo = value.response.accountInfo;
      let studentKey = userId;
      let studentName = accountInfo.realName;
      let gender = accountInfo.sex;
      let idNumber = accountInfo.certificateNo;
      let mobile = accountInfo.phone;
      let companyName = accountInfo.workUnit;
      let office = accountInfo.subject;
      let spclProjectNo = this.state.scode;
      let baseName = this.state.institutions;
      let periodNum = this.state.faceteachName;
      request(`jfsignUp?studentKey=${studentKey}&studentName=${studentName}&gender=${gender}
        &idNumber=${idNumber}&mobile=${mobile}&companyName=${companyName}&office=${office}
        &spclProjectNo=${spclProjectNo}&baseName=${baseName}&periodNum=${periodNum}`).then((value)=>{
          console.log(value);
          if(value.code == 1) {
            request(`signUp?userId=${userId}&cvSetId=${cvSetId}&faceteachId=${periodNum}`).then((value)=>{
              console.log(value)
              if (value.status == 1) {
                if (this.returnUrl != undefined) {   //存在returnUrl 则传递到报名表页 
                  let returnUrl = this.returnUrl;                
                  hashHistory.push({pathname: '/specialEntryForm',state: { cvSetId: cvSetId, faceteachId: periodNum, returnUrl: returnUrl}});
                }else {                                      //不存在returnUrl         
                  hashHistory.push({pathname: '/specialEntryForm',state: { cvSetId: cvSetId, faceteachId: periodNum}});
                }                
              }else {
                Toast.fail('报名失败', 2);
              }
            })
          }else {
            Toast.fail('报名失败', 2);
          }
        })
    })   
  }

  goEntryForm = () =>{
    let faceteachId = this.state.faceteachId;
    let cvSetId = this.xmId;
    let periodNum = this.state.faceteachName;
    if (this.returnUrl != undefined) {   //存在returnUrl 则传递到报名表页  
      let returnUrl = this.returnUrl;               
      hashHistory.push({pathname: '/specialEntryForm',state: { cvSetId: cvSetId, faceteachId: periodNum, returnUrl: returnUrl}});
    }else {                                      //不存在returnUrl         
      hashHistory.push({pathname: '/specialEntryForm',state: { cvSetId: cvSetId, faceteachId: periodNum}});
    }
  }

  componentDidMount() {
    this.requestDetail();
    window.scrollTo(0,0)
  }
  
  render() {
    const name = this.state.name;
    const code = this.state.code;
    const teacher = this.state.teacher;
    const institutions = this.state.institutions;
    const address = this.state.address;
    const startDate = this.state.startDate;
    const endDate = this.state.endDate;
    const {lists}= this.state;
    const {courseLists}= this.state;
    const arr = this.state.arr;

    const listItem = lists.map((list) => 
      <Button type="ghost" 
        inline size="small"
        key={list.faceteachName}
        className={(arr[list.faceteachName]==true ?styles.activeBtn : styles.qsBtn)}
        onClick={this.qsChoose.bind(this,list)}
        disabled = {(list.timeStatue == 1) ? true : false}
      >{list.faceteachName} 期</Button>)

    const courseListItem = courseLists.map((courseList) =>
      <li className={styles.courseLi} key={courseList.courseId}>
        <p>课程<span>{courseList.courseId}</span>： <span>{courseList.courseName}</span></p>
        <p>{courseList.courseTime}</p>
        <p>授课教师： {courseList.teacher_name}</p>
      </li>)

    return (
      <div>
          <div className={style.headerT}>
             <span className={style.headL} onClick={this.goBack}><Icon type='left'/></span>
             <span className={style.headM}>专项能力培训详情</span>
             <span className={style.headR}></span>
          </div>
          <div className={styles.detailWrap} >
            <h3 className={styles.detailTitle}>{name}</h3>
            <p className={styles.detailP}>项目编号：<span>{code}</span></p>
            <p className={styles.detailP}>项目负责人：<span>{teacher}</span></p>
            <p className={styles.detailP}>基地/机构：<span>{institutions}</span></p>
            <p className={styles.detailP}>培训地点：<span>{address}</span></p>
            <p className={styles.detailP}>培训时间：<span>{startDate}</span>~<span>{endDate}</span></p>
          </div> 
          <div className={styles.qsWrap}>
            <p className={styles.detailP}>培训期数</p>
            <div>{listItem}</div>
            <WhiteSpace size='lg' />
            <ul className={styles.courseUl}>{courseListItem}</ul>
          </div>
          <div className={styles.btnWrap}>
            <Button 
              type='primary'
              onClick={this.signUp}
              style={{display: this.state.SignUpBtn}}
            >报名</Button>
            <Button 
              className={styles.halfBtn}
              style={{display: this.state.noSignUpBtn}}
              disabled
            >已报名</Button>
            <Button 
              className={styles.halfBtn} 
              style={{display: this.state.noSignUpBtn}}
              type='primary' 
              onClick={this.goEntryForm}
            >查看报名表</Button>                   
          </div>         
      </div>
    );
  }
}

export default SpecialDetail;



