const vipProject = {
  namespaced: true,
  state: {
    Project: [],
    homeProject: [],
    // 下拉框数据
    selectValue: [],
  },
  mutations: {
    setProjectData(state, val) {
      state.Project = val;
      state.homeProject = val.slice(0, 26);
    },
    clearProjectData(state) {
      state.Project = [];
    },
    //  设置下拉框数据
    setSelectValue(state, val) {
      state.selectValue = val;
    },
  },
};

export default vipProject;
