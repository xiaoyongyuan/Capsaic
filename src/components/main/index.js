import React, { Component } from 'react'
import { Layout,Menu,Icon } from 'antd'
import { NavLink } from 'react-router-dom';
import LayerHeader from './../layout/LayerHeader'
import MenuRoutes from '../../routes/MenuRoutes'
import './index.less'
import MenuConfig from "../../routes/menuConfig";
const {Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
class Main extends Component {
	state = {
		collapsed: false,
		menuTreeNode: [],
		selectedKey: '',
		account: "",
		openKeys:[],
		rootSubmenuKeys:[]
	};
	componentDidMount() {
		let rootSubmenuKeys=[];
		MenuConfig.menuList.map((item)=>{
			if(item.children){
				rootSubmenuKeys.push(item.key);
			}
		});
		let pathname=this.props.location.pathname.split("/main/")[1].split("/")[0];
		rootSubmenuKeys.find(key=>{
			if( pathname.indexOf(key) > -1){
				this.setState({
					openKeys:[pathname]
				})
			}
		});
		this.setState({rootSubmenuKeys})
		document.onkeydown=(event)=>{
			// ctrl + alt + shift + d 
			if (event.keyCode == 68 && event.ctrlKey && event.altKey && event.shiftKey) {
				this.props.history.push('/main/system/developer')
			}
		}
	}
	componentWillUnmount = () =>{
		document.onkeydown=null;
	}
	onCollapse = () => {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	};
	onOpenChange = openKeys => {
		const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
		if (this.state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
			this.setState({openKeys});
		} else {
			this.setState({
				openKeys: latestOpenKey ? [latestOpenKey] : [],
			});
		}
	};
	renderMenu = () => { //菜单渲染
		//let account=localStorage.getItem("account")==="admin"?"admin":"others";
		return MenuConfig.menuList.map((el) => {
			//if(el.rank.indexOf(account) > -1){
			if (el.children && el.children.length) {
				return (
					<SubMenu key={el.key}
							 title={
								 <span>
                                        {el.icon && <Icon type={el.icon} />}
									 <span className="nav-text">{el.title}</span>
                                     </span>
							 }
					>
						{el.children.map(child=> {
							if(child.children && child.children.length){
								return (
									<SubMenu key={child.key} title={<span className="nav-text">{child.title}</span>}>
										{
											child.children.map((sun)=>{
												return (
													<Menu.Item key={sun.key} onClick={() => {this.props.history.push(sun.key) }}>{sun.title}</Menu.Item>
												)
											})
										}
									</SubMenu>
								)
							}else{
								return (
									<Menu.Item key={child.key}>
										<NavLink to={child.key}>
											{child.icon && <Icon type={child.icon} />}
											<span className="nav-text">{child.title}</span>
										</NavLink>
									</Menu.Item>
								)
							}
						})}
					</SubMenu>
				)
			}else{
				return (
					<Menu.Item key={el.key}>
						<NavLink to={el.key}>
							{el.icon && <Icon type={el.icon} />}
							<span className="nav-text">{el.title}</span>
						</NavLink>
					</Menu.Item>
				)
			}
			//}
		})
	};
	render() {
		return (
			<div className="main">
				<div className='leftWrap'>
					<div className='logoWrap'>
						<div className={this.state.collapsed ? "" : "logobg"} />
						<Icon
							className="trigger"
							type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
							onClick={this.onCollapse}
						/>
					</div>
					{
						this.state.collapsed?"":<div className="menuList">菜单列表</div>
					}
					<Menu
						mode="inline"
						selectedKeys={[this.props.history.location.pathname]}
						openKeys={this.state.openKeys}
						onOpenChange={this.onOpenChange}
						inlineCollapsed={this.state.collapsed}
						style={{marginTop:"12%"}}
					>
						{this.renderMenu()}
					</Menu>
				</div>
				<Layout>
					<LayerHeader />
					<Content className="contentAll">
						<MenuRoutes />
					</Content>
				</Layout>
			</div>
		)
	}
}
export default Main
