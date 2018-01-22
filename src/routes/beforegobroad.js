import React, { Component } from 'react';
import { hashHistory,Link } from 'dva/router';
import request from '../utils/request';
import { Modal,Toast,ActivityIndicator,InputItem,Button} from 'antd-mobile';
import style from './common.less';
import styles from './beforegobroad.less'
import { createForm } from 'rc-form';
import Dimensions from 'react-dimensions'


class BeforegobroadT extends Component {
  constructor(props){
     super(props);
     this.state = {
       modal: false,
       modalT:false,
       value:'',
       passWord:'',
       broadDetail:'',
       learn:'',
       passWordT:'',
       loading: 'none'
    };
    this._isMounted;
  }
  userName = (value) => {
    this.setState({
      value,
    });
  }
  learn = (learn) => {
    this.setState({
      learn,
    });
  }
  passWordT = (passWordT)=>{
   this.setState({
      passWordT,
    });
  }
  passWord = (passWord) =>{
    this.setState({
      passWord,
    }); 
  }
 closeBy =()=>{
    this.setState({
      modalT: false,
    })
    WeixinJSBridge.call("closeWindow");
  }
  onCloseT = () => {
    let url = window.location.hash 
    let urlDeal = url.slice(17,url.length);
    let cvId =  urlDeal.match(/&cvId=(\S*)&coursewareNo/)[1];
    let userId = localStorage.userId;
    let cardNumber = this.state.learn;
    let cardPassword = this.state.passWordT;
    let coursewareUrl;
    let coursewareToken;
    let studentJoinUrl;
    let coursewareTokenz;
    let classNo;
    let titleName;
    request(`beforegobroad?${urlDeal}`).then((value)=>{
        //回放
        coursewareUrl = value.response.viewBack.coursewareUrl;
        coursewareToken = value.response.viewBack.coursewareToken;
        //直播
        coursewareTokenz = value.response.liveBroadcast.token;
        classNo = value.response.liveBroadcast.classNo;
        studentJoinUrl = value.response.liveBroadcast.studentJoinUrl;
        titleName = value.response.liveBroadcast.className;
    })  
    request(`addlearning?cvId=${cvId}&userId=${userId}&cardNumber=${cardNumber}&cardPassword=${cardPassword}`).then((value)=>{
        let message = value.response.message;
        if(cardNumber == ''){
           Toast.info('卡号不能为空...', 2);
           return false;
        }
        if(cardPassword == ''){
           Toast.info('密码不能为空...', 2);
           return false;
        }
        if(message == "success!"){
          //绑卡成功直接进直播或者回放
          let nickname = localStorage.accountName;
          let uid = localStorage.userId;
          let email = `${uid}@ncmeorg.cn`;
          if(urlDeal.indexOf("studentJoinUrl") >-1){             
              let broadDetail;
              if (coursewareTokenz == "ncmexzx16"){
                broadDetail = `http://e.vhall.com/webinar/inituser/${classNo}?embed=video&email=${email}&name=${uid}`
              }else {             
                broadDetail = `${studentJoinUrl}?nickname=${nickname}&token=${coursewareTokenz}&uid=${parseInt(uid)+parseInt(1000000000)}`
              }
              window.document.title = titleName; //动态设置title
              request(`learning?cvId=${cvId}&userId=${uid}`).then((value)=>{
              })
              this.setState({
                  broadDetail:broadDetail
              })
          }else{
              
              let broadDetail = `${coursewareUrl}?nickname=${nickname}&token=${coursewareToken}&uid=${parseInt(uid)+parseInt(1000000000)}`
              this.setState({
                modalT: false,
                broadDetail:broadDetail
              })
          }       
        }else if(message == 'notbind'){
          Toast.info('该学习卡无法学习此项目，请输入匹配的卡号和密码！...', 2);
          return false;
          
        }else if(message == 'time'){
          Toast.info('该学习卡已过期，无法添加！', 2);
          return false;
         
        }else if(message == 'notfind'){
          Toast.info('输入的卡号或密码错误...', 2);
          return false;
          
        }else if(message == 'typeno'){
          Toast.info('该学习卡已被停用，无法添加！', 2);
          return false;
        }else if(message == 'alreadyBind'){
          Toast.info('该学习卡已被使用，无法再次添加！', 2);
            return false;
          }
    })
  }
  
  goBroadT= () =>{
    //链接进入
    let url = window.location.hash 
    let urlDeal = url.slice(17,url.length);
    let cvId =  urlDeal.match(/&cvId=(\S*)&coursewareNo/)[1];
    if(urlDeal.indexOf("studentJoinUrl") >-1){
        //直播
        let coursewareNo = '';
        request(`beforegobroad?cvId=${cvId}&coursewareNo=${coursewareNo}`).then((value)=>{
        let coursewareToken = value.response.liveBroadcast.token;
        let classNo = value.response.liveBroadcast.classNo;
        let studentJoinUrl = value.response.liveBroadcast.studentJoinUrl;
        let titleName = value.response.liveBroadcast.className;
        let userId = localStorage.userId;
        if(value.response.code == "0"){
            if(localStorage.userId){
                request(`islearning?cvId=${cvId}&userId=${userId}`).then((value)=>{
                    let bindFlag = value.response.bindFlag;
                    if(bindFlag == 1){
                        this.setState({
                            modalT: true,
                            modal:false

                        }); 
                    }else{
                        let nickname = localStorage.accountName;
                        let uid = localStorage.userId 
                        let email = `${uid}@ncmeorg.cn`;
                        let broadDetail;
                        if (coursewareToken == "ncmexzx16"){
                          broadDetail = `http://e.vhall.com/webinar/inituser/${classNo}?embed=video&email=${email}&name=${uid}`
                        }else {             
                          broadDetail = `${studentJoinUrl}?nickname=${nickname}&token=${coursewareToken}&uid=${parseInt(uid)+parseInt(1000000000)}`
                        }
                        window.document.title = titleName;
                        request(`learning?cvId=${cvId}&userId=${uid}`).then((value)=>{
                                 })
                        this.setState({
                            broadDetail:broadDetail,
                            modal:false
                        })                        
                    }
                })
            }else{
              this.setState({
                      modal:true
                    })
            }
            

        }
      })
    }else{
      //回放
      request(`beforegobroad?${urlDeal}`).then((value)=>{
              let coursewareUrl = value.response.viewBack.coursewareUrl;
              let coursewareToken = value.response.viewBack.coursewareToken;
              localStorage.coursewareUrl = coursewareUrl
              localStorage.coursewareToken = coursewareToken
              let userId = localStorage.userId;
              if(value.response.code == "0"){
                  if(localStorage.userId){
                    //已经登录，在新页面判断是否绑卡
                      request(`islearning?cvId=${cvId}&userId=${userId}`).then((value)=>{
                          let bindFlag = value.response.bindFlag;
                          if(bindFlag == 1){
                                this.setState({
                                    modalT: true,
                                    modal:false

                                }); 
                          }else{
                              let nickname = localStorage.accountName;
                              let uid = localStorage.userId 
                              let broadDetail = `${coursewareUrl}?nickname=${nickname}&token=${coursewareToken}&uid=${parseInt(uid)+parseInt(1000000000)}`
                              this.setState({
                                modal:false,
                                broadDetail:broadDetail
                              })
                              
                          }
                      })
                  }else{
                    this.setState({
                      modal:true
                    })
                  }
              }
          })
    }

  }
   goBroad= () =>{
    //正常进入
    let url = window.location.hash 
    let urlDeal = url.slice(17,url.length);
    let cvId =  urlDeal.match(/&cvId=(\S*)&coursewareNo/)[1];
    let coursewareNo = '';
    if(urlDeal.indexOf("studentJoinUrl") >-1){
        //直播
        request(`beforegobroad?cvId=${cvId}&coursewareNo=${coursewareNo}`).then((value)=>{
        let coursewareToken = value.response.liveBroadcast.token;
        let classNo = value.response.liveBroadcast.classNo;
        let uid;
        let studentJoinUrl = value.response.liveBroadcast.studentJoinUrl;
        let titleName = value.response.liveBroadcast.className;
        if(value.response.code == "0"){
            let nickname = localStorage.accountName;
            uid = localStorage.userId ;
            let email = `${uid}@ncmeorg.cn`;
            let broadDetail;
            if (coursewareToken == "ncmexzx16"){
              broadDetail = `http://e.vhall.com/webinar/inituser/${classNo}?embed=video&email=${email}&name=${uid}`
            }else {             
              broadDetail = `${studentJoinUrl}?nickname=${nickname}&token=${coursewareToken}&uid=${parseInt(uid)+parseInt(1000000000)}`
            }  
            window.document.title = titleName;          
            request(`learning?cvId=${cvId}&userId=${uid}`).then((value)=>{
                     })
            this.setState({
                  broadDetail:broadDetail
              })
        }
      })
    }else{
      //回放
      this._isMounted = true
      request(`beforegobroad?${urlDeal}`).then((value)=>{
        console.log(value)
        let coursewareUrl = value.response.viewBack.coursewareUrl;
        let coursewareToken = value.response.viewBack.coursewareToken;
        let userId = localStorage.userId;
        if(value.response.code == "0"){
            let nickname = localStorage.accountName;
            let uid = localStorage.userId;
            // let broadDetail = 'http://e.vhall.com/webinar/inituser/481101073?embed=video'
            let broadDetail = `${coursewareUrl}?nickname=${nickname}&token=${coursewareToken}&uid=${parseInt(uid)+parseInt(1000000000)}`
            if (this._isMounted) {
              this.setState({
                  broadDetail:broadDetail
              })
          }
        }
      })
    }
    
  }
  login = () =>{
    let accountName= this.state.value;
    let password = this.state.passWord;
    this.setState({
      loading: 'flex'
    })
    request(`login?accountName=${accountName}&password=${password}`).then((value)=>{
      if(accountName ==''){
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
      if(value.response.code === '0'){
        this.setState({
            loading: 'none'
          })
        Toast.info('恭喜登录成功...', 1);
        localStorage.userId = value.response.userId
        localStorage.accountName = value.response.accountName;
        this.goBroadT()
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
  componentWillUnmount() {
    this._isMounted = false;
    window.document.title = "中国继续医学教育网"
  }
  componentDidMount(){
    if(localStorage.isNewPage){
      //正常进入，不需要判断登录和邦卡  
      this.goBroad()
    }else{
      //链接进入，需要登录拦截和绑卡判断
      // if(localStorage.userId){
        this.goBroadT()     
    }
  }
 
  render() {

    const attrMakesure = {
      style:{border:'1px solid #ccc',borderRadius:'5px',padding:'.2rem .4rem',marginRight:'.2rem'}
    }
    let iframeHeight = this.props.containerHeight;
    const broadDetail = this.state.broadDetail;
    // broadDetail.indexOf("http://e.vhall.com/webinar/inituser/") >-1 ? iframeHeight=this.props.containerHeight/3 : iframeHeight=this.props.containerHeight
    if(localStorage.isNewPage){
      //正常进入，不需要判断登录和邦卡
      return (
        <div>
           <iframe width="100%" height={iframeHeight} frameBorder="0" scrolling="no" src={broadDetail}></iframe>
        </div>
      )
    }else{
      //链接进入，需要登录拦截和绑卡判断
      if(localStorage.userId){
          if(broadDetail !==''){
           return (
            <div>
               <iframe width="100%" height={iframeHeight} frameBorder="0" scrolling="no" src={broadDetail}></iframe>
            </div>
          )
          }
         
      }
      
    }
    const { getFieldProps } = this.props.form;
      return (
        <div>
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
              <div style={{}}>
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
          <Modal
            title="添加学习卡"
            transparent
            style={{backgroundColor:'#fff',width:'90%'}}
            maskClosable={true}
            visible={this.state.modalT}
            onClose={this.closeBy}
            className="cardModal"
          >
           <div style={{width:'84%',margin:'0 auto',color:'rgb(181, 181, 181)'}}><span style={{color:'red'}}>*</span>该卡只能绑定一个账户，且只能在绑定账户消费</div>
              <InputItem
                  {...getFieldProps('autofocus')}
                  placeholder="输入卡号"
                  clear
                  onChange={this.learn}
                  value={this.state.learn}
                >卡号</InputItem>
                <InputItem
                  {...getFieldProps('focus')}
                  clear
                  type="password"
                  value={this.state.passWordT}
                  onChange={this.passWordT}
                  placeholder="输入密码"
                >密码</InputItem>
                <div style={{textAlign:'right',paddingBottom:'.2rem',marginTop:'.4rem',marginBottom:'.2rem'}}><span {...attrMakesure} onClick={this.closeBy}>取消</span><span {...attrMakesure} onClick={this.onCloseT}>确定</span></div>
          </Modal>
        </div>
      )
  }
}


const Beforegobroad = createForm()(BeforegobroadT);
export default Dimensions()(Beforegobroad);



 