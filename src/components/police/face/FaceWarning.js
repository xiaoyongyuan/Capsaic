import React, { Component } from 'react';
import FaceTable from "./FaceTable"
import { Breadcrumb, Form, Input, Button } from "antd";
import "../../../style/ztt/css/faceWarning.less";
import axios from "../../../axios";
class FaceWarning extends Component {
    state = {
        faceWarningList: [],
    };


    render() {
        return (
            <div className="faceWarning">
                <Breadcrumb className="crumbs">
                    <Breadcrumb.Item>智能识别</Breadcrumb.Item>
                    <Breadcrumb.Item>人脸检测</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <span className="crumbs-item">人脸预警</span>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <FaceTable />
            </div>
        );
    }
}
export default FaceWarning = Form.create({})(FaceWarning);