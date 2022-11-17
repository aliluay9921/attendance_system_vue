import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import employees from '../store/modules/employees'
import attendance from '../store/modules/attendance'
import absent from '../store/modules/absent'
import setting from '../store/modules/setting'
import holiday from '../store/modules/holiday'
import bouns from '../store/modules/bouns'
import shift from '../store/modules/shift'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // server: "http://127.0.0.1:8000",
    server: "http://www.basmaiq.com",
    snackbar: false,
    textSnackbar: "",
    isLoggedIn: false,
    token: localStorage.token,
    status: "",
    user_type: localStorage.getItem("user_type"),
    full_name: localStorage.getItem("full_name"),

  },
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  mutations: {
    auth_success(state, token) {
      state.token = token;
      state.status = "done";
    },
    auth_request(state) {
      state.status = "loading";
    },
    auth_error(state) {
      state.status = "error";
    },
    get_statistics(state, data) {
      state.statistics.push(data);
    },
    logout(state) {
      state.status = null;
      state.token = null;
    },
  },
  actions: {
    async resetFields({ state }) {
      state.token = null;
      state.isLoggedIn = false;
      state.status = "";
      state.user_type = -1;

    },

    snackbarToggle: function ({ state }, data) {
      if (data.toggle == false) {
        state.snackbar = data.toggle;
      } else {
        state.snackbar = data.toggle;
        state.textSnackbar = data.text;
      }
    },
    login({ commit, state }, data) {
      // console.log(data);
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: `${state.server}` + "/api/login",
          data: data,
          method: "POST",
        })
          .then((resp) => {
            // console.log(resp);
            const token = resp.data.token;
            state.full_name = resp.data.result[0].full_name;
            state.user_type = resp.data.result[0].user_type;
            console.log(state.user_type)
            localStorage.setItem("token", token);
            localStorage.setItem("user_type", state.user_type);
            localStorage.setItem("full_name", state.full_name);

            Vue.prototype.$http.defaults.headers.common["Authorization"] =
              "Bearer " + token;
            commit("auth_success", token);
            resolve(resp);
          })
          .catch((err) => {
            // console.log(err);
            commit("auth_error");
            localStorage.removeItem("token");

            reject(err);
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit("logout");
        localStorage.removeItem("token");
        localStorage.removeItem("user_name");
        localStorage.removeItem("user_type");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    },



  },
  modules: {
    employees, attendance, absent, setting, holiday, bouns, shift
  },
});
