import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import patrol4 from "../../../style/ztt/imgs/manual/patrol4.png";
class History extends Component{
    render() {
        return(
            <div className="history">
                <div className="invasion-con">
                    1、点名历史页针对已做好的点名对象进行过点名操作的记录。
                </div>
                <img src={patrol4} alt=""/>
            </div>
        )
    }
}
export default History;