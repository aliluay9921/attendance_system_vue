import Vue from "vue";
import axios from "axios";

const shift = {
    namespaced: true,
    state: () => ({
        shifts: [],
        shifts_state: "done",
        table_loading: false,
        shiftsQuery: "",
        pageCount: 1,
        filter: {},
        params: {
            page: 1,
            itemsPerPage: 50,
        },
    }),
    getters: {},
    mutations: {
        shifts_success(state, shifts) {
            state.shifts.splice(0, state.shifts.length)
            shifts.forEach(element => {
                state.shifts.push(element)
            });
            state.shifts_state = "done"
            state.table_loading = false

        },
        shifts_request(state) {
            state.shifts_state = "loading";
        },
        shifts_error(state) {
            state.shifts_state = "error";
        },
        edit_shift_success(state, shift) {
            let index = state.shifts.findIndex((e) => e.id == shift.id);
            Vue.set(state.shifts, index, shift);
            state.shifts_state = "done";
            state.table_loading = false;
        },
        delete_shift(state, shift) {
            let index = state.shifts.findIndex((e) => e.id == shift.id);
            state.shifts.splice(index, 1)
            state.shifts_state = "done";
            state.table_loading = false;
        }



    },
    actions: {
        async resetFields({ state }) {
            state.shifts_state = "done";
            state.shifts = [];
            state.table_loading = false;
            state.params = {
                page: 1,
                itemsPerPage: 10,
            };
        },
        async getShifts({ commit, state, dispatch, rootState }) {
            if (state.shifts_state != "done") return -1;
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
                state.shiftsQuery != undefined &&
                state.shiftsQuery != null &&
                state.shiftsQuery.length > 0
            ) query = `&query=${state.shiftsQuery}`;
            return new Promise((resolve, reject) => {

                axios({
                    url: `${rootState.server}` + "/api/get_shifts" + "?skip=" + skip +
                        "&limit=" +
                        limit +
                        query,
                    method: "GET",
                }).then(resp => {

                    state.table_loading = false;
                    state.pageCount = resp.data.count;

                    commit('shifts_success', resp.data.result)
                    dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });


                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("shifts_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );
                    console.warn(err);
                });
            })

        },

        async editShift({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve, reject) => {
                commit("shifts_request");
                axios({
                    url: `${rootState.server}` + "/api/edit_shift",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                }).then(resp => {
                    state.table_loading = false
                    commit("edit_shift_success", resp.data.result[0])
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("shifts_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },
        async deleteShift({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve, reject) => {
                commit("shifts_request");
                axios({
                    url: `${rootState.server}` + "/api/delete_shift",
                    data: { id: data.id },
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "delete",
                }).then(resp => {
                    state.table_loading = false
                    commit("delete_shift", resp.data.result[0])
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("shifts_error");
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
export default shift;
