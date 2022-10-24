import Vue from "vue";
import axios from "axios";

const absent = {
    namespaced: true,
    state: () => ({
        absents: [],
        absents_state: "done",
        table_loading: false,
        absentsQuery: "",
        pageCount: 1,
        filter: {},
        params: {
            page: 1,
            itemsPerPage: 50,
        },
    }),
    getters: {},
    mutations: {
        absents_success(state, absents) {
            state.absents.splice(0, state.absents.length)
            absents.forEach(element => {
                state.absents.push(element)
            });
            state.absents_state = "done"
            state.table_loading = false

        },
        absents_request(state) {
            state.absents_state = "loading";
        },
        absents_error(state) {
            state.absents_state = "error";
        },
        add_absents_success(state, absents) {
            state.absents.unshift(absents);
            state.absents_state = "done";
            state.table_loading = false;
            console.log(absents);
        },
        absent_change_status_success(state, absent) {
            let index = state.absents.findIndex((e) => e.id == absent.id);
            Vue.set(state.absents, index, absent);
            state.absents_state = "done";
            state.table_loading = false;
        },
    },
    actions: {
        async resetFields({ state }) {
            state.absents_state = "done";
            state.absents = [];
            state.table_loading = false;
            state.params = {
                page: 1,
                itemsPerPage: 10,
            };
        },
        async getAbsents({ commit, state, dispatch, rootState }) {
            if (state.absents_state != "done") return -1;
            state.table_loading = true;
            console.log("here")
            let data = state.params;

            let skip = (data.page - 1) * data.itemsPerPage;
            let limit = data.itemsPerPage;
            let query = "";
            var filter = "";
            if (Object.keys(state.filter).length != 0)
                filter = "&filter=" + JSON.stringify(state.filter);
            console.log(filter);
            if (
                state.absentsQuery != undefined &&
                state.absentsQuery != null &&
                state.absentsQuery.length > 0
            ) query = `&query=${state.absentsQuery}`;
            return new Promise((resolve, reject) => {

                axios({
                    url: `${rootState.server}` + "/api/get_absents" + "?skip=" + skip +
                        "&limit=" +
                        limit +
                        query + filter,
                    method: "GET",
                }).then(resp => {

                    state.table_loading = false;
                    state.pageCount = resp.data.count;

                    commit('absents_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });


                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("absents_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );
                    console.warn(err);
                });
            })

        },
        async addAbsent({ commit, state, dispatch, rootState }) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("absents_request");
                axios({
                    url: `${rootState.server}` + "/api/add_absents",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_absents_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    console.log(err);
                    state.table_loading = false;
                    commit("absents_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },
        async changeStatusAbsent({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve, reject) => {
                commit("absents_request");
                axios({
                    url: `${rootState.server}` + "/api/change_status_absent",
                    data: { absent_id: data.id },
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                }).then(resp => {
                    state.table_loading = false
                    commit("absent_change_status_success", resp.data.result[0])
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("absents_error");
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
export default absent;
