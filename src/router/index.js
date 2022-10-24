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
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/employees",
    name: "employees",
    component: Employees,
  },
  {
    path: "/attendance",
    name: "attendance",
    component: Attendance,
  },
  {
    path: "/absents",
    name: "Absent",
    component: Absent,
  },
  {
    path: "/settings",
    name: "Setting",
    component: Setting,
  },
  {
    path: "/hoilday",
    name: "hoilday",
    component: hoilday,
  },

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
