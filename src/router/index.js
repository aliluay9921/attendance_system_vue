import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/login.vue";
import Employees from "../views/Employee.vue";
import Attendance from "../views/Attendance.vue";
import Absent from "../views/Absent.vue";
import Setting from "../views/setting.vue";
import hoilday from "../views/Hoilday.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      requireNotLogin: true,
    },
  },
  {
    path: "/",
    name: "employees",
    component: Employees,
    meta: {
      requireNotLogin: true,
    },
  },
  {
    path: "/attendance",
    name: "attendance",
    component: Attendance,
    meta: {
      requireNotLogin: true,
    },
  },
  {
    path: "/absents",
    name: "Absent",
    component: Absent,
    meta: {
      requireNotLogin: true,
    },
  },
  {
    path: "/settings",
    name: "Setting",
    component: Setting,
    meta: {
      requireNotLogin: true,
    },
  },
  {
    path: "/hoilday",
    name: "hoilday",
    component: hoilday,
    meta: {
      requireNotLogin: true,
    },
  },

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
