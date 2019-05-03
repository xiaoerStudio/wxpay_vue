<template>
  <el-dialog
    title="订阅支付"
    :close-on-click-modal="false"
    :label-width="100"
    :visible.sync="visible">
    <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px" style="padding-right: 40px;">
      <h3 :text-align="center">订单有效时间10分钟</h3>
      <el-form-item>
      	<img id="backgroundImg" :src="dataForm.url" style="width: 400px;height: 400px"/>
      </el-form-item>
     
    </el-form>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span> -->
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
				url: '',
				summary: '',
				coverImg: '',
				viewNum: '',
				point: '',
				price: ''
			}
		};
	},
	methods: {
		getBase64ImageUrl: function(){
			// 解决二维码问题 todo
		},
		// 初始化表单数据
		init(id) {
			this.dataForm.id = id || 0;
			this.visible = true;
			this.$nextTick(() => {
				this.$refs['dataForm'].resetFields();
				if (this.dataForm.id) {
					API.magazine.loadImg({journalId:this.dataForm.id}).then((res) => {
					console.log(res)
						// this.dataForm.url = res.data;
						var img = document.getElementById('backgroundImg')
						img.src = URL.createObjectURL(res.data)
						window.setTimeout(() => {
							window.URL.revokeObjectURL(res.data)
						})
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
