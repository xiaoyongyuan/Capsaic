import React from 'react';
import { Pagination, Modal, Form, Input, Button, Empty, Tabs, } from "antd";
import axios from "../../../axios";
import "../../../style/ztt/css/faceWarning.less";
const { TabPane } = Tabs;
class Facetab extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            facename: "",
            idcard: "",
            totalData: [],
            pagination: {
                total: 0,
                pageSize: 10,
                current: 1,
            },//分页
            visible: false,//模态框
            picture: '',//存储点击事件图片
            activeKey: "1",//tab选中人员类型标签
        });
    };

    componentDidMount() {
        var pagination = this.state.pagination;
        var windowWidth = document.body.clientWidth;
        windowWidth = windowWidth - 270;

        if (windowWidth < 1100) {
            pagination.pageSize = 6
            this.setState({
                pagination,
            }, () => {
                this.faceWarningList();
            })
        } else if (windowWidth >= 1100 && windowWidth < 1800) {
            var pageSize = Math.floor(windowWidth / 318) * 2;
            pagination.pageSize = pageSize
            this.setState({
                pagination,
            }, () => {
                this.faceWarningList();
            })
        } else if (windowWidth >= 1800) {
            pagination.pageSize = 10
            this.setState({
                pagination,
            }, () => {
                this.faceWarningList();
            })
        }
    };

    //人脸预警列表
    faceWarningList = () => {
        let data = {
            pageindex: this.state.pagination.current,
            pagesize: this.state.pagination.pageSize,
        };
        if (this.state.facename) {
            data.facename = this.state.facename
        }
        if (this.state.idcard) {
            data.idcard = this.state.idcard
        }
        data.facetype = this.state.activeKey;
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/face/facealarmlist",
            data: data
        }).then((res) => {
            if (res.success) {
                this.setState({
                    totalData: res.data,
                    pagination: {
                        total: res.totalcount,
                        current: res.page,
                        pageSize: res.pagesize
                    }
                })
            }
        })
    };
    //分页功能
    handlePaginationChange = pagination => {
        this.setState({
            pagination
        }, () => {
            this.faceWarningList();
        })
    };

    changePageSize = (pageSize, current) => {
        let pagination = {
            total: this.state.pagination.total,
            current: 1,
            pageSize: pageSize,
        };
        this.handlePaginationChange(pagination)
    };
    changePage = (current) => {
        let pagination = {
            total: this.state.pagination.total,
            current: current,
            pageSize: this.state.pagination.pageSize,
        };
        this.handlePaginationChange(pagination)
    };
    //信息弹框
    information = (item) => {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/face/facealarmgetone",
            data: {
                code: item.code
            }
        }).then((res) => {
            if (res.success) {
                let contrastpath = JSON.parse(res.data.contrastpath);
                this.setState({
                    point: contrastpath,
                    visible: true,
                    name: res.data.facename,
                    cname:res.data.cname,
                    sex: res.data.gender,
                    faceType: res.data.facetype,
                    ModelPhoto: contrastpath.contrastpath,//model 左侧图片
                    facepath: res.data.facepath,//model 右侧图片   res.data.facePath
                    contrastPath: contrastpath.contrastpath,//页面图片
                    idCard: res.data.idcard ? res.data.idcard.replace(/^(.{6})(?:\w+)(.{4})$/, "\$1********\$2") : "",//身份证号中间信息使用*代替
                    geton: res.data.createon,
                    memo: res.data.memo,//备注
                }, () => {
                    setTimeout(() => {
                        this.draw()
                    })
                })
            }
        })
    };
    //画围界
    draw = () => {
        let ele = document.getElementById('canvasobj');
        let area = ele.getContext('2d');
        area.clearRect(0, 0, 634, 500); //清除之前的绘图
        area.lineWidth = 1;
        if (this.state.point) {
            const objs = this.state.point.point;
            if (objs.length > 0) {
                const x = 634 / this.state.point.width,
                    y = 500 / this.state.point.height;
                //计算缩放比例 634, 500
                objs.map((el, i) => {
                    area.strokeStyle = '#ff0';
                    area.beginPath();
                    area.rect(parseInt(el.x * x), parseInt(el.y * y), parseInt(el.w * x), parseInt(el.h * y));
                    area.stroke();
                    area.closePath();
                    return ''
                })
            }
        }
    };
    //关闭弹框事件
    handleCancel = () => {
        this.setState({
            visible: false
        })
    };

    // 搜索
    faceFormSelect(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    facename: values.facename,
                    idcard: values.idcard,
                }, () => {
                    this.faceWarningList()
                })
            }
        });
    }
    hanlefaceType = (type) => {
        if (type == "2") {
            return "未知人员";
        } else if (type == "1") {
            return "重点人员";
        } else if (type == "0") {
            return "工作人员";
        }
    };
    callback = (key) => {
        this.setState({
            activeKey: key
        }, () => {
            this.faceWarningList();
        })
    };
    list = (type) => {
        return (
            this.state.totalData.map((item, index) => {
                let contrastpath = JSON.parse(item.contrastpath);
                return (
                    <div className={type === "2" ? "unknown" : "carBox"} key={index}>
                        <img
                            onClick={() => this.information(item)}
                            src={contrastpath.contrastpath}
                            className="box-img"
                        />
                        <div className="carcontent">
                            <p className="equipment">{item.cname ? item.cname : ""}</p>
                            <p className={type === "2" ? "unknownFont" : "createon"}>{item.createon}</p>
                            {
                                type === "2" ? ""
                                    : <div className="flexdiv">
                                        <div className="box-Icon">
                                            <div className="icon-item" style={{ display: item.facename ? "block" : "none" }}><span className="person" /></div>
                                            <div className="icon-item"><span className="gender" /></div>
                                            <div className="icon-item"><span className="work " /></div>
                                        </div>
                                        <div className="box-con">
                                            <div className="con-item" style={{ display: item.facename ? "block" : "none" }} title={item.facename}>{item.facename}</div>
                                            <div className="con-item">{this.gender(item.gender)}</div>
                                            <div className="con-item">{this.hanlefaceType(item.facetype)}</div>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                )
            })
        )
    };
    gender = (sex) => {
        switch (sex) {
            case 0:
                return "男";
            case 1:
                return "女";
            default:
                return sex;
        }
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="FaceTable">
                <div className="warningTitle">
                    <Form layout="inline" onSubmit={this.faceFormSelect.bind(this)}>
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
                </div>
                <div className="warningBody">
                    <Tabs defaultActiveKey={this.state.activeKey} onChange={this.callback}>
                        <TabPane tab="重点人员" key="1">
                            {
                                this.state.totalData.length > 0 ?
                                    <div className="tabbox">
                                        {this.list("1")}
                                    </div>
                                    :<div className="nodataEmpty">
                                        <Empty />
                                    </div>
                            }

                        </TabPane>
                        <TabPane tab="工作人员" key="0">
                            {
                                this.state.totalData.length > 0 ?
                                    <div className="tabbox">
                                        {this.list("0")}
                                    </div>
                                    :<div className="nodataEmpty">
                                        <Empty />
                                    </div>
                            }

                        </TabPane>
                        <TabPane tab="未知人员" key="2">
                            {
                                this.state.totalData.length > 0 ?
                                    <div className="tabbox">
                                        {this.list("2")}
                                    </div>
                                    :<div className="nodataEmpty">
                                        <Empty />
                                    </div>
                            }
                        </TabPane>
                    </Tabs>
                    <div className='pagination' style={{display: this.state.totalData.length> 0?"block":"none"}}>
                        <Pagination
                            showTotal={() => `共${this.state.pagination.total}条`}
                            pageSize={this.state.pagination.pageSize}
                            current={this.state.pagination.current}
                            total={this.state.pagination.total}
                            hideOnSinglePage={true}
                            onShowSizeChange={(current, pageSize) => this.changePageSize(pageSize, current)}
                            onChange={(current) => this.changePage(current)}
                        />
                    </div>
                </div>
                <Modal
                    className='policeDetailModel'
                    title="预警详情"
                    maskClosable={false}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <div className="wrap">
                        <canvas
                            id="canvasobj"
                            className="imgbox"
                            width="634px"
                            height="500px"
                            style={{
                                borderRadius: "5px",
                                backgroundImage: 'url(' + this.state.ModelPhoto + ')',
                                backgroundSize: '100% 100%'
                            }}
                        />
                        <div className='imgHeight'>
                            {
                                this.state.activeKey === "2" ?
                                    <span>
                                        <img src={this.state.facepath} alt="" style={{ display: this.state.facepath ? "block" : "none"}} />
                                        <div className='pt' style={{ display: this.state.cname ? "block" : "none" }}><p>设备名称</p>
                                            <p>{this.state.cname}</p></div>
                                        <div className='pt' style={{ display: this.state.geton ? "block" : "none" }}><p>获取时间</p>
                                            <p>{this.state.geton}</p></div>
                                    </span>
                                    : <span>
                                        <img src={this.state.facepath} alt="" style={{ display: this.state.facepath ? "block" : "none"}} />
                                        <div className='pt' style={{ display: this.state.cname ? "block" : "none" }}><p>设备名称</p>
                                            <p>{this.state.cname}</p></div>
                                        <div className='pt' style={{ display: this.state.name ? "block" : "none" }}><p>姓名</p>
                                            <p>{this.state.name}</p></div>
                                        <div className='pt' style={{ display: this.state.sex !== "" ? "block" : "none" }}><p>性别</p>
                                            <p>{this.gender(this.state.sex)}</p></div>
                                        <div className='pt' style={{ display: this.state.faceType ? "block" : "none" }}><p>类型</p>
                                            <p>{this.hanlefaceType(this.state.faceType)}</p></div>
                                        <div className='pt' style={{ display: this.state.idCard ? "block" : "none" }}><p>身份证号</p>
                                            <p>{this.state.idCard}</p></div>
                                        <div className='pt' style={{ display: this.state.geton ? "block" : "none" }}><p>获取时间</p>
                                            <p>{this.state.geton}</p></div>
                                        <div className='pt' style={{ display: this.state.memo ? "block" : "none" }}><p>备注</p><p
                                            className='memoRight' title={this.state.memo}>{this.state.memo}</p></div>
                                    </span>
                            }
                        </div>
                    </div>

                </Modal>
            </div>
        )
    }
}

export default Facetab = Form.create({})(Facetab);