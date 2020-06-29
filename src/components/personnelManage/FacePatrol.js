import React, { Component } from "react";
import { Breadcrumb, Button, DatePicker, Form, Icon, Input, Modal } from "antd";
import Etable from "../common/Etable";
import axios from "../../axios/index";
import "../../style/ztt/css/facePatrol.less";
const { RangePicker } = DatePicker;
class FacePatrol extends Component {
    state = {
        facePatrollList: [],
        visible: false
    };
    times = {
        bdate: "",
        edate: "",
    };
    componentDidMount() {
        this.hanleFacePatrollist();
    }
    hanleFacePatrollist = () => {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/ondutyresult/list",
            data: {
                bdate:this.times.bdate,
                edate:this.times.edate,
                ondutyaccount:this.times.ondutyaccount,
            }
        }).then((res) => {
            if (res.success) {
                this.setState({
                    facePatrollList: res.data,
                })
            }
        })
    };
    faceFormSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.date === undefined) {
                    this.times.bdate = "";
                    this.times.edate = "";
                } else if (values.date && values.date.length) {
                    this.times.bdate = values.date && values.date.length ? values.date[0].format('YYYY-MM-DD HH:mm:ss') : '';
                    this.times.edate = values.date && values.date.length ? values.date[1].format('YYYY-MM-DD HH:mm:ss') : '';
                } else {
                    this.times.bdate = values.date && values.date.length ? values.date[0].format('YYYY-MM-DD HH:mm:ss') : ''
                    this.times.edate = values.date && values.date.length ? values.date[1].format('YYYY-MM-DD HH:mm:ss') : ''
                }
                this.times.ondutyaccount = values.ondutyaccount
                this.hanleFacePatrollist();
            }
        });
    };
    hanleNightPatrol = (params, type) => {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/ondutyresult/setsign",
            data: {
                code: params.code,
                ohandle: type
            }
        }).then((res) => {
            if (res.success) {
                this.hanleFacePatrollist();
            }
        })
    };
    hanleName = (name) => {
        this.setState({
            visible: true
        })
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/security/getlist",
            data: { realname: name }
        }).then((res) => {
            if (res.success) {
                this.setState({
                    realname: res.data[0].realname,
                    gender: res.data[0].gender,
                    securityaccount: res.data[0].securityaccount,
                    linktel: res.data[0].linktel,
                    linkmen: res.data[0].linkmen,
                    linktel1: res.data[0].linktel1,
                })
            }
        })
    }
    handleCancel = () => {
        this.setState({
            visible: false
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const userlist = [
            {
                title: "序号",
                align: "center",
                key: "num",
                render: (text, record, index) => {
                    return (
                        <div className="tableIndex">{index + 1}</div>
                    )
                }
            },
            {
                title: "姓名",
                dataIndex: "realname",
                align: "center",
                render: (text) => {
                    return (
                        <span onClick={() => this.hanleName(text)} className="faceRealname">{text}</span>
                    )
                }
            }
            ,
            {
                title: "打卡人账号",
                dataIndex: "ondutyaccount",
                align: "center"
            },
            {
                title: "打卡状态",
                dataIndex: "ifhandle",
                align: "center",
                render: (text) => {
                    if (text === 0) {
                        return <span className='noduty'>未值日</span>;
                    } else if (text === 1) {
                        return <span>已值日</span>;
                    }
                }
            }, {
                title: "打卡时间",
                dataIndex: "odate",
                align: "center",
            }, {
                title: "打卡图像",
                dataIndex: "ondutypic",
                align: "center",
                render:(text)=>{
                    let contrastpath=JSON.parse(text).contrastpath;
                    return(
                        <img className="picImg" src={contrastpath} alt=""/>
                    )
                }
            }, {
                title: '打卡审核',
                dataIndex: 'ohandle',
                align: "center",
                render: text => {
                    if (text === 0) {
                        return (<span>未审核</span>);
                    } else if (text === 1) {
                        return (<span className="passFont">通过</span>);
                    } else if (text === 2) {
                        return (<span className='noduty'>不通过</span>);
                    }
                }
            }, {
                title: "操作",
                key: "oper",
                align: "center",
                render: (text, record) => record.ohandle == 1 ? null : <div className="facePatrolBtn">
                    <span className="borderDelete"><Icon type="close-circle" title="不通过" className="noPass" onClick={() => this.hanleNightPatrol(record, 2)} /></span>
                    <span className="borderEdit"><Icon type="check-circle" title="通过" className="pass" onClick={() => this.hanleNightPatrol(record, 1)} /></span>
                </div>
            }
        ];
        return (
            <div className="facePatrol">
                <Breadcrumb className="crumbs">
                    <Breadcrumb.Item>人员管理</Breadcrumb.Item>
                    <Breadcrumb.Item>考勤管理</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span className="crumbs-item">人脸巡更</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className="facePatrolTitle">
                    <Form layout="inline" onSubmit={this.faceFormSubmit}>
                        <Form.Item label="打卡人账号">
                            {
                                getFieldDecorator("ondutyaccount")(
                                    <Input placeholder="请输入打卡人账号" />
                                )
                            }
                        </Form.Item>
                        <Form.Item label="打卡时间">
                            {
                                getFieldDecorator("date")(
                                    <RangePicker
                                        disabledDate={this.disabledDate}
                                        showTime={{ format: 'YYYY-MM-DD HH:mm:ss' }}
                                        format="YYYY-MM-DD HH:mm:ss"
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button className="query-btn" type="primary" htmlType="submit">
                                搜索
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <Etable
                    dataSource={this.state.facePatrollList}
                    columns={userlist}
                />
                <Modal
                    title="人员详情"
                    visible={this.state.visible}
                    footer={null}
                    maskClosable={false}
                    width={340}
                    onCancel={this.handleCancel}
                >
                    <p className="model-item"><span className="modelCircle" /><span>姓名：</span>{this.state.realname}</p>
                    <p className="model-item"><span className="modelCircle" /><span>性别：</span>{this.state.gender}</p>
                    <p className="model-item"><span className="modelCircle" /><span>账号：</span>{this.state.securityaccount}</p>
                    <p className="model-item"><span className="modelCircle" /><span>联系电话：</span>{this.state.linktel}</p>
                    <p className="model-item"><span className="modelCircle" /><span>紧急联系人：</span>{this.state.linkmen}</p>
                    <p className="model-item"><span className="modelCircle" /><span>紧急联系人电话：</span>{this.state.linktel1}</p>
                </Modal>
            </div>
        )
    }
}
export default FacePatrol = Form.create({})(FacePatrol);