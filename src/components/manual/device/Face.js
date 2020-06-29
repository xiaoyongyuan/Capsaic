import React,{Component} from "react";
import face from "../../../style/ztt/imgs/manual/face.png";
import face2 from "../../../style/ztt/imgs/manual/face2.png";
import face3 from "../../../style/ztt/imgs/manual/face3.png";
import face4 from "../../../style/ztt/imgs/manual/face4.png";
import face5 from "../../../style/ztt/imgs/manual/face5.png";
class Face extends Component{
    render() {
        return(
            <div className="face">
                <div className="invasion-con">
                    1、人脸预警列表页分别显示重点人员、工作人员、位置人员。
                </div>
                <img src={face} alt=""/>
                <img src={face2} alt=""/>
                <img src={face3} alt=""/>
                <div className="invasion-con">
                    2、单击每一个信息弹窗信息详情显示，可使用人员名称、身份证号进行查询。
                </div>
                <img src={face4} alt=""/>
                <img src={face5} alt=""/>
            </div>
        )
    }
}
export default Face;