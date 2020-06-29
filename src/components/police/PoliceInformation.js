import React, { Component } from 'react'
import {
	Row,
	Col,
	Select,
	DatePicker,
	Button,
	Icon,
	Form,
	message,
	Pagination,
	Switch,
	Checkbox,
	Empty,
	Breadcrumb
} from 'antd'
import './ploceinfomation.less'
import alarmBg from '../../style/ztt/imgs/defenceImg.png'
import axios from '../../axios/index'
import moment from 'moment'
import nodata from '../../style/imgs/nodata.png'
import ImageMagnifier from './ImgeMagnifier'
const { Option } = Select;
const { RangePicker } = DatePicker;
class PoliceInformation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			alarm: {},
			malarminfo: [],
			policeList: [],
			equList: [],
			page: 1,
			pagesize: 30,
			field: true, //是否显示围界信息
			obj: true, //是否显示报警对象
			policeListCode: '',
			selectstatus: 0, //select默认选中的状态
			policeListIndex: 0, //初始化报警下标
			nextcode: '', //下一个
			lastcode: '', //上一个
			magnifierOff: false,
			widthEnlarge: '', //放大图片的宽度
			heightNarrow: '', //放大图片的高度
			auxiliary: false, //是否点击副报警
			subNode: [], //所属节点
			isChecked: false,//自动更新是否选中
			nextPage:false,//控制上一页、下一页显示、隐藏
		}
	}
	componentDidMount() {
		this.hanleEquipment();
		this.hanleQuantity();
		this.handlePoliceList();
		this.hanleNode();
	}
	params = {
		bdate: '',
		edate: ''
	};
	//报警列表
	handlePoliceList = () => {
		let params = {
			status: this.state.selectstatus,
			pageindex: this.state.page,
			pagesize: this.state.pagesize,
			cid: this.state.scid,
			bdate: this.params.bdate,
			edate: this.params.edate,
			sysip: this.state.sysip
		};
		axios.ajax({
			method: 'get',
			url: window.g.loginURL + '/api/alarm/alarmlist',
			data: params
		})
			.then((res) => {
				if (res.success) {
					this.setState({
						policeList: res.data,
						totalcount: res.totalcount
					});
					if (res.data.length > 0) {
						this.setState({
							policeListCode: res.data[0].code
						})
					}
					this.getInfor()
				}
			})
	};
	//所属节点列表
	hanleNode = () => {
		axios.ajax({
			method:"get",
			url: window.g.loginURL+'/api/system/nodelist',
			data: {}
		}).then((res) => {
			if (res.success) {
				this.setState({
					subNode: res.data
				})
			}
		})
	};
	//单条报警信息
	getInfor = () => {
		if (this.state.policeList.length > 0) {
			if (this.state.policeListCode) {
				axios
					.ajax({
						method: 'get',
						url: window.g.loginURL + '/api/alarm/alarminfo',
						data: {
							cid: this.state.scid,
							bdate: this.params.bdate,
							edate: this.params.edate,
							code: this.state.policeListCode,
							status: this.state.selectstatus
						}
					})
					.then((res) => {
						if (res.success) {
							if (res.data.Malarm && res.data) {
								res.data.Malarm.fieldresult.map((v) => {
									this.setState({
										tagType: v.tag
									})
								});
								this.setState(
									{
										alarm: res.data.Malarm,
										alarmTime: res.data.Malarm.atime,
										alarmCid: res.data.Malarm.cid,
										alarmImg: res.data.Malarm.picpath ? window.g.imgUrl + res.data.Malarm.picpath : "",
										malarminfo: res.data.Malarm.Malarminfo.slice(0, 9),
										fields: res.data.Malarm.field,
										fieldresult: res.data.Malarm.fieldresult,
										policeListCode: res.data.Malarm.code,
										pic_width: res.data.Malarm.pic_width,
										pic_height: res.data.Malarm.pic_height,
										nextcode: res.data.Malarm.nextcode,
										lastcode: res.data.Malarm.lastcode,
										lightEid: res.data.Malarm.eid
									},
									() => {
										this.draw();
										this.updateStatus()
									}
								)
							}
						}
					})
			}
		}
	};
	updateStatus = (state) => {
		switch (state) {
			case 0:
				return '未处理';
			case 1:
				return '警情';
			case 3:
				return '虚警';
			default:
				return '未处理';
		}
	};
	//围界去重
	hanleRemoval = (e) => {
		e.preventDefault();
		let ele = document.getElementById('canvasobj');
		let canvsclent = ele.getBoundingClientRect();
		let canvW = e.clientX - canvsclent.left;
		let canvH = e.clientY - canvsclent.top;
		let cavProportionW = parseInt(ele.width / canvsclent.width * canvW);
		let cavProportionH = parseInt(ele.height / canvsclent.height * canvH);
		this.setState({
			cavProportionW,
			cavProportionH
		})
	};
	//画围界
	draw = () => {
		let ele = document.getElementById('canvasobj');
		let area = ele.getContext('2d');
		area.clearRect(0, 0, 704, 576); //清除之前的绘图
		area.lineWidth = 1;
		if (this.state.alarmImg) {
			const datafield = this.state.fields;
			if (this.state.field && datafield.length > 0) {
				const xi = 495 / 704,
					yi = 326 / 576;
				let areafield = ele.getContext('2d');
				for (let i = 0; i < datafield.length; i++) {
					let list = datafield[i].pointList;
					for (let a = 0; a < list.length; a++) {
						areafield.lineWidth = 1;
						areafield.strokeStyle = '#f00';
						areafield.beginPath();
						areafield.moveTo(parseInt(list[0][0] * xi), parseInt(list[0][1] * yi))
						areafield.lineTo(parseInt(list[1][0] * xi), parseInt(list[1][1] * yi))
						areafield.lineTo(parseInt(list[2][0] * xi), parseInt(list[2][1] * yi))
						areafield.lineTo(parseInt(list[3][0] * xi), parseInt(list[3][1] * yi))
						areafield.lineTo(parseInt(list[4][0] * xi), parseInt(list[4][1] * yi))
						areafield.lineTo(parseInt(list[5][0] * xi), parseInt(list[5][1] * yi))
						areafield.lineTo(parseInt(list[0][0] * xi), parseInt(list[0][1] * yi))
						areafield.stroke();
						areafield.closePath();
					}
				}
			}
			const objs = this.state.fieldresult;
			if (this.state.obj && objs.length > 0) {
				//计算缩放比例
				const x = 495 / this.state.pic_width,
					y = 326 / this.state.pic_height;
				objs.map((el, i) => {
					area.strokeStyle = '#ff0';
					area.beginPath();
					area.rect(parseInt(el.x * x), parseInt(el.y * y), parseInt(el.w * x), parseInt(el.h * y));
					area.stroke();
					area.closePath();
					return ''
				})
			}
		}
	};
	//鼠标移入打开放大
	hanleEnter = () => {
		this.setState({
			magnifierOff: true
		})
	};
	//鼠标离开关闭放大
	hanleMouseLeave = () => {
		this.setState({
			magnifierOff: false
		})
	};
	//去重
	hanleAddremoval = () => {
		this.setState({
			magnifierOff: false
		})
		/* if(this.state.cavProportionW && this.state.cavProportionH){
             const xi = 510 / this.state.pic_width, yi = 340 / this.state.pic_height;
             this.state.fieldresult.map((v)=>{
                 if(this.state.cavProportionW>=parseInt(v.x*xi) && this.state.cavProportionW<=parseInt((v.x+v.w)*xi) && this.state.cavProportionH>=parseInt(v.y*yi) && this.state.cavProportionH<=parseInt((v.y+v.h)*yi)){
                     axios.ajax({
                         method:"post",
                         url:window.g.loginURL+"/api/alarm/distinctpoint",
                         data:{
                             cid:this.state.alarmCid,
                             finalinfo:JSON.stringify(v)
                         }
                     }).then((res)=>{
                        message.info(res.msg)
                     })
                 }
             });
         }else{
             message.warning("请点击目标对象!");
         }*/
	};
	//动态获取报警图片的宽度和高度
	hanleLoad = () => {
		this.setState({
			widthEnlarge: this.refs.alarmImg.getBoundingClientRect().width,
			heightNarrow: this.refs.alarmImg.getBoundingClientRect().height
		})
	};
	//设备
	hanleEquipment = () => {
		axios
			.ajax({
				method: 'get',
				url: window.g.loginURL + '/api/equ/getlist',
				data: {
					estatus:"-1"
				}
			})
			.then((res) => {
				if (res.success) {
					this.setState({
						equList: res.data
					})
				}
			})
	};
	//更新数量
	hanleQuantity = () => {
		axios
			.ajax({
				method: 'get',
				url: window.g.loginURL + '/api/alarm/updatecount',
				data: {}
			})
			.then((res) => {
				if (res.success) {
					this.setState({
						updateQuant: res.data.count
					})
				}
			})
	};
	//报警状态
	hanleStatus = (ststus) => {
		switch (ststus) {
			case 0:
				return '未处理';
			case 1:
				return '警情';
			case 3:
				return '虚警';
			default:
				return
		}
	};
	//报警背景颜色
	hanlePoliceBg = (ststus) => {
		switch (ststus) {
			case 0:
				return 'policeStatus unhanle';
			case 1:
				return 'policeStatus policebg';
			case 3:
				return 'policeStatus falsePolicebg';
			default:
				return
		}
	};
	//修改报警状态
	hanlePoliceStatus = (status) => {
		if (this.state.policeListCode) {
			this.state.policeList.map((v, i) => {
				if (v.code === this.state.policeListCode) {
					this.setState({ policeListIndex: i })
				}
			});
			axios
				.ajax({
					method: 'get',
					url: window.g.loginURL + '/api/alarm/setalastatus',
					data: {
						acode: this.state.policeListCode,
						status: status
					}
				})
				.then((res) => {
					if (res.success) {
						let oldPoilice = this.state.alarm;
						oldPoilice.status = res.data.status;
						let policeList = this.state.policeList;
						policeList[this.state.policeListIndex].status = res.data.status;
						this.setState({ oldPoilice, policeList }, () => {
							this.handlePoliceList();
						});
						message.info('操作成功!')
					}
				})
		}
	};
	//多条报警图片
	hanleReplace = (picImg) => {
		this.setState(
			{
				clickCode: picImg.code,
				alarmTime: picImg.atime,
				alarmImg: picImg.picpath ? window.g.imgUrl + picImg.picpath : "",
				fields: picImg.field,
				fieldresult: picImg.fieldresult,
				pic_width: picImg.pic_width,
				pic_height: picImg.pic_height
			},
			() => {
				this.draw()
			}
		)
	};
	//点击报警选中的样式
	hanleBorder = (index) => {
		if (this.state.policeListCode === index) {
			return 'selectBorder'
		}
	};
	//点击副报警选中的样式
	hanleAuxiliary = (code) => {
		if (this.state.clickCode === code) {
			return 'selectBorder'
		}
	};
	/*
        默认主报警的样式
        是否点击副报警图片 是 返回样式 否 不返回样式
    */
	hanleFirstAuxiliary = () => {
		if (this.state.policeListCode === this.state.clickCode) {
			return 'selectBorder'
		}
	};
	//查看详情
	hanlePoliceDateil = (code, index) => {
		this.setState(
			{
				policeListCode: code,
				policeListIndex: index,
				auxiliary: false
			},
			() => {
				this.getInfor()
			}
		)
	};
	//查询
	handleSubmitSelect = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				if (values.date && values.date.length) {
					let beforeTime = moment(values.date[0]).format('YYYY-MM-DD HH:mm:ss')
					let mydate = moment(moment(values.date[1]).format('YYYY-MM-DD HH:mm:ss'))
					let days = mydate.diff(beforeTime, 'day');
					if (days <= 1) {
						this.params.bdate =
							values.date && values.date.length ? values.date[0].format('YYYY-MM-DD HH:mm:ss') : ''
						this.params.edate =
							values.date && values.date.length ? values.date[1].format('YYYY-MM-DD HH:mm:ss') : ''
					} else {
						message.error('请选择1天以内的时间')
					}
				} else {
					this.params.bdate =
						values.date && values.date.length ? values.date[0].format('YYYY-MM-DD HH:mm:ss') : ''
					this.params.edate =
						values.date && values.date.length ? values.date[1].format('YYYY-MM-DD HH:mm:ss') : ''
				}
				this.setState(
					{
						scid: values.cid,
						selectstatus: values.status,
						page: 1,
						sysip: values.sysip
					},
					() => {
						this.handlePoliceList();
						this.hanleQuantity();
					}
				)
			}
		})
	};
	//分页
	hanlePage = (page) => {
		this.setState(
			{
				page: page
			},
			() => {
				this.handlePoliceList()
			}
		)
	};
	//控制显示围界与对象
	onChangeCumference = (checked, text) => {
		this.setState(
			{
				[text]: checked
			},
			() => {
				this.draw()
			}
		)
	};
	//自动更新
	hanleUpdate = (checked) => {
		this.setState(
			{
				isChecked: checked
			},
			() => {
				if (this.state.isChecked) {
					this.timer = setInterval(() => this.handlePoliceList(), 3000);
					this.updateNum = setInterval(() => this.hanleQuantity(), 3000)
				} else {
					clearInterval(this.timer);
					clearInterval(this.updateNum)
				}
			}
		)
	};
	onShowSizeChange = (current, pageSize) => {
		this.setState(
			{
				pagesize: pageSize
			},
			() => {
				this.handlePoliceList()
			}
		)
	};
	//上一个
	hanleUper = (text) => {
		this.setState(
			{
				policeListCode: this.state[text]
			},
			() => {
				this.getInfor()
			}
		)
	};
	disabledDate = (current) => {
		return current > moment().endOf('day')
	};
	componentWillUnmount() {
		clearInterval(this.timer);
		clearInterval(this.updateNum)
	}
	hanleTag = () => {
		if (this.state.tagType == 0) {
			return '人员报警'
		} else if (
			this.state.tagType == 1 ||
			this.state.tagType == 2 ||
			this.state.tagType == 3 ||
			this.state.tagType == 4 ||
			this.state.tagType == 5
		) {
			return '车辆报警'
		} else if (this.state.tagType == 6) {
			return '强制报警'
		}
	};
	//设备闪灯
	hanleFlashing = () => {
		if (this.state.lightEid) {
			axios.ajax({
				method: "get",
				url: window.g.loginURL + "/api/rasp/light",
				data: { devid: this.state.lightEid }
			}).then((res) => {
				if (res.success) {
					message.success("设备闪灯成功！");
				} else {
					message.success("设备闪灯失败！");
				}
			})
		}
	};
	//鼠标移入
	videoMove=()=>{
		this.setState({
			nextPage:true
		})
	};
	//鼠标离开
	videoOut=()=>{
		this.setState({
			nextPage:false
		})
	};
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="ploceinfomation">
				<Breadcrumb className="crumbs">
					<Breadcrumb.Item>智能识别</Breadcrumb.Item>
					<Breadcrumb.Item>
						<span className="crumbs-item">围界入侵</span>
					</Breadcrumb.Item>
				</Breadcrumb>
				<Form layout="inline" onSubmit={this.handleSubmitSelect}>
					<Row className="ploceinfomation-query">
						<Form.Item label="选择设备" className="choiceEqu">
							{getFieldDecorator('cid', {
								initialValue: ''
							})(
								<Select className="select-form" style={{ width: 120 }}>
									<Option value="">全部</Option>
									{this.state.equList.map((v, i) => (
										<Option key={i} value={v.cid} style={{display:v.relations.projecttype === "2"?"none":"block"}}>
											{v.ename}
										</Option>
									))}
								</Select>
							)}
						</Form.Item>
						<Form.Item label="报警状态">
							{getFieldDecorator('status', {
								initialValue: '0'
							})(
								<Select className="select-form" style={{ width: 120 }}>
									<Option value="1">警情</Option>
									<Option value="0">未处理</Option>
									<Option value="3">虚警</Option>
								</Select>
							)}
						</Form.Item>
						<Form.Item label="所属节点">
							{getFieldDecorator('sysip', {
								initialValue: ''
							})(
								<Select className="select-form" style={{ width: 150 }}>
									<Option value="">请选择</Option>
									{this.state.subNode.map((v) => (
										<Option key={v.code} value={v.sysip}>
											{v.sysip}
										</Option>
									))}
								</Select>
							)}
						</Form.Item>
						<Form.Item label="选择时间">
							{getFieldDecorator('date')(
								<RangePicker
									disabledDate={this.disabledDate}
									showTime={{ format: 'YYYY-MM-DD HH:mm:ss' }}
									format="YYYY-MM-DD HH:mm:ss"
								/>
							)}
							<Button className="query-btn" type="primary" htmlType="submit">
								搜索
							</Button>
						</Form.Item>
					</Row>
				</Form>
				{this.state.policeList.length > 0 ? (
					<div>
						<div className="ploceinfomationCon">
							<div className="main-left">
								<div className="alarmImg" ref="alarmImg" onLoad={this.hanleLoad}>
									<div className="img-up-fu-word">
										<div className="circle" />
										<span className="img-up-fu-word-span">{this.state.alarm.name}</span>
									</div>
									<div className="smallImg">
										<div className={'everyImg ' + this.hanleFirstAuxiliary()}>
											<img src={this.state.alarm.picpath ? window.g.imgUrl + this.state.alarm.picpath : ""}
												alt=""
												onClick={() => this.hanleReplace(this.state.alarm)}
											/>
										</div>
										{
											this.state.malarminfo.map((v, i) => (
												<div key={i} className={'everyImg ' + this.hanleAuxiliary(v.code)}>
													<img src={v.picpath}
														alt=""
														onClick={() => this.hanleReplace(v)}
													/>
												</div>
											))
										}
									</div>
									<canvas
										id="canvasobj"
										//onClick={this.hanleRemoval}
										onMouseEnter={this.hanleEnter}
										width="495px"
										height="326px"
										style={{
											backgroundImage: 'url(' + this.state.alarmImg + ')',
											backgroundSize: '100% 100%'
										}}
									/>
									<img
										src={nodata}
										alt=""
										className="nodata"
										style={{ display: this.state.alarmImg ? 'none' : 'block' }}
									/>
									{this.state.magnifierOff && this.state.alarmImg ? (
										<ImageMagnifier
											minImg={this.state.alarmImg}
											maxImg={this.state.alarmImg}
											mouseLeave={this.hanleMouseLeave}
											widthEnlarge={this.state.widthEnlarge}
											heightNarrow={this.state.heightNarrow}
										/>
									) : null}
								</div>
								<div className="pageLeft" title="上一个" style={{display:this.state.nextPage?"block":"none"}} 	onMouseMove={this.videoMove}>
									<Icon type="left"  onClick={() => this.hanleUper('lastcode')} />
								</div>
								<div className="pageRight" title="下一个" style={{display:this.state.nextPage?"block":"none"}} 	onMouseMove={this.videoMove}>
									<Icon type="right" onClick={() => this.hanleUper('nextcode')} />
								</div>
								<video
									controls="controls"
									src={this.state.alarm.videopath ? window.g.imgUrl + this.state.alarm.videopath : ''}
									style={{ width: "55%", height: "88%", paddingLeft: "25px", objectFit: "fill" }}
									onMouseMove={this.videoMove}
									onMouseOut={this.videoOut}
								/>
							</div>
							<div className="main-right">
								<div className="early-title">预警信息</div>
								<div className="policeTab">
									<div className="policeTab-item">
										<span>设备名称</span>
										<span>检测类型</span>
									</div>
									<div className="policeTab-item">
										<span>{this.state.alarm.name}</span>
										<span>{this.hanleTag()}</span>
									</div>
									<div className="policeTab-item">
										<span>报警时间</span>
										<span>报警状态</span>
									</div>
									<div className="policeTab-item">
										<span title={"2020-05-25 16:34:09"}>{this.state.alarmTime}</span>
										<span>
											{
												this.updateStatus(this.state.alarm.status ? this.state.alarm.status : '')
											}
										</span>
									</div>
								</div>
								<div className="sector">
									<div className="sectorCon">
										<span className="sectorCon-item">
											<Switch
												className="switchfiled"
												size="small"
												checked={this.state.field}
												onChange={(checked) =>
													this.onChangeCumference(checked, 'field')}
											/>
											<span className="sectorCon-switch">防区显示</span>
										</span>
										<span className="sectorCon-item">
											<Switch
												className="switchfiled"
												size="small"
												checked={this.state.obj}
												onChange={(checked) =>
													this.onChangeCumference(checked, 'obj')}
											/>
											<span className="sectorCon-switch">目标显示</span>
										</span>
									</div>
									<Button type="primary" className="light" onClick={this.hanleFlashing}>设备闪灯</Button>
								</div>
								<div className="early-title">操作处理</div>
								<Button
									type="primary"
									className="policeBtn policq"
									onClick={() => this.hanlePoliceStatus('1')}
								>
									警情
								</Button>
								<Button
									type="primary"
									className="policeBtn policex"
									onClick={() => this.hanlePoliceStatus('3')}
								>
									虚警
								</Button>
							</div>
						</div>
						{/*<Row className="ploceinfomation-main">
							<div className="main-left">
								<Row type="flex" justify="space-around">
									<Col span={1} className="pageLeft">
										<div className="pageBorder">
											<Icon type="left" onClick={() => this.hanleUper('lastcode')} />
										</div>
									</Col>
									<Col className="main-left-L" xxl={12} xl={10}>
										<div className="img-up-fu">
											<div className="alarmImg" ref="alarmImg" onLoad={this.hanleLoad}>
												<canvas
													id="canvasobj"
													onClick={this.hanleRemoval}
													onMouseEnter={this.hanleEnter}
													width="510px"
													height="316px"
													style={{
														backgroundImage: 'url(' +this.state.alarmImg+ ')',
														backgroundSize: '100% 100%'
													}}
												/>
												<img
													src={nodata}
													alt=""
													className="nodata"
													style={{ display: this.state.alarmImg ? 'none' : 'block' }}
												/>
												{this.state.magnifierOff && this.state.alarmImg ? (
													<ImageMagnifier
														minImg={this.state.alarmImg}
														maxImg={this.state.alarmImg}
														mouseLeave={this.hanleMouseLeave}
														widthEnlarge={this.state.widthEnlarge}
														heightNarrow={this.state.heightNarrow}
													/>
												) : null}
											</div>
											<div className="img-up-fu-word">
												<div className="circle" />
												<span className="img-up-fu-word-span">{this.state.alarm.name}</span>
											</div>
											<div className="smallImg">
												<div className={'everyImg ' + this.hanleFirstAuxiliary()}>
													<img src={this.state.alarm.picpath?window.g.imgUrl+this.state.alarm.picpath:""}
														 alt=""
														 onClick={() => this.hanleReplace(this.state.alarm)}
													/>
												</div>
												{this.state.malarminfo.map((v, i) => (
													<div key={i} className={'everyImg ' + this.hanleAuxiliary(v.code)}>
														<img src={v.picpath ?window.g.imgUrl+v.picpath : alarmBg}
															 alt=""
															 onClick={() => this.hanleReplace(v)}
														/>
													</div>
												))}
											</div>
										</div>
									</Col>
									<Col className="main-left-R" xxl={12} xl={10}>
										<video
											controls="controls"
											src={this.state.alarm.videopath ? window.g.imgUrl+this.state.alarm.videopath : ''}
											style={{ width: '100%', height: '100%' }}
										/>
									</Col>
								</Row>
							</div>
							<div className="main-right">
								<Row>
									<Col span={21}>
										<div className="up">
											<div style={{ height: '20px' }} />
											<p className="alarmInfor">
												<span className="alarmInforBg" />&nbsp;
												<span>报警信息</span>
											</p>
											<Row className="equipName">
												<Col className="equipName-left" span={8}>
													设备名称
												</Col>
												<Col className="equipName-right" span={16}>
													<span className="equipName-right-word">
														{this.state.alarm.name}
													</span>
												</Col>
											</Row>
											<Row className="equipName">
												<Col className="equipName-left" span={8}>
													报警类型
												</Col>
												<Col className="equipName-right" span={16}>
													<span className="equipName-right-word">{this.hanleTag()}</span>
												</Col>
											</Row>
											<Row className="equipName">
												<Col className="equipName-left" span={8}>
													报警时间
												</Col>
												<Col className="equipName-right" span={16}>
													<span className="equipName-right-word">{this.state.alarmTime}</span>
												</Col>
											</Row>
											<Row className="equipName">
												<Col className="equipName-left" span={8}>
													报警状态
												</Col>
												<Col className="equipName-right" span={16}>
													<span className="equipName-right-word">
														{this.updateStatus(
															this.state.alarm.status ? this.state.alarm.status : ''
														)}
													</span>
												</Col>
											</Row>
											{this.state.alarmImg ? (
												<Row className="equipName">
													<Col className="equipNamefiled" span={9}>
														防区显示<Switch
														className="switchfiled"
														size="small"
														checked={this.state.field}
														onChange={(checked) =>
															this.onChangeCumference(checked, 'field')}
													/>
													</Col>
													<Col className="equipName-right" span={9}>
														目标显示<Switch
														className="switchfiled"
														size="small"
														checked={this.state.obj}
														onChange={(checked) =>
															this.onChangeCumference(checked, 'obj')}
													/>
													</Col>
												</Row>
											) : (
												''
											)}
											<Row className="equipName" style={{textAlign:"center"}}>
												<Col span={4} className="flashing">
													<span className="light" onClick={this.hanleFlashing}>设备闪灯</span>
												</Col>
											</Row>
										</div>
										<div className="down">
											<div className="equipHandleTitle">
												<div className="alarmsta">
													<span className="equimentBg" />&nbsp;
													<span>报警状态</span>
												</div>
												<div className="addDuplicate ">添加去重</div>
											</div>
											<Row className="equipHandle">
												<Col span={12}>
													<Button
														type="primary"
														className="policeBtn policq"
														onClick={() => this.hanlePoliceStatus('1')}
													>
														警情
													</Button>
												</Col>
												<Col span={12}>
													<Button
														type="primary"
														className="policeBtn policex"
														onClick={() => this.hanlePoliceStatus('3')}
													>
														虚警
													</Button>
												</Col>
											</Row>
										</div>
									</Col>
									<Col span={3} className="pageLeft">
										<div className="pageBorder">
											<Icon type="right" onClick={() => this.hanleUper('nextcode')} />
										</div>
									</Col>
								</Row>
							</div>
						</Row>*/}
						<div className="policeLists">
							<Row className="ploceinfomation-update">
								<Col span={12}>
									<span className="updata-word">今日报警数量</span>
									<div className="updata-Num">{this.state.updateQuant ? this.state.updateQuant : 0}</div>
								</Col>
								<Col span={12} className="zdupdate-col">
									<div className="zdupdate">
										<div className="zdupdate-word">
											自动更新:
											<Switch
												defaultChecked={this.state.isChecked}
												onChange={this.hanleUpdate}
												size="small"
												style={{ marginLeft: "10px" }}
											/>
										</div>
									</div>
								</Col>
							</Row>
							<div style={{ height: "238px", overflowX: "hidden", overflowY: "scroll" }}>
								<Row gutter={16} >
									{this.state.policeList.map((v, i) => (
										<Col key={v.code} className={'gutter-row ' + this.hanleBorder(v.code)} xxl={4} xl={6}>
											<div
												key={i}
												className="gutter-box policeList"
												onClick={() => this.hanlePoliceDateil(v.code, i)}
											>
												<img src={v.picpath ? window.g.imgUrl + v.picpath : alarmBg} className="picImg" alt="" />
												<div className="policeBottom">
													<span className="policeName">{v.atime}</span>
												</div>
												<div className={this.hanlePoliceBg(v.status)}>
													<span className="policeStatusCicle" />
													<span className="policeStatusFont">{this.hanleStatus(v.status)}</span>
												</div>
												<div className="policeNikName">
													<span className="policeCircle" />
													<span className="policeTimes">{v.name}</span>
												</div>
											</div>
										</Col>
									))}
								</Row>
							</div>
							<div className="pagination">
								<span className="pagesCon">每页显示{this.state.pagesize}条</span>
								<Pagination
									showSizeChanger={true}
									hideOnSinglePage={true}
									onShowSizeChange={this.onShowSizeChange}
									defaultCurrent={this.state.page}
									current={this.state.page}
									total={this.state.totalcount}
									pageSize={this.state.pagesize}
									onChange={this.hanlePage}
									showTotal={() => `总共 ${this.state.totalcount} 条`}
								/>
							</div>
						</div>
					</div>
				) : (
						<div className="nodataEmpty">
							<Empty />
						</div>
					)}
			</div>
		)
	}
}

export default (PoliceInformation = Form.create({})(PoliceInformation))
