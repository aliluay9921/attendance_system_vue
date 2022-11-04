import Vue from "vue";
import axios from "axios";

const holiday = {
    namespaced: true,
    state: () => ({
        holidays: [],
        holidays_state: "done",
        table_loading: false,
        holidaysQuery: "",
        pageCount: 1,
        params: {
            dropdown: true,
            page: 1,
            itemsPerPage: 50,
        },
    }),
    getters: {},
    mutations: {
        holidays_success(state, holidays) {
            state.holidays.splice(0, state.holidays.length)
            holidays.forEach(element => {
                state.holidays.push(element)
            });
            state.holidays_state = "done"
            state.table_loading = false

        },
        holidays_request(state) {
            state.holidays_state = "loading";
        },

        holidays_error(state) {
            state.holidays_state = "error";
        },
    },
    actions: {
        async resetFields({ state }) {
            state.holidays_state = "done";
            state.holidays = [];
            state.table_loading = false;
            state.params = {
                dropdown: true,
                page: 1,
                itemsPerPage: 10,
            };
        },
        async getHolidays({ commit, state, dispatch, rootState }) {
            if (state.holidays_state != "done") return -1;
            state.table_loading = true;
            console.log("here")
            let data = state.params;

            let skip = (data.page - 1) * data.itemsPerPage;
            let limit = data.itemsPerPage;
            let query = "";

            if (
                state.holidaysQuery != undefined &&
                state.holidaysQuery != null &&
                state.holidaysQuery.length > 0
            ) query = `&query=${state.holidaysQuery}`;
            return new Promise((resolve, reject) => {

                axios({
                    url: `${rootState.server}` + "/api/get_holiday" + "?skip=" + skip +
                        "&limit=" +
                        limit +
                        query,
                    method: "GET",
                }).then(resp => {

                    state.table_loading = false;
                    state.pageCount = resp.data.count;
                    if (data.dropdown == false) {
                        commit('holidays_success', resp.data.result)
                        dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    } else {
                        commit("holidays_dropdown_success", resp.data.result);
                    }

                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("holidays_error");
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
export default holiday;
