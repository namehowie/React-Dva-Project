import React,{Component} from 'react';
import PropTypes from 'prop-types';
import styles from './mine.less';
import style from './common.less';
import request from '../utils/request';
import requestApp from '../utils/requestApp';
import { WhiteSpace,WingBlank,Toast,ActivityIndicator,InputItem,Button,Icon,List,Picker} from 'antd-mobile';
import { hashHistory } from 'dva/router';
import { createForm } from 'rc-form';
import Steps from '../components/steps';

const ListItem = List.Item;
var timeClick;
const yesOrNo = [
    {
      label: '是',
      value: '1',
    },
    {
      label: '否',
      value: '0',
    },
];
const documentType = [
    {
      label: '身份证',
      value: '1',
    },
    {
      label: '军官证',
      value: '2',
    },
    {
      label: '港澳/台通行证',
      value: '3',
    },
    {
      label: '护照',
      value: '4',
    },
];

class RegisterC extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
     isFrist: 'block',
     isNext:'none',
     isOther: 'none',
     currentNum: 1,
     documentTypeValue:['1'],    
     idCard:'',
     name:'',
     district: [],
     districtArr:[],
     keyWord: '',
     company: [],
     companyValue:[],
     companyName:'',
     jobType: [],
     jobTypeValue: [],
     title: [],
     titleValue:[],
     subject: [],
     subjectValue:[],
     grassroot:[],
     phone: '',
     code: '',
     password: '',
     confirmPassword:'',
     count: 60,
     liked: true,
     visible: false,
     titleVisible: false,
     subjectVisible: false,
     cols: 3,
     isDistrict: true,
     yzCode: '',
     yzPhone: ''
    }; 
    this.urlData = window.location.href;
  }

  idCard = (idCard) => {
    this.setState({
      idCard,
    });
  }
  idCardR = () =>{
    let idCardReg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
    let jgCardReg = /^[a-zA-Z0-9]{7,21}$/;
    let gaCardReg = /^[a-zA-Z0-9]{5,21}$/;
    let hzCardReg =  /^[a-zA-Z0-9]{3,21}$/;
    let type = this.state.documentTypeValue[0];
    if (type == 1) {
      if (idCardReg.test(this.state.idCard) == false) {
        Toast.fail('身份证号输入有误', 2);
      }else {
        this.checkIsRegister();
      }
    }else if (type == 2) {
      if (jgCardReg.test(this.state.idCard) == false) {
        Toast.fail('军官证号输入有误', 2);
      }else {
        this.checkIsRegister();
      }
    }else if (type == 3) {
      if (gaCardReg.test(this.state.idCard) == false) {
        Toast.fail('港澳/台通行证号输入有误', 2);
      }else {
        this.checkIsRegister();
      }
    }else if (type == 4) {
      if (gaCardReg.test(this.state.idCard) == false) {
        Toast.fail('护照号输入有误', 2);
      }else {
        this.checkIsRegister();
      }
    }else {
      Toast.fail('请先选择证件类型', 2);
    }    
  }
  checkIsRegister = () =>{   //检测证件号是否注册过
    let idCard = this.state.idCard;
    requestApp(`idcardIsRegister?idCard=${idCard}`).then((value)=>{  
      console.log(value);
      let type = this.state.documentTypeValue[0];
      if (value.isRegister == "false") {
        // Toast.fail('该证件号已被使用', 2);
        switch (parseInt(type)) {
          case 1:
            Toast.fail('身份证号已被使用', 2);
            break;
          case 2:
            Toast.fail('军官证号已被使用', 2);
            break;
          case 3:
            Toast.fail('港澳/台通行证号已被使用', 2);
            break;
          case 4:
            Toast.fail('护照号已被使用', 2);
            break;
          default:
            Toast.fail('该证件号已被使用', 2);
            break;
        }
      }else {
        return
      }
    })
  }
  name = (name) =>{
    this.setState({
      name,
    }); 
  }
  companyName = (companyName) =>{
    this.setState({
      companyName,
    }); 
  }
  phone = (phone) =>{
    this.setState({
      phone,
    }); 
  }
  phoneR = () =>{
    let phoneReg = /^[T1][34578]\d{9}$/;
    console.log(this.state.phone)
    if (phoneReg.test(this.state.phone) == false) {
      Toast.fail('手机号格式不正确', 2);
    }else {
      return
    }
  }
  code = (code) =>{
    this.setState({
      code,
    }); 
  }
  password = (password) =>{
    this.setState({
      password,
    }); 
  }
  confirmPassword = (confirmPassword) =>{
    this.setState({
      confirmPassword,
    }); 
  }
  componentWillMount = () =>{   //组件将要加载时

  }
  componentDidMount = () =>{
    request(`getProvince`).then((value)=>{  //获取地区接口数据
      console.log(value);
      this.setState({
        district: value.data
      });
    });
    requestApp(`getPostType`).then((value)=>{  //获取职务类型接口数据
      console.log(value);
      let jobTypeArr =[];
      for(let i=0;i<value.data.length;i++){
        let item = {};
        item.label = value.data[i].name;
        item.value = value.data[i].id;
        jobTypeArr.push(item);
      }
      this.setState({
        jobType: jobTypeArr
      });
    })
  }

  goBack = () =>{
    if (this.state.currentNum == 2) {
      this.setState({
        isFrist: 'block',
        isNext:'none',
        currentNum: 1
      })
    }else {
      hashHistory.go(-1)
    }
  }
  //选择单位时先选择地区
  showPicker = () =>{
    this.setState({
      visible: true,
      cols: 3,
      isDistrict: true,
      companyName:''
    })
  }
  //选择地区调取单位接口数据
  queryCompany = (v) => {
    console.log(v);
    if (v.length == 3) {
      this.setState({
        districtArr: v
      });
      let provinceId = v[0];
      let cityId = v[1];
      let countyId = v[2];
      let keyWord = '';
      requestApp(`hospital?provinceId=${provinceId}&cityId=${cityId}&countyId=${countyId}&keyWord=${keyWord}`).then((value)=>{
        console.log(value);
        let companyArr =[];
        for(let i=0;i<value.data.length;i++){
          let item = {};
          item.label = value.data[i].hospitalName;
          item.value = value.data[i].hospitalid;
          companyArr.push(item);
        }
        this.setState({
          cols: 1,
          company: companyArr,
          isDistrict: false
        });
      })
    }else {
      this.setState({
        companyValue: v,
        visible: false
      });
      if(v==0){
        this.setState({
          isOther: ''
        })
      }else {
        this.setState({
          isOther: 'none'
        })
      }
    }
    
  };
  //选择职务类型，调取职务和学科接口数据
  queryTitleAndSubject = (v) => {
    console.log(v);
    this.setState({
      jobTypeValue: v
    });
    let jobTypeId = v[0];
    requestApp(`getPost?id=${jobTypeId}`).then((value)=>{
      console.log(value);
      let titleArr =[];
      for(let i=0;i<value.data.length;i++){
        let item = {};
        item.label = value.data[i].name;
        item.value = value.data[i].id;
        titleArr.push(item);
      }
      this.setState({
        title: titleArr
      });
    });
    request(`getXueke?id=${jobTypeId}`).then((value)=>{
      console.log(value);
      this.setState({
        subject: value.data
      });
    })
  };
  //选择职务前判断职务类型是否已选择
  typeFirstT = () =>{
    if(this.state.jobTypeValue.length != 0){
      this.setState({
        titleVisible: true
      })
    }else {
      Toast.info('请先选择职务类型!',2)
    }    
  }
  //选择学科前判断职务类型是否已选择
  typeFirstS = () =>{
    if(this.state.jobTypeValue.length != 0){
      this.setState({
        subjectVisible: true
      })
    }else {
      Toast.info('请先选择职务类型!',2)
    }    
  }
  //点击下一页时验证空值
  goNext = () =>{
    if (this.state.idCard !='' && this.state.name !='' && this.state.companyValue.length !=0 
      && this.state.jobTypeValue.length !=0 && this.state.titleValue.length !=0 
      && this.state.subjectValue.length !=0 && this.state.grassroot.length !=0 ) {
      let idCardReg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
      let jgCardReg = /^[a-zA-Z0-9]{7,21}$/;
      let gaCardReg = /^[a-zA-Z0-9]{5,21}$/;
      let hzCardReg =  /^[a-zA-Z0-9]{3,21}$/;
      let type = this.state.documentTypeValue[0];
      if (type == 1 && idCardReg.test(this.state.idCard) == false) {
          Toast.fail('身份证号输入有误', 2);
      }else if (type == 2 && jgCardReg.test(this.state.idCard) == false) {
          Toast.fail('军官证号输入有误', 2);
      }else if (type == 3 && gaCardReg.test(this.state.idCard) == false) {
          Toast.fail('港澳/台通行证号输入有误', 2);
      }else if (type == 4 && gaCardReg.test(this.state.idCard) == false) {
          Toast.fail('护照号输入有误', 2);
      }else if (this.state.subjectValue.length != 3){
        Toast.fail('请选择三级学科',2)
      }else {
        let idCard = this.state.idCard;
        requestApp(`idcardIsRegister?idCard=${idCard}`).then((value)=>{  
          console.log(value);
          let type = this.state.documentTypeValue[0];
          if (value.isRegister == "false") {
            // Toast.fail('该证件号已被使用', 2);
            switch (parseInt(type)) {
              case 1:
                Toast.fail('身份证号已被使用', 2);
                break;
              case 2:
                Toast.fail('军官证号已被使用', 2);
                break;
              case 3:
                Toast.fail('港澳/台通行证号已被使用', 2);
                break;
              case 4:
                Toast.fail('护照号已被使用', 2);
                break;
              default:
                Toast.fail('该证件号已被使用', 2);
                break;
            }
          }else {
            this.setState({
              isFrist: 'none',
              isNext:'block',
              currentNum: 2
            })
          }
        })      
      }     
    }else {
      Toast.fail('请填/选所有工作信息！',2)
    }    
  }
  //获取验证码
  getCode = () =>{
    let phone = this.state.phone;
    requestApp(`sendmsg?phone=${phone}&act=register`).then((value)=>{
      console.log(value);
      if (value.status == '1') {
        Toast.success(value.message, 1);
        if(this.state.liked){                       //验证码时效
          this.timer = setInterval(function () {
            let count = this.state.count;
            this.state.liked = false;
            count -= 1;
            if (count < 1) {
              this.setState({
                liked: true
              });
              count = 60;
　　　　　　　clearInterval(this.timer);
            }
            this.setState({
              count: count
            });
          }.bind(this), 1000);
        }
        let yzm = value.data.yzm;  //存储校验验证码
        let yzPhone = this.state.phone; //存储校验手机号
        this.setState({
          yzCode: yzm,
          yzPhone: yzPhone
        })
      }else if(value.status == '100'){
        Toast.fail(value.message,2)
      }
    }) 
  }
  caeateAccount = () =>{    // 完成注册
    let documentType = parseInt(this.state.documentTypeValue[0]) ;
    let idCard = this.state.idCard;
    let name= this.state.name;
    let provinceId = this.state.districtArr[0];
    let cityId = this.state.districtArr[1];
    let districtId = this.state.districtArr[2];
    let companyId = this.state.companyValue[0];
    let company = this.state.companyName; 
    let titleId = this.state.titleValue[0];
    let subjectId = this.state.subjectValue[2];
    let grassroot = this.state.grassroot[0];
    let phone = this.state.phone;
    let password = this.state.password;
    let jobTypeId = this.state.jobTypeValue[0];
    switch (jobTypeId) {
      case 98953:
        jobTypeId = '1';
        break;
      case 98954:
        jobTypeId = '2';
        break;
      case 98955:
        jobTypeId = '3';
        break;
      case 98956:
        jobTypeId = '4';
        break;
      case 98957:
        jobTypeId = '5';
        break;
      case 98958:
        jobTypeId = '6';
        break;
      case 98959:
        jobTypeId = '7';
        break;
      case 98961:
        jobTypeId = '8';
        break;
      case 98962:
        jobTypeId = '9';
        break;
    }
    console.log(jobTypeId);
    if (this.state.phone !='' && this.state.code !='' && this.state.password !='' && this.state.confirmPassword !=''){
      let phoneReg = /^[T1][34578]\d{9}$/;
      let passwordReg = /^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]))[a-zA-Z0-9]{8,20}$/;
      if (phoneReg.test(this.state.phone) === false){
        Toast.fail('手机号格式不正确', 2);
      }else if (this.state.phone != this.state.yzPhone){
        Toast.fail('非验证手机号', 2);
      }else if (this.state.code != this.state.yzCode){
        Toast.fail('验证码错误', 2);
      }else if (this.state.confirmPassword != this.state.password){
        Toast.fail('两次密码不一致，请重新输入', 2);
      }else if (passwordReg.test(this.state.password) === false){
        Toast.fail('请输入8-20位大、小写字母和数字组合！', 2);
      }else {
        if (company != '') {  //添加新单位
          request(`register?documentType=${documentType}&idCard=${idCard}&name=${name}&proviceId=${provinceId}
            &cityId=${cityId}&districtId=${districtId}&company=${company}&jobTypeId=${jobTypeId}&titleId=${titleId}&subjectId=${subjectId}&grassroot=${grassroot}&phone=${phone}&password=${password}`)
          .then((value)=>{
            console.log(value);
            if(value.response.code === '0'){
              Toast.success('注册成功...', 1);
              // hashHistory.push('/mine');  //跳转到登录页
              hashHistory.go(-1);  //返回原路径
            }else if(value.response.code === '-1'){
              Toast.fail(value.response.message, 2);
            }
          })
        }else {
          request(`register?documentType=${documentType}&idCard=${idCard}&name=${name}&proviceId=${provinceId}
            &cityId=${cityId}&districtId=${districtId}&companyId=${companyId}&jobTypeId=${jobTypeId}&titleId=${titleId}&subjectId=${subjectId}&grassroot=${grassroot}&phone=${phone}&password=${password}`)
          .then((value)=>{
            console.log(value);
            if(value.response.code === '0'){
              Toast.success('注册成功...', 1);
              // hashHistory.push('/mine');  //跳转到登录页
              hashHistory.go(-1);  //返回原路径
            }else if(value.response.code === '-1'){
              Toast.fail(value.response.message, 2);
            }
          })
        }
      }        
    }else {
      Toast.fail('有选项未填写', 2);
    }   
  }
  render() {
    const { getFieldProps } = this.props.form;
    const company = this.state.company;
    const jobType = this.state.jobType;
    const subject = this.state.subject;
    const title = this.state.title;
    let text = this.state.liked ? '获取验证码' : this.state.count + '秒后可重发';
    let className = this.state.liked ? styles.verification : styles.verificationT;
    let disabled = this.state.liked ? false : true;
    let district = this.state.isDistrict ? this.state.district : this.state.company;
    let districtValue = this.state.isDistrict ? this.state.districtValue : this.state.companyValue;
    return (
      <div>
        <div style={{marginTop:'1rem'}}>
          <div className={style.headerTlogin}>
             <span className={style.headL} onClick={this.goBack}><Icon type='left'/></span>
             <span className={style.headM}>注册</span>
             <span className={style.headR}></span>
          </div> 
          <WhiteSpace size="lg" />
          <WingBlank size="lg" >
            <div style={{display:this.state.isFrist}}>第1步 工作信息</div>
            <div style={{display:this.state.isNext}}>第2步 账号验证</div>
          </WingBlank>
          <List className={styles.navBar} style={{display:this.state.isFrist}}>
            <Picker 
              data={documentType}
              cols={1}
              {...getFieldProps('documentType')}
              value={this.state.documentTypeValue}
              onChange={v => this.setState({ documentTypeValue: v })}
              onOk={v => this.setState({documentTypeValue: v})}
            >
              <ListItem arrow="horizontal">证件类型</ListItem>
            </Picker>
            <InputItem
              {...getFieldProps('focus')}
              placeholder="请输入相关证件号码"
              onChange={this.idCard}
              value={this.state.idCard}
              onBlur={this.idCardR}
            >证件号码</InputItem>
            <InputItem
              {...getFieldProps('focus')}
              placeholder="请输入真实姓名"
              onChange={this.name}
              value={this.state.name}
            >姓名</InputItem>
            <Picker extra="请选择"
              cols={this.state.cols}
              visible={this.state.visible}
              data={district}
              {...getFieldProps('district')}
              value = {districtValue}
              onChange={this.queryCompany}
              onDismiss={() => this.setState({ visible: false })}
            >
              <ListItem arrow="horizontal" onClick={this.showPicker}>单位名称</ListItem>
            </Picker>
            <InputItem
              {...getFieldProps('focus')}
              clear
              value={this.state.companyName}
              onChange={this.companyName}
              placeholder="请输入单位名称"
              style={{display: this.state.isOther}}
            >新增单位</InputItem>
            <Picker 
              data={jobType} 
              cols={1} 
              {...getFieldProps('jobType')}
              value={this.state.jobTypeValue}
              onChange={this.queryTitleAndSubject}
              onOk={this.queryTitleAndSubject}
            >
              <ListItem arrow="horizontal">职务类型</ListItem>
            </Picker>
            <Picker 
              data={title} 
              cols={1} 
              visible={this.state.titleVisible}
              {...getFieldProps('title')}
              value={this.state.titleValue}
              onChange={v => this.setState({ titleValue: v,titleVisible: false})}
              onDismiss={() => this.setState({ titleVisible: false })}
            >
              <ListItem arrow="horizontal" onClick={this.typeFirstT}>职称</ListItem>
            </Picker>
            <Picker 
              data={subject} 
              cols={3} 
              visible={this.state.subjectVisible}
              {...getFieldProps('subject')}
              value={this.state.subjectValue}
              onChange={v => this.setState({ subjectValue: v,subjectVisible: false })}
              onDismiss={() => this.setState({ subjectVisible: false })}
            >
              <ListItem arrow="horizontal" onClick={this.typeFirstS}>学科</ListItem>
            </Picker>
            <Picker 
              extra="基层包括县及以下、社区等医疗卫生机构"
              data={yesOrNo} 
              cols={1} 
              {...getFieldProps('yesOrNo')}
              value={this.state.grassroot}
              onChange={v => this.setState({ grassroot: v })}
              onOk={v => this.setState({grassroot: v})}
            >
              <ListItem arrow="horizontal">来自基层</ListItem>
            </Picker>
            <Button onClick={this.goNext} className={styles.loginBtn} type="primary">下一步</Button>
          </List>

          <List className={styles.navBar} style={{display:this.state.isNext}}>
            <InputItem
              {...getFieldProps('focus')}
              placeholder="输入手机号"
              maxLength={11}
              onChange={this.phone}
              value={this.state.phone}
              onBlur={this.phoneR}
            >手机号</InputItem>
            <InputItem
              {...getFieldProps('focus')}
              placeholder="输入验证码"
              type="number"
              maxLength={6}
              onChange={this.code}
              value={this.state.code}
            >验证码
              <Button 
                type="primary" 
                inline 
                size="small" 
                disabled={disabled}
                className={className}
                onClick= {this.getCode}
              >{text}</Button>
            </InputItem>
            <InputItem
              {...getFieldProps('focus')}
              clear
              type="password"
              value={this.state.password}
              onChange={this.password}
              placeholder="请输入8-20位大、小写字母和数字组合！"
            >密码</InputItem>
            <InputItem
              {...getFieldProps('focus')}
              clear
              type="password"
              value={this.state.confirmPassword}
              onChange={this.confirmPassword}
              placeholder="确认密码"
            >确认密码</InputItem>
            <Button onClick={this.caeateAccount} className={styles.loginBtn} type="primary">完成注册</Button>
          </List>
        </div>
      </div>
    )
  }      
}
const Register = createForm()(RegisterC);
export default Register;

