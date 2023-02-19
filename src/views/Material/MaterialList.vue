<template>
  <div class="MaterialList">
    <div class="title">
      <p>
        <span class="title1">最新材料案例</span>
        <span class="title2" @click="toProject">NEW CASE</span>
      </p>
      <span class="title3" @click="toProject">MORE+</span>
    </div>
    <div class="loading">
      <a class="fa fa-spinner" v-show="loadingCase"></a>
      <span v-show="loadingCase">{{ msg }}</span>
    </div>
    <div class="case">
      <div class="leftPic">
        <div class="leftImgOuter">
          <img :src="leftCase.url"/>
        </div>
        <div class="text">
          <a class="name">{{ leftCase.proName }}</a>
          <a class="materialItem">{{ leftCase.materialItem }}</a>
        </div>
      </div>
      <div class="centerPic">
        <div
          class="pic"
          @click="toDetail()"
          v-for="item in centerCase"
          :key="item.id"
        >
          <div class="imgOuter">
            <img :src="item.url" />
          </div>
          <div class="text">
            <a class="name">{{ item.proName }}</a>
            <a class="materialItem">{{ item.materialItem }}</a>
          </div>
        </div>
      </div>
      <div class="centerPic rightPic">
        <div
          class="pic"
          @click="toDetail()"
          v-for="item in rightCase"
          :key="item.id"
        >
          <div class="imgOuter">
            <img :src="item.url" />
          </div>
          <div class="text">
            <a class="name">{{ item.proName }}</a>
            <a class="materialItem">{{ item.materialItem }}</a>
          </div>
        </div>
      </div>
    </div>
    <ul class="top-nav">
      <li
        v-for="(item,index) in materialNave"
        :key="item.eng"
        @click="toMaterail(item.type, index)"
        :class="{ active: change === index }"
      >
        <a class="nane">{{ item.name }}</a>
        <a class="eng">{{ item.eng }}</a>
      </li>
    </ul>
    <div class="inputFixed">
      <div class="materailInfo">
        <!-- input -->
        <div class="inputMenu">
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
              <span
                class="fa fa-search searchIcon"
                @click="clearHistoryLists"
              ></span>
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
          <!-- handelLists -->
          <div class="handelLists" v-permission="'add'">
            <el-button
              type="primary"
              @click="addProject"
              size="mini"
              class="addProject"
              plain
              >新增材料</el-button
            >
            <div class="verticalLine"></div>
            <el-button
              type="danger"
              size="mini"
              class="delButton"
              @click="delChecklists"
              plain
            >
              删除已选</el-button
            >
            <div class="selectText">
              <span>全选</span>
              <input type="checkbox" v-model="checkAll" />
              <div class="verticalLine"></div>
              <span
                >已选择 {{ delId.length }} / 全部 {{ materailInfo.length }}
              </span>
            </div>
          </div>
        </div>
        <div class="loading">
          <a class="fa fa-spinner" v-show="loading"></a>
          <span v-show="loading">{{ msg }}</span>
        </div>
        <div class="end">
          <a class="fa fa-exclamation-circle" v-show="end"></a>
          <span v-show="end">{{ loadingEndMsg }}</span>
        </div>
        <div class="info" v-for="item in materailInfo" :key="item.id">
          <input
            v-permission="'edit'"
            type="checkbox"
            class="delCheckItem"
            v-model="delId"
            :value="item.id"
          />
          <div class="materailImg">
            <img :src="item.materialImg.url" />
          </div>
          <div class="materailText type">
            <a class="name">材料种类</a>
            <a class="materialItem">{{ item.material_text }}</a>
          </div>
          <div class="materailText type">
            <a class="name">材料选型</a>
            <a class="materialItem" v-html="highlight(item.materialItem)"></a>
          </div>
          <div class="materailText color">
            <a class="name">材料色系</a>
            <a class="materialItem" v-html="highlight(item.materialColor)"></a>
          </div>
          <div class="materailText size">
            <a class="name">材料尺寸</a>
            <a class="materialItem">{{ item.materialSize }}</a>
          </div>
          <div class="materailText size">
            <a class="name">材料商</a>
            <a
              class="materialItem"
              v-html="highlight(item.materialCompany)"
            ></a>
          </div>
          <div class="materailText phone">
            <a class="name">材料商电话</a>
            <a class="materialItem">{{ item.phone }}</a>
          </div>
          <el-button
            class="edit"
            type="primary"
            style="padding: 5px 6px"
            plain
            size="mini"
            @click="changeItem(item)"
            v-permission="'edit'"
            >编辑 <i style="margin-left: 0px"> </i
          ></el-button>
          <el-button
            class="deleteBtn"
            @click="delItem(item.id)"
            style="padding: 5px 6px"
            type="danger"
            plain
            size="mini"
            v-permission="'delete'"
            >删除</el-button
          >
        </div>
      </div>
    </div>
    <!-- dialog、form表单 -->
    <el-dialog
      :title="state ? '新增材料信息' : '修改材料信息'"
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
        :picLabel="picLabel"
        :uploadingStatus="uploadingStatus"
        :action="action"
        :backPic="backPic"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit(form)">提交</el-button>
        <el-button @click="offSubmit">取消</el-button>
      </div>
    </el-dialog>
    <el-footer>
      <footerMsg />
    </el-footer>
  </div>
</template>
<script>
import CommerForm from "@/components/commer/CommerForm";
import footerMsg from "@/components/footerMsg";
import permission from "@/directives/permission";
import {
  setHistoryAllList,
  getHistoryAllList,
  removeHistoryAllList,
} from "@/Utils/historyList";
import {
  getMaterail,
  delMaterail,
  addMaterail,
  changeMaterail,
  getVipProject
} from "@/api/api";

export default {
  name: "MaterialList",
  components: { footerMsg, CommerForm },
  // 自定义指令
  directives: { permission },
  data() {
    return {
      // 项目数据//
      projectLists: [],
      leftCase: {},
      centerCase: [],
      rightCase: [],
      //材料数据
      materailInfo: [],
      // 请求状态
      msg: "正在加载中",
      loading: true,
      loadingCase: true,
      loadingEndMsg: "无更多数据",
      //  无更多数据
      end: false,
      // 材料导航条
      materialNave: [
        { name: "石材", type:"1", eng: "stone" },
        { name: "玻璃", type:"2", eng: "Glass" },
        { name: "金属", type:"3", eng: "Metal" },
        { name: "涂料", type:"4", eng: "coating" },
        { name: "面砖", type:"5", eng: "brick" },
        { name: "木材", type:"6", eng: "wood" },
      ],
      type: "",
      // 删除数据
      delId: [],

      keyword: "",
      // 搜索栏数据//
      placeholder: "请输入材料名称 / 色系 / 材料商",
      // 历史记录//
      showSrarchMenu: false,
      historyList: ["黄色", "超白玻", "中国建材"],
      // 导航条默认位置
      change: 0,

      //管理员权限data
      // form表头
      state: true,
      isShow: false,
      uploadingStatus: true /* 文件上传是否显示 */,
      picLabel: "项目图片" /* 文件上传的表头 */,
      backPic: {},
      action:
        "https://api.e.360.cn/dianjing/pichouse/upload" /* 文件上传接口 */,

      // form表单表头
      formLabel: [
        {
          model: "material",
          label: "材料种类",
          type: "select",
          opts: [
            {
              label: "石材",
              value: "1",
            },
            {
              label: "玻璃",
              value: "2",
            },
            {
              label: "金属",
              value: "3",
            },
            {
              label: "涂料",
              value: "4",
            },
            {
              label: "面砖",
              value: "5",
            },
            {
              label: "木材",
              value: "6",
            },
          ],
        },
        {
          model: "materialItem",
          label: "材料选型",
          type: "input",
        },
        {
          model: "materialColor",
          label: "材料色系",
          type: "select",
          opts: [
            {
              label: "白色系",
              value: "白色系",
            },
            {
              label: "黑色系",
              value: "黑色系",
            },
            {
              label: "灰色系",
              value: "灰色系",
            },
            {
              label: "红色系",
              value: "红色系",
            },
            {
              label: "黄色系",
              value: "黄色系",
            },
            {
              label: "绿色系",
              value: "绿色系",
            },
            {
              label: "蓝色系",
              value: "蓝色系",
            },
            {
              label: "棕色系",
              value: "棕色系",
            },
            {
              label: "透明",
              value: "透明",
            },
          ],
        },
        {
          model: "materialSize",
          label: "材料尺寸",
          type: "input",
        },
        {
          model: "materialCompany",
          label: "材料商",
          type: "input",
        },
        {
          model: "phone",
          label: "材料商联系方式",
          type: "input",
        },
        {
          model: "materialUrl",
          label: "材料服务器地址",
          type: "input",
        },
        {
          model: "materialParagraph",
          label: "材料简介",
          type: "textarea",
        },
      ],
      // 收集form表单数据
      form: {
        material: "",
        materialItem: "",
        materialColor: "",
        materialSize: "",
        materialCompany: "",
        phone: "",
        materialUrl: "",
        materialParagraph: "",
        // 图片上传成功返回来的地址
        displayImg: [],
      },
    };
  },
  methods: {
    // 请求材料数据//
    getProjectData(val) {
      this.end = false;
      this.loading = true;
      this.materailInfo = [];
      getMaterail(val).then((res) => {
        this.loading = false;
        this.materailInfo = res.data.data;
        this.materailInfo.forEach((item) => {
          // 不要修改原数据
          item.material === "1"
            ? (item.material_text = "石材")
            : item.material === "2"
            ? (item.material_text = "玻璃")
            : item.material === "3"
            ? (item.material_text = "金属")
            : item.material === "4"
            ? (item.material_text = "涂料")
            : item.material === "5"
            ? (item.material_text = "面砖")
            : (item.material_text = "木材");
          item.url = item.materialImg.url;
        });
      });
    },
    // 请求案最新例数据//
    getCasetData() {
      this.loadingCase = true;
      getVipProject().then((res) => {
        this.loadingCase = false;
        this.projectLists = res.data.data;
        this.projectLists.forEach((item) => {
          // 不要修改原数据
          item.material === "1"
            ? (item.material_text = "石材")
            : item.material === "2"
            ? (item.material_text = "玻璃")
            : item.material === "3"
            ? (item.material_text = "金属")
            : item.material === "4"
            ? (item.material_text = "涂料")
            : item.material === "5"
            ? (item.material_text = "面砖")
            : (item.material_text = "木材");
          item.url = item.materialImg.url;
        });
        this.leftCase = this.projectLists[0];
        this.rightCase = this.projectLists.slice(1, 3);
        this.centerCase = this.projectLists.slice(3, 5);
      });
    },

    // 删除数据//
    delItem(val) {
      this.$confirm("此操作将永久删除该信息, 是否继续?", { type: "warning" })
        .then(() => {
          delMaterail(val).then((res) => {
            this.delId = [];
            if (res.data.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              if (res.data.data.length === 0) {
                this.end = true;
              }
              this.materailInfo = res.data.data;
              this.materailInfo.forEach((item) => {
                // 不要修改原数据
                item.material === "1"
                  ? (item.material_text = "石材")
                  : item.material === "2"
                  ? (item.material_text = "玻璃")
                  : item.material === "3"
                  ? (item.material_text = "金属")
                  : item.material === "4"
                  ? (item.material_text = "涂料")
                  : item.material === "5"
                  ? (item.material_text = "面砖")
                  : (item.material_text = "木材");
                item.address === "1"
                  ? (item.address_text = "华南地区")
                  : item.address === "2"
                  ? (item.address_text = "华东地区")
                  : item.address === "3"
                  ? (item.address_text = "华北地区")
                  : item.address === "4"
                  ? (item.address_text = "中部地区")
                  : (item.address_text = "西部地区");
                item.url = item.materialImg.url;
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
    // 提交按钮,新增和修改数据//
    onSubmit() {
      // 信息校验
      const {
        material,
        materialItem,
        materialColor,
        materialSize,
        materialCompany,
        phone,
        materialUrl,
        materialParagraph,
      } = this.form;
      if (
        material !== "" &&
        materialItem !== "" &&
        materialColor !== "" &&
        materialSize !== "" &&
        materialCompany !== "" &&
        phone !== "" &&
        materialUrl !== "" &&
        materialParagraph !== ""
      ) {
        // 判断是新增还是修改
        if (this.state) {
          this.$confirm("确认上传项目信息吗?").then(() => {
            addMaterail(this.form).then((res) => {
              if (res.data.status === 200) {
                this.isShow = false;
                this.$message({
                  type: "success",
                  message: "新增成功!",
                });
                this.getProjectData();
              }
            });
          });
        } else {
          this.$confirm("确认修改项目信息吗?").then(() => {
            changeMaterail(this.form).then((res) => {
              if (res.data.status === 200) {
                this.isShow = false;
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
                this.materailInfo = res.data.data;
                this.materailInfo.forEach((item) => {
                  // 不要修改原数据
                  item.material === "1"
                    ? (item.material_text = "石材")
                    : item.material === "2"
                    ? (item.material_text = "玻璃")
                    : item.material === "3"
                    ? (item.material_text = "金属")
                    : item.material === "4"
                    ? (item.material_text = "涂料")
                    : item.material === "5"
                    ? (item.material_text = "面砖")
                    : (item.material_text = "木材");
                  item.address === "1"
                    ? (item.address_text = "华南地区")
                    : item.address === "2"
                    ? (item.address_text = "华东地区")
                    : item.address === "3"
                    ? (item.address_text = "华北地区")
                    : item.address === "4"
                    ? (item.address_text = "中部地区")
                    : (item.address_text = "西部地区");
                });
              }
            });
          });
        }
      } else {
        this.$message.error("项目信息不完整，请完善后提交");
      }
    },


    // 材料检索导航条
    toMaterail(val,index) {
      // 改变导航条样式
      this.change = index
      // 请求数据
      this.type = val;
      this.getProjectData(this.type);
    },

    // input搜索//
    searchDate(event) {
      this.getProjectData(this.keyword);
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
      this.getProjectData(this.type);
    },

    //管理员权限 methods
    // 新增按钮//
    addProject() {
      this.isShow = true;
      // 标题为新增
      this.state = true;
    },
    // 编辑按钮//
    changeItem(row) {
      this.$bus.$emit("showPic", row.materialImg);
      this.state = false;
      this.form = { ...row };
      this.isShow = true;
    },
    // 删除已选项目//
    delChecklists() {
      this.delId.length
        ? this.delItem(this.delId)
        : this.$message("请选择要删除的项目");
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
    // 更多案例
    toProject() {
      this.$router.push("/case");
    },
  },
  watch: {
    // 关闭时清空form数据
    isShow(newValue) {
      if (!newValue) {
        // 子组件form清空图片上传的缓存
        this.$bus.$emit("resetPics");
        this.form = {
          material: "",
          materialItem: "",
          materialColor: "",
          materialSize: "",
          materialCompany: "",
          phone: "",
          materialUrl: "",
          materialParagraph: "",
          displayImg: [],
        };
      }
    },
  },
  computed: {
    // 全选框//
    checkAll: {
      // 已选数据等于数据全部，且不为 0
      get() {
        return (
          this.delId.length === this.materailInfo.length && this.delId.length
        );
      },
      // value为checkbox点击的状态
      set(value) {
        if (value) {
          this.delId = [];
          this.materailInfo.forEach((item) => {
            this.delId.push(item.id);
          });
        } else {
          this.delId = [];
        }
      },
    },
  },
  created(){
    // 请求材料数据//
    this.getProjectData("1");
    // 请求案最新例数据//
    this.getCasetData();
  },
  mounted() {
    // 先调用form，再关闭，解决第一次回显失败问题,但是页面有抖动，待优化
    // this.isShow = false;

    //本地存储的historyList有值，直接赋值给data中的 historyList
    if (JSON.parse(getHistoryAllList("historyAllListKey"))) {
      this.historyList = JSON.parse(getHistoryAllList("historyAllListKey"));
    }
  },
  beforeMount(){
    // 先调用form，再关闭，解决第一次回显失败问题，但是页面有抖动，待优化
    // this.isShow = true;
  },
};
</script>

<style lang="less" scoped>
.MaterialList {
  overflow: hidden;
  .title {
    color: #424242;
    display: flex;
    justify-content: space-between;
    user-select: none;
    margin: 18px 0 6px 0;
    .title1 {
      font-size: 20px;
      margin: 0 10px 0 40px;
      font-weight: bold;
    }
    .title2 {
      font-size: 12px;
    }
    .title3 {
      //鼠标移入变小手
      cursor: pointer;
      line-height: 20px;
      font-size: 12px;
      border: #333 1px solid;
      border-radius: 20px;
      padding: 6px 12px;
      margin-right: 40px;
      position: relative;
      top: -5px;
    }
    .title3:hover {
      color: #fff;
      background-color: #101820;
    }
  }
  .case {
    width: 100%;
    height: 560px;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    .leftPic {
      margin-left: 40px;
      width: 48%;
      height: 100%;
      .leftImgOuter {
        margin-bottom: 12px;
        overflow: hidden;
        width: 100%;
        height: 90.5%;
        img {
          overflow: hidden;
          width: 100%;
          transition: 1.5s;
          object-fit: cover;
        }
        img:hover {
          transform: scale(1.05);
        }
      }
    }
    .rightPic {
      margin-right: 40px;
    }
    .centerPic {
      width: 23%;
      height: 100%;
      .pic {
        width: 100%;
        height: 48%;
        margin-bottom: 12px;
        .imgOuter {
          overflow: hidden;
          width: 100%;
          height: 84%;
          margin-bottom: 1vh;
          img {
            overflow: hidden;
            width: 100%;
            height: 100%;
            transition: 1.5s;
            object-fit: cover;
          }
          img:hover {
            transform: scale(1.05);
          }
        }
      }
    }
    .text {
      width: 100%;
      height: 100%;
      color: #424242;
      .name {
        font-size: 15px;
        font-weight: 600;
        display: block;
        margin-bottom: 0.5vh;
      }
      .materialItem {
        display: block;
        font-size: 12px;
      }
    }
  }

  .top-nav {
    display: flex;
    justify-content: center;
    padding-left: 0;
    padding-right: 0;
    margin: 0 auto;
    margin-top: 120px;
    margin-bottom: 20px;
    a {
      display: block;
      text-decoration: none;
      margin-bottom: 2px;
      font-size: 14px;
    }
    .eng {
      font-size: 12px;
      text-transform: uppercase;
    }
    li {
      background-color: rgb(241, 241, 241);
      color: rgb(170, 170, 170);
      padding: 10px 87px;
      text-align: center;
      cursor: pointer;
    }
    // 点击激活样式
    .active {
      color: rgb(255, 255, 255);
      background-color: rgb(82, 82, 82);
    }
  }
  .materailInfo::-webkit-scrollbar {
    height: 0;
    width: 0;
    color: transparent;
  }
  .delCheckItem {
    margin: 0 0 0 40px;
  }

  .inputFixed {
    position: relative;
    .materailInfo {
      overflow: auto;
      height: 500px;
      width: 1286px;
      margin: 0 auto;
      border-radius: 6px;
      border: 1px rgb(216, 216, 216) solid;
      padding: 100px 0 30px 0;
      margin-bottom: 50px;
      .info {
        display: flex;
        align-items: center;
        width: 1260px;
        height: 70px;
        border: 1px rgb(216, 216, 216) solid;
        border-radius: 6px;
        margin: 0 auto;
        margin-bottom: 16px;
        .materailImg {
          margin: 0 40px;
          overflow: hidden;
          height: 50px;
          width: 74px;
        }
        .size {
          width: 300px;
          // background-color: #c98e8e;
        }
        .phone {
          width: 200px;
          // background-color: #c05757;
        }
        .type,
        .color {
          // background-color: #771f1f;
          width: 180px;
        }
        a {
          display: block;
          font-size: 13px;
          color: rgb(78, 78, 78);
          line-height: 24px;
        }
        .deleteBtn {
          margin-right: 30px;
        }
      }
      .inputMenu {
        width: 1286px;
        position: absolute;
        // border-radius: 6px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        top: 1px;
        padding: 25px 0 25px 0;
        background-color: rgb(255, 255, 255);
        border-bottom: 1px rgb(216, 216, 216) solid;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
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
            z-index: 5;
            height: 26px;
            border: 1px solid #dbdfe6;
            border-radius: 4px;
            z-index: 5;
            .el-input {
              width: 215px;
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
              // background-color: #fff;
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
            z-index: 4;
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
        .handelLists {
          width: 100%;
          display: flex;
          height: 28px;
          position: absolute;
          left: 830px;
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
    }
  }
  .el-footer {
    min-width: 1280px;
    width: 100%;
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
}
/deep/ .el-dialog {
    width: 700px;
    height: 830px;
  position: relative;
  border-radius: 10px;
}
.dialog-footer {
  position: absolute;
  bottom: 30px;
  right: 56px;
}
</style>