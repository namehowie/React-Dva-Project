import { RefreshControl,Toast, ListView ,ActivityIndicator} from 'antd-mobile';
import ItemBroad from '../components/itemBroad';
import styles from './ListBroad'
import request from '../utils/request';
import { hashHistory } from 'dva/router';
import { createForm } from 'rc-form';

export default class ListBroad extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.initData = [];
    this.state = {
      dataSource: dataSource.cloneWithRows(this.initData),
      refreshing: false,
      isLoading: false,
      footer:'',
      chooseWhat:'',
      chooseWhatT:'',
      clickName:'',
      btnOpen:false
    };
    this.accountName = localStorage.accountName
    this.userId = localStorage.userId
    this.pageNo = 1;
    this.filterData=[];
  }
  //上拉调用函数
  onEndReached = (arrE) => {
   
    // if(this.state.chooseWhat == ''){
    //   return
    // }
    if (this.state.isLoading){
        Toast.info('没有数据了...', 2);
        return ;
     }
    let pageNo= this.pageNo;
    let xueke = this.state.chooseWhat;
    let type = this.state.chooseWhatT;
    let accountName= localStorage.accountName;
    let userId = localStorage.userId;
    this.setState({
      isLoading: true,
      footer:'加载中...'
      
    })

    request(`broadcast?accountName=${accountName}&userId=${userId}&pageNo=${pageNo}&xueke=${xueke}&type=${type}`).then((value)=>{
      
      let pageNum = value.response.page.totalPages
      let code = value.response.code;
      let totalCounts = value.response.page.totalCounts;
      this.props.listBack(totalCounts,this.state.chooseWhat ,this.state.chooseWhatT)
      if(value.response.list.length == 0){
        this.filterData = []
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.filterData)
          })
        Toast.info('暂时没有数据...', 2);
        return
      }
      
      if(code === "0"){
          let newData = value.response.list
          this.filterData = this.filterData.concat(newData)
          this.setState({
            isLoading:false,
            dataSource: this.state.dataSource.cloneWithRows(this.filterData),
            footer:'加载完毕'   
          })

       }else{
        console.error("获取数据错误")
       }
       this.pageNo++;
        if(this.pageNo > pageNum){ 
         this.setState({
            footer:'没有数据了',
            isLoading:true
          })
        return
      }

    })
  }
  componentDidMount() {
   this.onEndReached()
  }
  componentWillReceiveProps(newstate){
    if (JSON.stringify(this.props) === JSON.stringify(newstate)) {
        return
    }
    this.filterData =[]
    this.pageNo = 1
    this.setState({
      chooseWhat : newstate.chooseWhat,
      chooseWhatT : newstate.chooseWhatT,
      clickName : newstate.clickName,
      isLoading : false
    },()=>{
      this.onEndReached()
    })
    
  }
  render() {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 1,
          borderTop: '1px solid #ECECED'
        }}
      />
    );
    const row = (rowData, rowID) => {
      return (
         <ItemBroad rowID= {rowID} rowData={rowData}/>
      );
    };
    return (
      <div>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={row}
          renderSeparator={separator}
          renderFooter={() => (<div style={{ padding: '0', textAlign: 'center',marginTop:'-1rem'}}>
          {this.state.footer}</div>)}
          initialListSize={0}
          pageSize={20}
          scrollRenderAheadDistance={200}
          scrollEventThrottle={20}
          style={{
            height: document.documentElement.clientHeight,
            border: '1px solid #ddd',
            padding: '0.1rem 0 6rem 0'
          }}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          scrollerOptions={{ scrollbars: true }}
          className="broadcastList"
        />
       
      </div>
    );
  }
}

