<template>
  <div class="userDetailInfo">
    <div class="title">
      <a class="left">基本信息</a>
      <a class="el-icon-edit el-icon--right right" @click="editInfo" v-show="!edit">
        <span>编辑</span>
      </a>
      <a v-show="edit"> 
        <span class="right" @click="cancelEdit">取消</span>
        <span class="fa fa-save right" @click="saveInfo" >保存</span>
      </a>
    </div>
    <div class="info">
      <div class="item">
        <span class="infoKey">ID</span>
        <div class="infoValue">
          <a>{{ workerInfo.id }}</a>
        </div>
      </div>
      <div class="item">
        <span class="infoKey">权限</span>
        <div class="infoValue">
          <a>超级管理员</a>
        </div>
      </div>
      <div class="item">
        <span :class="{ active: edit }">姓名</span>
        <div class="infoValue" v-show="!edit">
          <a>{{ workerInfo.name }}</a>
        </div>
        <input v-model="tempWorkerInfo.name" v-show="edit" />
      </div>
      <div class="item">
        <span :class="{ active: edit }">性别</span>
        <div class="infoValue" v-show="!edit">
          <a>{{ workerInfo.sex_text }}</a>
        </div>
        <input v-model="tempWorkerInfo.sex_text" v-show="edit" />
      </div>
      <div class="item">
        <span :class="{ active: edit }">邮箱</span>
        <div class="infoValue" v-show="!edit">
          <a>{{ workerInfo.email }}</a>
        </div>
        <input v-model="tempWorkerInfo.email" v-show="edit" />
      </div>
      <div class="item">
        <span :class="{ active: edit }">联系方式</span>
        <div class="infoValue" v-show="!edit">
          <a>{{ workerInfo.phone }}</a>
        </div>
        <input v-model="tempWorkerInfo.phone" v-show="edit" />
      </div>
      <div class="item">
        <span :class="{ active: edit }">身份证</span>
        <div class="infoValue" v-show="!edit">
          <a>{{ workerInfo.cardId }}</a>
        </div>
        <input v-model="tempWorkerInfo.cardId" v-show="edit" />
      </div>
      <div class="item">
        <span class="infoKey">上次登录时间</span>
        <div class="infoValue">
          <a>{{ workerInfo.date }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookie from "js-cookie";
import { changeUserInfo } from "@/api/api";

export default {
  name: "userDetailInfo",
  data() {
    return {
      workerInfo: {},
      tempWorkerInfo: {},
      edit: false,
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
    this.tempWorkerInfo = {...this.workerInfo};
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
            changeUserInfo(this.workerInfo).then( (res) => {
                if(res.status === 200){
                    this.$message.success("信息修改成功");
                }else{
                    this.$message.error("信息修改失败");
                }
            })
        })
        .catch(() => {
          this.edit = false;
          this.$message({
            type: "info",
            message: "已取消修改",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.userDetailInfo {
  width: 100%;
  .title {
    display: flex;
    justify-content: space-between;
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
    .right {
        font-size: 12px;
      color: #006bf7;
      margin-right: 30px;
      cursor: pointer;
    }
  }
  .info {
    display: flex;
    flex-wrap: wrap;
    padding: 0 30px;
    margin: 20px auto;
    justify-content: space-between;
    .item {
      width: 47%;
      margin-bottom: 30px;
    }
    span {
      font-size: 14px;
      line-height: 40px;
      color: rgb(167, 167, 167);
    }
    .active {
      color: #006bf7;
    }
    .infoValue {
      background-color: #f8f9fd;
      padding-left: 20px;
      border-radius: 6px;
      a {
        font-size: 13px;
        color: rgb(53, 53, 53);
        line-height: 40px;
      }
    }
    input {
      width: 93%;
      height: 36px;
      border-radius: 6px;
      border: 1px rgb(230, 230, 230) solid;
      padding-left: 20px;
      color: rgb(53, 53, 53);
      font-size: 13px;
    }
    input:focus {
      outline: 0;
      border: 1px #2483ff solid;
    }
  }
}
</style>