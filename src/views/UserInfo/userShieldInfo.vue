<template>
  <div class="userShieldInfo">
    <div class="title">
      <a class="left">安全等级</a>
    </div>
    <div class="info">
      <div class="item">
        <div class="leftInfo">
          <a class="infoKey">密码等级</a>
          <span class="infoval"
            >安全性高的密码可以使账户更安全。建议定期更改密码</span
          >
        </div>
        <div class="rightInfo">
          <a class="fa fa-check-circle " v-show="bandAccount"></a>
          <a>已设置</a> 
          <a class="line">l</a>
          <a class="handel" v-show="bandAccount" @click="handelInfo('1')">立即修改</a>
        </div>
      </div>
      <div class="item">
        <div class="leftInfo">
          <a class="infoKey">手机绑定：{{ workerInfo.phone }}</a>
          <span class="infoval"
            >绑定手机号码，账户安全问题实时通知</span
          >
        </div>
        <div class="rightInfo">
          <div v-show="workerInfo.phoneBandAccount">
            <a class="fa fa-check-circle"></a>
            <a>已设置</a> 
            <a class="line">l</a>
            <a class="handel" >立即修改</a>
          </div>
          <div v-show="!workerInfo.phoneBandAccount">
            <a class="fa fa-exclamation-triangle" ></a>
            <a>未绑定</a> 
            <a class="line">l</a>
            <a class="handel" @click="handelInfo('2')">立即绑定</a>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="leftInfo">
          <a class="infoKey">邮箱绑定：{{ workerInfo.email }}</a>
          <span class="infoval"
            >为了您的账户安全，请绑定邮箱</span
          >
        </div>
        <div class="rightInfo">
          <div v-show="workerInfo.emailBandAccount">
            <a class="fa fa-check-circle"></a>
            <a>已设置</a> 
            <a class="line">l</a>
            <a class="handel" @click="handelInfo('3')">立即修改</a>
          </div>
          <div v-show="!workerInfo.emailBandAccount">
            <a class="fa fa-exclamation-triangle" ></a>
            <a>未绑定</a> 
            <a class="line">l</a>
            <a class="handel">立即绑定</a>
          </div>
        </div>
      </div>
    </div>
    <!-- dialog、form表单 -->
    <el-dialog
      :title="state"
      :visible.sync="isShow"
      :modal-append-to-body="false"
      append-to-body
      :close-on-click-modal="false"
    >
      <CommerForm
        class="CommerForm"
        ref="form"
        :form="form"
        :formLabel="formLabel"
        :uploadingStatus="uploadingStatus"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit(form)">提交</el-button>
        <el-button @click="offSubmit">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookie from "js-cookie";
import { changeUserInfo } from "@/api/api";
import CommerForm from "@/components/commer/CommerForm";

export default {
  name: "userShieldInfo",
  components: { CommerForm },
  data() {
    return {
      workerInfo: {},
      edit: false,
      bandAccount: true,

      // form表头
      state: "",
      isShow: false,
      uploadingStatus: false /* 文件上传是否显示 */,
      // form表头
      formLabel: [],
      // form数据
      form: {},
    };
  },
  created() {
    this.workerInfo = JSON.parse(Cookie.get("userInfo"));
    this.workerInfo.sex === 0
      ? (this.workerInfo.sex_text = "男")
      : (this.workerInfo.sex_text = "女");
  },
  methods: {
    // 修改信息
    editInfo() {
      this.edit = true;
      this.tempWorkerInfo = { ...this.workerInfo };
    },
    // 取消
    cancelEdit() {
      this.$confirm("确认放弃修改用户信息吗？")
        .then(() => {
          this.edit = false;
        })
        .catch();
    },
    // 保存
    saveInfo() {
      this.$confirm("确认修改用户信息吗？")
        .then(() => {
          this.edit = false;
          this.tempWorkerInfo.sex_text === "男"
            ? (this.tempWorkerInfo.sex = "0")
            : (this.tempWorkerInfo.sex = "1");
          this.workerInfo = this.tempWorkerInfo;
          changeUserInfo(this.workerInfo).then((res) => {
            if (res.status === 200) {
              this.$message.success("信息修改成功");
            } else {
              this.$message.error("信息修改失败");
            }
          });
        })
        .catch(() => {
          this.edit = false;
          this.$message({
            type: "info",
            message: "已取消修改",
          });
        });
    },
    // 提交
    onSubmit(){
       this.$confirm("确认修改信息吗？")
        .then(() => {
      this.isShow = false;
      this.formLabel = [];
      this.form = {};
            changeUserInfo(this.form).then( (res) => {
                if(res.status === 200){
                    this.$message.success("信息修改成功");
                }else{
                    this.$message.error("信息修改失败");
                }
            })
        })
        .catch(() => {
      this.isShow = false;
      this.formLabel = [];
      this.form = {};
          this.$message({
            type: "info",
            message: "已取消修改",
          });
        });
    },
    // 取消
    offSubmit(){
      this.isShow = false;
      this.formLabel = [];
      this.form = {};
    },
    // 传入form数据
    handelInfo(val){
      if(val === "1"){
        this.state = "修改密码";
        this.formLabel = [
        {
          model: "oldPassWord",
          label: "当前密码",
          type: "input",
        },
        {
          model: "newPassWord",
          label: "新密码",
          type: "input",
        },
        {
          model: "checkNewPassWord",
          label: "确认密码",
          type: "input",
        },
        ];
        this.form = {
          oldPassWord: "",
          newPassWord: "",
          checkNewPassWord: "",
        };
      }else if(val === "2"){
        this.state = "手机绑定";
        this.formLabel = [
        {
          model: "phone",
          label: "手机号码",
          type: "input",
        },
        {
          model: "PassWord",
          label: "确认密码",
          type: "input",
        },
        ];
        this.form = {
          phone: "",
          PassWord: "",
        };
      }else if(val === "3"){
        this.state = "邮箱绑定";
        this.formLabel = [
        {
          model: "oldEmail",
          label: "当前邮箱",
          type: "input",
        },
        {
          model: "newEmail",
          label: "新邮箱",
          type: "input",
        },
        {
          model: "checkPassWord",
          label: "确认密码",
          type: "input",
        },
        ];
        this.form = {
          oldEmail: "",
          newEmail: "",
          checkPassWord: "",
        };
      };
      this.isShow = true;
    },
  },
};
</script>

<style lang="less" scoped>
.userShieldInfo {
  width: 100%;
  .title {
    border-bottom: 1px rgb(230, 230, 230) solid;
    a {
      line-height: 60px;
    }
    .left {
      font-size: 14px;
      color: rgb(53, 53, 53);
      margin-left: 30px;
      font-weight: 600;
    }
  }
  .info {
    padding: 0 30px;
    margin-top: 40px;
    .item {
      margin-bottom: 20px;
      padding-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    border-bottom: 1px rgb(235, 235, 235) solid;
      .leftInfo {
        a {
          font-size: 14px;
          line-height: 30px;
          color: rgb(53, 53, 53);
          display: block;
        }
        .infoval {
          font-size: 13px;
          line-height: 30px;
          color: rgb(167, 167, 167);
          display: block;
        }
      }
      .rightInfo {
        text-align: center;
        .fa-check-circle{
          color: #09af8b;
      margin-right: 10px;
        }
        .fa-exclamation-triangle{
          margin-right: 10px;
          color: #ffb701;
        }
        a {
          font-size: 13px;
          line-height: 30px;
          color: rgb(53, 53, 53);
        }
        .line{
          color: rgb(168, 168, 168);
          display: inline-block;
          font-size: 13px;
          margin: 0 10px;
        }
        .handel{
          color: #006bf7;
        }
      }
    }
  }
}
</style>