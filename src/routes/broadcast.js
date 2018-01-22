import React,{Component} from 'react';
import PropTypes from 'prop-types';
import styles from './broadcast.less';
import style from './common.less';
import request from '../utils/request';
import { hashHistory } from 'dva/router';
import { Flex,Popup, List, Button, InputItem} from 'antd-mobile';
import PopupContent from '../components/PopupContent'
import ListBroad from '../components/ListBroad'

let maskPropss= {
    broadType: ["ALL",1,2,3,4],
    subType:["ALL","全科医学","妇产科学","儿科学","精神卫生学","康复医学","医学教育与卫生管理","传染病学","骨外科学","泌尿外科学","外科学其他学科","耳鼻喉科","肾脏病学","心血管病学"]
  };
class Broadcast extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
        subS:true,
        chooseWhat:'',
        chooseWhatT:'',
        nameBtn:'',
        sta:true,
        Highlight:'#ffffff',
        HighlightT:'#ffffff',
        arrowPng:'down.png',
        arrowPngT:'down.png',
        clickW:[],
        howManyNum:'',
        cWhatBack:'',
        chooseWhatBackT:''  
    };
    this.stateS = true;

  }

  clickWhat = (chooseWhat,clickName) =>{
    if(clickName == "stS"){
        this.setState({
          chooseWhatT:chooseWhat,
          clickName,
          HighlightT:'#ffffff',
          Highlight:'#ffffff'
        })
        if(chooseWhat == "ALL"){
           this.setState({
              chooseWhat:'',
              chooseWhatT:''
           })
        }
    }else{
       this.setState({
          chooseWhat:chooseWhat,
          clickName,
          HighlightT:'#ffffff',
          Highlight:'#ffffff'
        })
       if(chooseWhat == "ALL"){
           this.setState({
             chooseWhat:'',
              chooseWhatT:''
           })
        }
    }
   
    clickName == "stS" ? this.state.arrowPngT == "down.png"?this.setState({arrowPngT:'up.png',}):this.setState({arrowPngT:'down.png',}):''
    clickName == "subS" ? this.state.arrowPng == "down.png"?this.setState({arrowPng:'up.png',}):this.setState({arrowPng:'down.png',}):''
    this.stateS = true
  }
  hideOrShow = (statuS,maskData) =>{
    let staa = this.stateS; 
    let sta= this.state.sta
    const onMaskClose = () => {
       this.stateS = true;
    }
    if(staa){
      Popup.show(<PopupContent clickName={statuS} clickWhat= {this.clickWhat} onClose={() => Popup.hide()} chooseType={maskData}/>, {maskClosable: false,onMaskClose});
      this.stateS = false;
      this.setState({
        sta:false
      })
    }else{
      Popup.hide();
      this.stateS = true
      this.setState({
        sta:true
      })
    }
   
  }

  subChoose = (e) => {
    e.preventDefault();
    if(this.state.arrowPngT == "up.png"){
        Popup.hide();
        this.stateS = true
        this.setState({
        HighlightT:'#ffffff',
        arrowPngT:'down.png'
      })
    }else{
      this.state.Highlight == "#ffffff" ? this.setState({
        Highlight:'#e7e2e2',
        HighlightT:'#ffffff'
      }):this.setState({
        Highlight:'#ffffff'
      })
      this.hideOrShow('subS',maskPropss.subType)
      if(this.state.arrowPng == "down.png"){
          this.setState({
            arrowPng:'up.png',
            arrowPngT:'down.png'
                })
      }else{
         this.setState({
            arrowPng:'down.png',
        })
      }
    }
    
  };
  stateChoose = (e) => {
    e.preventDefault();
    if(this.state.arrowPng == "up.png"){
        Popup.hide();
        this.stateS = true
        this.setState({
        Highlight:'#ffffff',
        arrowPng:'down.png'
      })
    }else{
      if(this.state.arrowPng == "up.png"){
        console.log('')
      }
      this.state.HighlightT == "#ffffff" ? this.setState({
        HighlightT:'#e7e2e2',
        Highlight:'#ffffff'
      }):this.setState({
        HighlightT:'#ffffff'
      })
      this.hideOrShow('stS',maskPropss.broadType)
      if(this.state.arrowPngT == "down.png"){
          this.setState({
            arrowPngT:'up.png',
            arrowPng:'down.png'
                })
      }else{
         this.setState({
            arrowPngT:'down.png',
        })
      }
    }
  }
  listBack =(howMany,chooseWhatBack,chooseWhatBackT)=>{
    this.setState({
      howManyNum: howMany,
      cWhatBack:chooseWhatBack,
      chooseWhatBackT,
    })   
  }
  render() {
    let typeText ='';
    let cWhatBack = this.state.cWhatBack
    if(this.state.chooseWhatBackT == 1){
       typeText = "正在直播"
    }else if(this.state.chooseWhatBackT == 2){
      typeText = "即将开课"
    }else if(this.state.chooseWhatBackT == 5){
      typeText = "已经结束"
    }else if(this.state.chooseWhatBackT == 4){
      typeText = "观看回放"
    }else if(this.state.chooseWhatBackT == 3){
      typeText = "已经结束"
    }else if(this.state.chooseWhatBackT == "ALL"){
      typeText = "全部"
    }
    if(this.state.cWhatBack == 'ALL'){
         cWhatBack = "全部"
    }
    window.chooseWhat = this.state.chooseWhat;
    window.chooseWhatT = this.state.chooseWhatT;
    return (
      <div>
          <div className={style.headerT}>
             <span className={style.headL}></span>
             <span className={style.headM}>精彩直播</span>
             <span className={style.headR}></span>
          </div> 
          <Flex>
            <Flex.Item onClick={this.subChoose} style={{backgroundColor:this.state.Highlight}}>学科<img style={{width:'.25rem',display:'inline-block',marginLeft:'.3rem'}} src={require('../assets/'+this.state.arrowPng)}/></Flex.Item>
            <Flex.Item onClick={this.stateChoose} style={{backgroundColor:this.state.HighlightT}}>状态<img src={require('../assets/'+this.state.arrowPngT)} style={{width:'.25rem',display:'inline-block',marginLeft:'.3rem'}}/></Flex.Item>
          </Flex>
          {this.state.cWhatBack !== '' || this.state.chooseWhatBackT !== '' ? <div style={{position: 'relative',top:'2rem',textAlign:'center',fontSize: '.24rem',color: '#555'}}><span>在</span><span style={{color:'#989898'}}>{cWhatBack !== ''?"”"+cWhatBack+" ”, ":''}{typeText !== ''?"”"+typeText+" ”":''} </span><span>分类下，找到</span><span style={{color:'#989898'}}>{this.state.howManyNum}</span><span>个课程</span></div>
          :<div></div>}
          <ListBroad listBack={this.listBack} chooseWhatT = {window.chooseWhatT} chooseWhat = {window.chooseWhat} clickName = {this.state.clickName}/>
      </div>
    );
  }
}

export default Broadcast;


