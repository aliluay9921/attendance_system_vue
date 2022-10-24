import Vue from "vue";
import axios from "axios";

const settings = {
    namespaced: true,
    state: () => ({
        settings: [],
        settings_state: "done",
        table_loading: false,
        settingsQuery: "",
        selected_object: {},
        isEdit: false,
        pageCount: 1,
        params: {
            dropdown: true,
            page: 1,
            itemsPerPage: 50,
        },
    }),
    getters: {},
    mutations: {
        settings_success(state, settings) {
            state.settings.splice(0, state.settings.length)
            settings.forEach(element => {
                state.settings.push(element)
            });
            state.settings_state = "done"
            state.table_loading = false

        },
        settings_request(state) {
            state.settings_state = "loading";
        },

        settings_error(state) {
            state.settings_state = "error";
        },
        add_settings_success(state, settings) {
            state.settings.unshift(settings);
            state.settings_state = "done";
            state.table_loading = false;
            console.log(settings);
        },

        settings_edit_success(state, setting) {
            let index = state.settings.findIndex((e) => e.id == setting.id);
            Vue.set(state.settings, index, setting);
            state.settings_state = "done";
            state.table_loading = false;
        },
    },
    actions: {
        async resetFields({ state }) {
            state.settings_state = "done";
            state.settings = [];
            state.table_loading = false;
            state.params = {
                dropdown: true,
                page: 1,
                itemsPerPage: 10,
            };
        },
        async getSettings({ commit, state, dispatch, rootState }) {
            if (state.settings_state != "done") return -1;
            state.table_loading = true;
            console.log("here")
            let data = state.params;

            let skip = (data.page - 1) * data.itemsPerPage;
            let limit = data.itemsPerPage;

            if (
                state.settingsQuery != undefined &&
                state.settingsQuery != null &&
                state.settingsQuery.length > 0
            ) query = `&query=${state.settingsQuery}`;
            return new Promise((resolve, reject) => {

                axios({
                    url: `${rootState.server}` + "/api/get_roles" + "?skip=" + skip +
                        "&limit=" +
                        limit
                    ,
                    method: "GET",
                }).then(resp => {

                    state.table_loading = false;
                    state.pageCount = resp.data.count;
                    commit('settings_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("settings_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );
                    console.warn(err);
                });
            })

        },
        async addSetting({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("settings_request");
                axios({
                    url: `${rootState.server}` + "/api/add_role",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_settings_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    console.log(err);
                    state.table_loading = false;
                    commit("settings_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },
        async editSetting({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve, reject) => {
                commit("settings_request");
                axios({
                    url: `${rootState.server}` + "/api/update_role",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                }).then(resp => {
                    state.table_loading = false
                    commit("settings_edit_success", resp.data.result[0])
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("settings_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },

    }

}
export default settings;
