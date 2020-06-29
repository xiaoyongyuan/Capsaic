import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import security3 from "../../../style/ztt/imgs/manual/security3.png";
import security4 from "../../../style/ztt/imgs/manual/security4.png";
class Scheduling extends Component{
    render() {
        return (
            <div className="scheduling">
                <div className="invasion-con">
                    1、安保排班页为安保人员排班记录列表页，单击“添加安保排班”可新增安保
                    人员排班信息。
                </div>
                <img src={security3} alt=""/>
                <img src={security4} alt=""/>
            </div>
        )
    }
}
export default Scheduling;
