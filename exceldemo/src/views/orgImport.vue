<template>
  <div class="orgImportContainer">
  	<el-tabs type="border-card">
      <el-tab-pane label="解释说明页" class="tabClass">
      	<el-row class="panel-title">
	      <div class="fl">
	      	<p>ps：部门导入是根据这种“/”来识别组织层级，把中文名称的组织变成树形结构。</p>
	      	<p>例如把如下所示的表格数据变成，树形结构进行展示：</p>
	      </div>
	      <div class="clearfix"></div>
	      <div class="imageContent">
	      	<div class="imageItem">
	      		<p>表格中的数据</p>
	          <img src="@/assets/tree.png" height="500px"/>
	      	</div>
	      	<!--<div class="dividerItem">
	      		<div class="dividerLine"></div>
	      		转换后：
	      	</div>-->
	      	<div class="imageItem">
	      		<p>树形结构</p>
	          <img src="@/assets/tree2.png" height="450px"/>
	      	</div>
	      </div>
	    </el-row>
      </el-tab-pane>
      <el-tab-pane label="功能体验页">
      	<el-row class="panel-title">
	      <div class="fr">
	      	<input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
	      	<el-button type="primary" size="small" plain @click="openImportOrg" icon="el-icon-upload2">导入组织</el-button>
	      </div>
	    </el-row>
      	<el-tree :data="virtualTree.children" v-loading="importLoading" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-tab-pane>
  	</el-tabs>
    <!-- 导入组织结构 -->
    <div class="import-org-dialog">
      <el-dialog title="导入组织结构" :visible.sync="importDeptVisible" :modal-append-to-body="false">
        <el-table :data="tableData" v-loading="tableLoading" element-loading-text="拼命加载中" 
          style="width: 100%; margin-top: 10px; text-align: left;" border highlight-current-row height="700">
          <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" style="line-height: 48px;" />
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmImport" :loading="btnloading">提 交</el-button>
          <el-button @click="cancleImport">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'

export default {
  name: 'orgimport',
  data () {
    return {
      loading: false,
      tableLoading: false,
      btnloading: false,
      importLoading: false,
      importDeptVisible: false,
      building: [],
      defaultProps: [],
      tableData: [], // 表格数据
      tableHeader: [], // 表头数据
      xlsxJson: [],
      virtualTree: {}, // 虚拟树形数据
      png1: '@/assets/tree2.png',
      png2: '@/assets/tree.png'
    }
  },
  created () {
  	
  },
  methods: {
  	openImportOrg () {
      let self = this
      self.tableData = []
      self.tableHeader = []
      self.$refs['excel-upload-input'].click()
  	},
  	handleClick (e) {
      let self = this
      let files = e.target.files
      let fileobj = files[0]
      console.log('文件时:', fileobj)
      const types = fileobj.name.split('.')[1]
      // const types = file.name.split('.')[1]
      const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(item => item === types)
      self.importLoading = true
      if (!fileType) {
        self.$message('格式错误！请重新选择')
        self.importLoading = false
        return
      }
      self.file2Xce(fileobj).then(tabJson => {
        if (tabJson && tabJson.length > 0) {
          self.xlsxJson = tabJson
          self.importLoading = false
          self.importDeptVisible = true
          e.target.value = ''
          console.log('数据', self.xlsxJson)
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
    },
  	handleNodeClick (obj) {
      console.log(obj)
  	},
  	confirmImport () {
      let self = this
      // 首先将获取到的excel数据的部门字符串按照“/”，拆分成数组
      // 再利用递归算法，将数据构建成树形
      self.virtualTree = {
        name: 'root',
        children: []
      }
      let objArr = []
      for (let i = 0; i < self.tableData.length; i++) {
        if (self.tableData[i]['部门'].indexOf('/') === -1) {
          objArr.push([self.tableData[i]['部门']])
        } else {
          objArr.push(self.tableData[i]['部门'].split('/'))
        }
      }
      // 去掉字符串首尾的空格
      for (let x = 0; x < objArr.length; x++) {
        for (let y = 0; y < objArr[x].length; y++) {
          objArr[x][y] = objArr[x][y].replace(/(^\s*)|(\s*$)/g, '')
        }
      }
      console.log('处理好的数据是：', objArr)
      // 循环每一条数据，把长度为1的数据直接放到树的根节点
      for (let k = 0; k < objArr.length; k++) {
        if (objArr[k].length === 1) {
          // 这条数据长度只有一个
          if (self.checkExist(self.virtualTree.children, objArr[k][0]) === false) {
            self.virtualTree.children.push({
              label: objArr[k][0],
              name: objArr[k][0],
              children: []
            })
          }
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
          }
      	}
      }
      console.log('组装好的树是：', self.virtualTree)
      self.importDeptVisible = false
  	},
  	cancleImport () {
      let self = this
      self.importDeptVisible = false
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
              label: my,
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
	  $map(self.virtualTree)
    },
    // 查看节点是否存在
    checkExist (tree, obj) {
      let existFlag = false
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].name === obj) {
          existFlag = true
        }
      }
      return existFlag
    }
  }
}
</script>

<style rel="stylesheet/scss" lang='scss'>
.orgImportContainer {
	max-width: 100%;
  	min-height: 100%;
  	background: #FFFFFF;
  	padding: 10px;
  	
  	.el-tabs__content {
  		padding: 0 0 10px 0;
  	}
  	
  	.panel-title {
        /*height: 45px;*/
        line-height: 45px;
        width: 100%;
        text-transform: uppercase;
        padding: 0 10px;
        
        .fr {
        	float: right;
        }
        .fl {
        	float: left;
        }
        p {
        	margin: 0px;
        	text-align: left;
        }
        .excel-upload-input {
        	display: none;
        }
        .imageContent {
        	display: flex;
        	width: 100%;
        	height: 700px;
        	justify-content: space-around;
        	
        	.dividerItem {
        		width: 20%;
        		display: inline-block;
        		position: relative;
        		
        		.dividerLine {
        			position: absolute;
        			top: 50%;
        			width: 100%;
        			height: 1px;
        			border-bottom: 1px solid #efefef;
        			/*margin: auto 0;*/
        		}
        	}
        	.imageItem {
        		display: inline-block;
        		width: 50%;
        		&:last-child {
        			border-left: 1px solid #efefef;
        		}
        		/*text-align: center;*/
        		p {
        			text-align: center;
        		}
        		img {
        			/*width: 400px;*/
        			/*height: 400px;*/
        		}
        	}
        }
    }
    .import-org-dialog {
    	.el-dialog {
    		margin-top: 10vh !important;
    	}
    }
    .clearfix {
    	clear: both;
    }
    .tableContain {
    	/*width: 100%;*/
    	height: 100%;
    	width: auto;
    	/*padding: 0 10px;*/
    }
}
</style>
