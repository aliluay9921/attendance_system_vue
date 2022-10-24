import Vue from "vue";
import axios from "axios";

const attendance = {
    namespaced: true,
    state: () => ({
        attendances: [],
        attendances_state: "done",
        table_loading: false,
        attendancesQuery: "",
        filter_date: "",
        filter: {},
        pageCount: 1,
        params: {
            dropdown: true,
            page: 1,
            itemsPerPage: 50,
        },
    }),
    getters: {},
    mutations: {
        attendances_success(state, attendances) {
            state.attendances.splice(0, state.attendances.length)
            attendances.forEach(element => {
                state.attendances.push(element)
            });
            state.attendances_state = "done"
            state.table_loading = false

        },
        attendances_request(state) {
            state.attendances_state = "loading";
        },

        attendances_error(state) {
            state.attendances_state = "error";
        },
    },
    actions: {
        async resetFields({ state }) {
            state.attendances_state = "done";
            state.attendances = [];
            state.table_loading = false;
            state.params = {
                dropdown: true,
                page: 1,
                itemsPerPage: 10,
            };
        },
        async getAttendances({ commit, state, dispatch, rootState }) {
            if (state.attendances_state != "done") return -1;
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
                state.attendancesQuery != undefined &&
                state.attendancesQuery != null &&
                state.attendancesQuery.length > 0
            ) query = `&query=${state.attendancesQuery}`;
            return new Promise((resolve, reject) => {

                axios({
                    url: `${rootState.server}` + "/api/get_attendances" + "?skip=" + skip +
                        "&limit=" +
                        limit +
                        query + filter,
                    method: "GET",
                }).then(resp => {

                    state.table_loading = false;
                    state.pageCount = resp.data.count;
                    if (data.dropdown == false) {
                        commit('attendances_success', resp.data.result)
                        dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    } else {
                        commit("attendances_dropdown_success", resp.data.result);
                    }

                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("attendances_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );
                    console.warn(err);
                });
            })

        },

    }

}
export default attendance;
