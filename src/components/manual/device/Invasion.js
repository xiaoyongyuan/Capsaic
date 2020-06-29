import React,{Component} from "react";
import "../../../style/ztt/css/Invasion.less";
import invasion from "../../../style/ztt/imgs/manual/invasion.png";
import invasion2 from "../../../style/ztt/imgs/manual/invasion2.png";
import invasion3 from "../../../style/ztt/imgs/manual/invasion3.png";
class Invasion extends Component{
    render() {
        return(
            <div className="invasion">
                <div className="invasion-con">
                    1、报警页展示所有设备的报警情况，在图中红框处单击可选择
                    查询设备、报警状态、所属节点及时间段（时间和日期只可选择查询 24 小时以
                    内的报警数据，图中查询的是 2020-03-30 10:38:12 至 2020-03-31 10:38:12 的报
                    警数据）。
                </div>
                <img src={invasion} alt=""/>
                <div className="invasion-con">
                    2、单击选择一条未处理报警信息，在右侧可查看报警信息详情，单击右侧红色
                    框内“警情/虚警”处理该条报警信息，其中图片上黄线围起来的
                    部分为设定的防区（右侧红框内的防区显示，去掉勾选即可取消），红线围起来
                    的部分为触发报警的对象（右侧红框内的目标显示，去掉勾选即可取消）
                </div>
                <img src={invasion2} alt=""/>
                <div className="invasion-con">
                    3、鼠标移入短视频上显示上一个/下一个，单击红框内左右箭头可以切换查看“上一个/下一个”报警信息，勾选“自
                    动更新”系统有新的报警页面自动更新报警栏位信息。
                </div>
                <img src={invasion3} alt=""/>
            </div>
        )
    }
}
export default Invasion;