<template>
  <div class="administrator">
    <div class="lists">
      <div class="graphics">
        <div class="icon fa fa-address-book"></div>
        <span> 管理员分组</span>
      </div>
      <div class="btn">
        <el-select v-model="adminType" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button
          @click="addProject"
          type="primary"
          size="mini"
          class="addProject"
          plain
          >添加管理员</el-button
        >
      </div>
    </div>
    <!-- input -->
    <div class="inputMenu">
      <div class="search">
        <div class="searchInput">
          <div class="outerbox">
            <el-input
              class="input"
              ref="input"
              v-model="keyword"
              :placeholder="placeholder"
              size="mini"
              @keyup.enter.native="searchDate($event)"
              @focus="getInputFocus($event)"
              @blur="removeBlur()"
            >
            </el-input>
            <span class="fa fa-search searchIcon" @click="searchDate"></span>
          </div>
          <div class="historyMenu" v-show="showSrarchMenu">
            <div class="title">
              <span>历史搜索</span>
              <span
                class="fa fa-trash deleteIcon"
                @click="clearHistoryLists"
              ></span>
            </div>
            <ul class="historyLists">
              <li
                class="historyListsItem"
                v-for="(item, index) in historyList"
                :key="index"
                @click="goSearchDetail(item)"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
        <el-button
          type="primary"
          size="mini"
          class="searchButton"
          @click="resetInput"
          plain
        >
          重置</el-button
        >
      </div>
      <!-- handelLists -->
      <div class="handelLists" v-permission="'add'">
        <el-button
          type="danger"
          size="mini"
          class="delButton"
          @click="delChecklists"
          plain
        >
          解除已选</el-button
        >
        <div class="selectText">
          <span>全选</span>
          <input type="checkbox" v-model="checkAll" />
          <div class="verticalLine"></div>
          <span
            >已选择 {{ checkedId.length }} / 全部 {{ workerLists.length }}
          </span>
        </div>
      </div>
    </div>
    <div class="inputFixed">
      <div class="workerLists">
        <div class="loading">
          <a class="fa fa-spinner" v-show="loading"></a>
          <span v-show="loading">{{ msg }}</span>
        </div>
        <div class="end">
          <a class="fa fa-exclamation-circle" v-show="end"></a>
          <span v-show="end">{{ loadingEndMsg }}</span>
        </div>
        <div v-if="listShwo">
          <div class="info" v-for="item in workerLists" :key="item.cardId">
            <input
              type="checkbox"
              class="delCheckItem"
              v-model="checkedId"
              :value="item"
            />
            <div>
              <span class="workerImg">AD</span>
            </div>
            <div class="materailText name">
              <a class="workerTitle">姓名</a>
              <a
                class="workerTitleInfo"
                v-html="highlight(item.name) || '-'"
              ></a>
            </div>
            <div class="materailText email">
              <a class="workerTitle">权限</a>
              <a class="workerTitleInfo">{{ item.power || "-" }}</a>
            </div>
            <div class="materailText phone">
              <a class="workerTitle">联系方式</a>
              <a
                class="workerTitleInfo"
                v-html="highlight(item.phone) || '-'"
              ></a>
            </div>
            <div class="materailText email">
              <a class="workerTitle">邮箱</a>
              <a class="workerTitleInfo">{{ item.email || "-" }}</a>
            </div>
            <div class="materailText timer">
              <a class="workerTitle">上次登录时间</a>
              <a class="workerTitleInfo">{{ item.date || "-" }}</a>
            </div>
            <el-button
              class="deleteBtn"
              @click="delItem(item.id, item.name)"
              style="padding: 5px 6px"
              type="danger"
              plain
              size="mini"
              v-permission="'delete'"
              >解除权限</el-button
            >
          </div>
        </div>
      </div>
    </div>
    <!-- dialog、form表单 -->
    <el-dialog
      title="新增管理员信息"
      :visible.sync="isShow"
      :modal-append-to-body="false"
      append-to-body
      :close-on-click-modal="false"
    >
      <div style="text-align: center">
        <el-transfer
          style="text-align: left; display: inline-block"
          v-model="value4"
          filterable
          filter-placeholder="请输入姓名"
          target-order="unshift"
          :titles="['普通员工', adminTitle]"
          :button-texts="['', '']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}',
          }"
          :data="allWorker"
        >
          <span slot-scope="{ option }"
            >{{ option.key }} - {{ option.label }}</span
          >
        </el-transfer>
      </div>
      <div class="dialog-footer">
        <el-button type="primary" @click="onSubmit()" size="mini"
          >提交</el-button
        >
        <el-button @click="offSubmit" size="mini">取消</el-button>
      </div>
    </el-dialog>
    <el-footer>
      <footerMsg />
    </el-footer>
  </div>
</template>
<script>
import footerMsg from "@/components/footerMsg";
import permission from "@/directives/permission";
import {
  setHistoryAllList,
  getHistoryAllList,
  removeHistoryAllList,
} from "@/Utils/historyList";
import {
  getWorkerLists,
  changeWorkerLists,
  getAdminLists,
  delAdmin,
} from "@/api/api";

export default {
  name: "administrator",
  components: { footerMsg },
  // 自定义指令
  directives: { permission },
  data() {
    return {
      // 所有员工名单
      allWorker: [],
      // 管理员名单
      value4: [],
      adminTitle: "项目管理员",

      // select选项
      options: [
        {
          value: "1",
          label: "项目管理员",
        },
        {
          value: "0",
          label: "超级管理员",
        },
      ],
      adminType: "1",

      //人员数据
      workerLists: [],
      // 请求状态
      msg: "正在加载中",
      loading: true,
      loadingEndMsg: "无更多数据",
      //  无更多数据
      end: false,
      // 删除数据
      checkedId: [],
      // 列表展示
      listShwo: true,
      keyword: "",
      // 搜索栏数据//
      placeholder: "请输入姓名 / 手机号码 ",
      // 历史记录//
      showSrarchMenu: false,
      historyList: ["182"],
      //管理员权限data
      isShow: false,
    };
  },

  created() {
    // 请求管理员数据//
    this.getProjectData(this.adminType);
    // 添加管理员时获取全部员工信息
    this.getAllWorker();
  },

  methods: {
    // 请求员工数据//
    getAllWorker() {
      getWorkerLists().then((res) => {
        if (res.data.data.length === 0) {
          this.end = true;
          return;
        }
        this.allWorker = res.data.data;
        this.allWorker.forEach((item) => {
          item.label = item.name;
        });
      });
    },
    // 请求管理员数据//
    getProjectData(val) {
      this.end = false;
      this.loading = true;
      this.listShwo = false;
      getAdminLists(val).then((res) => {
        this.loading = false;
        if (res.data.data.length === 0) {
          this.end = true;
          return;
        }
        this.workerLists = res.data.data;
        this.listShwo = true;
        this.workerLists.forEach((item) => {
          // 不要修改原数据
          item.power === "0"
            ? (item.power = "超级管理员")
            : (item.power = "项目管理员");
        });
      });
    },
    // 删除管理员数据//
    delItem(val, name) {
      this.$confirm(`解除 ${name} 的权限, 是否继续?`, { type: "warning" })
        .then(() => {
          delAdmin(val).then((res) => {
            this.checkedId = [];
            if (res.data.status === 200) {
              this.$message({
                type: "success",
                message: "解除成功!",
              });
              if (res.data.data.length === 0) {
                this.end = true;
              }
              this.workerLists = res.data.data;
              this.workerLists.forEach((item) => {
                item.power === "0"
                  ? (item.power = "超级管理员")
                  : (item.power = "项目管理员");
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 提交按钮,新增管理员//
    onSubmit() {
      this.$confirm("确认更新管理员名单吗?").then(() => {
        let arr = [];
        if (!this.value4.length) {
          this.isShow = false;
          this.workerLists = [];
          this.end = true;
        } else {
          this.end = false;
          this.listShwo = false;
          this.loading = true;
          this.isShow = false;
          // 重新匹配，选出管理员
          this.allWorker.forEach((item) => {
            this.value4.forEach((key) => {
              if (item.key === key) {
                item.power = this.adminType;
                arr.push(item);
              }
            });
          });
        }
        // 发送新的管理员名单
        changeWorkerLists(this.workerLists).then((res) => {
          if (res.data.status === 200) {
            this.workerLists = arr;
            this.loading = false;
            this.listShwo = true;
            this.$message({
              type: "success",
              message: "修改成功!",
            });
          }
        });
      });
    },

    // input搜索//
    searchDate(event) {
      // 筛选名单
      this.workerLists = this.workerLists.filter((item) => {
        return (
          !item.name.indexOf(this.keyword) || !item.phone.indexOf(this.keyword)
        );
      });

      // 没有搜索记录，把搜索值push进数组首位，存入本地
      if (!this.historyList.includes(this.keyword)) {
        // 记录长度不大于8
        if (this.historyList.length >= 8) {
          this.historyList.pop();
        }
        this.historyList.unshift(this.keyword);
        setHistoryAllList(
          "historyAllListKey",
          JSON.stringify(this.historyList)
        );
      } else {
        //有搜索记录，删除之前的旧记录，将新搜索值重新push到数组首位
        let i = this.historyList.indexOf(this.keyword);
        this.historyList.splice(i, 1);
        this.historyList.unshift(this.keyword);
        setHistoryAllList(
          "historyAllListKey",
          JSON.stringify(this.historyList)
        );
      }
      // 关闭记录，失去焦点
      this.removeBlur();
      if (event) {
        event.target.blur();
      }
    },
    // 弹出记录//
    getInputFocus(event) {
      this.showSrarchMenu = true;
    },
    // 关闭记录//
    removeBlur() {
      let time = setTimeout(() => {
        this.showSrarchMenu = false;
        clearTimeout(time);
      }, 200);
    },
    // 清除记录//
    clearHistoryLists() {
      this.historyList = [];
      removeHistoryAllList("historyAllListKey");
    },
    // 点击历史记录//
    goSearchDetail(item) {
      this.keyword = "";
      this.keyword = item;
      this.searchDate();
    },
    // input重置//
    resetInput() {
      this.keyword = "";
      this.getProjectData(this.adminType);
    },

    // 新增按钮//
    addProject() {
      this.isShow = true;
      this.getAllWorker();
      // 清空已选
      this.value4 = [];
      this.allWorker.forEach((item) => {
        if (item.power === this.adminType) {
          this.value4.push(item.key);
        }
      });
    },

    // 解除已选//
    delChecklists() {
      if (!this.checkedId.length) {
        this.$message.warning("请选择要删除的项目");
        return;
      } else {
        let arr = [];
        this.checkedId.forEach((item) => {
          arr.push(item.id);
        });
        this.delItem(arr);
      }
    },
    // 取消按钮//
    offSubmit() {
      this.isShow = false;
    },
    // 搜索项目文字高亮//
    highlight(text) {
      const highlightStr = `<span style="color:#ff5134">${this.keyword}</span>`;
      const reg = new RegExp(this.keyword, "gi");
      return text.replace(reg, highlightStr);
    },
  },
  watch: {
    // 请求管理员数据//
    adminType() {
      this.getProjectData(this.adminType);
      this.adminType === 1
        ? (this.adminTitle = "项目管理员")
        : (this.adminTitle = "超级管理员");
    },
  },
  computed: {
    // 全选框//
    checkAll: {
      // 已选数据等于数据全部，且不为 0
      get() {
        return (
          this.checkedId.length === this.workerLists.length &&
          this.checkedId.length
        );
      },
      // value为checkbox点击的状态
      set(value) {
        if (value) {
          this.checkedId = [];
          this.checkedId = this.workerLists;
        } else {
          this.checkedId = [];
        }
      },
    },
  },
  mounted() {
    //本地存储的historyList有值，直接赋值给data中的 historyList
    if (JSON.parse(getHistoryAllList("historyAllListKey"))) {
      this.historyList = JSON.parse(getHistoryAllList("historyAllListKey"));
    }
  },
};
</script>

<style lang="less" scoped>
.administrator {
  overflow: hidden;
  .lists {
    width: 1286px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 6px;
    margin: 0 auto;
    padding: 30px 0 30px 0;
    border: 1px rgb(230, 230, 230) solid;
    margin-bottom: 20px;
    transition: all 1s;
    margin-top: 30px;
    .graphics {
      .icon {
        color: #006bf7;
        padding: 28px;
        font-size: 28px;
        border-radius: 8px;
        background-color: rgba(0, 107, 247, 0.1);
        margin: 0 30px 0 40px;
      }
      span {
        font-size: 24px;
        font-weight: 600;
      }
    }
    .btn {
      display: flex;
      margin-right: 42px;
      /deep/ .el-input__inner {
        height: 30px;
        width: 200px;
        font-size: 12px;
        .el-input__icon {
          line-height: 30px;
        }
      }
      /deep/ .el-button {
        margin-left: 20px;
      }
    }
  }
  .workerLists::-webkit-scrollbar {
    height: 0;
    width: 0;
    color: transparent;
  }
  .inputMenu {
    width: 1286px;
    position: relative;
    display: flex;
    justify-content: space-between;
    border-radius: 6px;
    margin: 0 auto;
    padding: 25px 0 25px 0;
    border: 1px rgb(230, 230, 230) solid;
    transition: all 1s;
    margin-bottom: 20px;
    .search {
      display: flex;
      .searchWord {
        width: 100px;
        span {
          margin-right: 20px;
          color: rgb(116, 116, 116);
          font-size: 14px;
        }
      }
      .searchInput {
        margin-left: 12px;
        position: relative;
        display: flex;
        .outerbox {
          height: 26px;
          border: 1px solid #dbdfe6;
          border-radius: 4px;
          z-index: 2;
          .el-input {
            width: 280px;
          }
          /deep/.el-input__inner {
            background-color: transparent !important;
            border: 0;
          }
          .searchIcon {
            border-radius: 4px;
            line-height: 26px;
            padding: 0 15px;
            font-size: 14px;
            color: #bbbbbb;
            cursor: pointer;
          }
          // /deep/ .input .el-input__inner:focus{
          //   border-color: rgb(255, 255, 255);
          // }
        }
        .outerbox:focus-within {
          border-color: rgb(255, 255, 255);
        }
        .historyMenu {
          width: 100%;
          z-index: 1;
          top: 0;
          padding-top: 50px;
          position: absolute;
          background-color: #ffffff;
          border-radius: 5px;
          box-shadow: 0 0 6px 4px rgb(245, 245, 245);
          font-size: 14px;
          color: rgb(116, 116, 116);
          .title {
            margin: 0px 16px;
            display: flex;
            justify-content: space-between;
            .deleteIcon {
              font-size: 16px;
              cursor: pointer;
            }
            .deleteIcon:hover {
              color: #ff6263;
            }
          }
          .historyLists {
            line-height: 24px;
            padding: 12px 0px;
          }
          .historyListsItem {
            padding: 0 17px;
          }
          .historyListsItem:hover {
            background-color: #eeeeee;
          }
        }
      }
      .searchButton {
        margin: 0 20px;
      }
    }
    .handelLists {
      display: flex;
      height: 28px;
      position: absolute;
      // margin-right: 42px;
      left: 940px;
      .handelWord {
        width: 100px;
        span {
          line-height: 28px;
          color: rgb(116, 116, 116);
          font-size: 14px;
          margin-right: 20px;
        }
      }
      .delButton {
        margin-right: 20px;
      }
      .selectText {
        display: flex;
        align-items: center;
        span {
          line-height: 28px;
          color: rgb(116, 116, 116);
          font-size: 14px;
        }
      }
      .verticalLine {
        width: 1px;
        background-color: rgba(78, 78, 78, 0.2);
        margin: 4px 20px;
        height: 20px;
      }
    }
  }
  .inputFixed {
    position: relative;
    .workerLists {
      overflow: auto;
      transition: all 1s;
      height: 580px;
      width: 1286px;
      margin: 0 auto;
      border-radius: 6px;
      border: 1px rgb(230, 230, 230) solid;
      padding: 20px 0 20px 0;
      margin-bottom: 10px;
      .info {
        display: flex;
        align-items: center;
        width: 1260px;
        height: 70px;
        border: 1px rgb(230, 230, 230) solid;
        border-radius: 6px;
        margin: 0 auto;
        margin-bottom: 16px;
        .delCheckItem {
          margin: 0 24px;
        }
        .workerImg {
          margin-right: 50px;
          padding: 10px;
          background-color: #6b50d9;
          border-radius: 50%;
          color: #fff;
        }
        .workerId,
        .email,
        .cardId,
        .timer {
          width: 340px;
        }
        .name,
        .sex {
          width: 150px;
          //   background-color: #ff6263;
        }
        .phone {
          width: 250px;
          //   background-color: #8f1b1b;
        }
        .workerTitle {
          display: block;
          font-size: 12px;
          color: rgb(167, 167, 167);
          line-height: 26px;
        }
        .workerTitleInfo {
          line-height: 26px;
          font-size: 14px;
          color: rgb(53, 53, 53);
        }
        .deleteBtn {
          margin-right: 30px;
        }
      }
    }
  }
  .el-footer {
    min-width: 1280px;
    width: 100%;
    position: fixed;
    bottom: 0;
    padding: 0;
  }
  .loading {
    line-height: 50px;
    margin-left: 50%;
    margin-bottom: 10px;
    position: relative;
    right: 50px;
    span {
      color: rgb(116, 116, 116);
      margin-left: 8px;
      font-size: 16px;
      text-align: center;
    }
    a {
      color: rgb(116, 116, 116);
      animation: loading 1s linear infinite;
    }
    // 加载滚动
    @keyframes loading {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
  .end {
    line-height: 50px;
    margin-left: 50%;
    margin-bottom: 10px;
    position: relative;
    right: 50px;
    a {
      color: rgb(116, 116, 116);
    }
    span {
      color: rgb(116, 116, 116);
      margin-left: 8px;
      font-size: 16px;
      text-align: center;
    }
  }
  .lists:hover {
    box-shadow: 0 0 6px 4px rgb(245, 245, 245);
  }
  .inputMenu:hover {
    box-shadow: 0 0 6px 4px rgb(245, 245, 245);
  }
  .workerLists:hover {
    box-shadow: 0 0 6px 4px rgb(245, 245, 245);
  }
}

/deep/ .el-dialog {
    width: 800px;
  position: relative;
  border-radius: 10px;
}

// input
/deep/ .el-transfer-panel__body {
  .el-input {
    width: 90%;
  }
}
// 穿梭框整体
/deep/ .el-transfer {
  position: relative;
  border-right: 0;
  border-radius: 10px;
}
// 单个穿梭框
/deep/ .el-transfer-panel {
  height: 400px;
  width: 300px;
  background-color: transparent;
  margin-bottom: 60px;
  border-radius: 8px;
  border: 1px rgb(226, 226, 226) solid;
}
/deep/ .el-transfer-panel:first-child {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
/deep/ .el-transfer-panel:last-child {
  border-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
// 穿梭框列表
/deep/.el-transfer-panel__list.is-filterable {
  width: 300px;
  height: 300px;
  background-color: transparent;
}
// 按钮
/deep/ .el-button + .el-button {
  margin-left: 20px;
}
/deep/ .el-button [class*="el-icon-"] + span {
  margin: 0px;
}
/deep/ .el-transfer__buttons {
  position: absolute;
  bottom: 15px;
  left: 242px;
  padding: 0;
}
/deep/ .el-button--primary {
  padding: 6px 12px;
}
.dialog-footer {
  position: absolute;
  bottom: 20px;
  right: 100px;
}
</style>