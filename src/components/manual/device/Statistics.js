import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import statistics from "../../../style/ztt/imgs/manual/statistics.png";
import statistics2 from "../../../style/ztt/imgs/manual/statistics2.png";
import statistics3 from "../../../style/ztt/imgs/manual/statistics3.png";
import statistics4 from "../../../style/ztt/imgs/manual/statistics4.png";
import statistics5 from "../../../style/ztt/imgs/manual/statistics5.png";
class Statistics extends Component{
    render() {
        return(
            <div className="statistics">
               <div className="invasion-con">
                   1、报警统计页面为所有设备每个月报警数据统计情况展示页，单击“图表”展
                   示可查看当月所有设备每天报警总数曲线图，单击其中一天可进
                   入查看当天所有设备报警处理次数情况。
               </div>
                <img src={statistics} alt=""/>
                <img src={statistics2} alt=""/>
                <img src={statistics3} alt=""/>
                <div className="invasion-con">
                    2、单击“图标详情”可查看该摄像头 24 小时内报警总数曲线图，单击“详情
                    导出”可下载该摄像头 24 小时内报警总数的 Excel 表格。<br/>
                    【默认支持 wps-Excel 无格式版本，微软版本 Excel 暂不兼容，Excel 导出带
                    背景色，可通过切换换字体颜色解决】
                </div>
                <img src={statistics4} alt=""/>
                <div className="invasion-con">
                    3、单击“查看摄像头图表”可查看当天所有设备报警总数的曲线图，单击“数
                    据导出”可查看当天所有设备报警总数的详细信息。
                </div>
                <img src={statistics5} alt=""/>
            </div>
        )
    }
}
export default Statistics;