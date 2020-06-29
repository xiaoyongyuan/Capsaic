import React, { Component } from 'react';
import {Button,Table,message,Breadcrumb,Modal} from "antd";
import "../../style/ztt/css/developer.less";
import axios from "../../axios/index";
const { confirm } = Modal;
class Developer extends Component{
    state={
        unbindList:[],
        tabSelectList:[],
        lightEid:"",
    };
    componentDidMount() {
        this.unbindDataList();//联动设备关系列表
        this.sys_setInitInfo();//系统初始化
    }
    unbindDataList=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/develop/linkageequ",
            data:{}
        }).then((res)=>{
            if(res.success){
                this.setState({
                    unbindList:res.data
                })
            }
        })
    };
    //批量解绑数据
    unbindData=()=>{
        const _this=this;
        if(this.state.tabSelectList.length>0){
        confirm({
            title: '确定解绑设备吗？',
            onOk() {
                axios.ajax({
                    method:"get",
                    url:window.g.loginURL+"/api/develop/onekeydisbind",
                    data:{
                        devidlist:JSON.stringify(this.state.tabSelectList)
                    }
                }).then((res)=>{
                    if(res.success){
                        message.success("设备解绑成功！");
                        _this.unbindDataList();
                    }else{
                        message.success("设备解绑失败！");
                    }
                })
            }
        });
        }else{
            message.info("请选择表格数据！");
        }
    };
    //设备闪灯
    hanleFlashing=()=>{
        if(this.state.lightEid){
            axios.ajax({
                method:"get",
                url:window.g.loginURL+"/api/rasp/light",
                data:{devid:this.state.lightEid}
            }).then((res)=>{
                if(res.success){
                    message.success(this.state.lightEid+"设备闪灯成功！");
                }else{
                    message.success("设备闪灯失败！");
                }
            })
        }else{
            message.info("请选中表格中的一个设备，只能选择一个！");
        }
    };
    //重置报警记录
    restAlarmRecord=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/develop/delunion",
            data:{}
        }).then((res)=>{
            if(res.success){
                message.success(res.msg);
            }else{
                message.error(res.msg);
            }
        })
    };
    //树莓派升级ipExcel生成
    upgrade=()=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/develop/upgraderasp",
            data:{}
        }).then((res)=>{
            if(res.success){
                message.success(res.msg);
            }else{
                message.error(res.msg);
            }
        })
    };
    //系统初始化
    sys_setInitInfo = () => {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/redisinfo/setinfo",
            data: {}
        }).then();
    };
    render() {
        let columns = [
            {
                title: "序号",
                align: "center",
                key: "code",
                render: (text, record, index) => index + 1
            },
            {
                title: "主设备设备编码",
                dataIndex: "maindevid",
                align: "center",
                render:(text)=>{
                    return(
                        <span className="equCode">{text}</span>
                    )
                }
            },
            {
                title: "主设备设备名称",
                dataIndex: "maindevidname",
                align: "center"
            },
            {
                title: "主设备设备IP",
                dataIndex: "maindevidip",
                align: "center",
            },{
                title: "接入设备名称",
                dataIndex: "localdevidname",
                align: "center",
            },{
                title: "接入设备编码",
                dataIndex: "localdevid",
                align: "center",
                render:(text)=>{
                    return(
                        <span className="equCode">{text}</span>
                    )
                }
            },
            {
                title: "接入设备IP",
                dataIndex: "localdevidip",
                align: "center",
            }
        ];
        const rowSelection = {
            onSelect: (record, selected, selectedRows) => {
                    let selectList=[];
                    selectedRows.map((v)=>{
                        selectList.push({"ecode":v.localdevid})
                    });
                    this.setState({
                        tabSelectList:selectList,
                        lightEid:record.localdevid
                    })
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                let selectList=[];
                selectedRows.map((v)=>{
                    selectList.push({"ecode":v.localdevid})
                });
                this.setState({
                    tabSelectList:selectList
                });
            },
        };
        return (
            <div className="developer">
                <Breadcrumb className="crumbs">
                    <Breadcrumb.Item>
                        <span className="crumbs-item">开发者</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className="developerTitle">
                    <div>
                        <Button type="primary" className="equBtn" onClick={this.unbindData}>解绑设备</Button>
                        <Button type="primary" className="equBtn" onClick={this.hanleFlashing}>设备闪灯</Button>
                    </div>
                    <div>
                        <Button className="unboundEqu" onClick={this.restAlarmRecord}>重置报警记录</Button>
                        <Button className="unboundEqu" onClick={this.upgrade}>树莓派升级</Button>
                    </div>
                </div>

                <Table columns={columns} rowSelection={rowSelection} dataSource={this.state.unbindList} />
            </div>
        );
    }
}
export default Developer;