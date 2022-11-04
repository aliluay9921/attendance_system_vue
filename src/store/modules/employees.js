import Vue from "vue";
import axios from "axios";

const employees = {
    namespaced: true,
    state: () => ({
        employees: [],
        employees_state: "done",
        table_loading: false,
        employeesQuery: "",
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
        employees_success(state, employees) {
            state.employees.splice(0, state.employees.length)
            employees.forEach(element => {
                state.employees.push(element)
            });
            state.employees_state = "done"
            state.table_loading = false

        },
        employees_request(state) {
            state.employees_state = "loading";
        },

        employees_error(state) {
            state.employees_state = "error";
        },
        add_employees_success(state, employees) {
            state.employees.unshift(employees);
            state.employees_state = "done";
            state.table_loading = false;
            console.log(employees);
        },
        employees_dropdown_success(state, employees) {

            state.table_loading = false;
            if (employees.length == 0) {
                state.employees_state = "finished";
                if (state.params.page > 1)
                    state.params.page = state.params.page - 1;
                return;
            }
            state.params.page = state.params.page + 1;
            employees.forEach((employees) => {
                state.employees.push(employees);
            });
            state.employees_state = "done";
        },
        employee_edit_success(state, employee) {
            let index = state.employees.findIndex((e) => e.id == employee.id);
            Vue.set(state.employees, index, employee);
            state.employees_state = "done";
            state.table_loading = false;
        },

        delete_employees(state, employees) {
            let index = state.employees.findIndex((e) => e.id == employees.id);
            state.employees.splice(index, 1)
            state.employees_state = "done";
            state.table_loading = false;
        },

        add_bonus_success(state, employee) {
            console.log(employee);
            let index = state.employees.findIndex((e) => e.id == employee.id);
            console.log(state.employees[index]);
            Vue.set(state.employees, index, employee);
            state.employees_state = "done";
            state.table_loading = false;
        },
        add_shift_success(state, employee) {
            console.log(employee);
            let index = state.employees.findIndex((e) => e.id == employee.id);
            console.log(state.employees[index]);
            Vue.set(state.employees, index, employee);
            state.employees_state = "done";
            state.table_loading = false;
        },
    },
    actions: {
        async resetFields({ state }) {
            state.employees_state = "done";
            state.employees = [];
            state.table_loading = false;
            state.params = {
                dropdown: true,
                page: 1,
                itemsPerPage: 10,
            };
        },
        async getEmployees({ commit, state, dispatch, rootState }) {
            if (state.employees_state != "done") return -1;
            state.table_loading = true;
            console.log("here")
            let data = state.params;

            let skip = (data.page - 1) * data.itemsPerPage;
            let limit = data.itemsPerPage;
            let query = "";
            if (
                state.employeesQuery != undefined &&
                state.employeesQuery != null &&
                state.employeesQuery.length > 0
            ) query = `&query=${state.employeesQuery}`;
            return new Promise((resolve, reject) => {

                axios({
                    url: `${rootState.server}` + "/api/get_users" + "?skip=" + skip +
                        "&limit=" +
                        limit +
                        query,
                    method: "GET",
                }).then(resp => {

                    state.table_loading = false;
                    state.pageCount = resp.data.count;
                    if (data.dropdown == false) {
                        commit('employees_success', resp.data.result)
                        dispatch("snackbarToggle", { toggle: true, text: resp.data.message }, { root: true });
                    } else {
                        commit("employees_dropdown_success", resp.data.result);
                    }

                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    reject(err);
                    commit("employees_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );
                    console.warn(err);
                });
            })

        },
        async addEmployee({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("employees_request");
                axios({
                    url: `${rootState.server}` + "/api/add_user",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_employees_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    console.log(err);
                    state.table_loading = false;
                    commit("employees_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },

        async addBonus({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("employees_request");
                axios({
                    url: `${rootState.server}` + "/api/add_bonus",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_bonus_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    console.log(err);
                    state.table_loading = false;
                    commit("employees_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },
        async addShift({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("employees_request");
                axios({
                    url: `${rootState.server}` + "/api/add_shift",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                }).then(resp => {
                    state.table_loading = false;
                    commit("add_shift_success", resp.data.result[0]);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    console.log(err);
                    state.table_loading = false;
                    commit("employees_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },


        async editEmployee({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve, reject) => {
                commit("sale_category_request");
                axios({
                    url: `${rootState.server}` + "/api/update_user",
                    data: data,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PUT",
                }).then(resp => {
                    state.table_loading = false
                    commit("employee_edit_success", resp.data.result[0])
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("employees_error");
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: err.response.data.message },
                        { root: true }
                    );

                    console.warn(err);
                });
            });
        },
        async deleteEmployee({ commit, state, dispatch, rootState }, data) {
            state.table_loading = true
            return new Promise((resolve) => {
                commit("employees_request");
                axios({
                    url: `${rootState.server}` + "/api/delete_user",
                    data: { user_id: data.id },
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "delete",
                }).then(resp => {
                    state.table_loading = false;
                    // console.log(resp)
                    commit("delete_employees", data);
                    dispatch(
                        "snackbarToggle",
                        { toggle: true, text: resp.data.message },
                        { root: true }
                    );
                    resolve(resp);
                }).catch((err) => {
                    state.table_loading = false;
                    commit("employees_error");
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
export default employees;
