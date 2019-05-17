<template>
<div class="orgExportContainer">
  <el-row class="panel-title">
  	<div class="fl">
      
    </div>
    <div class="fr">
      <el-button type="primary" size="small" plain @click="openExportOrg" icon="el-icon-upload2">导出组织</el-button>
    </div>
  </el-row>
  <el-tree ref="tree"
    :data="virtualTree"
    :props="defaultProps"
    :default-expand-all="true">
  </el-tree>
</div>
</template>

<script>
export default {
  name: 'orgexport',
  data () {
  	return {
      virtualTree: [{
        label: '中国',
        children: [{
          label: '黑龙江省',
          children: [{
          	label: '哈尔滨市',
          	children: [{
          	  label: '呼兰区',
          	  children: []
          	}, {
              label: '南岗区',
              children: [{
              	label: '哈站',
              	children: []
              }]
          	}, {
          	  label: '松北区',
          	  children: []
          	}]
          }, {
          	label: '齐齐哈尔市',
          	children: []
          }, {
          	label: '大庆市',
          	children: [{
              label: '大庆油田',
              children: []
          	}]
          }, {
          	label: '绥化市',
          	children: []
          }]
        }, {
          label: '吉林省',
          children: [{
          	label: '长春市',
          	children: []
          }, {
          	label: '吉林市',
          	children: []
          }]
        }, {
          label: '辽宁省',
          children: [{
          	label: '沈阳市',
          	children: []
          }, {
          	label: '大连市',
          	children: []
          }, {
          	label: '本溪市',
          	children: []
          }]
        }, {
          label: '北京市',
          children: [{
          	label: '朝阳区',
          	children: [{
              label: '樱花街道',
              children: [{
              	label: '中日友好医院',
              	children: []
              }]
          	}, {
          	  label: '和平街道',
          	  children: []
          	}]
          }, {
          	label: '海淀区',
          	children: [{
              label: '清华大学',
              children: []
          	}, {
              label: '北京大学',
              children: []
          	}, {
              label: '北京航空航天大学',
              children: []
          	}]
          }, {
          	label: '昌平区',
          	children: []
          }, {
          	label: '东城区',
          	children: []
          }, {
          	label: '西城区',
          	children: []
          }]
        }]
      }],
      defaultProps: [],
      importData: [] // 导出的数据是
  	}
  },
  created () {
  	
  },
  methods: {
  	openExportOrg () {
      let self = this
      // 处理数据
      // console.log('树形是：', self.virtualTree)
      let odata = []
      let treedata = {
      	label: 'root',
      	path: ['虚拟'],
      	children: self.virtualTree
      }
      // console.log('树形是2：', treedata)
      let $map = function (childs, path) {
      	for (let i = 0; i < childs.length; i++) {
          let item = childs[i]
          item.path = []
          item.path = item.path.concat(path)
          item.path.push(item.label)
          odata.push(item)
          if (item.children.length === 0) {
            console.log('当前节点无子节点')
          } else {
          	$map(item.children, item.path)
          }
      	}
      }
      $map(treedata.children, treedata.path)
      // console.log('处理好的数据是：', odata)
      // 把path项处理并传递给输出
      for (let j = 0; j < odata.length; j++) {
      	// 去掉path的第一项“虚拟”
      	odata[j].path.splice(0, 1)
      	self.importData.push({
          path: odata[j].path.join('/')
      	})
      }
      self.output()
  	},
  	output () {
      let self = this
      import('@/excel/Export2Excel').then(excel => {
        const tHeader = ['中国地理']
        const filterVal = ['path']
        const list = self.importData
        const data = self.formatJson(filterVal, list)
        excel.special_export_json_to_excel({
          header: tHeader,
          data,
          filename: '中国',
          autoType: true,
          bookType: 'xlsx'
        })
      })
  	},
  	formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang='scss'>
.orgExportContainer {
	max-width: 100%;
  	min-height: 100%;
  	background: #FFFFFF;
  	padding: 10px;
  	
  	.panel-title {
  		height: 45px;
  		line-height: 45px;
        width: 100%;
        text-transform: uppercase;
        padding: 0 10px;
        
        .fl {
        	float: left;
        }
        .fr {
	  		float: right;
	  	}
  	}
  	
}
</style>
