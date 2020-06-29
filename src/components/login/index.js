import React, { Component } from 'react'
import { Form, Input, Button, message, Icon, Checkbox } from 'antd'
import axios from '../../axios/index'
import logo from '../../style/imgs/logoCricle.png'
import './index.less'
import loginball from '../../style/imgs/loginball.png'

import lock from '../../style/imgs/lock.png'
import loginbg from '../../style/imgs/loginbg.png'
import loginboder from '../../style/imgs/loginboder.png'
import user from '../../style/imgs/user.png';

import md5 from "js-md5";
class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {}
	}
	componentDidMount() {
		if (this.getChromeVersion()) {
			var version = this.getChromeVersion();
			if (version < 42) {
				message.info("您使用的谷歌浏览器版本过低，系统自动会下载谷歌浏览器最新版本");
				window.location.href = "https://dl.google.com/tag/s/appguid%3D%7B8A69D345-D564-463C-AFF1-A69D9E530F96%7D%26iid%3D%7BB7B5683E-DD02-1662-00D3-0BC710F183D0%7D%26lang%3Dzh-TW%26browser%3D4%26usagestats%3D1%26appname%3DGoogle%2520Chrome%26needsadmin%3Dprefers%26ap%3Dx64-stable-statsdef_1%26installdataindex%3Dempty/update2/installers/ChromeSetup.exe"
			}
		}
	}
	//检测浏览器版本
	getChromeVersion = () => {
		let arr = navigator.userAgent.split(' ');
		let chromeVersion = '';
		for (let i = 0; i < arr.length; i++) {
			if (/chrome/i.test(arr[i]))
				chromeVersion = arr[i]
		}
		if (chromeVersion) {
			return Number(chromeVersion.split('/')[1].split('.')[0]);
		} else {
			return false;
		}
	};
	hanleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				axios
					.login({
						data: {
							account: values.account,
							password: md5(values.password)
						}
					})
					.then((res) => {
						if (res.success && res.data) {
							localStorage.setItem('account', res.data.datainfo.account)
							localStorage.setItem('companycode', res.data.datainfo.companycode)
							localStorage.setItem('ifsys', res.data.datainfo.ifsys)
							localStorage.setItem('utype', res.data.datainfo.utype)
							localStorage.setItem('token', res.data.token)
							localStorage.setItem('elemapinfo', res.data.elemapinfo)
							this.props.history.push('/dashboard')
						} else {
							message.warn('用户名或密码错误！')
						}
					})
			}
		})
	}

	creanumar = (num) => {
		let arr = []
		for (let i = 0; i < num; i++) {
			arr.push(i)
		}
		return arr
	}

	render() {
		const { getFieldDecorator } = this.props.form
		return (
			<div className="Login">
				<div className="login_title">
					<img src={logo} alt="" />
				</div>

				<div className="logoBor">
					<div className="logoBg">

						{/* 动画图片  */}
						<div className="tranfpro">
							<div className="imgfa">
								<img src={loginball} className="loginball" />
							</div>

							{/* 动画结束  */}
						</div>
						<div className="login_pro">

							{/* 登录表单 */}
							<div className="loginFrame"
								style={{
									backgroundImage: 'url(' + loginboder + ')',
									backgroundSize: '100% 100%',
								}}
							>
								<p className="uselogtitle">用户登录</p>
								<Form className="logoForm" onSubmit={this.hanleSubmit}>
									<Form.Item>
										{getFieldDecorator('account', {
											rules: [{ required: true, message: '请输入用户名!', help: '' }]
										})(
											<Input
												className="iphoneInput"
												placeholder="用户名"
												prefix={<Icon type="user" style={{ color: "#1C7CFF" }} />}
											/>
										)}
									</Form.Item>
									<Form.Item>
										{getFieldDecorator('password', {
											rules: [{ required: true, message: '请输入密码!', help: '' }]
										})(
											<Input
												className="iphoneInput"
												type="password"
												placeholder="密码"
												prefix={<Icon type="lock" style={{ color: "#1C7CFF" }} />}
											/>
										)}
									</Form.Item>
									<Form.Item>
										<Button type="primary" htmlType="submit" className="logoBtn">
											登录
										</Button>
									</Form.Item>
								</Form>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Form.create()(Login)
