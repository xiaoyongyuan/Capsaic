import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import "./dashboard.less";
import {Select} from "antd";
import ReactEcharts from "echarts-for-react";
import getNongli from "../common/getNongli";
import axios from "../../axios";
import echarts from "echarts";
const Option=Select.Option;
class Dashboard extends Component {
    state = {
        year: "",
        seconds: "",
        sensingList: [],//围界入侵
        facialList: [],//人脸采集
        echartsOptions: {},//今日报警处理完成率
        equCount:{},
        columnChart:{},
        equList:[],
        equListDefault:""
    };
    componentWillMount() {
        let width = window.screen.availWidth;
        if (width < 1600) {
            document.documentElement.style.fontSize = (width / 100) + "px"
        } else if (width > 1600) {
            document.documentElement.style.fontSize = (width / 110) + "px"
        }
    }
    componentDidMount() {
        this.getTimes();
        this.getList();
        this.industryNews = setInterval(this.taskIndustryNews, 50);
        this.equipmentCount();
        this.policeCount();
        this.faceCollection();
        this.columnChart();
        this.hnaleDeviceAlarm();
        this.hanleEquipment();
    }
    //人脸采集信息
    faceCollection = () => {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/index/facelist",
            data: {}
        }).then((res) => {
            if (res.success) {
                this.setState({
                    facialList: res.data.slice(0, 5)
                })
            }
        })
    };
    //获取当前时间
    getTimes = () => {
        let date = new Date();
        this.setState({
            year: moment(date).format("YYYY-MM-DD"),
            seconds: moment(date).format("HH:mm:ss")
        });
        this.secondsTimes = setInterval(() => {
            this.setState({
                seconds: moment(new Date()).format("HH:mm:ss")
            })
        }, 1000);
    };
    //报警信息
    getList = () => {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/index/alarmvideolist",
            data: {}
        }).then((res) => {
            this.setState({
                sensingList: res.data
            })
        })
    };
    //已处理报警 未处理报警
    policeCount = () => {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/index/alarmtotal",
            data: {}
        }).then((res) => {
            if (res.success) {
                this.setState({
                    totalCount: res.data.totalCount,//今日报警总数
                    hasDealCount: res.data.hasDealCount,//已处理
                    unDealCount: res.data.unDealCount,//未处理
                    faceSaveCount: res.data.faceSaveCount,//人脸采集数
                    faceAlaCount: res.data.faceAlaCount//今日人脸疑似目标数
                },()=>{
                    this.setEchartsOption();
                })
            }
        })
    };
    //设备数量  在线设备 离线设备
    equipmentCount = () => {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/index/equipmenttotal",
            data: {}
        }).then((res) => {
            if (res.success) {
                this.setState({
                    //cameraTotals:res.data.cameraTotals,
                    onlineCameras: res.data.onlineCameras,
                    downCameras: res.data.downCameras
                })
            }
        })
    };
    hnaleDeviceAlarm=()=>{
        let currentTime=moment(new Date()).format("YYYY/MM/DD");
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/report/cidalacount",
            data:{date:currentTime}
        }).then((res)=>{
            if(res.success){
                let equList=[];
                let equTotal=[];
                res.data.map((v)=>{
                    if(v.Cname!=null){
                        equList.push(v.Cname);
                        equTotal.push(v.Totalcount);
                    }
                });
                this.columnChart(equList,equTotal);
            }
        })
    };
    hanleEquipment = () => {
        axios.ajax({
            method: 'get',
            url: window.g.loginURL + '/api/equ/getlist',
            data: {
                estatus:'-1'
            }
        }).then((res) => {
            if (res.success) {
                this.setState({
                    equList:res.data,
                    equListDefault:res.data[0].cid
                },()=>{
                    this.handleHours(this.state.equListDefault,res.data[0].relations.projecttype);
                });
            }
        })
    };
    //设备24小时报警数
    handleHours=(cid,projecttype)=>{
        let currentTime=moment(new Date()).format("YYYY/MM/DD");
        axios.ajax({
            method:"get",
            url:window.g.loginURL+"/api/report/cidhouralacount",
            data:{
                cid:cid,
                date:currentTime,
                projecttype:projecttype
            }
        }).then((res)=>{
            if(res.success){
                let linexData=[];
                let lineyData=[];
                let count=[];
                let importantman=[];//重点人员
                let workman=[];// 工作人员
                let others=[];// 其他
                //2人脸设备  1围界设备
                res.data.map((v)=>{
                    linexData.push(v.Hour);
                    lineyData.push(v.Totalcount);
                    importantman.push(v.Importantman);
                    workman.push(v.Workman);
                    others.push(v.Others);
                });
                this.setState({projecttype},()=>{
                    if(projecttype == "2"){
                        count.push(importantman,workman,others);
                        this.equCount(linexData,count);
                    }else if(projecttype == "1"){
                        this.equCount(linexData,lineyData);
                    }
                })
            }
        })
    };
    //今日报警处理完成率
    setEchartsOption = () => {
        let finish =this.state.hasDealCount;
        let unFinish = this.state.unDealCount - finish;
        let echartsOptions = this.state.echartsOptions;
        let center = ['50%', '50%'];
        // 最外圈的点点
        function _pie3() {
            let dataArr = [];
            for (let i = 0; i < 120; i++) {
                if (i % 2 === 0) {
                    dataArr.push({
                        name: (i + 1).toString(),
                        value: 1,
                        itemStyle: {
                            normal: {
                                borderWidth: 3,
                                shadowBlur: 30,
                                borderColor: '#3699FF',
                                shadowColor: 'rgba(142, 152, 241, 0.6)'
                            }
                        }
                    })
                } else {
                    dataArr.push({
                        name: (i + 1).toString(),
                        value: 5,
                        itemStyle: {
                            normal: {
                                color: "rgba(0,0,0,0)",
                                borderWidth: 0,
                                borderColor: "rgba(0,0,0,0)"
                            }
                        }
                    })
                }

            }
            return dataArr
        }
        echartsOptions = {
            tooltip: {
                show: false
            },
            legend: {
                show: false
            },
            toolbox: {
                show: false
            },
            series: [
                {
                    name: '未完成',
                    type: 'pie',
                    radius: ['50%', "65%"],
                    center: center,
                    hoverAnimation: false,
                    clockwise: false,
                    tooltip: {
                        show: false
                    },
                    data: [{
                        tooltip: {
                            show: true
                        },
                        value: unFinish,
                        itemStyle: {
                            color: "#3699FF"
                        },
                        label: {
                            color: "#fff",
                            fontSize: 14,
                            padding: 10,
                            formatter: [
                                '{a|未完成占总比}',
                                '{b|{d}%}',
                            ].join('\n'),
                            rich: {
                                a: {
                                    color: "#fff",
                                    fontSize: 14,
                                    lineHeight: 16
                                },
                                b: {
                                    color: "#3699FF",
                                    fontSize: 14,
                                    lineHeight: 24,
                                    padding: 30,
                                }
                            }
                        }
                    },
                    {
                        value: finish,
                        name: 'rose2',
                        itemStyle: {
                            color: "transparent"
                        }
                    }
                    ]
                },
                {
                    name: '已完成',
                    type: 'pie',
                    radius: ['48%', "58%"],
                    center: center,
                    hoverAnimation: false,
                    clockwise: false,
                    tooltip: {
                        show: false
                    },
                    data: [{
                        value: unFinish,
                        itemStyle: {
                            color: "transparent"
                        }
                    },
                    {
                        value: finish,
                        name: '',
                        tooltip: {
                            show: true
                        },
                        itemStyle: {
                            color: "#ED5B2A"
                        },
                        label: {
                            color: "#fff",
                            fontSize: 14,
                            padding: 10,
                            formatter: [
                                '{a|完成占总比}',
                                '{b|{d}%}',
                            ].join('\n'),
                            rich: {
                                a: {
                                    color: "#fff",
                                    fontSize: 14,
                                    lineHeight: 16
                                },
                                b: {
                                    color: "#ED5B2A",
                                    fontSize: 14,
                                    lineHeight: 24,
                                    padding: 20,
                                }
                            }
                        }
                    }
                    ]
                },

                {
                    type: 'pie',
                    zlevel: 3,
                    silent: true,
                    radius: ['79%', '80%'],
                    center: center,
                    label: {
                        normal: {
                            show: false
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: _pie3()
                }
            ]
        };
        this.setState({
            echartsOptions
        })
    };
    //24小时设备报警数
    equCount=(linexData,lineyData)=>{
        let serise=[];
        let legendDate=[];
        let color=[];
        if(this.state.projecttype === "2"){
            color.push("#FA704D","#3596FF","#cda631")
            legendDate.push("重点人员","工作人员","其他人员");
            serise.push(
                {
                    name: '重点人员',
                    type: 'line',
                    smooth: true, //是否平滑曲线显示
                    animation:true,
                    showAllSymbol: true,
                    symbol: 'emptyCircle',
                    symbolSize: 6,
                    lineStyle: {
                        normal: {
                            color: "#FA704D", // 线条颜色
                        },
                    },
                    label: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#fff',
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "#FA704D",
                        }
                    },
                    areaStyle: { //区域填充样式
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{
                                offset: 0,
                                color: 'rgba(250,112,77,0.8)'
                            },
                                {
                                    offset: 1,
                                    color: 'rgba(250,112,77,0)'
                                }
                            ],),
                            shadowColor: 'rgba(250,112,77,0.3)',
                            shadowBlur: 20
                        }
                    },
                    data:lineyData[0]
                },
                {
                    name: '工作人员',
                    type: 'line',
                    smooth: true, //是否平滑曲线显示
                    animation:true,
                    showAllSymbol: true,
                    symbol: 'emptyCircle',
                    symbolSize: 6,
                    lineStyle: {
                        normal: {
                            color: "#3596FF", // 线条颜色
                        },
                    },
                    label: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#fff',
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "#3596FF",
                        }
                    },
                    areaStyle: { //区域填充样式
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{
                                offset: 0,
                                color: 'rgba(53,150,255,0.8)'
                            },
                                {
                                    offset: 1,
                                    color: 'rgba(53,150,255,0)'
                                }
                            ],),
                            shadowColor: 'rgba(53,150,255,0.3)',
                            shadowBlur: 20
                        }
                    },
                    data:lineyData[1]
                },
                {
                    name: '其他人员',
                    type: 'line',
                    smooth: true, //是否平滑曲线显示
                    animation:true,
                    showAllSymbol: true,
                    symbol: 'emptyCircle',
                    symbolSize: 6,
                    lineStyle: {
                        normal: {
                            color: "#cda631", // 线条颜色
                        },
                    },
                    label: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#fff',
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "#cda631",
                        }
                    },
                    areaStyle: { //区域填充样式
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{
                                offset: 0,
                                color: 'rgba(250,180,101,0.8)'
                            },
                                {
                                    offset: 1,
                                    color: 'rgba(250,180,101,0)'
                                }
                            ],),
                            shadowColor: 'rgba(250,180,101,0.3)',
                            shadowBlur: 20
                        }
                    },
                    data:lineyData[2]
                },
            );
        }else if(this.state.projecttype === "1"){
            legendDate.push("");
            color.push("")
            serise.push(
                {
                    name: '围界报警',
                    type: 'line',
                    smooth: true, //是否平滑曲线显示
                    animation:true,
                    showAllSymbol: true,
                    symbol: 'emptyCircle',
                    symbolSize: 6,
                    lineStyle: {
                        normal: {
                            color: "#28ffb3", // 线条颜色
                        },
                        borderColor: '#f0f'
                    },
                    label: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: '#fff',
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: "#28ffb3",

                        }
                    },
                    areaStyle: { //区域填充样式
                        normal: {
                            //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(0,154,120,1)'
                            },
                                {
                                    offset: 1,
                                    color: 'rgba(0,0,0, 0)'
                                }
                            ], false),
                            shadowColor: 'rgba(53,142,215, 0.9)', //阴影颜色
                            shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
                        }
                    },
                    data:lineyData
                },
            );
        }
        let equCount={
            grid: {
                top: '10%',
                left: '6%',
                right: '8%',
                bottom: '8%',
                containLabel: true,
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                itemGap: 50,
                data:legendDate,
                icon:'circle',
                textStyle: {
                    color: '#f9f9f9',
                    borderColor: '#fff'
                },
            },
            xAxis: [{
                name:"小时",
                type: 'category',
                boundaryGap: true,
                axisLine: { //坐标轴轴线相关设置。数学上的x轴
                    show: true,
                    lineStyle: {
                        color: 'transparent'
                    },
                },
                axisLabel: { //坐标轴刻度标签的相关设置
                    textStyle: {
                        color: '#d1e6eb',
                        margin: 15,
                    },
                },
                axisTick: {
                    show: false,
                },
                data:linexData,
            }],
            yAxis: [{
                name:"报警次数",
                nameTextStyle:{
                    color:"#fff"
                },
                type: 'value',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#0a3256'
                    }
                },
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    margin: 20,
                    textStyle: {
                        color: '#d1e6eb',

                    },
                },
                axisTick: {
                    show: false,
                },
            }],
            series:serise
        };
        this.setState({equCount})
    };
    //围界设备的总报警数
    columnChart=(equList,equTotal)=>{
        let columnChart={
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                top: '8%',
                left: '5%',
                right: '5%',
                bottom: '0',
                containLabel: true,
            },
            xAxis: [{
                type: 'category',
                data: equList,
                axisLine: { //坐标轴轴线相关设置。数学上的x轴
                    show: true,
                    lineStyle: {
                        color: 'transparent',
                    },
                },
                axisLabel: {
                    margin: 10,
                    color: '#e2e9ff',
                    textStyle: {
                        fontSize: 14
                    },
                },
            }],
            yAxis: [{
                splitNumber: 3,
                axisLabel: {
                    formatter: '{value}',
                    color: '#e2e9ff',
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#0a3256'
                    }
                },
            }],
            series: [{
                type: 'bar',
                data: equTotal,
                barWidth: '20px',
                itemStyle: {
                    normal:{
                        color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#00b0ff'
                        }, {
                            offset: 0.8,
                            color: '#7052f4'
                        }], false),

                    }
                }
            }]
        };
        this.setState({columnChart});
    };
    hanleSelect=(value)=>{
        if(this.state.equList){
            this.state.equList.map((v)=>{
                if(v.cid == value){
                    console.log(v.cid)
                    this.setState({
                        equListDefault:v.cid
                    })
                    this.handleHours(value,v.relations.projecttype);
                }
            })
        }
    }
    //报警状态
    hanleStatus = (ststus) => {
        switch (ststus) {
            case 0:
                return "未处理";
            case 1:
                return "警情";
            case 3:
                return "虚警";
            default:
                return;
        }
    };
    tableBody = (item, index) => {
        return (
            <li key={index}>
                <div className='name' >
                    <div className='name-div'>
                        {item.name}
                    </div>
                </div>
                <div className='name'>
                    <div className='name-div'>
                        {item.atime}
                    </div>
                </div>
                <div className='name'>
                    <div className='name-div'>
                        {this.hanleStatus(item.status)}
                    </div>
                </div>
                <div className='name'>
                    <div className='name-div'>
                        <img src={item.picpath ? item.picpath : ""} alt="" />
                    </div>
                </div>
            </li>
        );
    };
    taskIndustryNews = () => {
        if (this.refs.newDiv.scrollTop >= this.refs.newDivUI.offsetHeight - this.refs.newDiv.clientHeight) {
            this.refs.newDiv.scrollTop = 0;
        }
        else {
            this.refs.newDiv.scrollTop += 1;
        }
    };
    hanlefaceType=(type)=>{
        if(type == "2"){
            return "未知人员";
        }else if(type == "1"){
            return "重点人员";
        }else if(type == "0"){
            return "工作人员";
        }
    };
    handleIndustryNewsLeave = () => {
        this.industryNews = setInterval(this.taskIndustryNews, 50);
    };
    handleIndustryNewsEnter = () => {
        clearInterval(this.industryNews);
    };
    componentWillUnmount() {
        clearInterval(this.secondsTimes);
        clearInterval(this.industryNews);
    }

    render() {
        return (
            <div className="dashboard">
                <div className="dashboard-title">
                    <span className="titleName">AI视频警戒系统</span>
                    <div className="titleEnter">
                        <div className="enterIndex"><Link to="/main/police/policeInformation" >进入首页</Link></div>
                        <span className="titleExit" onClick={() => this.props.history.push("/")}>退出</span>
                    </div>
                </div>
                <div className="dashIndex">
                    <div className="dashboard-left">
                        <div className="dashboard-times">
                            <div className="time-date">
                                <span className="timeYear">{this.state.year}</span>
                                <span className="timeDate">{this.state.seconds}</span>
                            </div>
                            <div className="calendar">{getNongli()}</div>
                        </div>
                        <div className="dashboard-bg dashboard-equipment">
                            <div className="online">
                                <div className="onlineBg" />
                                <div className="onlineNum">
                                    <span className="equName">在线设备数量</span>
                                    <span className="line" />
                                    <span className="onlineCount">{this.state.onlineCameras}</span>
                                </div>
                            </div>
                            <span className="centerLine" />
                            <div className="offline">
                                <div className="offlineBg" />
                                <div className="offlineNum">
                                    <span className="equName">离线设备数量</span>
                                    <span className="line" />
                                    <span className="offlineCount">{this.state.downCameras}</span>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard-bg dashboard-police">
                            <div className='numberItem'><div className='title'>今日报警总数</div><div className='number'>{this.state.totalCount}</div></div>
                            <div className='numberItem'><div className='title'>已处理</div><div className='number'>{this.state.hasDealCount}</div></div>
                            <div className='numberItem'><div className='title'>未处理</div><div className='number'>{this.state.unDealCount}</div></div>
                        </div>
                        <div className="dashboard-bg dashboard-collect">
                            <div className='numberItem'><div className='title'>今日人脸采集数</div><div className='number'>{this.state.faceSaveCount}</div></div>
                            <div className='numberItem'><div className='title'>今日人脸疑似目标数</div><div className='number'>{this.state.faceAlaCount}</div></div>
                        </div>
                        <div className="dashboard-bg dashboard-completion">
                            <div className="invasion-title">今日报警处理完成率</div>
                            <ReactEcharts
                                option={this.state.echartsOptions}
                                style={{ width: '100%', height: '74%' }}
                            />
                        </div>
                    </div>
                    <div className="dashboard-center">
                        <div className="dasCenter-top dashboard-bg">
                            {/*围界报警数*/}
                            <div className="invasion-title">当日预警变化趋势【{this.state.projecttype == 1 ?"围界报警数":"人脸采集数"}】</div>
                            <div className="dashSelect">
                                 <Select value={this.state.equListDefault} style={{ width: 150}} onSelect={this.hanleSelect} >
                                    {
                                        this.state.equList.map((v,i)=>(
                                            <Option value={v.cid} key={i}>{v.ename}</Option>
                                        ))
                                    }
                                </Select>
                            </div>
                            <ReactEcharts
                                notMerge={true}
                                option={this.state.equCount}
                                style={{ width: '100%', height: '74%' }}
                            />
                        </div>
                        <div className="dasCenter-bottom dashboard-bg">
                            <div className="invasion-title">当日围界设备预警总览图</div>
                            <ReactEcharts
                                option={this.state.columnChart }
                                style={{ width: '100%', height: '74%' }}
                            />
                        </div>
                    </div>
                    <div className="dashboard-right">
                        <div className="dashboard-bg dashboard-information">
                            <div className="invasion-title">围界入侵信息</div>
                            <div className="evercontent">
                                <div className="tabtitle">设备名称</div>
                                <div className="tabtitle">时间</div>
                                <div className="tabtitle">处理情况</div>
                                <div className="tabtitle">明细</div>
                            </div>
                            <div className='ceShiTable'>
                                <div
                                    ref='newDiv'
                                    className='ceShiTable-body'
                                    onMouseEnter={this.handleIndustryNewsEnter.bind(this)}
                                    onMouseLeave={this.handleIndustryNewsLeave.bind(this)}
                                >
                                    <ul ref='newDivUI'>
                                        {
                                            this.state.sensingList.map(this.tableBody)
                                        }
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard-bg dashboard-Facial">
                            <div className="invasion-title">人脸采集信息</div>
                            <div className="facialTitle">
                                <div className="tabtitle">类型</div>
                                <div className="tabtitle">时间</div>
                                <div className="tabtitle">位置</div>
                                <div className="tabtitle">明细</div>
                            </div>
                            <div className="facial-context">
                                {
                                    this.state.facialList.map((item, i) => {
                                        return (
                                            <div className="facialBody" key={i}>
                                                <div className="facialBody-item" title={this.hanlefaceType(item.facetype)}>{this.hanlefaceType(item.facetype)}</div>
                                                <div className="createon">{item.createon}</div>
                                                <div className="facialBody-item" title={item.cname}>{item.cname}</div>
                                                <div className="facialBody-item"><img src={JSON.parse(item.contrastpath).contrastpath} alt="" /></div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Dashboard;
