<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px" style="padding-right: 40px;">
      <el-form-item label="杂志名称" prop="title">
        <el-input v-model="dataForm.title" placeholder="请输入杂志名称"></el-input>
      </el-form-item>
      <el-form-item label="杂志封面图">
      	<img v-bind:src="dataForm.coverImg" alt="" style="width: 150px;height: 150px"/>
      	<el-upload
		  :action="requestUrl('/api/common/save_file')"
		  :show-file-list=false
		  :on-success="onSuccess">
		  <el-button size="small" type="primary">点击上传</el-button>
		</el-upload>
      </el-form-item>
      

      <el-form-item label="杂志概述" prop="summary">
        <el-input v-model="dataForm.summary" placeholder="请输入杂志概述" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="dataForm.price" placeholder="请输入价格">
        </el-input>
      </el-form-item>
      <el-form-item label="评分" prop="point">
        <el-input v-model="dataForm.point" placeholder="请输入评分">
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import API from '@/api';
import { isURL } from '@/utils/validate';
import requestUrl from '@/api/requestUrl'
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
				title: '',
				summary: '',
				coverImg: '',
				viewNum: '',
				point: '',
				price: ''
			},
			dataRule: {
				title: [
					{ required: true, message: '杂志名称不能为空', trigger: 'blur' }
				],
				summary: [
					{ required: true, message: '模块名称不能为空', trigger: 'blur' }
				],
				price: [
					{ required: true, message: '模块名称不能为空', trigger: 'blur' }
				]
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
					API.magazine.info(this.dataForm.id).then(({ data }) => {
						console.log('data', data);
						if (data && data.code === 0) {
							this.dataForm.id = data.data.id;
							this.dataForm.title = data.data.title;
							this.dataForm.summary = data.data.summary;
							this.dataForm.coverImg = data.data.coverImg;
							this.dataForm.viewNum = data.data.viewNum;
							this.dataForm.point = data.data.point;
							this.dataForm.price = data.data.price/100;
						}
					});
				}else{
					this.dataForm.title = '';
					this.dataForm.summary = '';
					this.dataForm.coverImg = '';
					this.dataForm.viewNum = '';
					this.dataForm.point = '';
					this.dataForm.price = '';
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
						price: this.dataForm.price*100,
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
		},
		requestUrl,
		onSuccess (response, file, fileList) {
			console.log("onSuccess: ", response, file, fileList)
			this.dataForm.coverImg = response
		}
	}
};
</script>
