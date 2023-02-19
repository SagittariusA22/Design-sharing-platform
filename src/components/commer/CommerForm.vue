<template>
  <el-form ref="form" :model="form" label-width="120px" class="commerForm">
    <!-- input -->
    <el-form-item
      v-for="item in formLabel"
      :key="item.label"
      :label="item.label"
    >
      <el-input
        v-if="item.type === 'input'"
        v-model="form[item.model]"
        :placeholder="'请输入' + item.label"
      ></el-input>

      <!-- select -->
      <el-select
        v-if="item.type === 'select'"
        v-model="form[item.model]"
        :placeholder="'请选择' + item.label"
      >
        <el-option
          v-for="opt in item.opts"
          :key="opt.label"
          :label="opt.label"
          :value="opt.value"
        ></el-option>
      </el-select>

      <!-- datePicker -->
      <el-col :span="11">
        <el-date-picker
          v-if="item.type === 'datePicker'"
          placeholder="选择日期"
          v-model="form[item.model]"
          :style="{ width: item.width }"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-col>

      <!-- switch -->
      <el-switch
        v-if="item.type === 'switch'"
        v-model="form[item.model]"
      ></el-switch>

      <!--checkbox  -->
      <el-checkbox-group
        v-model="form[item.model]"
        v-if="item.type === 'checkbox'"
      >
        <el-checkbox
          v-for="opt in item.opts"
          :key="opt.label"
          :label="opt.label"
        ></el-checkbox>
      </el-checkbox-group>

      <!-- radio -->
      <el-radio-group v-model="form[item.model]" v-if="item.type === 'radio'">
        <el-radio
          v-for="opt in item.opts"
          :key="opt.label"
          :label="opt.value"
          >{{ opt.label }}</el-radio
        >
      </el-radio-group>

      <!-- textarea -->
      <el-input
        v-if="item.type === 'textarea'"
        type="textarea"
        v-model.lazy="form[item.model]"
        :rows="2"
        style="width:500px"
        resize="none"
      ></el-input>
      <slot></slot>
    </el-form-item>
    <!-- uploading -->
    <div class="uploading" v-if="uploadingStatus">
      <span>{{ picLabel }}</span>
      <div class="icon">
        <el-upload
          v-loading="loading"
          class="resetDialog"
          ref="upload"
          action="action"
          list-type="picture-card"
          :auto-upload="false"
          multiple
          :on-success="successUp"
          :on-error="errorUp"
          :headers="token"
          :show-file-list="true"
          :file-list="fileList"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{ file }">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt="效果图"
            />
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
          <img width="100%" :src="this.dialogImageUrl" alt="效果图" />
        </el-dialog>
        <el-button
          style="margin: 0 0 10px 10px"
          size="mini"
          type="success"
          @click="submitUpload"
          plain
          >上传到服务器</el-button
        >
      </div>
    </div>
  </el-form>
</template>

<script>
export default {
  name: "CommerForm",
  props: {
    form: Object /* 表单数据 */,
    formLabel: Array /* 表单表头 */,
    uploadingStatus: Boolean /* 文件上传是否显示 */,
    picLabel: String /* 文件上传的表头*/,
    action: String /* 文件上传接口 */,
    backPic: Object /* 文件上传接口 */,
  },
  data() {
    return {
      // 图片上传
      loading: false,
      dialogImageUrl: [],
      dialogVisible: false,
      disabled: false,
      token: { Authorization: localStorage.token },
      fileList: [],
    };
  },
  methods: {
    // 上传前删除图片
    handleRemove(file) {
      this.$confirm(`确认删除${file.name}?`).then(() => {
        //indexOf找出图片的索引、删掉
        const arr = this.$refs.upload.uploadFiles;
        const index = arr.indexOf(file);
        arr.splice(index, 1);
        this.$message.success("图片删除成功");
      });
    },
    // 上传图片
    submitUpload() {
      //图片不能为空
      if (this.$refs.upload.uploadFiles.length) {
        this.loading = true;
        this.$refs.upload.submit();
      } else {
        this.$message.error("上传的图片不能为空");
      }
    },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    successUp(res) {
      this.loading = false;
      const { meta } = res;
      if (meta.status === 200) {
        this.$message.success("meta.msg");
        // 拼接得到图片信息,传入form
        const picInfo = { pic: res.data.tmp_path };
        this.form.displayImg.push(picInfo);
      } else {
        this.$message.error("meta.msg");
      }
    },
    errorUp(err) {
      this.loading = false;
      this.$message.error("err.msg");
    },
    // 清除文件缩略图显示的缓存
    resetFileList() {
      // 清除缓存
      // this.$refs.upload.uploadFiles = [];
      // 清除预览的缓存，让编辑项目回显图片时之前的图片被清空
      this.fileList = [];
    },
  },
  mounted() {
    // 清除文件缩略图
    this.$bus.$on("resetPics", this.resetFileList);
    // 编辑项目图片回显
    this.$bus.$on("showPic", (val) => {
      this.resetFileList;
      this.fileList.push(val);

    }); 
  },
  beforeDestroy() {
    this.$bus.$off(["resetPics", "showPic"]); //解绑多个事件总线事件
  },
};
</script>

<style lang="less" scoped>
.el-input,
.el-col {
  width: 216px;
}
// 图片上传
.uploading {
  align-items: center;
  display: flex;
  span {
    display: inline;
    margin-right: 14px;
    margin-left: 51px;
  }
}
.icon {
  border: 1px #dbdfe6 solid;
  border-radius: 4px;
  width: 500px;
  /deep/ .el-upload--picture-card {
    margin: 10px 0 10px 10px;
    width: 60px;
    height: 60px;
  }
  /deep/ .el-upload {
    margin: 10px 0 10px 10px;
    width: 60px;
    height: 60px;
    line-height: 60px;
  }
  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    margin: 10px 0 10px 10px;
    width: 60px;
    height: 60px;
    line-height: 60px;
  }
  /deep/ .el-upload-list--picture-card .el-upload-list__item-thumbnail {
    // margin: 10px 0 10px 10px;
    width: 60px;
    height: 60px;
    line-height: 60px;
    object-fit: cover;
  }
  /deep/ .avatar {
    margin: 10px 0 10px 10px;
    width: 60px;
    height: 60px;
  }
  .el-upload-list__item-actions {
    margin-left: 0;
    margin-right: 0;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: space-around;
  }
  .el-upload-list__item-preview {
    font-size: 16px;
    margin-right: 0;
    margin-left: 0;
  }
  .el-upload-list__item-delete {
    font-size: 16px;
    margin-right: 0;
    margin-left: 0;
  }
  // /deep/.el-upload-list__item.is-success {
  //   display: none;
  // }
}
</style>