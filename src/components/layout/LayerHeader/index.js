import React, {Component} from 'react';
import {Icon, Modal, Badge, Popover, Form, Input,message,Avatar,Empty } from "antd";
import './index.less';
import {withRouter} from 'react-router-dom';
import noInfo from "../../../style/ztt/imgs/dashboard/noInfo.png";
import {Link} from "react-router-dom";
//reudux
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {postReducer} from '../../../action/sckoetAction';
import voice from "../../../style/ztt/voice/audio.mp3";
import axios from "../../../axios/index";

const confirm = Modal.confirm;
let popoverLists=[];
class LayerHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alarmNum: '',
            popoverVisble:true,
            videoClose:true,//判断报警是否是open或close
            updatepass: false,//修改密码
            voicePopover:false,//报警信息详情弹窗
            popoverDetail:{},
        };
    }

    componentDidMount() {
        this.setState({
            account: localStorage.getItem("account"),
        });
        this.props.postReducer();
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.alarNums && JSON.parse(nextProps.alarNums).msgInfo) {
            /*
            通过webscoket接受报警消息
            需求：
                消息列表只存20条数据，存在本地；
                超过20条数据，新来的数据替换数组的第一个元素，删除数组的最后一个元素
                不超过20条数据，继续添加数据。
            逻辑：
                如果本地存在并在getLocalLists长度大于0，在本地基础上增加数据，
            *   否则判断popoverLists长度是否小于20，小于20则，添加数据，否则不添加数据
            * */
            if(localStorage.getItem("popoverLists")){
                let getLocalLists=JSON.parse(localStorage.getItem("popoverLists"));
                if(getLocalLists && getLocalLists.length>0){
                    if(getLocalLists.length<20){
                        getLocalLists.unshift(JSON.parse(nextProps.alarNums));
                    }
                    localStorage.setItem("popoverLists",JSON.stringify(getLocalLists))
                }
                if(getLocalLists.length >= 20){
                    getLocalLists.splice(19,1);
                    getLocalLists.unshift(JSON.parse(nextProps.alarNums));
                    localStorage.setItem("popoverLists",JSON.stringify(getLocalLists));
                }
            }else{
                if(popoverLists.length<20){
                    popoverLists.unshift(JSON.parse(nextProps.alarNums));
                    localStorage.setItem("popoverLists",JSON.stringify(popoverLists));
                }
            }
            this.state.alarmNum = JSON.parse(nextProps.alarNums).count;
            let isOPen=JSON.parse(nextProps.alarNums).webVoiceFlag;
            let audioDom = document.getElementById("audioVideo");
            let voiceBack=localStorage.getItem("voiceBack");
            //当isOpen为open并且voiceBack为true是响铃
            if(isOPen == "open" && JSON.parse(voiceBack)){
                audioDom.play();
                setTimeout(()=>{ audioDom.pause()},3000);
                this.voive();
                localStorage.setItem("voiceBack","true");
            }else{
                audioDom.pause();
                this.voive();
                this.setState({
                    videoClose:true
                });
                localStorage.setItem("voiceBack","false");
            }
        }
    }

    hanlevoice = () => {
        //当isOPen为close，不弹出窗体
        if(this.state.videoClose){
            this.setState({
                voiceModel: false
            })
        }
        this.setState({
            voiceModel: true
        })
    };
    hanleVioceOk = () => {
        let voiceShow=localStorage.getItem("voiceBack");
        if(JSON.parse(voiceShow)){
            localStorage.setItem("voiceBack","false");
        }else{
            localStorage.setItem("voiceBack","true");
        }
        this.setState({
            voiceModel:false
        });
    };
    hanleVioceCancel = () => {
        this.setState({
            voiceModel: false
        })
    };
    voive = () => {
        let voiceShow=localStorage.getItem("voiceBack");
        if(JSON.parse(voiceShow)){
            return "equImg6";
        }else{
            return "equImg7";
        }
    };
    hanleClose = () => {
        const _this = this;
        confirm({
            title: '退出',
            content: '确认退出吗？',
            onOk() {
                localStorage.removeItem('account');
                localStorage.removeItem('companycode');
                localStorage.removeItem('ifsys');
                localStorage.removeItem('utype');
                localStorage.removeItem('token');
                localStorage.removeItem('elemapinfo');
                _this.props.history.push('/')
            }
        });
    };
    checkPsd2(rule, value, callback) {
        let password = this.props.form.getFieldValue('newpassword');
        if (password && password !== value) {
            callback(new Error('两次密码输入不一致'));
        } else {
            callback();
        }
    }
    //修改密码
    hanleUpdatePass = () => {
        this.setState({
            updatepass: true
        })
    };
    handlePassOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                axios.ajax({
                    method:"post",
                    url:window.g.loginURL+"/api/system/updateuserpwd",
                    data:{
                        account:localStorage.getItem("account"),
                        oldpassword:values.oldpassword,
                        newpassword:values.newpassword
                    }
                }).then((res)=>{
                    if(res.success){
                        this.setState({
                            updatepass: false
                        });
                        message.success("密码修改成功，请重新登录!");
                        this.props.history.push('/login');
                    }else{
                        message.error(res.msg);
                    }
                    this.props.form.resetFields();
                })
            }
        });
    };
    handlePassCancel = () => {
        this.props.form.resetFields();
        this.setState({
            updatepass: false
        })
    };
    //报警信息弹窗详情 给popoverLists数组添加badgeShow属性，badgeShow为false消息已读，没有badgeShow属性消息未读
    popoverGetOne=(v,i)=>{
        let tagType="";
        let msgInfo=JSON.parse(v.msgInfo);
        let popoverLists=JSON.parse(localStorage.getItem("popoverLists"));
        popoverLists[i].badgeShow=false;
        localStorage.setItem("popoverLists",JSON.stringify(popoverLists));
        if(msgInfo.info){
            JSON.parse(msgInfo.info).map((v)=>{
                if (v.tag == 0) {
                    tagType = '人员报警';
                } else if (
                    v.tag == 1 ||
                    v.tag == 2 ||
                    v.tag == 3 ||
                    v.tag == 4 ||
                    v.tag == 5) {
                    tagType =  '车辆报警'
                } else if ( v.tag == 6) {
                    tagType =  '强制报警'
                }
            });
        }
        this.setState({
            voicePopover:true,
            popoverLists,
            popoverDetail:{
                cameraName:v.cameraName,
                msgInfo:msgInfo,
                tagType
            }
        },()=>{
            setTimeout(()=>{
                this.Draw(msgInfo);
            });
        })
    };
    //绘制防区
    Draw=()=>{
        let msgInfo=this.state.popoverDetail.msgInfo;
        if(msgInfo){
            const x =652 / 704,
                y = 366 / 576;

            let ele = document.getElementById('popoverCan');
            let area = ele.getContext('2d');
            area.clearRect(0, 0, 652, 366); //清除之前的绘

            let field=msgInfo.field;//防区区域图
            let areafield = ele.getContext('2d');
            for (let i = 0; i < field.length; i++) {
                let list = field[i].pointList;
                for (let a = 0; a < list.length; a++) {
                    areafield.lineWidth = 1;
                    areafield.strokeStyle = '#f00';
                    areafield.beginPath();
                    areafield.moveTo(parseInt(list[0][0] * x), parseInt(list[0][1] * y))
                    areafield.lineTo(parseInt(list[1][0] * x), parseInt(list[1][1] * y))
                    areafield.lineTo(parseInt(list[2][0] * x), parseInt(list[2][1] * y))
                    areafield.lineTo(parseInt(list[3][0] * x), parseInt(list[3][1] * y))
                    areafield.lineTo(parseInt(list[4][0] * x), parseInt(list[4][1] * y))
                    areafield.lineTo(parseInt(list[5][0] * x), parseInt(list[5][1] * y))
                    areafield.lineTo(parseInt(list[0][0] * x), parseInt(list[0][1] * y))
                    areafield.stroke();
                    areafield.closePath();
                }
            }
            let objs=JSON.parse(msgInfo.info);//目标区域
            const xi =652 / msgInfo.width,
                yi = 366 / msgInfo.height;
            area.lineWidth = 1;
            objs.map((el) => {
                area.strokeStyle = '#ff0';
                area.beginPath();
                area.rect(parseInt(el.x * xi), parseInt(el.y * yi), parseInt(el.w * xi), parseInt(el.h * yi));
                area.stroke();
                area.closePath();
                return ''
            })
        }
    };
    hanlePopoverCancel=()=>{
        this.setState({
            voicePopover:false
        })
    };
    render() {
        let voiceShow = JSON.parse(localStorage.getItem("voiceBack"));
        const content = (
            <div className="backout">
                <p onClick={this.hanleUpdatePass}>修改密码</p>
                <p onClick={this.hanleClose}>退出</p>
            </div>
        );
        let popoverLists=localStorage.getItem("popoverLists")?JSON.parse(localStorage.getItem("popoverLists")):[];
        let policeListTop=(
            <div className="policeList-top">
                <p className="police-name"><Icon type="unordered-list" />&nbsp;&nbsp;我的消息</p>
                <ul className="policeCont">
                    {
                        popoverLists.length>0?popoverLists.map((v,i)=>{
                            let msgInfo=JSON.parse(v.msgInfo);
                            return(
                                <li onClick={()=>this.popoverGetOne(v,i)} key={i}>
                                    <Badge dot={v.badgeShow === undefined ?true:false} id="badge" className="popover-img">
                                        <img src={msgInfo.picpath} alt=""/>
                                    </Badge>
                                    <div className="popover-content">
                                        <p>
                                            <span className="context-num">
                                                 <span className={v.badgeShow === undefined ?"context-name":"nopass"}>设备名称:</span>
                                                 <span title={v.cameraName} className={v.badgeShow === undefined ?"context":"nopass"}>{v.cameraName}</span>
                                            </span>
                                            <span className="context-num">
                                                <span className={v.badgeShow === undefined ?"context-name":"nopass"}>设备编号:</span>
                                                <span title={msgInfo.devid} className={v.badgeShow === undefined ?"context":"nopass"}>{msgInfo.devid}</span>
                                           </span>
                                        </p>
                                        <p>
                                            <span className={v.badgeShow === undefined ?"context-name":"nopass"}>采集时间:</span>
                                            <span className={v.badgeShow === undefined ?"context":"nopass"}>{msgInfo.starttime_ymd +" "+msgInfo.starttime_hms}</span>
                                        </p>
                                    </div>
                                </li>
                            )
                        })
                            : <div className="popoverEmpty">
                                <Empty
                                    image={noInfo}
                                    imageStyle={{
                                        width:"50%",
                                        height: "100%",
                                        margin:"0 auto"
                                    }}
                                    description={<span style={{color:"#CCCCCC"}}>暂无消息</span>}
                                >
                                </Empty>
                            </div>
                    }
                </ul>
                <p className="popover-bottom">
                    <span>全部已读</span>
                    <Link to='/main/police/policeInformation'>查看全部消息</Link>
                </p>
            </div>
        );
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16},
        };
        return (
            <div className="LayerHeader">
                <div className="headerLeft">
                    <div className="logo-title">AI视频警戒系统</div>
                </div>
                <div className="headerRight">
                    {/*<Link to="/manual"><Icon type="question-circle" theme="filled" className="manual" /></Link>*/}
                    <div onClick={()=>{this.props.history.push("/manual")}}><Icon type="question-circle" theme="filled" className="manual" /></div>
                    <div className="alarmNum">
                        <Popover
                            placement="bottom"
                            content={policeListTop}
                            //visible={this.state.popoverVisble}
                            className="popoverInfo"
                        >
                            <Badge count={this.state.alarmNum} onClick={this.hanlevoice}>
                                <span className={this.voive()} />
                            </Badge>
                        </Popover>
                        <audio id="audioVideo" loop src={voice} type="audio/mp3"/>
                    </div>
                    <div className="alarmRight">
                        <Avatar size="large" icon="user" className="userIcon" />
                        <span className="userName">{this.state.account}</span>
                        <Popover placement="bottomRight" content={content} title="用户中心">
                            <Icon type="caret-down" className="signout"/>
                        </Popover>
                    </div>
                </div>
                <Modal
                    title="提示"
                    visible={this.state.voiceModel}
                    onOk={this.hanleVioceOk}
                    onCancel={this.hanleVioceCancel}
                    okText="确认"
                    cancelText="取消"
                    width={350}
                >
                    <div><span>{voiceShow ? '是否关闭声音吗?' : '是否开启声音吗?'}</span></div>
                </Modal>
                <Modal
                    title="修改密码"
                    visible={this.state.updatepass}
                    onOk={this.handlePassOk}
                    onCancel={this.handlePassCancel}
                >
                    <Form {...formItemLayout}>
                        <Form.Item label="旧密码">
                            {getFieldDecorator('oldpassword', {
                                rules: [
                                    {required: true, message: '请输入旧密码!'},
                                    {min:6,message:"旧密码最小长度为6位！"},
                                    {max:8,message:"旧密码最大长度为8位！"}
                                ],
                            })(
                                <Input.Password  placeholder="请输入旧密码"/>
                            )}
                        </Form.Item>
                        <Form.Item label="新密码">
                            {getFieldDecorator('newpassword', {
                                rules: [
                                    {required: true, message: '请输入新密码!'},
                                    {min:6,message:"新密码最小长度为6位！"},
                                    {max:8,message:"新密码最大长度为8位！"}
                                ],
                            })(
                                <Input.Password  placeholder="请输入新密码"/>
                            )}
                        </Form.Item>
                        <Form.Item label="确认密码">
                            {getFieldDecorator('restpass', {
                                rules: [
                                    {required: true, message: '请输入确认密码!'},
                                    { validator: (rule, value, callback) => { this.checkPsd2(rule, value, callback) } },
                                    {min:6,message:"确认密码最小长度为6位！"},
                                    {max:8,message:"确认密码最大长度为8位！"}
                                ],
                            })(
                                <Input.Password  placeholder="请输入确认密码"/>
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="预警详情"
                    visible={this.state.voicePopover}
                    onCancel={this.hanlePopoverCancel}
                    footer={null}
                    width={700}
                >
                    {
                        this.state.popoverDetail && this.state.popoverDetail.msgInfo?<div className="popoverMoal">
                            <canvas
                                id="popoverCan"
                                width="652px"
                                height="366px"
                                style={{
                                    backgroundImage: 'url(' +this.state.popoverDetail.msgInfo.picpath+ ')',
                                    backgroundSize: '100% 100%'
                                }}
                             />
                            <div className="popoverMoal-con">
                                <span>设备名称：{this.state.popoverDetail.cameraName}</span>
                                <span>报警类型：{this.state.popoverDetail.tagType?this.state.popoverDetail.tagType:"无"}</span>
                                <span>报警时间：{this.state.popoverDetail.msgInfo.starttime_ymd +this.state.popoverDetail.msgInfo.starttime_hms}</span>
                            </div>
                        </div>
                            :""
                    }
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    alarNums: state.postReducer.num,
});
LayerHeader.propTypes = {
    postReducer: PropTypes.func.isRequired,
};
export default withRouter(connect(mapStateToProps, {postReducer})(Form.create()(LayerHeader)));
