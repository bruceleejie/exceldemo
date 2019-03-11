<template>
  <div id="app">
    <!--
    <router-view/>-->
    <div class="headerContain">
		  <h2>Excel导出Demo</h2>
		</div>
		<div class="bodyContain">
			<div class="leftContain">
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo">
					<el-menu-item index="1">
						<router-link to="/exportexcel">excel导出</router-link>
					</el-menu-item>
				</el-menu>
			</div>
			<div class="mainContain">
				<!--我这里展示内容-->
				<router-view ></router-view>
			</div>
		</div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
  	return {
  		
  	}
  },
  created () {
  	
  }
}
</script>

<style rel="stylesheet/scss" lang='scss'>
#app {
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	position: relative;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
  .headerContain {
  	box-sizing: border-box;
  	position: fixed;
		top: 0;
		left: 0;
		height: 72px;
		width: 100%;
		color: #fff;
		background: #2C3E50;
		
		h2 {
			float: left;
			margin-left: 30px;
		}
	}
	.bodyContain {
		box-sizing: border-box;
		position: fixed;
		top: 72px;
		left: 0px;
		/*height: 100%;*/
		/*padding: 72px 0 0 0;*/
		width: 100%;
		height: calc(100% - 72px);
		/*height: auto;*/
		background: #eee;
		/*overflow-y: auto;*/
		
		.leftContain {
			float: left;
			width: 15%;
			height: 100%;
			background: #fff;
			text-align: center;

			.el-menu-vertical-demo {
				
				.el-menu-item {
					
					a {
						text-decoration: none;
					  color: #000;
					  &.active{
						  color: #409EFF;
						}
					}
					
				}
			}
		}
		.mainContain {
			box-sizing: border-box;
			/*width: calc(100% - 15%);*/
			width: auto;
			height: 100%;
			/*float: left;*/
			background: #EEE;
			text-align: center;
			padding: 10px;
			overflow-x: hidden;
			/*overflow-y: scroll;*/
			
			.mainContain:after {
				content: ' ';
				display: block;
				height: 0px;
				clear: both;
				visibility: hidden;
			}
		}
	}
}
</style>
