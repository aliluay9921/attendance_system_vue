import Vue from "vue";
import axios from "axios";

const bouns = {
    namespaced: true,
    state: () => ({
        bonuses: [],
        bonuses_state: "done",
        table_loading: false,
        bonusesQuery: "",
        pageCount: 1,
        filter: {},
        params: {
            page: 1,
            itemsPerPage: 50,
        },
    }),
    getters: {},
    mutations: {
        bonuses_success(state, bonuses) {
            state.bonuses.splice(0, state.bonuses.length)
            bonuses.forEach(element => {
                state.bonuses.push(element)
            });
            state.bonuses_state = "done"
            state.table_loading = false

        },
        bonuses_request(state) {
            state.bonuses_state = "loading";
        },
        bonuses_error(state) {
            state.bonuses_state = "error";
        },
        edit_bouns_success(state, bouns) {
            let index = state.bonuses.findIndex((e) => e.id == bouns.id);
            Vue.set(state.bonuses, index, bouns);
            state.bonuses_state = "done";
            state.table_loading = false;
        }



    },
    actions: {
        async resetFields({ state }) {
            state.bonuses_state = "done";
            state.bonuses = [];
            state.table_loading = false;
            state.params = {
                page: 1,
                itemsPerPage: 10,
            };
        },
        async getBounses({ commit, state, dispatch, rootState }) {
            if (state.bonuses_state != "done") return -1;
            state.table_loading = true;
            console.log("here")
            let data = state.params;

            let skip = (data.page - 1) * data.itemsPerPage;
            let limit = data.itemsPerPage;
            let query = "";
            // var filter = "";
            // if (Object.keys(state.filter).length != 0)
            //     filter = "&filter=" + JSON.stringify(state.filter);
            // console.log(filter);
            if (
                state.bonusesQuery != undefined &&
                state.bonusesQuery != null &&
                state.bonusesQuery.length > 0
            ) query = `&query=${state.bonusesQuery}`;
            return new Promise((resolve, reject) => {

                axios({
                    url: `${rootState.server}` + "/api/get_bounses" + "?skip=" + skip +
                        "&limit=" +
                        limit +
                        query,
                    method: "GET",
                }).then(resp => {

                    state.table_loading = false;
                    state.pageCount = resp.data.count;

                    commit('bonuses_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });


                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("bonuses_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );
                    console.warn(err);
                });
            })

        },

        async editBonus({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve, reject) => {
                commit("bonuses_request");
                axios({
                    url: `${rootState.server}` + "/api/edit_bonus",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                }).then(resp => {
                    state.table_loading = false
                    commit("edit_bouns_success", resp.data.result[0])
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("bonuses_error");
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
export default bouns;
