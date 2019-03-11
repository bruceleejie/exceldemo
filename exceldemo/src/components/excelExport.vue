<template>
	<div class="exportContain">
		<!--我这里要显示相关数据-->
		<el-row class="panel-title">
			<div class="fr">
				<el-button type="primary" size="small" @click="exportData">导出为Excel</el-button>
			</div>
		</el-row>
		<div class="tableContain">
			<el-table :data="building" v-loading="loading" element-loading-text="拼命加载中" style=" margin-top: 10px;" border>
				<el-table-column label="序号" type="index" width="50"></el-table-column>
				<!--<el-table-column prop="id" label="参数项id" width="100"></el-table-column>-->
				<el-table-column prop="name" label="深圳名称" width=""></el-table-column>
				<el-table-column prop="address" label="地址" width=""></el-table-column>
				<el-table-column prop="longitude" label="经度" width=""></el-table-column>
				<el-table-column prop="latitude" label="纬度" width=""></el-table-column>
				<!--<el-table-column prop="opt_modify" label="是否可修改" width="">
					<template slot-scope="scope">
	                    <span v-text="scope.row.opt_modify == 1 ? '可修改' : '不可修改'"></span>
	                </template>
				</el-table-column>-->
				<!--<el-table-column label="操作" width="200">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" @click="openUpdate(scope.row)" size="mini" plain>修改</el-button>
						<el-button type="danger" icon="el-icon-delete" @click="startDelete(scope.row.id)" size="mini" plain>删除</el-button> 
					</template>
				</el-table-column>-->
			</el-table>
		</div>
	</div>
</template>

<script>
import HelloWorld from './HelloWorld'
// 定义常量方便更改操作
const DATA_OK = 0

export default {
  name: 'excelexport',
  data () {
    return {
      loading: false,
      building: []
    }
  },
  created () {
  	this.loading = true
  	this.$http.get('/api/building').then((response) => {
  	  // console.log('这里打印一下数据1', response)
      // response = response.body
      response = response.data
	  // console.log('这里打印一下数据', response)
	  if (response.errno === DATA_OK) {
	    this.building = response.data
	    // console.log('显示我传递好的数据：', this.building)
	  }
	  this.loading = false
  	}).catch(() => {
      
  	})
  },
  methods: {
  	exportData () {
  		import('../excel/Export2Excel').then(excel => {
			const tHeader = ['ID', '配置项名称', 'key值', 'value值', '是否可修改']
			const filterVal = ['id', 'opt_name', 'opt_key', 'opt_value', 'opt_modify']
			const list = self.tableData
			const data = self.formatJson(filterVal, list)
			excel.special_export_json_to_excel({
				header: tHeader,
				data,
				filename: 'csexcel',
				autoType: true,
				bookType: 'xlsx'
			})
		})
  	}
  }
}
</script>

<style rel="stylesheet/scss" lang='scss'>
.exportContain {
  	width: 100%;
  	height: 100%;
  	background: #FFFFFF;
  	/*padding: 10px;*/
  	
  	.panel-title {
        height: 45px;
        line-height: 45px;
        width: 100%;
        text-transform: uppercase;
        padding: 0 10px;
        
        .fr {
        	float: right;
        }
    }
    .tableContain {
    	width: 100%;
    	padding: 0 10px;
    }
}
</style>
