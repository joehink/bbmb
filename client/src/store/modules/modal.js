const actions = {
  displayModal: ({ commit }, { message, btnText, btnColor, action }) => {
    commit('showModal');
    commit('setMessage', message);
    commit('setBtnText', btnText);
    commit('setBtnColor', btnColor);
    commit('setAction', action);
  },
};

const mutations = {
  showModal: (state) => {
    state.show = true;
  },
  hideModal: (state) => {
    state.show = false;
  },
  setMessage: (state, message) => {
    state.message = message;
  },
  setBtnText: (state, btnText) => {
    state.btnText = btnText;
  },
  setBtnColor: (state, btnColor) => {
    state.btnColor = btnColor;
  },
  setAction: (state, action) => {
    state.action = action;
  },
};

const getters = {
  modal: state => state.show,
  modalMessage: state => state.message,
  modalBtnText: state => state.btnText,
  modalBtnColor: state => state.btnColor,
  modalAction: state => state.action,
};

const state = {
  show: false,
  message: '',
  action: null,
  btnText: '',
};

export default {
  state,
  getters,
  actions,
  mutations,
};