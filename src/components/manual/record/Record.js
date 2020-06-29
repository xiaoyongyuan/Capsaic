import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import record from "../../../style/ztt/imgs/manual/record.png";
import record2 from "../../../style/ztt/imgs/manual/record2.png";
class Record extends Component{
    render() {
        return(
            <div className="record">
                <div className="invasion-con">
                    1、操作记录页面为该系统使用人员进行的一系列操作的记录信息。
                </div>
                <img src={record} alt=""/>
                <div className="invasion-con">
                    2、在图中红框处单击可选择查询操作类型、用户名以及时间段
                    （时间和日期只可选择查询 24 小时内的操作记录）。
                </div>
                <img src={record2} alt=""/>
            </div>
        )
    }
}
export default Record;