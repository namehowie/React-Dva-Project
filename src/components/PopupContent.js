import React, { Component } from 'react';
import { List } from 'antd-mobile';
import styles from './PopupContent.less';
import request from '../utils/request';
import { Toast} from 'antd-mobile';

const Item = List.Item;
const Brief = Item.Brief;
class PopupContent extends Component {
  constructor(props){
     super(props);
     this.state = {
      sel: '',
    };
    this.accountName = localStorage.accountName
    this.userId = localStorage.userId
    this.pageNo = 1;
    this.filterData=[];
  }
  
  onSel= (sel) => {
    let clickName = this.props.clickName
    this.props.onClose();
    this.props.clickWhat(sel,clickName) 
  }
  render() {
    var broadItemName
    const {chooseType} = this.props;
    const broadTypeItem = chooseType.map(function(item,index){
            if(item == 1){
               broadItemName = "正在直播"
            }else if(item == 2){
               broadItemName = "即将开课"
            }else if(item == 3){
               broadItemName = "已经结束"
            }else if(item == 4){
               broadItemName = "观看回放"
            }else if(item == "ALL"){
               broadItemName = "全部"
            }else{
              broadItemName = item
            }
            return <List.Item multipleLine onClick={() => {}} key={index}><div onClick={()=>{this.onSel(item)}}>{broadItemName}</div></List.Item>
          },this)
    
    return (
    <div>
    <div className='specialList' style={{maxHeight:'8.1rem',overflow:this.props.clickName =="stS" ?'none':'auto'}}>
        <List>          
            {
              broadTypeItem
            }
          <div className={styles.gunT} style={{display:this.props.clickName =="stS" ?'none':'block'}}></div>
        </List>
      </div>
    </div>
    );
  }
}

export default PopupContent