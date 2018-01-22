import React, { Component } from 'react';
import { hashHistory,Link } from 'dva/router';
import request from '../utils/request';
import styles from './itemBroad.less';
import style from '../routes/common.less';
import {Modal, Popup, List,ActivityIndicator, Button, InputItem,Toast, Icon } from 'antd-mobile';
import { createForm } from 'rc-form';
import Ripples from 'react-ripples';

const prompt = Modal.prompt;
class ItemBroadT extends Component {
  constructor(props){
     super(props);
     this.state = {
        isDisplay:'none',
        clickDetail:'clickBtnup.png',
        modal: false,
        modalT: false,
        value:'',
        learn:'',
        passWord:'',
        passWordT:'',
        colorFont:'',
        bgColor:'#fff',
        loading: 'none'
    };
  }
  toggle = (e) =>{
    //阻止事件冒泡
    e.stopPropagation();
    if(this.state.clickDetail == "clickBtnup.png"){
        this.setState({
                clickDetail:'clickBtndown.png',
              })
    }else{
       this.setState({
        clickDetail:'clickBtnup.png',
      })
    }
    this.state.isDisplay == 'none' ? this.setState({
        isDisplay:'block',
      }):this.setState({
        isDisplay:'none',
      })
  }
  onMaskClose = () => {

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
  learn = (learn) => {
     console.log(learn)
    this.setState({
      learn,
    });
  }
  passWordT = (passWordT)=>{
   this.setState({
      passWordT,
    });
   if(this.state.passWordT && this.state.learn){
      this.setState({
        colorFont:'#fff',
        bgColor:'#12bce1'
      })
   }else{
      this.setState({
        colorFont:'',
        bgColor:'#fff'
      })
   }
  }
  goMine = () =>{  
    this.setState({
          modal:false
        })
  }
  login = (rowData) =>{
    
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
        this.setState({
          modal:false
        })
        this.goBroadDetail(rowData)
        localStorage.isNewPage = true;
      }else if(value.response.code === '101'){
        this.setState({
          loading: 'none'
        })
        Toast.info('请输入用户名...', 2);
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
  showActionSheet = (playbackList,cvId ) =>{
    // e.preventDefault(); // 修复 Android 上点击穿透
    Popup.show(<PopupContent playbackList={playbackList} cvId={cvId} onClose={() => Popup.hide()} />, { });
  }
  goBroadDetail = (rowData) =>{

    let playbackList = rowData.viewBackUrlList;
    let nickname = localStorage.accountName;
    let cvId = rowData.cvId
    let userId = localStorage.userId;
    if(rowData.type == 1){
      if(localStorage.userId){
        request(`islearning?cvId=${cvId}&userId=${userId}`).then((value)=>{
            let bindFlag = value.response.bindFlag;
            if(bindFlag == 1){
                  this.setState({
                      modalT: true,
                  });  
            }else{
                request(`learning?cvId=${cvId}&userId=${userId}`).then((value)=>{
                 })
                 let coursewareNo = '';
                hashHistory.push(`/beforegobroad/?&cvId=${cvId}&coursewareNo=${coursewareNo}&studentJoinUrl=${rowData.studentJoinUrl}` )
            }
        })
      }else{
        this.setState({
          modal:true
        })
      }
    }else if(rowData.type == 4){
       if(localStorage.userId){
          request(`islearning?cvId=${cvId}&userId=${userId}`).then((value)=>{
            let bindFlag = value.response.bindFlag;
            if(bindFlag == 1){
                this.setState({
                    modalT: true,
                });  
            }else{
                this.showActionSheet(playbackList,cvId)
            }
          })
        }else{
            this.setState({
              modal:true
            });
        }  
    }else if(rowData.type == 2){
      // let startDate = rowData.startDate.slice(5,7)+'月'+rowData.startDate.slice(8,10)+'日 '+rowData.startDate.slice(11,13)+':'+rowData.startDate.slice(14,16)
      // let endDate = rowData.startDate.slice(8,10) == rowData.endDate.slice(8,10) ?(rowData.endDate.slice(11,13)+':'+rowData.endDate.slice(14,16)) : (rowData.endDate.slice(5,7)+'月'+rowData.endDate.slice(8,10)+'日 '+rowData.endDate.slice(11,13)+':'+rowData.endDate.slice(14,16))
      // let lookLater = <div style={{}}>{`直播未开始，请于${startDate}-${endDate}观看`}</div>
      // Toast.info(lookLater, 2);
      Toast.info("即将开课，敬请期待！", 2);
    }else if (rowData.type == 3) {
      Toast.info("直播已结束~", 2);
    }else{
       Toast.info('直播已结束，请耐心等待转码~', 2);
    }   
  }

  onCloseT = (rowData) => {
    let cvId = rowData.cvId;
    let userId = localStorage.userId;
    let cardNumber = this.state.learn;
    let cardPassword = this.state.passWordT;
    let nickname = localStorage.accountName;
    let broadDetail = `${rowData.studentJoinUrl}?nickname=${nickname}&token=${rowData.token}&uid=${parseInt(userId)+parseInt(1000000000)}`
    let playbackList = rowData.viewBackUrlList
    request(`addlearning?cvId=${cvId}&userId=${userId}&cardNumber=${cardNumber}&cardPassword=${cardPassword}`).then((value)=>{
        console.log(value);
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
           this.setState({
            modalT: false,
          });
          if(rowData.type == 1){
            request(`learning?cvId=${cvId}&userId=${userId}`).then((value)=>{
                  
                     })
            let coursewareNo = '';
            let studentJoinUrl = 'studentJoinUrl'
            hashHistory.push(`/beforegobroad/?&cvId=${cvId}&coursewareNo=${coursewareNo}&studentJoinUrl=${studentJoinUrl}` )
          }else{
             this.showActionSheet(playbackList,cvId)
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
  closeBy =()=>{
    this.setState({
      modalT: false,
      learn:'',
      passWordT:'',
      bgColor:'#fff',
      colorFont:''
    })
  }
  
  render() {
    var typeText;
    var learningK;
    const { getFieldProps } = this.props.form;
    const {isDisplay} = this.state;
    const {rowID ,rowData} = this.props;
    let startDate = rowData.startDate.slice(5,7)+'月'+rowData.startDate.slice(8,10)+'日 '+rowData.startDate.slice(11,13)+':'+rowData.startDate.slice(14,16)
    let endDate = rowData.startDate.slice(8,10) == rowData.endDate.slice(8,10) ?(rowData.endDate.slice(11,13)+':'+rowData.endDate.slice(14,16)) : (rowData.endDate.slice(5,7)+'月'+rowData.endDate.slice(8,10)+'日 '+rowData.endDate.slice(11,13)+':'+rowData.endDate.slice(14,16))
    const attributeB = {style:{textAlign: 'right',float:'right',marginTop:'.21rem',width:'.5rem',display: 'inline-block'}}
    const attributeJ = {style:{fontSize:'.24rem',color:"#666",marginTop:'.11rem'}}
    const attributeD = {style:{color:'#666',fontSize:'.26rem',lineHeight:'.36rem',wordWrap:'break-word',wordBreak:'break-all'}}
    const attributeC = {style:{color:'#444',fontSize:'.28rem',padding:'.11rem 0'}}
    const attributeF = {style:{padding: '0.18rem 0.16rem 0.1rem 0.16rem',background: 'white'}}
    const attributeQ = {style:{border: '1px solid #e1e1e1',position:'relative',width: '35%', marginRight: '0.18rem',height:"auto",textAlign: 'center',height:'1.78rem'}}
    const attributeS = {style:{marginRight: '.1rem', textAlign: 'center',marginTop:'.21rem',padding:'.01rem .1rem',display:'inline-block',borderRadius:'.03rem'}}
    const attributeST = {style:{marginRight: '.1rem', textAlign: 'center',marginTop:'.21rem',padding:'.01rem .1rem',display:'inline-block',borderRadius:'.03rem'}}
    const attributeW = {style:{position:'absolute',left:'0',bottom:0,backgroundColor:'rgba(0,0,0,0.4)',color:'#fff',fontSize:'.20rem',width:'100%',padding:'.1rem',textAlign:'left'}}
    const attributeI = {
          src:require('../assets/'+this.state.clickDetail),
          style:{width:'40%'}
    }
    const attrMakesure = {
      style:{border:'1px solid #ccc',borderRadius:'5px',padding:'.2rem .4rem',marginRight:'.2rem',background:this.state.bgColor,color:this.state.colorFont}
    }
    const color =(color) =>{
      attributeS.style.backgroundColor =color
      attributeS.style.color = '#fff'
    }
    const colorT =(color) =>{
      attributeST.style.backgroundColor = color
      attributeST.style.color = '#fff'
    }
    if(rowData.type == 1){
      color('green') 
       typeText = "正在直播"
    }else if(rowData.type == 2){
      color('red')
      typeText = "即将开课"
    }else if(rowData.type == 5){
      color('#ccc')
      typeText = "已经结束"
    }else if(rowData.type == 3){
      color('#ccc')
      typeText = "已经结束"
    }else{
      color('#00c2e7')
      typeText = "观看回放"
    }
    if(rowData.costType == 0){
       colorT('green') 
       learningK = "免费"
    }else if(rowData.costType == 1){
       colorT('#00c2e7') 
       learningK = "学习卡"
    }else{
       colorT('#ccc')
       learningK = "收费"
    }
    return (
    <div>
       <Ripples style={{width:'100%'}} color='rgba(231, 226, 226, .4)' during ={2000}>
       <div key={rowID} {...attributeF} onClick={this.goBroadDetail.bind(this,rowData)}>
          <div style={{ display: '-webkit-box', display: 'flex',}} >
            <div {...attributeQ}>
              <img style={{maxHeight: '1.78rem',maxWidth:'100%'}} src={rowData.filePath} />
              <div {...attributeW}><span>{startDate}-</span><span>{endDate}</span></div> 
            </div>
            <div style={{ display: 'inline-block',flex:1,width:'100%',overflow:'hidden'}}>
              <div style={{fontSize:'.32rem',marginBottom:'.1rem'}}>{rowData.cvName}</div>
              <div {...attributeJ}><span>授课教师:</span><span>{rowData.teacherName}</span></div>
              <div {...attributeJ}><span><img style={{width:'.3rem'}} src={require('../assets/people.png')}/>人数:</span><span>{rowData.studentNum}</span></div>
              <div style={{fontSize:'.22rem', paddingTop:'.1rem'}}><span {...attributeS}>
                {typeText}
              </span>
              <span {...attributeST}>
                 {learningK}
              </span>
              <span {...attributeB} onClick = {(e) => this.toggle(e)}><img {...attributeI}/></span></div>
            </div>
          </div>
          <div style={{display:`${isDisplay}`}}>
              <div {...attributeC}>课程简介</div>
              <div {...attributeD}>{rowData.introduction}</div>
            </div>
        </div>
        </Ripples>
        <Modal
          transparent
          maskClosable={false}
          visible={this.state.modal}
          style={{backgroundColor:'#fff',width:'100%',height:'100%'}}
        >
          <div style={{marginTop:'1rem'}}>
            <div className={style.headerTlogin}>
               <span className={style.headL} onClick={this.goMine}><Icon type='left'/></span>
               <span className={style.headM}>登录</span>
               <span className={style.headR}></span>
            </div> 
            <div className={styles.navBar}>
            <div style={{marginBottom:'.7rem'}}>
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
            </div>
              <Button onClick={this.login.bind(this,rowData)} className={styles.loginBtn} type="primary">登录</Button>
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
              <div style={{textAlign:'right',paddingBottom:'.2rem',marginTop:'.4rem',marginBottom:'.2rem'}}><span {...attrMakesure} onClick={this.closeBy}>取消</span><span {...attrMakesure} onClick={this.onCloseT.bind(this,rowData)}>确定</span></div>
        </Modal>
    </div>
    );
  }
}

class PopupContent extends React.Component {
  state = {
    sel: ''
  };
  onSel = (item,cvId) => {
    this.props.onClose()
    let coursewareUrl = item.coursewareUrl
    localStorage.coursewareUrl = item.coursewareUrl
    let coursewareToken = item.coursewareToken
    localStorage.coursewareToken = item.coursewareToken
    let nickname = localStorage.accountName;
    let uid = localStorage.userId;
    hashHistory.push(`/beforegobroad/?&cvId=${cvId}&coursewareNo=${item.coursewareNo}` )
  }
  render() {
    const {playbackList,cvId} = this.props;
    let playbackItem = playbackList.map(function(item,index){
        return <div key={index} onClick={() => {this.onSel(item,cvId)}} style={{height:'.8rem',textAlign:'center',lineHeight:'.8rem',borderBottom:'1px solid #d3d3d3'}}>{item.coursewareName}</div>
        },this)
    return (
      <div>
        <div style={{height:'auto'}}>
          <List>
             {playbackItem}
          </List>
        </div>
      </div>
    );
  }
}


const ItemBroad = createForm()(ItemBroadT);
export default ItemBroad;