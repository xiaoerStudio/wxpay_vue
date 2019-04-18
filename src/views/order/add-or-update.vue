<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '订单详情'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px" style="padding-right: 40px;">
      <el-form-item label="订单号" prop="outTradeNo">
        <el-input v-model="dataForm.outTradeNo" placeholder="请输入杂志概述" type="textarea" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="杂志名称" prop="journalTitle">
        <el-input v-model="dataForm.journalTitle" placeholder="请输入杂志名称" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="杂志封面图">
      	<img v-bind:src="dataForm.journalImg" alt="" style="width: 150px;height: 150px"/>
      </el-form-item>
      <el-form-item label="订单金额" prop="totalFee">
        <el-input placeholder="请输入价格" v-model="dataForm.totalFee/100" :disabled="true">
        </el-input>
      </el-form-item>
      <el-form-item label="订单产生时间" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder="请输入评分" :disabled="true">
        </el-input>
      </el-form-item>
      <el-form-item label="订单用户" prop="userName">
        <el-input v-model="dataForm.userName" :disabled="true">
        </el-input>
      </el-form-item>
      <el-form-item label="产生订单地址" prop="ip">
        <el-input v-model="dataForm.ip" :disabled="true">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <!-- <el-button type="primary" @click="dataFormSubmit()">确定</el-button> -->
    </span>
  </el-dialog>
</template>

<script>
import API from '@/api';
import { isURL } from '@/utils/validate';
export default {
	data() {
		// 验证规则
		var validateAcquisitionURL = (rule, value, callback) => {
			if (isURL(value)) {
				callback();
			} else {
				callback(new Error('请输入有效的网址'));
			}
		};
		return {
			visible: false,
			dataForm: {
				id: 0,
				journalTitle: '',
				journalImg: '',
				outTradeNo: '',
				totalFee: '',
				userName: '',
				ip: ''
			}
		};
	},
	methods: {
		// 初始化表单数据
		init(id) {
			this.dataForm.id = id || 0;
			this.visible = true;
			this.$nextTick(() => {
				console.log("this.id")
				this.$refs['dataForm'].resetFields();
				if (this.dataForm.id) {
					API.order.info(this.dataForm.id).then(({ data }) => {
						console.log('data', data);
						if (data && data.code === 0) {
							this.dataForm.id = data.data.id;
							this.dataForm.journalTitle = data.data.journalTitle;
							this.dataForm.outTradeNo = data.data.outTradeNo;
							this.dataForm.journalImg = data.data.journalImg;
							this.dataForm.userName = data.data.userName;
							this.dataForm.createTime = data.data.createTime;
							this.dataForm.totalFee = data.data.totalFee;
							this.dataForm.ip = data.data.ip;
						}
					});
				}
			});
		},
		// 表单提交
		dataFormSubmit() {
			this.$refs['dataForm'].validate(valid => {
				if (valid) {
					var params = {
						id: this.dataForm.id || undefined,
						title: this.dataForm.title,
						summary: this.dataForm.summary,
						coverImg: this.dataForm.coverImg,
						price: this.dataForm.price,
						point: this.dataForm.point,
						viewNum: this.dataForm.viewNum,
					};
					var tick = !this.dataForm.id
						? API.magazine.add(params)
						: API.magazine.update(params);

					tick.then(({ data }) => {
						if (data && data.code === 0) {
							this.$message({
								message: '操作成功',
								type: 'success',
								duration: 1500,
								onClose: () => {
									this.visible = false;
									this.$emit('refreshDataList');
								}
							});
						} else {
							this.$message.error(data.msg);
						}
					});
				}
			});
		}
	}
};
</script>
