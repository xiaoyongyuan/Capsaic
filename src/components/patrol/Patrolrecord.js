import React,{Component} from "react";
import Etable from "../common/Etable";
import {Form,Button,Select,DatePicker,Modal,Breadcrumb,Icon} from "antd";
import axios from "../../axios/index";
import "../../style/ztt/css/patrolrecord.less";
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
class Patrolrecord extends Component{
    constructor(props) {
        super(props);
        this.state={
            recordList:[],
            plainOptions:[],
            visible:false
        };
    }
    componentDidMount() {
       this.hanleRecord({});
       this.hanleEqument();
    }
    //巡更记录列表
    hanleRecord=(params)=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/rasp/patrolresultlist",
            data:params
        }).then((res)=>{
            if(res.success){
                this.setState({
                    recordList:res.data
                })
            }
        })
    };
    hanleSelect=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params={
                   pbdate:values.date && values.date.length?values.date[0].format("YYYY/MM/DD HH:mm:ss"):'',
                   pedate:values.date && values.date.length?values.date[1].format("YYYY/MM/DD HH:mm:ss"):'',
                   cid:values.cid
                };
                if(params.pbdate === '' && params.pedate === ''){
                    delete params.pbdate;
                    delete params.pedate;
                }
                this.hanleRecord(params);
            }
        });
    };
    //巡更设备
    hanleEqument = () => {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/camera/getlistSelect",
            data: {}
        }).then((res) => {
            if (res.success) {
                this.setState({
                    plainOptions: res.data
                })
            }
        })
    };
    //巡更处理
    hanleNightPatrol=(params,type)=>{
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/rasp/patrolhandle",
            data:{
                code:params.code,
                phandle:type
            }
        }).then((res)=>{
            if(res.success){
                this.hanleRecord({});
            }
        })
    };
    hanleImg=(text)=>{
        if(text){
            this.setState({
                visible:true,
                patrolimg:text
            });
        }
    };
    handleCancel=()=>{
        this.setState({
            visible:false,
        });
    };
    render() {
        const userlist=[
            {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            align:"center",
            render: (text, record, index) => {
                return (
                    <div className="tableIndex">{index + 1}</div>
                )
            }
        }, {
            title: '巡更图',
            dataIndex: 'ppic',
            key: 'ppic',
            align:"center",
            width:130,
            render: (text) => {
                return(
                    <div className="ppic" onClick={()=>this.hanleImg(text)}><img src={text?text:""} alt=""  /></div>
                )
            }
        }, {
            title: '巡更人',
            dataIndex: 'handlename',
            key: 'handlename',
            align:"center",
        },{
            title: '日期',
            dataIndex: 'pdate',
            key: 'pdate',
            align:"center",
            render:(text)=>{
                if(text){
                    return (<span>{text.split("00:00:00")[0]}</span>)
                }
            }
        },{
            title: '时段',
            dataIndex: 'pbdate',
            key: 'pbdate',
            align:"center",
            render:(text,record )=>{
                if(record.pbdate && record.pedate){
                    return(
                        <span>{record.pbdate}:00——{record.pedate}:00</span>
                    )
                }else{
                    return (<span> </span>)
                }
            }
        },{
            title: '班次',
            dataIndex: 'pteam',
            key: 'pteam',
            align:"center",
        },{
            title: '设备名称',
            dataIndex: 'cameraname',
            key: 'cameraname',
            align:"center",
        },{
            title: '处理人',
            dataIndex: 'phaccount',
            key: 'phaccount',
            align:"center",
        },{
            title: '是否通过',
            dataIndex: 'phandle',
            key: 'phandle',
            align:"center",
            render: text => {
                if(text === 0){
                    return(<span>未处理</span>);
                }else if(text === 1){
                    return(<span>通过</span>);
                }else if(text === 2){
                    return(<span className="noPassColor">不通过</span>);
                }
            }
        },{
                title: '操作',
                dataIndex: 'oper',
                key: 'oper',
                align:"center",
                width:300,
                render: (text, record) => {
                   return(
                       <div className="recordBtn">
                           <span className="borderDelete"><Icon type="close-circle" title="不通过" className="noPass" onClick={()=>this.hanleNightPatrol(record,"2")}/></span>
                           <span className="borderEdit"><Icon type="check-circle" title="通过" className="pass" onClick={()=>this.hanleNightPatrol(record,"1")}/></span>
                       </div>
                   )
                }
            }];
        const { getFieldDecorator } = this.props.form;
        return(
            <div className="patrolrecord">
                <Breadcrumb className="crumbs">
                    <Breadcrumb.Item>文保巡检</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span className="crumbs-item">巡更记录</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className="patrolTitle">
                    <Form layout="inline" className="rangeForm" onSubmit={this.hanleSelect}>
                        <Form.Item
                            label="日期"
                        >
                            {getFieldDecorator('date')(
                                <RangePicker
                                    placeholder={['开始时间', '结束时间']}
                                    format="YYYY/MM/DD HH:mm:ss"
                                    showTime
                                />
                            )}
                        </Form.Item>

                        <Form.Item
                            label="设备"
                        >
                            {getFieldDecorator('cid',{
                                initialValue:""
                            } )(
                                <Select style={{ width: 120 }}>
                                    <Option value="" >所有</Option>
                                    {
                                        this.state.plainOptions.map((v)=>(
                                            <Option key={v.code} value={v.code} >{v.name}</Option>
                                        ))
                                    }
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">查询</Button>
                        </Form.Item>
                    </Form>
                </div>
                <Etable
                    columns={userlist}
                    dataSource={this.state.recordList}
                    pagination={{hideOnSinglePage:true}}
                    style={{ marginTop: "20px" }}
                />
                <Modal
                    title="图片"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    width={700}
                    footer={null}
                >
                    <img src={this.state.patrolimg} alt="" />
                </Modal>
            </div>
        )
    }
}
export default Patrolrecord=Form.create()(Patrolrecord);
