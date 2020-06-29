import React, { Component } from 'react';
import {Button,Modal,message,Input,Form,Empty,Icon,Breadcrumb} from 'antd';
import Etable from "../../common/Etable";
import '../../../style/ztt/css/raspberry.less';
import axios from "../../../axios/index";
import Utils from "../../../utils/utils";
const confirm = Modal.confirm;
class Raspberry extends Component{
    constructor(props){
        super(props);
        this.state={
            tabList:[],
            ifDisable:false,
            visible:false,
            details:false,
            manualModel:false,
            equFont:false
        };
    }
    componentDidMount() {
        this.handleEqument();
    }
    params = {
        pageindex: 1,
        pagesize: 30
    };
    //设备列表 estatus 0全部   2未使用  1 使用中
    handleEqument=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/equ/getlist",
            data:{
                pagesize: this.params.pagesize,
                pageindex: this.params.pageindex,
                estatus:0
            }
        }).then((res)=>{
            if(res.success){
                this.setState({
                    tabList:res.data,
                    pagination: Utils.pagination(res, current => {
                        this.params.pageindex = current;
                        this.handleEqument();
                    })
                })
            }
        })
    }
    //恢复出场设备
    hanleResume=(code)=>{
        confirm({
            title: '是否恢复出厂设置？',
            onOk() {
                axios.ajax({
                    method: "get",
                    url:window.g.loginURL+"/api/rasp/initrasp",
                    data:{devid:code}
                }).then((res)=>{
                    if(res.success){
                        message.success("恢复出厂设置成功！")
                    }
                })
            }
        });
    };
    //重启设备
    hanleRestart=(code)=>{
        confirm({
            title: '是否重启设备？',
            onOk() {
                axios.ajax({
                    method: "get",
                    url:window.g.loginURL+"/api/rasp/restartrasp",
                    data:{devid:code}
                }).then((res)=>{
                    if(res.success){
                        message.success("重启成功！")
                    }
                })
            }
        });
    };
    //设备详情
    hanleDetails=(devid)=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/rasp/raspstatus",
            data:{devid:devid}
        }).then((res)=>{
            if(res.success){
                this.hanleResult(res.data);
                this.setState({
                    details:true
                })
            }
        })
    };
    //设备详情结果
    hanleResult=(taskid)=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/rasp/rasptaskrst",
            data:{taskid:taskid}
        }).then((res)=>{
            if(res.success){
                this.setState({
                    equimentInfor:JSON.parse(res.data.taskresult)
                })
            }
        })
    }
    //设备详情弹框关闭
    hanleDetailsCancel=()=>{
        this.setState({
            details:false
        })
    }
    //设备升级弹框打开
    hanleUpgrading=(code)=>{
        this.setState({
            visible:true,
            equmentCode:code
        })
    };
    //设备升级
    handleEqumentOk=()=>{
        this.props.form.validateFields((err,values) => {
            if (!err) {
                axios.ajax({
                    method:"get",
                    url:window.g.loginURL+"/api/rasp/raspupversion",
                    data:{
                        devid:this.state.equmentCode,
                        version:values.version
                    }
                }).then((res)=>{
                    if(res.success){
                        message.success("设备升级成功！");
                        this.handleEqument();
                        this.props.form.resetFields();
                        this.setState({
                            visible:false,
                        })
                    }
                })
            }
        });
    };
    //设备升级弹框关闭
    handleEqumentCancel=()=>{
        this.setState({
            visible:false,
        })
    }
    //解绑
    hanleUntying=(devid)=>{
        const _this=this;
        confirm({
            title: '是否解除设备？',
            onOk() {
                axios.ajax({
                    method:"get",
                    url:window.g.loginURL+"/api/equ/disbind",
                    data:{devid:devid}
                }).then((res)=>{
                    if(res.success){
                        setTimeout(()=>_this.hanleReasult(res.data),3000)
                    }
                })
            }
        })
    };
    //解绑树莓派任务结果
    hanleReasult=(taskid)=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/rasp/rasptaskrst",
            data:{
                taskid:taskid
            }
        }).then((res)=>{
            if(res.success){
                if(res.data.taskresult){
                    let taskresult=JSON.parse(res.data.taskresult);
                    if(taskresult.status=="200"){
                        message.success("解绑成功！");
                        this.handleEqument();
                    }else {
                        message.error("解绑失败！");
                    }
                }else{
                    message.error("解绑失败！");
                }
            }
        })
    };
    hanleManualAdd=()=>{
        this.setState({manualModel:true})
    };
    hanleManualOk=()=>{
        if(this.state.device){
            axios.ajax({
                method:"post",
                url:window.g.loginURL+"/api/equ/add",
                data:{ecode:this.state.device}
            }).then((res)=>{
                if(res.success){
                    message.success(res.msg);
                    this.setState({
                        manualModel:false,
                        equFont:false
                    },()=>{
                        this.handleEqument();
                    })
                }else{
                    message.error(res.msg);
                }
            })
        }else{
            this.setState({equFont:true})
        }
    };
    hanleManualCancel=()=>{
        this.setState({
            manualModel:false,
            equFont:false
        })
    };
    equValue=(e)=>{
        if(e.target.value){
            this.setState({
                device:e.target.value,
                equFont:false
            });
        }else{
            this.setState({
                equFont:true
            });
        }

    };
    render() {
        const userlist = [
            {
                title: "序号",
                align: "center",
                key: "code",
                render: (text, record, index) => {
                    return(
                        <div className="tableIndex">{index + 1}</div>
                    )
                }
            },
            {
                title: "设备编码",
                dataIndex: "ecode",
                align: "center"
            },
            {
                title: "设备名称",
                dataIndex: "ename",
                align: "center"
            },
            {
                title: "设备IP",
                dataIndex: "boxip",
                align: "center",
                render:(text,record)=>{
                    if(record.heartinfo){
                        return <span>{record.heartinfo.boxip}</span>
                    }
                }
            },{
                title:"设备类型",
                dataIndex: "projecttype",
                align: "center",
                render:(text,record)=>{
                    if(record.relations){
                        if(record.relations.projecttype === "1"){
                            return <span>围界设备</span>
                        }else if(record.relations.projecttype === "2"){
                            return <span>人脸设备</span>
                        }
                    }
                }
            },{
                title: "温度",
                dataIndex: "temp",
                align: "center",
                render:(text,record)=>{
                    if(record.heartinfo){
                        return <span>{record.heartinfo.temp+"℃"}</span>
                    }
                }
            },{
                title: "心跳时间",
                dataIndex: "time",
                align: "center",
                render:(text,record)=>{
                    if(record.heartinfo){
                        return <span>{record.heartinfo.time}</span>
                    }
                }
            },
            {
                title: "使用状态",
                dataIndex: "estatus",
                align: "center",
                render:(text)=>{
                    if(text===2){
                        return(
                            <span className="state-bg-not">未使用</span>
                        )
                    }else if(text===1){
                        return(
                            <span className="state-bg-normal">使用中</span>
                        )
                    }
                }
            }, {
                title: "运行状态",
                dataIndex: "ifonline",
                align: "center",
                render:(text)=>{
                    if(text===0){
                        return(
                            <span className="ifStatus">
                                <span className="offline" />
                                离线
                            </span>
                        )
                    }else if(text===1){
                        return(
                            <span className="ifStatus">
                                <span className="online" />
                                在线
                            </span>
                        )
                    }
                }
            }, {
                title: "操作",
                dataIndex: "oper",
                align: "center",
                render:(text,record)=>{
                    if(record.estatus===1){
                        return(
                            <div>
                                <a href={"#/main/addRaspberry?activeKeys="+5+"&code="+record.cid+"&ecode="+record.ecode+"&projecttype="+record.relations.projecttype} className="operationBtn infoCircle equIcon"  ><Icon title="设置" type="setting" /></a>
                                {/* <a href={"#/main/addRaspberry?activeKeys="+4+"&code="+record.cid+"&ecode="+record.ecode} className="operationBtn" >布防时间</a>*/}
                                <span  className="poweroff equIcon" onClick={()=>this.hanleDetails(record.ecode)}><Icon type="info-circle" title="设备详情" /></span>
                                <span  className="poweroff equIcon" onClick={()=>this.hanleUntying(record.ecode)}><Icon type="disconnect" title="解绑" /></span>
                                {/*<span  className="operationBtn" onClick={()=>this.hanleResume(record.ecode)}>恢复出厂设置</span>*/}
                                <span  className="equoff equIcon" onClick={()=>this.hanleRestart(record.ecode)}><Icon type="sync" title="重启设备" /></span>
                                {/*<span  className="operationBtn" onClick={()=>this.hanleUpgrading(record.ecode)}>设备升级</span>*/}
                            </div>
                        )
                    }else{
                        return(
                            <a className="operationBtn" href={"#/main/addRaspberry?activeKeys="+2+"&ecode="+record.ecode}>绑定摄像头</a>
                        )
                    }
                }
            }
        ];
        const formlayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 16
            }
        };
        const { getFieldDecorator} = this.props.form;
        return (
            <div className="raspberry">
                <Breadcrumb className="crumbs">
                    <Breadcrumb.Item>设备管理</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span className="crumbs-item">围界列表</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Button type="primary" className="rasBtn" >
                    <a href={"#/main/addRaspberry?activeKeys="+1}><Icon type="file-add" />&nbsp;&nbsp;引进添加</a>
                </Button>
                <Button className="rasBtn addEqu manual" onClick={this.hanleManualAdd}>手动新增</Button>
                <Etable
                    columns={userlist}
                    dataSource={this.state.tabList}
                    //pagination={this.state.pagination}
                />
                <Modal
                    title="设备升级"
                    visible={this.state.visible}
                    onOk={this.handleEqumentOk}
                    onCancel={this.handleEqumentCancel}
                >
                    <Form {...formlayout}>
                        <Form.Item label="设备版本号">
                            {getFieldDecorator("version", {
                                rules: [
                                    {
                                        required: true,
                                        pattern: new RegExp(
                                            "^([1-9]\\d|[1-9])(.([1-9]\\d|\\d)){2}$",
                                            "g"
                                        ),
                                        message: "请输入正确的设备版本号!"
                                    },
                                    {
                                        required: true,
                                        message: "请输设备版本号!"
                                    }
                                ]
                            })(<Input />)}
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="设备详情"
                    visible={this.state.details}
                    onCancel={this.hanleDetailsCancel}
                    footer={null}
                    width={400}
                    className="equiment"
                >
                    {
                        this.state.equimentInfor!=null?[
                            <div>
                                <p ><span>设备号：</span>{this.state.equimentInfor.devid}</p>
                                <p ><span>所属公司：</span>{this.state.equimentInfor.companyid}</p>
                                <p ><span>摄像头IP：</span>{this.state.equimentInfor.cameraip}</p>
                                <p ><span>摄像头端口号：</span>{this.state.equimentInfor.cameraportno}</p>
                                <p ><span>摄像头宽度：</span>{this.state.equimentInfor.camerawidth}</p>
                                <p ><span>摄像头高度：</span>{this.state.equimentInfor.cameraheight}</p>
                                <p ><span>任务状态：</span>{this.state.equimentInfor.status}</p>
                                <p ><span>任务号：</span>{this.state.equimentInfor.taskid}</p>
                                <p ><span>设备硬件版本：</span>{this.state.equimentInfor.hardversion}</p>
                                <p ><span>设备软件版本：</span>{this.state.equimentInfor.softversion}</p>
                            </div>
                        ]:<Empty />
                    }
                </Modal>
                <Modal
                    title="手动新增"
                    visible={this.state.manualModel}
                    onOk={this.hanleManualOk}
                    onCancel={this.hanleManualCancel}
                >
                    <p style={{display:"flex",alignItems:"center"}}><span>设备号：</span><Input onChange={this.equValue} style={{width:280}} /></p>
                    <span style={{color:"red",fontSize:"13px",paddingLeft:"48px",display:this.state.equFont?"block":"none"}}>请输入设备号！</span>
                </Modal>
            </div>
        );
    }
}
export default Raspberry=Form.create({})(Raspberry);
