<template>
	<div class="exportContain">
		<!--我这里要显示相关数据-->
		<el-row class="panel-title">
			<div class="fr">
				<input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
				<el-button :loading="btnloading" style="margin-left:16px;" type="primary" size="small" @click="handleUpload">导入Excel</el-button>
				<el-button style="margin-left:16px;" type="primary" size="small" @click="uploadToDatabase">确认导入到数据库</el-button>
			</div>
		</el-row>
		<div class="tableContain">
			<el-table :data="tableData" v-loading="loading" element-loading-text="拼命加载中" 
				style="width: 100%; margin-top: 10px;" border highlight-current-row>
				<el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
			</el-table>
		</div>
	</div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  name: 'excelexport',
  data () {
    return {
      loading: false,
      btnloading: false,
      building: [],
      tableData: [],
      tableHeader: [],
      xlsxJson: [],
      odata: {}
    }
  },
  created () {
  	
  },
  methods: {
  	uploadToDatabase () {
      let self = this
      self.odata = {
      	name: 'root',
      	children: []
      }
      let objArr = []
      for (let j = 0; j < self.tableData.length; j++) {
      	if (self.tableData[j]['部门'].indexOf('/') === -1) {
      		objArr.push([self.tableData[j]['部门']])
      	} else {
      		objArr.push(self.tableData[j]['部门'].split('/'))
      	}
      }
      console.log('转成数组是：', objArr)
      for (let k = 0; k < objArr.length; k++) {
      	if (objArr[k].length === 1) {
          // 这条数据长度只有一个
          self.odata.children.push({
            name: objArr[k][0],
            children: []
          })
      	} else {
          // 这条数据长度大于一
          console.log('长度不是1的是：', objArr[k])
          for (let m = 0; m < objArr[k].length; m++) {
            if (m === 0) {
      	      let pName = 'root'
      	      let myName = objArr[k][m]
      	      self.processTree(pName, myName)
            } else {
              let pName = objArr[k][m - 1]
              let myName = objArr[k][m]
              self.processTree(pName, myName)
            }
            console.log('当前树形是：', self.odata)
      	  }
      	}
      }
      console.log('处理完的数据是', JSON.stringify(self.odata))
  	},
  	processTree (parent, my) {
      let self = this
      let $map = function (objtree) {
      	// 第一层
      	if (parent === objtree.name) {
          // 虚拟节点的children有数据
          // 检查子节点是否存在my
          if (self.checkExist(objtree.children, my) === false) {
            // 子节点不存在my，就把my插入其中
          	objtree.children.push({
              name: my,
              children: []
          	})
          } else {
          	console.log('存在节点')
          }
      	} else {
          // 第二层
          for (let i = 0; i < objtree.children.length; i++) {
          	$map(objtree.children[i])
          }
      	}
      }
      $map(self.odata)
  	},
  	// 查看是否存在
  	checkExist (tree, obj) {
      // let self = this
      let existFlag = false
      for (let i = 0; i < tree.length; i++) {
      	if (tree[i].name === obj) {
          existFlag = true
        }
      }
      return existFlag
    },
    
  	handleUpload () {
      this.$refs['excel-upload-input'].click()
      // this.loading = true
  	},
  	handleClick (e) {
  	  let files = e.target.files
  	  let fileobj = files[0]
      console.log('文件时:', fileobj)
  	  const types = fileobj.name.split('.')[1]
      // const types = file.name.split('.')[1]
	  const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(item => item === types)
	  this.loading = true
	  if (!fileType) {
	  	this.loading = false
	    this.$message('格式错误！请重新选择')
	    return
	  }
	  this.file2Xce(fileobj).then(tabJson => {
        if (tabJson && tabJson.length > 0) {
          this.xlsxJson = tabJson
          this.loading = false
          console.log('数据', this.xlsxJson)
		  // xlsxJson就是解析出来的json数据,数据格式如下
		  // [
		  //   {
		  //     sheetName: sheet1
		  //     sheet: sheetData
		  //   }
		  // ]
        }
      })
  	},
  	file2Xce (file) {
      let self = this
	  return new Promise(function (resolve, reject) {
	    const reader = new FileReader()
	    reader.onload = function (e) {
	      const data = e.target.result
	      self.wb = XLSX.read(data, {type: 'binary'})
	      console.log('binary格式是：', self.wb)
	      // 这段代码是处理成表格显示到页面上
	      let firstSheetName = self.wb.SheetNames[0]
	      let worksheet = self.wb.Sheets[firstSheetName]
	      if (worksheet['!ref'] === undefined) {
	      	self.$message('excel文件为空！请重新选择')
	        self.loading = false
	        return false
	      }
	      let header = self.getHeaderRow(worksheet)
	      let results = XLSX.utils.sheet_to_json(worksheet)
	      self.tableHeader = header
	      self.tableData = results
	      console.log('表格数据是：', results, self.tableData)
	      // this.workbook = XLSX.read(data, {type: 'array'})
	      // console.log('array格式是：', this.workbook)
	      const result = []
	      self.wb.SheetNames.forEach((sheetName) => {
	        result.push({
	          sheetName: sheetName,
	          sheet: XLSX.utils.sheet_to_json(self.wb.Sheets[sheetName])
	        })
	      })
	      resolve(result)
	    }
	    // reader.readAsBinaryString(file.raw)
	     reader.readAsBinaryString(file) // 传统input方法
	  })
    },
    getHeaderRow (sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
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
        .excel-upload-input {
        	display: none;
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
