import React, {Component} from 'react';
import Etable from "../../common/Etable";
import axios from "../../../axios";
import {Button, Icon, message, Modal,Breadcrumb, Form, Input, Select} from "antd";
import "../../../style/ztt/css/security.less";
import SecurityModel from "./SecurityModel";

const confirm = Modal.confirm;
const Option = Select.Option;

class Security extends Component {
    constructor(props) {
        super(props);
        this.state = {
            securList: [],
            visible: false
        };
    }

    componentDidMount() {
        this.securityList();
    }

    //安保人员列表
    securityList = () => {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/security/getlist",
            data: {
                realname: this.state.realname,
                gender: this.state.gender
            }
        }).then((res) => {
            if (res.success) {
                this.setState({
                    securList: res.data
                })
            }
        })
    };
    //查询安保人员姓名、性别
    handleSecuritySubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    realname: values.realname,
                    gender: values.gender
                }, () => {
                    this.securityList();
                })
            }
        });
    }
    changeState = (key, val, record, groupType, typecode) => {
        this.setState(
            {
                [key]: val,
                codetype: record.code,
                [groupType]: typecode,
            }
        )
    };
    uploadOk = (params) => {
        const _this = this;
        if(params.memo!==null){
            if (_this.state.groupType === 0) {
                //新增
                axios.ajax({
                    method: "post",
                    url: window.g.loginURL + "/api/security/add",
                    data: params
                }).then((res) => {
                    if (res.success) {
                        this.securityList();
                    } else {
                        message.warning(res.msg);
                    }
                })
            } else {
                //编辑
                params.code = this.state.codetype;
                axios.ajax({
                    method: "put",
                    url: window.g.loginURL + "/api/security/update",
                    data: params
                }).then((res) => {
                    if (res.success) {
                        message.success(res.msg);
                        this.securityList();
                    }
                })
            }
        }else{
            message.info("请上传头像");
        }
    };
    //删除
    hanleGroupDel = (delcode) => {
        const _this = this;
        confirm({
            title: '确认删除吗？',
            onOk() {
                axios.ajax({
                    method: "delete",
                    url: window.g.loginURL + "/api/security/del",
                    data: {code: delcode.code}
                }).then((res) => {
                    if (res.success) {
                        message.success(res.msg);
                        _this.securityList();
                    }
                })
            }
        });
    };

    render() {
        const userlist = [
            {
                title: "序号",
                align: "center",
                key: "code",
                render: (text, record, index) => {
                    return (
                        <div className="tableIndex">{index + 1}</div>
                    )
                }
            },
            {
                title: "头像",
                dataIndex: "memo",
                align: "center",
                render:(text)=>{
                    return(
                        <img src={text} className="picImg" alt=""/>
                    )
                }
            },
            {
                title: "姓名",
                dataIndex: "realname",
                align: "center",
            },
            {
                title: "性别",
                dataIndex: "gender",
                align: "center",
            },
            {
                title: "安保人员账号",
                dataIndex: "securityaccount",
                align: "center"
            },
            {
                title: "联系电话",
                dataIndex: "linktel",
                align: "center"
            },
            {
                title: "紧急联系人",
                dataIndex: "linkmen",
                align: "center"
            }, {
                title: "紧急联系人电话",
                dataIndex: "linktel1",
                align: "center"
            },
            {
                title: "操作",
                dataIndex: "oper",
                width: "20%",
                align: "center",
                render: (text, record) => {
                    return (
                        <div className="faceBtn">
                            <span className="borderEdit" onClick={() => this.changeState('visible', true, record, 'groupType', 1)}>
                                <Icon type="form" className="faceEdit" title="编辑" />
                            </span>
                            <span className="borderDelete" onClick={() => this.hanleGroupDel(record)}>
                                <Icon type="delete" className="faceDelete" title="删除" />
                            </span>
                        </div>
                    )
                }
            }
        ];
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="security">
                <Breadcrumb className="crumbs">
                    <Breadcrumb.Item>人员管理</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span className="crumbs-item">安保人员信息</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className = "bodyTop">
                    <Form layout="inline" onSubmit={this.handleSecuritySubmit}>
                        <Form.Item label="姓名">
                            {getFieldDecorator('realname')(<Input/>)}
                        </Form.Item>
                        <Form.Item label="性别">
                            {getFieldDecorator('gender', {
                                initialValue: ""
                            })(
                                <Select style={{width: 120}}>
                                    <Option value="">请选择</Option>
                                    <Option value="男">男</Option>
                                    <Option value="女">女</Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                查询
                            </Button>
                        </Form.Item>
                    </Form>
                    <Button type="primary" className="addGroup-person" onClick={() => this.changeState('visible', true, '', 'groupType', 0)}>
                        添加安保人员
                    </Button>
                </div>
                <div className="securityTab">
                    <Etable
                        columns={userlist}
                        dataSource={this.state.securList}
                    />
                </div>
                <SecurityModel
                    visible={this.state.visible}
                    filterSubmit={this.uploadOk}
                    code={this.state.codetype}
                    groupType={this.state.groupType}
                    uploadreset={() => this.changeState('visible', false, '', 'groupType', 1)}
                />
            </div>
        );
    }
}

export default Security = Form.create({})(Security);
