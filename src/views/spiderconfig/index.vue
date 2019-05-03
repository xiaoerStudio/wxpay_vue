<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.title" placeholder="请输入杂志名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="getDataList()">搜索</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" v-loading="dataListLoading" @selection-change="selectionChangeHandle" stripe border style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column type="index" align="center" width="60" label="编号"></el-table-column>
      <el-table-column prop="title" align="center" width="150" label="杂志名称"></el-table-column>
      <!-- <el-table-column prop="summary" align="center" label="概述"></el-table-column> -->
<!--       <el-table-column prop="coverImg" align="center" label="封面图"></el-table-column> -->
      <el-table-column align="center" label="封面图">
      	<template slot-scope="scope">
      		<img v-bind:src="scope.row.coverImg" alt="" style="width: 50px;height: 50px"/>
      	</template>
      </el-table-column>
      <el-table-column align="center" label="价格">
      	<template slot-scope="scope">
      		{{scope.row.price/100}}元
      	</template>
      </el-table-column>
      <el-table-column prop="point" align="center" label="评分"></el-table-column>
      <el-table-column align="center" label="是否上线">
      	<template slot-scope="scope">
          <el-tag v-if="scope.row.online === 0" size="small" type="danger">预售</el-tag>
          <el-tag v-else size="small">在售</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="400" label="操作">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
          <el-button size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)">删除</el-button>
          <el-button size="small" width="100" :type="scope.row.online ? 'success' : ''" @click="audite(scope.row.id)">{{scope.row.online ? '取消上线' : '审核上线'}}</el-button>
           <el-button size="small" icon="el-icon-edit" :disabled="(!scope.row.online)" @click="subscribeHandle(scope.row.id)">订阅</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <subscribe v-if="subscribeVisible" ref="subscribe" @refreshDataList="getDataList"></subscribe>
  </div>
</template>

<script>
import API from '@/api';
import { mapMutations } from 'vuex';
import AddOrUpdate from './add-or-update';
import Subscribe from './subscribe';
export default {
	data() {
		return {
			dataForm: {
				key: ''
			},
			dataList: [],
			pageIndex: 1,
			pageSize: 10,
			totalPage: 0,
			dataListLoading: false,
			dataListSelections: [],
			addOrUpdateVisible: false,
			subscribeVisible: false,
		};
	},
	components: {
		AddOrUpdate,
		Subscribe
	},
	activated() {
		this.getDataList();
	},
	methods: {
		// 获取数据列表
		getDataList() {
			this.dataListLoading = true;
			var params = {
				page: this.pageIndex,
				limit: this.pageSize,
				title: this.dataForm.title
			};
			API.magazine.list(params).then(({ data }) => {
				if (data && data.code === 0) {
					this.dataList = data.list.list;
					this.totalPage = data.list.totalCount;
				} else {
					this.dataList = [];
					this.totalPage = 0;
				}
				this.dataListLoading = false;
			});
		},
		// 每页数
		sizeChangeHandle(val) {
			this.pageSize = val;
			this.pageIndex = 1;
			this.getDataList();
		},
		// 当前页
		currentChangeHandle(val) {
			this.pageIndex = val;
			this.getDataList();
		},
		// 多选
		selectionChangeHandle(val) {
			this.dataListSelections = val;
		},
		// 新增 / 修改
		addOrUpdateHandle(id) {
			this.addOrUpdateVisible = true;
			this.$nextTick(() => {
				this.$refs.addOrUpdate.init(id);
			});
		},
		// 订阅
		subscribeHandle(id) {
			this.subscribeVisible = true;
			this.$nextTick(() => {
				this.$refs.subscribe.init(id);
			});
		},
		audite(id){
			console.log("id:",id);
			var id = id;
			this.$confirm(
				`确定对[id=${id}]进行操作?`,
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log("13ssds",id)
				API.magazine.toExamine({ id: id }).then(({ data }) => {
					if (data && data.code === 0) {
						this.$message({
							message: '操作成功',
							type: 'success',
							duration: 1500,
							onClose: () => {
								this.getDataList();
							}
						});
					} else {
						this.$message.error(data.msg);
					}
				});
			});
		},
		// 删除
		deleteHandle(id) {
			var ids = id
				? [id]
				: this.dataListSelections.map(item => {
						return item.id;
				  });
			this.$confirm(
				`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}
			).then(() => {
				API.magazine.del(ids).then(({ data }) => {
					if (data && data.code === 0) {
						this.$message({
							message: '操作成功',
							type: 'success',
							duration: 1500,
							onClose: () => {
								this.getDataList();
							}
						});
					} else {
						this.$message.error(data.msg);
					}
				});
			});
		},
		...mapMutations(['UPDATE_SPIDER_ID', 'UPDATE_SPIDER_URL'])
	}
};
</script>