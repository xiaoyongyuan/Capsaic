import React, { Component } from 'react';
import '../../../style/ztt/css/AddRaspberry.less';
import { Tabs,Button,message,Breadcrumb} from 'antd';
import {Link} from 'react-router-dom'
import UploadRas from "./UploadRas";
import axios from "../../../axios/index";
import ConfigureRas from "./ConfigureRas";
import CameraSet from "./cameraSetRas"
import DefTime from "./DefendTimeRas";
import RaspEdit from "./RaspEdit";
import FalsePositives from "./FalsePositives";
const { TabPane } = Tabs;
class AddRaspberry extends Component{
    constructor(props){
        super(props);
        this.state={
            activeKeys:"",
            disabledStopSer: true,
            disabled24: true,
            disabledRecover: true,
            equipData:{},
            subNode:[],
            crumbsTab:"",
            projecttype:""
        };
    }
    componentWillMount() {
        this.setState({
            activeKeys:this.props.query.activeKeys,
            projecttype:this.props.query.projecttype
        },()=>{
            if(this.state.activeKeys === "5"){
                this.setState({
                    crumbsTab:"基本信息"
                })
            }else if(this.state.activeKeys === "1"){
                this.setState({
                    crumbsTab:"上传设备"
                })
            }else if(this.state.activeKeys === "2"){
                this.setState({
                    crumbsTab:"配置"
                })
            }
        })
    }
    componentDidMount(){
        if (this.props.query.code) {
            if(this.state.activeKeys==3 || this.state.activeKeys ==4 || this.state.activeKeys ==5){
                this.getOne();
                this.hanleSubordinate();
            }
        }
    }
    //所属节点
    hanleSubordinate=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/system/nodelist",
            data:{}
        }).then((res)=>{
            if(res.success){
                this.setState({
                    subNode:res.data
                })
            }
        })
    };
    getOne = () => {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/camera/getone",
            data: {
                code: this.props.query.code
            }
        })
            .then(res => {
                if (res.success) {
                    if (res.data.cstatus === 0) {
                        this.setState({
                            disabledStopSer: true,
                            disabled24: true,
                            disabledRecover: true
                        });
                    } else if (res.data.cstatus === 1) {
                        if (res.data.if_cancel === 1) {
                            this.setState({
                                disabledStopSer: false,
                                disabled24: true,
                                disabledRecover: false
                            });
                        } else if (res.data.if_cancel === 0) {
                            this.setState({
                                disabledStopSer: false,
                                disabled24: false,
                                disabledRecover: true
                            });
                        } else if (res.data.if_cancel === 2) {
                            this.setState({
                                disabledStopSer: true,
                                disabledRecover: false,
                                disabled24: false
                            });
                        }
                    }
                    this.setState({
                        equipData: res.data,
                    });
                }else{
                    message.error(res.msg)
                }
            });
    };
    //设备配置摄像头
    hanleConfigure=(param)=>{
        axios.ajax({
            method:"post",
            url:window.g.loginURL+"/api/rasp/initproperties",
            data:param
        }).then((res)=>{
            if(res.success){
                setTimeout(()=>this.hanleReault(res.data),4000);
            }
        })
    };
    //任务结果返回
    hanleReault=(taskid)=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/rasp/rasptaskrst",
            data:{taskid:taskid}
        }).then((res)=>{
            if(res.success){
                if(res.data.taskresult){
                    let taskresult=JSON.parse(res.data.taskresult);
                    if(taskresult.initstatus){
                        if(taskresult.initstatus=="200"){
                            window.location.href="#/main/raspberry";
                            message.success("配置成功！");
                        }else{
                            message.error("配置失败！");
                        }
                    }else{
                     message.info("手动点击返回按钮!");
                    }
                }else{
                    message.error("配置失败！");
                }
            }
        })
    };
    callback=(key)=>{
        if(key === "5"){
            this.setState({
                crumbsTab:"基本信息"
            })
        }else if(key === "3"){
            this.setState({
                crumbsTab:"防区设置"
            })
        }else if(key === "6"){
            this.setState({
                crumbsTab:"误报设置"
            })
        }else if(key === "4"){
            this.setState({
                crumbsTab:"布防时间"
            })
        }
    };
    crumbsTab=()=>{
        if(this.state.activeKeys ===5){
            return "基本信息";
        }
    };
    hanleShowTab=()=>{
        if(this.state.activeKeys == 1){
            return(
                <Tabs defaultActiveKey={this.state.activeKeys} className="setting">
                    <TabPane
                        key="1"
                        tab="上传设备"
                    >
                        <UploadRas />
                    </TabPane>
                </Tabs>
            )
        }else if(this.state.activeKeys == 2){
            return(
                <Tabs defaultActiveKey={this.state.activeKeys} className="setting" >
                    <TabPane
                        key="2"
                        tab="配置"
                    >
                        <ConfigureRas
                            configureSubmit={this.hanleConfigure}
                            ecode={this.props.query.ecode}
                        />
                    </TabPane>
                </Tabs>
            )
        }else if(this.state.activeKeys == 3 || this.state.activeKeys == 4 ||this.state.activeKeys == 5 ||this.state.activeKeys == 6){
            return(
                <Tabs defaultActiveKey={this.state.activeKeys} className="setting" onChange={this.callback}>
                    <TabPane
                        key="5"
                        tab="基本信息"
                    >
                        <RaspEdit
                            ststIn = {this.state}
                            equipData = {this.state.equipData}
                            getOne = {this.getOne}
                            subNode={this.state.subNode}
                            formcode = {this.props.query.code}
                            handleThresholdChange = {this.handleThresholdChange}
                            handleFrozenChange = {this.handleFrozenChange}
                        />
                    </TabPane>
                    <TabPane
                        key="3"
                        tab={this.state.projecttype === "2" ? "图像背景":"防区设置"}
                    >
                        <CameraSet
                            camerdat = {this.state}
                            code={this.props.query.code}
                            getOne = {this.getOne}
                            ecode={this.props.query.ecode}
                        />
                    </TabPane>
                    {
                        this.state.projecttype === "2"?""
                         : <TabPane
                                key="6"
                                tab="误报设置"
                            >
                                <FalsePositives
                                    camerdat = {this.state}
                                />
                            </TabPane>
                    }
                    {
                        this.state.projecttype === "2"?""
                            : <TabPane
                                key="4"
                                tab="布防时间"
                            >
                                <DefTime
                                    code={this.props.query.code}
                                    equipData={this.state.equipData}
                                    getOne={this.getOne}
                                    ecode={this.props.query.ecode}
                                />
                            </TabPane>
                    }
                </Tabs>
            )
        }
    };
    render() {
        return (
            <div className="addRaspberry">
                <Breadcrumb className="crumbs">
                    <Breadcrumb.Item>设备管理</Breadcrumb.Item>
                    {
                        this.state.activeKeys === "1" || this.state.activeKeys === "2"
                            ?"": <Breadcrumb.Item>设置</Breadcrumb.Item>
                    }
                    <Breadcrumb.Item>
                        <span className="crumbs-item">{this.state.crumbsTab}</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className="backBtn">
                    <Button type="primary"><Link to="/main/raspberry">返回</Link></Button>
                </div>
                {this.hanleShowTab()}
            </div>
        );
    }
}

export default AddRaspberry;
