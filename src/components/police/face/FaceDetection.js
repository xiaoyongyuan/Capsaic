import React,{Component}  from "react";
import {Breadcrumb,Input} from "antd";
import Etable from "../../common/Etable";
import axios from "../../../axios";
import "../../../style/ztt/css/faceDetection.less";
import FaceModel from "./FaceModel";
import {Button,Modal,Form,Icon, message } from "antd";
import Utils from "../../../utils/utils";
const { confirm } = Modal;
class FaceDetection extends Component{
    state={
        faceLists:[],
        facaVisible:false,
        imageUrl:"",
        addSuccess:false,//判断添加成功，子组件头像地址清空
        formData:{},//form查询参数
        faceDetailVisible:false,
        faceDetail:{},
    };
    params = {
        pageindex: 1,
        pagesize: 6
    };
    componentDidMount() {
        this.getfaceList();
    }
    //人脸列表
    getfaceList=()=>{
        axios.ajax({
            url:window.g.loginURL+"/api/keyface/list",
            method:"get",
            data:{
                pagesize: this.params.pagesize,
                pageindex: this.params.pageindex,
                facename:this.state.formData.facename,
                idcard:this.state.formData.idcard
            }
        }).then((res)=>{
            if(res.success){
                this.setState({
                    faceLists:res.data,
                    pagination: Utils.pagination(res, current => {
                        this.params.pageindex = current;
                        this.getfaceList();
                    })
                })
            }
        })
    };
    //重点人员查询
    faceFormSelect=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    formData:values
                },()=>{
                    this.getfaceList();
                });
            }
        });
    };
    //人脸删除
    hanleFaceDel=(data)=>{
        const _this=this;
        confirm({
            title: '是否删除该用户?',
            onOk() {
                axios.ajax({
                    method:"delete",
                    url:window.g.loginURL+"/api/keyface/del",
                    data:{code:data.code}
                }).then((res)=>{
                    if(res.success){
                        message.success("人脸删除成功！");
                      _this.getfaceList();
                    }
                })
            },
        });
    };
    changeState=(facaVisible,record,groupType, typecode)=>{
        this.setState({
            facaVisible,
            codetype: record.code,
            [groupType]: typecode,
        });
    };
    filterSubmit=(params)=>{
        if(this.state.groupType === 0){
            if(params.facepath){
                axios.ajax({
                    url:window.g.loginURL+"/api/keyface/add",
                    method:"post",
                    data:params
                }).then((res)=>{
                    if(res.success){
                        message.success("添加成功！");
                        this.setState({
                            facaVisible:false,
                            addSuccess:true
                        },()=>{
                            this.getfaceList();
                        });
                        this.setState({facaVisible:false})
                    }else{
                        message.error(res.msg);
                    }
                });
            }else{
                message.info("请上传头像！");
            }
        }else if(this.state.groupType === 1){
            if(params.facepath){
                params.code=this.state.codetype;
                axios.ajax({
                    method:"put",
                    url:window.g.loginURL+"/api/keyface/update",
                    data:params
                }).then((res)=>{
                    if(res.success){
                        message.success("修改成功！");
                        this.getfaceList();
                        this.setState({facaVisible:false})
                    }else{
                        message.error(res.msg);
                    }
                });
            }else{
                message.info("请上传头像！");
            }
        }
    };
    render() {
        const userlist=[
            {
                title: "序号",
                align: "center",
                key: "num",
                render: (text, record, index) => {
                    return(
                        <div className="tableIndex">{index + 1}</div>
                    )
                }
            },
            {
                title: "头像",
                dataIndex: "facepath",
                align: "center",
                render:(text)=>{
                    return(
                        <img className="picImg" src={text} alt=""/>
                    )
                }
            },
            {
                title: "姓名",
                dataIndex: "facename",
                align: "center"
            },{
                title: "性别",
                dataIndex: "gender",
                align: "center",
                render: (text) => {
                    if(text === 0){
                        return <span>男</span>
                    }else if(text === 1){
                        return <span>女</span>
                    }
                }
            },
            {
                title: "身份证号",
                dataIndex: "idcard",
                align: "center"
            },{
                title:"类型",
                dataIndex: "facetype",
                align: "center",
                render: (text) => {
                    if(text === 1){
                        return <span className="keyPersonnel">重点人员</span>
                    }else if(text === 0){
                        return <span>工作人员</span>
                    }
                }
            },{
                title:"操作",
                dataIndex: "oper",
                align: "center",
                render: (text, record, index) => {
                    return(
                        <div className="faceBtn">
                            <span className="borderEdit"><Icon type="form" className="faceEdit" title="编辑" onClick={()=>this.changeState(true,record,'groupType', 1)} /></span>
                            <span className="borderDelete"><Icon type="delete" className="faceDelete" title="删除" onClick={()=>this.hanleFaceDel(record)} /></span>
                        </div>
                    )
                }
            }
        ];
        const { getFieldDecorator } = this.props.form;
        return(
            <div className="faceDetection">
                <Breadcrumb className="crumbs">
                    <Breadcrumb.Item>智能识别</Breadcrumb.Item>
                    <Breadcrumb.Item>人脸检测</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span className="crumbs-item">重点人员</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className="detectionTitle">
                    <Form layout="inline" onSubmit={this.faceFormSelect}>
                        <Form.Item label="人员名称">
                            {
                                getFieldDecorator("facename")(
                                    <Input placeholder="请输入人员名称" />
                                )
                            }
                        </Form.Item>
                        <Form.Item label="身份证号">
                            {
                                getFieldDecorator("idcard")(
                                    <Input placeholder="请输入身份证号" />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button className="query-btn" type="primary" htmlType="submit">
                                搜索
                            </Button>
                        </Form.Item>
                    </Form>
                    <Button className="faceAdd"
                            onClick={() => this.changeState(true,  "",'groupType', 0)}
                    >添加</Button>
                </div>
                <Etable
                    dataSource={this.state.faceLists}
                    columns={userlist}
                    pagination={this.state.pagination}
                />
                <FaceModel
                    facaVisible={this.state.facaVisible}
                    groupType={this.state.groupType}
                    addSuccess={this.state.addSuccess}
                    codetype={this.state.codetype}
                    filterSubmit={this.filterSubmit}
                    uploadreset={()=>this.changeState(false, '', 'groupType', 1)}
                />
            </div>
        )
    }
}
export default FaceDetection=Form.create({})(FaceDetection);