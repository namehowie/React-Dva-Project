import React,{Component} from 'react';
import PropTypes from 'prop-types';
import styles from './mine.less';
import style from './common.less';
import request from '../utils/request';
import { Modal,Toast,ActivityIndicator,InputItem,Button} from 'antd-mobile';
import { hashHistory,Link } from 'dva/router';
import { createForm } from 'rc-form';


var timeClick;
class MineC extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
     mineData:[],
     modal: true,
     value:'',
     passWord:'',
     loginNo:'none',
     loading: 'none'
    }; 
    this.urlData = window.location.href;
  }
  userName = (value) => {
    this.setState({
      value,
    });
  }
  passWord = (passWord) =>{
    this.setState({
      passWord,
    }); 
  }
  componentWillMount = () =>{   //组件将要加载时
    if(localStorage.userId ){  //如果本地存储中有userId
      this.setState({
         modal: false,             //不显示登录modal
         loginNo:'inline-block'    //显示退出按钮
      })
      // Toast.success('恭喜登录成功...', 1);
      this.mineAjax();           //请求账号数据
    }
  }
  loginModal = ()=>{
  }
  componentDidMount = () =>{

  }

  mineAjax = ()=>{     //数据请求函数
    let accountName = localStorage.accountName;
    let userId = localStorage.userId;
    request(`mine?userId=${userId}&accountName=${accountName}`).then((value)=>{
        console.log(value);
        this.setState({
            mineData:value.response.accountInfo,
        })
    })
  }
  goMine = () =>{  
    this.setState({
          modal:false,
          loginNo:'inline-block'
        })
     this.mineAjax()
  }
  loginOut = ()=>{              //退出登录
     localStorage.clear();
     this.setState({
      modal:true,
      value:'',
      passWord:''
    });
  }
  login = () =>{    //登录
    let userName= this.state.value;
    let password = this.state.passWord;
    this.setState({
      loading: 'flex'
    })
    console.log(this.urlData)   
    request(`login?accountName=${userName}&password=${password}`).then((value)=>{
      console.log(value);
      if(userName ==''){
        this.setState({
          loading: 'none'
        })
        Toast.info('请输入用户名...', 2);
        return
      }
      if(password ==''){
        this.setState({
          loading: 'none'
        })
        Toast.info('请输入密码...', 2);
        return
      }
      if(value.response.code == '0'){    
        localStorage.userId = value.response.userId; //本地存储userid  
        localStorage.accountName = value.response.accountName;    
        if (this.urlData.indexOf('returnUrl') != -1) {   //url中存在returnUrl 则跳转专项 
          let returnUrl = this.urlData.split('returnUrl=')[1].split('&')[0];
          window.location.href = decodeURIComponent(returnUrl);  //URI解码
        }else { 
          this.setState({
            loading: 'none'
          })                                     //url中不存在returnUrl         
          Toast.info('恭喜登录成功...', 1);
          this.goMine();
        }
      }else if(value.response.code === '101'){
        this.setState({
            loading: 'none'
          })
      }else if(value.response.code === '-1'&& value.response.message == "用户不存在!"){
        this.setState({
          loading: 'none'
        })
        Toast.info('用户不存在...', 2);
      }else{
        this.setState({
          loading: 'none'
        })
        Toast.info('用户名密码不匹配...', 2);
      }
    })      
  }
  render() {
    const {mineData}= this.state;
    const { getFieldProps } = this.props.form;
     if(localStorage.userId){
      return (
      <div>
         <div className={style.headerT}>
             <span className={style.headL}></span>
             <span className={style.headM}>我的</span>
             <span onClick= {this.loginOut} className={style.headR} style={{display:this.state.loginNo}}>退出</span>
          </div> 
         <div className={styles.mineTop}>
            <div className={styles.mineItem}><span>手机<i>*</i></span><span>{mineData.phone}</span></div>
         </div>
         <div className={styles.mineMiddle}>
            <div className={styles.mineItem}><span>身份证号<i>*</i></span><span>{mineData.certificateNo}</span></div>
            <div className={styles.mineItem}><span>姓名<i>*</i></span><span>{mineData.realName}</span></div>
            <div className={styles.mineItem}><span>用户名</span><span>{mineData.accountName}</span></div>
            <div className={styles.mineItem}><span>性别</span><span>{mineData.sex}</span></div>
         </div>
         <div className={styles.mineBottom}>
            <div className={styles.mineItem}><span>单位名称<i>*</i></span><span>{mineData.workUnit}</span></div>
            <div className={styles.mineItem}><span>单位地址</span><span>{mineData.hospitalAddress}</span></div>
            <div className={styles.mineItem}><span>职务类型<i>*</i></span><span>{mineData.workType}</span></div>
            <div className={styles.mineItem}><span>职称<i>*</i></span><span>{mineData.jobName}</span></div>
            <div className={styles.mineItem}><span>学科<i>*</i></span><span>{mineData.subject}</span></div>
            <div className={styles.mineItem}><span>职业医师号</span><span>{mineData.pCertificateNo}</span></div>
            <div className={styles.mineItem}><span>学历</span><span>{mineData.education}</span></div>
         </div>
      </div>
    )    
    }else{
      return (
        <Modal
          transparent
          maskClosable={false}
          visible={this.state.modal}
          style={{backgroundColor:'#fff',width:'100%',height:'100%'}}
        >
          <div style={{marginTop:'1rem'}}>
            <div className={style.headerTlogin}>
               <span className={style.headL}></span>
               <span className={style.headM}>登录</span>
               <span className={style.headR}></span>
            </div> 
            <div className={styles.navBar}>
              <InputItem
                {...getFieldProps('autofocus')}
                placeholder="输入用户名/手机号/邮箱"
                clear
                autoFocus
                onChange={this.userName}
                value={this.state.value}
              >用户名</InputItem>
              <InputItem
                {...getFieldProps('focus')}
                clear
                type="password"
                value={this.state.passWord}
                onChange={this.passWord}
                placeholder="输入密码"
              >密码</InputItem>
              <Button onClick={this.login} className={styles.loginBtn} type="primary">登录</Button>
              <p className={styles.register}>
                还没有账号去
                <Link to="/register"> 注册</Link>
              </p>
              <div className={styles.loading} style={{display: this.state.loading}}>
                <div className={styles.align}>
                  <ActivityIndicator size="large" />
                  <span style={{ marginTop: 8 }}>正在登录中...</span>
                </div>
              </div>
            </div>
        </div>
        </Modal>
      )
     }
      
  }
}
const Mine = createForm()(MineC);
export default Mine;

