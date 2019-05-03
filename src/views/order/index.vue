<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.outTradeNo" placeholder="请输入订单号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.journalTitle" placeholder="请输入商品名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
      	<el-input v-model="dataForm.userName" placeholder="请输入用户名" clearable></el-input>
      </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="getDataList()">搜索</el-button>
        <!-- <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" v-loading="dataListLoading" @selection-change="selectionChangeHandle" stripe border style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column type="index" align="center" width="60" label="编号"></el-table-column>
      <el-table-column prop="outTradeNo" align="center" width="150" label="订单号"></el-table-column>
	  <el-table-column prop="journalTitle" align="center" width="150" label="商品名称"></el-table-column>
      <el-table-column align="center" label="商品图片">
      	<template slot-scope="scope">
      		<img v-bind:src="scope.row.journalImg" alt="" style="width: 50px;height: 50px"/>
      	</template>
      </el-table-column>
      <el-table-column align="center" label="价格">
      	<template slot-scope="scope">
      		{{scope.row.totalFee/100}}元
      	</template>
      </el-table-column>
      <el-table-column prop="createTime" align="center" width="180" label="订单生成时间"></el-table-column>
      <el-table-column align="center" label="支付情况">
      	<template slot-scope="scope">
          <el-tag v-if="scope.row.state === 1" size="small" type="danger">支付</el-tag>
          <el-tag v-else size="small">未支付</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="userName" align="center" width="90" label="用户名称"></el-table-column>
      <el-table-column fixed="right" width="200" label="操作">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-edit" @click="addOrUpdateHandle(scope.row.id)">详情</el-button>
          <el-button size="small" icon="el-icon-delete" :disabled="(scope.row.state)" @click="deleteHandle(scope.row.id)">删除</el-button>
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
  </div>
</template>

<script>
import API from '@/api';
import { mapMutations } from 'vuex';
import AddOrUpdate from './add-or-update';
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
		};
	},
	components: {
		AddOrUpdate
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
				outTradeNo: this.dataForm.outTradeNo,
				journalTitle: this.dataForm.journalTitle,
				userName: this.dataForm.userName
			};
			API.order.list(params).then(({ data }) => {
				if (data && data.code === 0) {
					this.dataList = data.list.list;
					console.log("dataList:",this.dataList)
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
				API.order.del(ids).then(({ data }) => {
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
		...mapMutations(['UPDATE_ORDER_ID', 'UPDATE_ORDER_URL'])
	}
};
</script>