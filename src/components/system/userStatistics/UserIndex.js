import React, { Component } from 'react';
import "../../../style/ztt/css/userIndex.less";
import ReactEcharts from 'echarts-for-react';
import { Link } from "react-router-dom";
import echarts from 'echarts';
import { DatePicker, Button, Modal, Breadcrumb } from 'antd';
import axios from "../../../axios/index";
import moment from "moment";
const { MonthPicker } = DatePicker;
class UserIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDay: '',
            currentMonth: '',
            currentYear: '',
            dayList: [],
            alarmList: [],
            sameMonth: false,
            option: {},
            weekBegin: 0,  // 当前月第一天周几（0-6）
        };
        this.initCalendar = this.initCalendar.bind(this);
    }
    componentDidMount() {
        let weekBegin = moment(moment().format('YYYY-MM') + '-01').format('d')
        this.setState({
            weekBegin
        })
        this.initCalendar();
    }
    hanleCalendar = (nowDate) => {
        axios.ajax({
            method: "get",
            url: window.g.loginURL + "/api/report/monthalacount",
            data: {
                month: moment(nowDate).format("MM")
            }
        }).then((res) => {
            if (res.success) {
                let datasLine = [];
                let lineData = [];
                res.data.map((v) => {
                    datasLine.push(moment(v.Dayly).format("DD"));
                    lineData.push(v.Totalcount);
                    this.setState({ datasLine, lineData })
                });
                this.setState({
                    alarmList: res.data
                })
            }
        })
    };
    // 初始化日历
    initCalendar(currentDate) {
        let nowDate = currentDate ? currentDate : new Date();
        let weekBegin = moment(moment(currentDate).format('YYYY-MM') + '-01').format('d')
        this.setState({ nowDate,weekBegin });
        this.hanleCalendar(nowDate);
    }
    sameMonthShow = () => {
        this.hanleEverDay();
        this.setState({
            sameMonth: true
        })
    };
    sameMonthCancel = () => {
        this.setState({
            sameMonth: false
        })
    };
    //每天报警总数的折线图表
    hanleEverDay = () => {
        let option = {
            legend: {
                name: moment(this.state.nowDate).format("MM") + "月份报警",
                icon: "rect",
                right: 0,
                itemWidth: 16,
                itemHeight: 16,
                textStyle: {
                    fontSize: 14
                }
            },
            color: ["#3661FF"],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            xAxis: {
                name: "日",
                type: 'category',
                boundaryGap: false,
                data: this.state.datasLine,
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
            },
            yAxis: {
                name: "报警次数",
                type: 'value',
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "#ECECEC",
                        type: "dashed"
                    }
                },
                axisTick: {
                    show: false,
                },
            },
            series: [{
                name: moment(this.state.nowDate).format("MM") + "月份报警",
                data: this.state.lineData,
                type: 'line',
                lineStyle: {
                    color: "#3661FF"
                },
                symbol: 'none',
                smooth: true,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, [{
                                offset: 0,
                                color: '#9FB4FF'
                            },
                            {
                                offset: 1,
                                color: '#F5F7FF'
                            }
                        ])
                    }
                }
            }]
        };
        this.setState({ option })
    };
    onChangeTime = (date) => {
        if (date && date._d) {
            this.initCalendar(date._d)
        }
    };
    renderBlank = () => {
        let divs = []
        if (this.state.weekBegin == 0) {
            for (let i = 0; i < 7; i++) {
                divs.push(<div className='day'></div>)
            }
        } else {
            for (let i = 0; i < this.state.weekBegin - 1; i++) {
                divs.push(<div className='day'></div>)
            }
        }
        return divs;
    }
    render() {
        return (
            <div className="userIndex">
                <Breadcrumb className="crumbs">
                    <Breadcrumb.Item>智能识别</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span className="crumbs-item">围界入侵统计</span>
                    </Breadcrumb.Item>
                </Breadcrumb>

                <div className="calendar-body">
                    <div className='calendar-header'>
                        <div className='calendar-header-left'>
                            <MonthPicker onChange={this.onChangeTime} />
                        </div>
                        <div className="todayTime">{moment(this.state.nowDate).format("YYYY")}年{moment(this.state.nowDate).format("MM")}月</div>
                        <div className='calendar-header-right'>
                            <Button className="chart" onClick={this.sameMonthShow}>图表展示</Button>
                            <Button type="primary" ><a href={window.g.loginURL + "/api/report/monthalacountdownload?month=" + moment(this.state.nowDate).format("MM")}>数据导出</a></Button>
                        </div>
                    </div>
                    <div className='day-container'>
                        <div className='day-title'>
                            星期一
                        </div>
                        <div className='day-title'>
                            星期二
                        </div>
                        <div className='day-title'>
                            星期三
                        </div>
                        <div className='day-title'>
                            星期四
                        </div>
                        <div className='day-title'>
                            星期五
                        </div>
                        <div className='day-title'>
                            星期六
                        </div>
                        <div className='day-title'>
                            星期日
                        </div>
                        {this.renderBlank()}
                        {
                            this.state.alarmList.map((dayObject, index) => {
                                return (
                                    <Link to={"/main/userEquipment?dayTime=" + dayObject.Dayly}
                                        key={index} className={`day`}>
                                        <div className="dayTime">
                                            <span className="dayNumber">{moment(dayObject.Dayly).format("DD")}</span>
                                            {/*<span className="dayFont">日</span>*/}
                                        </div>
                                        {
                                            dayObject.Totalcount == 0 && dayObject.Unhandle == 0 && dayObject.Confirm == 0 ? "" :
                                                <div className="dayAlarm">
                                                    <p className="dayAlarm-item confirm overflow" style={dayObject.Totalcount==0?{color:'#cccccc'}:{}} title={dayObject.Totalcount + "次总报警"}><span className="alarmNum" >{dayObject.Totalcount}</span><span className="alarmFont">次总报警</span></p>
                                                    <p className="dayAlarm-item untreated overflow"  style={dayObject.Unhandle==0?{color:'#cccccc'}:{}} title={dayObject.Unhandle + "次未处理报警"}><span className="alarmNum" >{dayObject.Unhandle}</span><span className="alarmFont">次未处理报警</span></p>
                                                    <p className="dayAlarm-item total overflow" style={dayObject.Confirm==0?{color:'#cccccc'}:{}} title={dayObject.Confirm + "次确认报警"}><span className="alarmNum" >{dayObject.Confirm}</span><span className="alarmFont">次确认报警</span></p>
                                                    <p className="dayAlarm-item neglect overflow"  style={dayObject.Neglect==0?{color:'#cccccc'}:{}} title={dayObject.Neglect + "次虚警报警"}><span className="alarmNum">{dayObject.Neglect}</span><span className="alarmFont">次虚警报警</span></p>
                                                </div>

                                        }
                                    </Link>
                                )
                            })}
                    </div>
                </div>
                <Modal
                    title={`${moment(this.state.nowDate).format("YYYY")}年${moment(this.state.nowDate).format("MM")}月每天报警总数曲线图`}
                    visible={this.state.sameMonth}
                    onCancel={this.sameMonthCancel}
                    footer={null}
                    maskClosable={false}
                    width={650}
                >
                    <ReactEcharts
                        option={this.state.option}
                        style={{ width: "100%", height: "350px" }}
                    />
                </Modal>
            </div>
        )
    }
}
export default UserIndex;
