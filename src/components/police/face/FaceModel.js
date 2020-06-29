import React,{Component} from "react";
import {message,Icon,Form,Input,Upload,Modal,Radio} from "antd";
import axios from "../../../axios/index";
let vis=false;
class FaceModel extends Component{
    state={
        loading:false
    };
    componentWillReceiveProps(nextProps) {
        if(nextProps.facaVisible !== vis){
            vis=nextProps.facaVisible;
            if(vis){
                this.setState({
                    codetype:nextProps.codetype
                },(()=>{
                    this.hanleGetOne();
                }))
            }
            if(nextProps.addSuccess){
                this.setState({
                    imageUrl:""
                })
            }
        }
    }
    hanleGetOne=()=>{
        if(this.state.codetype){
            axios.ajax({
                method:"get",
                url:window.g.loginURL+"/api//keyface/getone",
                data:{
                    code:this.state.codetype
                }
            }).then((res)=>{
                if(res.success){
                    this.setState({
                        imageUrl:res.data.facepath
                    });
                    this.props.form.setFieldsValue({
                        facename:res.data.facename,//姓名
                        gender:res.data.gender,//性别
                        idcard:res.data.idcard,//身份证号
                        facetype:res.data.facetype,//类型
                        memo:res.data.memo,//备注
                    });
                }
            })
        }
    };
    handleOk=()=>{
        this.props.form.validateFields((err,values) => {
            if (!err) {
                let data={};
                data.facename=values.facename;
                data.facepath=this.state.imageUrl;
                data.facetype=values.facetype;
                data.gender=values.gender;
                data.idcard=values.idcard;
                data.memo=values.memo?values.memo:"无";
                this.props.filterSubmit(data);
            }
        });
    };
    handleCancel=()=>{
        this.props.form.resetFields();
        this.props.uploadreset();
        this.setState({
            imageUrl:""
        })
    };
    render() {
        const _this=this;
        const props = {
            name: 'file',
            method:"post",
            multiple: false,
            showUploadList:false,
            action:window.g.loginURL+"/api/keyface/uploadphoto",
            accept:".png,.jpg",
            onChange(info) {
                const { status } = info.file;
                if (status !== 'uploading') {
                    _this.setState({
                        imageUrl:info.file.response.msg,
                        loading: true
                    });
                }
                if (status === 'done') {
                    _this.setState({
                        loading:false,
                    });
                    message.success(`${info.file.name}上传成功.`);
                } else if (status === 'error') {
                    message.error(`${info.file.name} 上传失败.`);
                }
            },
        };
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">上传图片</div>
            </div>
        );
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        };
        const { getFieldDecorator } = this.props.form;
        return(
            <Modal
                title={this.props.groupType =="0"?"添加":"编辑"}
                visible={this.props.facaVisible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Form {...formItemLayout}>
                <Form.Item label="头像">
                    {
                        <Upload
                            {...props}
                            listType="picture-card"
                            className="avatar-uploader"
                        >
                            {this.state.imageUrl ? <img src={this.state.imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    }
                </Form.Item>
                <Form.Item label="姓名">
                    {
                        getFieldDecorator("facename",{
                            rules: [{
                                    required: true,
                                    message: "请输入姓名!"
                                }]
                        })(<Input />)
                    }
                </Form.Item>
                <Form.Item label="性别">
                    {
                        getFieldDecorator("gender",{
                            rules: [{
                                required: true,
                                message: "请输入性别!"
                            }]
                        })(
                            <Radio.Group>
                                <Radio value={0}>男</Radio>
                                <Radio value={1}>女</Radio>
                            </Radio.Group>
                        )
                    }
                </Form.Item>
                <Form.Item label="类型">
                    {
                        getFieldDecorator("facetype",{
                            rules: [{
                                required: true,
                                message: "请输入类型!"
                            }]
                        })(
                            <Radio.Group>
                                <Radio value={0}>工作人员</Radio>
                                <Radio value={1}>重点人员</Radio>
                            </Radio.Group>
                        )
                    }
                </Form.Item>
                <Form.Item label="身份证号">
                    {
                        getFieldDecorator("idcard",{
                            rules: [{
                                required: true,
                                message: "请输入身份证号!"
                            }]
                        })(<Input />)
                    }
                </Form.Item>
                <Form.Item label="备注">
                    {
                        getFieldDecorator("memo")(<Input />)
                    }
                </Form.Item>
            </Form>
            </Modal>
            )
    }
}
export default FaceModel=Form.create({})(FaceModel);