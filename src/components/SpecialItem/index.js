import React, { Component } from 'react';
import { hashHistory } from 'dva/router';
import request from '../../utils/request';
import styles from './style.less';
import style from '../../routes/common.less';
import {Modal, Popup, List, Button, InputItem,Toast  } from 'antd-mobile';
import { createForm } from 'rc-form';
import Ripples from 'react-ripples';

export default class SpecialItem extends Component {
  constructor(props){
     super(props);
     this.state = {

    };
    this.urlData = window.location.href;
  }

  goBroadDetail = (rowData) =>{
    let xmId = rowData.id;
    if (this.urlData.indexOf('returnUrl') != -1) {   //url中存在returnUrl 则传递到详情页 
      let returnUrl = this.urlData.split('returnUrl=')[1].split('&')[0];
      hashHistory.push({pathname: '/specialDetail',state: { xmId: xmId ,returnUrl: returnUrl}});
    }else {                                      //url中不存在returnUrl         
      hashHistory.push({pathname: '/specialDetail',state: { xmId: xmId }});
    }   
  }
  
  render() {
    const {rowID ,rowData} = this.props;
    let formaText;
    if(rowData.forma == 3) {
      formaText = '面授'
    }else {
      formaText = '远程'
    };
    let statueText;
    if(rowData.trainStatue == 1) {
      statueText = '已报名'
    }else {
      statueText = ''
    };
    const attributeB = {style:{float:'right',marginTop:'.31rem',width:'.4rem'}}
    const attributeJ = {style:{fontSize:'.24rem',color:"#666",marginTop:'.11rem'}}
    const attributeD = {style:{color:'#666',fontSize:'.26rem',lineHeight:'.36rem'}}
    const attributeC = {style:{color:'#444',fontSize:'.28rem',padding:'.11rem 0'}}
    const attributeF = {style:{padding: '0.28rem 0.16rem',background: 'white'}}
    const attributeQ = {style:{position:'relative',width: '35%', marginRight: '0.18rem',height:"auto"}}
    const attributeS = {style:{marginTop:'.21rem',padding:'.05rem .1rem',display:'inline-block',borderRadius:'5px'}}
    const attributeW = {style:{position:'absolute',left:'0',bottom:0,backgroundColor:'rgba(0,0,0,0.4)',color:'#fff',fontSize:'.24rem',width:'100%',padding:'.1rem 0',textAlign:'center'}}
 
    const color =(color) =>{
      attributeS.style.border = '2px solid'+ ' '+color
      attributeS.style.color = color
    }

    return (
    <div>
      <Ripples style={{width:'100%'}} color='rgba(231, 226, 226, .4)' during ={2000}>
       <div key={rowID} {...attributeF}>
          <div style={{ display: '-webkit-box', display: 'flex' }} >
            <div {...attributeQ} onClick={this.goBroadDetail.bind(this,rowData)}>
              <img style={{width:'100%'}} src={rowData.filePath} />
            </div>
            <div style={{ display: 'inline-block',flex:1,width:'63%'}}>
              <div onClick={this.goBroadDetail.bind(this,rowData)} style={{fontSize:'.28rem',marginBottom:'.1rem',textOverflow:'ellipsis',overflow:'hidden',whiteSpace:'nowrap'}}>{rowData.name}</div>
              <div onClick={this.goBroadDetail.bind(this,rowData)} {...attributeJ}><span>培训方式： </span><span>{formaText}</span> <span style={{float:'right',fontSize:'.28rem',color:'#12bce1'}}>{statueText}</span></div>
            </div>
          </div>
        </div>
      </Ripples>       
    </div>
    );
  }
}



