<template>
	<div class="exportContain">
		<!--我这里要显示相关数据-->
		<el-row class="panel-title">
			<div class="fr">
				<el-button type="primary" size="small" @click="exportData">导出为Excel</el-button>
				<el-button type="primary" size="small" @click="exportExcelWithSheet">导出为Excel(多个sheet)</el-button>
			</div>
		</el-row>
		<div class="tableContain">
			<el-table :data="building" v-loading="loading" element-loading-text="拼命加载中" style=" margin-top: 10px;" border>
				<el-table-column label="序号" type="index" width="50"></el-table-column>
				<!--<el-table-column prop="id" label="参数项id" width="100"></el-table-column>-->
				<el-table-column prop="name" label="名称" width=""></el-table-column>
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
import { utils, writeFileSync } from 'xlsx'
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
  mounted () {
  	this.loading = true
  	this.$http.get('/api/building').then((response) => {
  	  // console.log('这里打印一下数据1', response)
      response = response.data
	  // console.log('这里打印一下数据', response)
	  if (response.errno === DATA_OK) {
	    this.building = response.data
	     console.log('显示我传递好的数据：', this.building)
	  }
	  this.loading = false
  	}).catch(() => {
      
  	})
  },
  methods: {
  	exportData () {
      let self = this
      import('@/excel/Export2Excel').then(excel => {
        const tHeader = ['ID', '名称', '地址', '经度', '纬度']
        const filterVal = ['id', 'name', 'address', 'longitude', 'latitude']
        const list = self.building
        const data = self.formatJson(filterVal, list)
        excel.special_export_json_to_excel({
          header: tHeader,
          data,
          filename: 'testexcel',
          autoType: true,
          bookType: 'xlsx'
        })
      })
  	},
	exportExcelWithSheet () {
		// 多个sheet的逻辑就是给每个ws对应上数据和唯一的sheet名，然后把每个ws都追加到wb创建的excel中，然后用writeFile写文件
		let size = 10 // 每个sheet 10条
		let sheetCount = Math.ceil(this.building.length / size) // 总共有多少个sheet
		let wb = utils.book_new()
		let ws = null
		let map = {
			id: 'ID', name: '名称', address: '地址', longitude: '经度', latitude: '纬度'
		}
		for (let i=0; i<sheetCount; i++) {
			let tableList = this.building.slice(i*size, (i+1)*size)
			let finalArr = []
			tableList.forEach(item => {
				let obj = {}
				for(let key in item) {
					obj[map[key]] = item[key]
				}
				finalArr.push(obj)
			})
			ws = utils.json_to_sheet(finalArr)
			utils.book_append_sheet(wb, ws, `sheet${i+1}`)
		}
		// writeFileXLSX(wb, `ceshi.xlsx`) // 这个版本没有这个方法 可以用下面的方法代替
		writeFileSync(wb, `ceshi.xlsx`)
	},
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang='scss'>
.exportContain {
  	max-width: 100%;
  	min-height: 100%;
  	background: #FFFFFF;
  	padding: 10px;
  	
  	.panel-title {
        height: 45px;
        line-height: 45px;
        width: 100%;
        text-transform: uppercase;
        /*padding: 0 10px;*/
        
        .fr {
        	float: right;
        }
    }
    .tableContain {
    	/*width: 100%;*/
    	height: 100%;
    	width: auto;
    	/*padding: 0 10px;*/
    }
}
</style>
