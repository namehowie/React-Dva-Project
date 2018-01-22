import { RefreshControl,Toast, ListView ,ActivityIndicator,Modal,InputItem,Button} from 'antd-mobile';
import styles from './style.less';
import style from '../../routes/common.less';
import request from '../../utils/request';
import { browserHistory,Link } from 'dva/router';
import { createForm } from 'rc-form';
import SpecialItem from '../SpecialItem'

class SpecialListC extends React.Component {
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
      btnOpen:false,
      modal: true,
      value:'',
      passWord:''
    };
    this.pageNo = 1;
    this.pageSize = 20;
    this.filterData=[];
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
  //上拉调用函数
  onEndReached = (arrE) => {
   
    if (this.state.isLoading){
        Toast.fail('没有数据了...', 2);
        return ;
     }
    let pageNo= this.pageNo;
    let pageSize= this.pageSize;
    let userId = localStorage.userId;
    this.setState({
      isLoading: true,
      footer:'加载中...'
      
    })
    
    request(`getSpeciaList?userId=${userId}&pageNo=${pageNo}&pageSize=${pageSize}`).then((value)=>{
      console.log(value)
      let pageNum = value.page.totalPages
      let status = value.status;
      if(value.data.length == 0){
        this.filterData = []
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.filterData)
          })
        Toast.fail('暂时没有数据...', 2);
        return
      }
      
      if(status == "1"){
          let newData = value.data
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
  componentWillMount = () =>{   //组件将要加载时
    if(localStorage.userId ){  //如果本地存储中有userId
      this.setState({
         modal: false,             //不显示登录modal
      })
      this.onEndReached();           //获取列表信息
    }
  }
  componentDidMount() {
   // this.onEndReached()
  }
  componentWillReceiveProps(newstate){
    if (JSON.stringify(this.props) === JSON.stringify(newstate)) {
        return
    }
    this.filterData =[]
    this.pageNo = 1
    this.setState({
      isLoading : false
    },()=>{
      this.onEndReached()
    })    
  }

  login = () =>{    //登录
    let userName= this.state.value;
    let password = this.state.passWord; 
    request(`login?accountName=${userName}&password=${password}`).then((value)=>{
      console.log(value);
      if(value.response.code == '0'){    
        localStorage.userId = value.response.userId; //本地存储userid  
        localStorage.accountName = value.response.accountName;    
        Toast.success('恭喜登录成功...', 1);
        this.onEndReached();           
        this.setState({
          modal:false
        })
      }else if(value.response.code === '101'){
        Toast.fail('请输入用户名...', 2);
      }else if(value.response.code === '-1'&& value.response.message == "用户不存在!"){
        Toast.fail('用户不存在...', 2);
      }else{
        Toast.fail('用户名密码不匹配...', 2);
      }
    })      
  }

  render() {
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 1,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    const row = (rowData, rowID) => {
      return (
         <SpecialItem rowID= {rowID} rowData={rowData}/>
      );
    };
    const { getFieldProps } = this.props.form;
    if(localStorage.userId){
    return (
      <div>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={row}
          renderSeparator={separator}
          renderFooter={() => (<div style={{ padding: '0', textAlign: 'center',marginTop:'-.3rem'}}>
          {this.state.footer}</div>)}
          initialListSize={0}
          pageSize={20}
          scrollRenderAheadDistance={200}
          scrollEventThrottle={20}
          style={{
            height: document.documentElement.clientHeight,
            padding: '0.1rem 0 6rem 0'
          }}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.5}
          scrollerOptions={{ scrollbars: true }}
          className='specialList'
        />
       
      </div>
    );
    }else{
      return (
        <Modal
          transparent
          maskClosable={false}
          visible={this.state.modal}
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
            </div>
        </div>
        </Modal>
      )
     }
  }
}

const SpecialList = createForm()(SpecialListC);
export default SpecialList;