<template>
  <v-container class="elevation-1">
    <!-- delete employee -->

    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog1" persistent max-width="390">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              حذف الموضف
            </v-card-title>
            <v-card-text class="mt-5 text-h5 dark--text"
              ><b> هل أنت متأكد من عملية الحذف </b></v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="dialog1 = false"
              >
                غلق
              </v-btn>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="deleteEmployee()"
              >
                تأكيد الحذف
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <!-- add employee -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="1000">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              أضافة موضف جديد
              <v-spacer></v-spacer>
              <v-btn icon color="red" @click="close">
                <v-icon dark> mdi-close </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <AddEmployeeForm></AddEmployeeForm>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <!--  add bonus -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog2" persistent max-width="660">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              أضافة مكافئة
              <v-spacer></v-spacer>
              <v-btn icon color="red" @click="dialog2 = false">
                <v-icon dark> mdi-close </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="bonus"
                    placeholder="المكافئة"
                    label="المكافئة"
                    hide-details="auto"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-radio-group v-model="type">
                    <v-radio label="مكافئة" value="1"></v-radio>
                    <v-radio label="مكافئة خاصة" value="2"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="dialog2 = false"
              >
                غلق
              </v-btn>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="addBonus()"
              >
                أضافة مكافئة
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <!-- add shift -->

    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog3" persistent max-width="660">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              أضافة مكافئة
              <v-spacer></v-spacer>
              <v-btn icon color="red" @click="dialog3 = false">
                <v-icon dark> mdi-close </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="start_shift"
                    placeholder="وقت تسجيل الحضور"
                    label="وقت تسجيل الحضور"
                    hide-details="auto"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="end_shift"
                    placeholder="وقت المغادرة"
                    label="وقت المغادرة"
                    hide-details="auto"
                    clearable
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="dialog3 = false"
              >
                غلق
              </v-btn>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="addShift()"
              >
                أضافة شفت
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <v-data-table
      :headers="headers"
      :items="employees"
      :options.sync="pagination"
      :loading="table_loading || false"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-start">{{ item.user_name }}</td>
          <td class="text-start">{{ item.full_name }}</td>
          <td class="text-start">{{ item.salary }}$</td>
          <td class="text-start">
            <v-chip
              class="ma-2"
              color="primary"
              v-for="(shift, index) in item.shift"
              :key="index"
              >{{ shift.start_time }} || {{ shift.end_time }}</v-chip
            >
          </td>
          <td class="text-start">{{ item.bonus }}</td>
          <td class="text-start">{{ item.coustom_bonus }}</td>
          <td class="text-start">{{ item.absent_count }}</td>
          <td class="text-start">{{ item.num_clock }}</td>
          <td class="text-start">
            {{ item.salary + item.bonus + item.coustom_bonus - item.rival }} $
          </td>
          <td class="text-start" style="display: flex; flex-diractions: row">
            <v-btn
              dark
              class="ml-2 mt-2"
              color="error"
              @click="getItem(item, (type = 0))"
              >حذف</v-btn
            >
            <v-btn
              dark
              color="success"
              class="ml-2 mt-2"
              @click="getItem(item, (type = 1))"
              >تعديل</v-btn
            >
            <v-btn
              dark
              color="info"
              class="ml-2 mt-2"
              @click="getItem(item, (type = 2))"
              >أضافة مكافئة</v-btn
            >
            <v-btn
              dark
              color="orange"
              class="ml-2 mt-2"
              @click="getItem(item, (type = 3))"
              >أضافة شفت</v-btn
            >
          </td>
        </tr>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول الموضفين</v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn
            style="color: black"
            dark
            color="creamy"
            rounded
            elevation="6"
            @click="dialog = true"
          >
            أضافة موضف جديد
          </v-btn>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="employeesQuery"
            @input="queryChange"
            append-icon="mdi-magnify"
            label="بحث"
            single-line
            hide-details
            class="mr-5"
          ></v-text-field>
        </v-toolbar>
      </template>
    </v-data-table>
    <div class="text-center pt-2 mt-3">
      <v-row>
        <v-col align-self="center" cols="2" offset="2">
          <v-select
            v-model="pagination.itemsPerPage"
            :items="items"
            label="عدد العناصر في الصفحة"
          ></v-select>
        </v-col>
        <v-col align-self="center" cols="4">
          <v-pagination
            v-model="pagination.page"
            :length="pageCount"
            circle
          ></v-pagination>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script>
import AddEmployeeForm from "../forms/AddEmployeeForm.vue";

export default {
  data() {
    return {
      search: "",
      item: {},

      headers: [
        {
          text: "أسم المستخدم",
          value: "user_name",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "الأسم الكامل",
          value: "full_name",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: " الراتب الأسمي",
          value: "salary",
          align: "start",
          class: "nutty white--text title ",
        },

        {
          text: " الشفتات ",
          value: "shift",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "المكافئات",
          value: "bonus",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: " المكافئات الخاصة",
          value: "coustom_bonus",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "عدد أيام الغياب",
          value: "absent_count",
          align: "start",
          class: "nutty white--text title ",
        },

        {
          text: "عدد ساعات التأخير",
          value: "num_clock",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "الراتب النهائي",
          value: "rival",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "العمليات",
          value: "actions",
          align: "start",
          class: "nutty white--text title ",
        },
      ],
      pagination: {},
      items: [5, 10, 25, 50, 100],
      dialog: false,
      dialog1: false,
      dialog2: false,
      dialog3: false,
      type: "",
      bonus: "",
      start_shift: "",
      end_shift: "",
    };
  },
  components: {
    AddEmployeeForm,
  },
  computed: {
    employees() {
      return this.$store.state.employees.employees;
    },
    table_loading() {
      return this.$store.state.employees.table_loading;
    },
    pageCount: function () {
      return this.$store.state.employees.pageCount;
    },
    totalItems: function () {
      return this.$store.state.employees.employeess.length;
    },
    employeesQuery: {
      set(val) {
        this.$store.state.employees.employeesQuery = val;
      },
      get() {
        return this.$store.state.employees.employeesQuery;
      },
    },
    employees_params: {
      set(val) {
        this.$store.state.employees.params = val;
      },
      get() {
        return this.$store.state.employees.params;
      },
    },
  },
  methods: {
    addBonus() {
      let data = {};
      data["user_id"] = this.item.id;
      data["type"] = this.type;
      data["bonus"] = this.bonus;
      console.log(data);
      this.$store.dispatch("employees/addBonus", data);
      this.getEmployees();
      this.dialog2 = false;
    },
    addShift() {
      let data = {};
      data["user_id"] = this.item.id;
      data["start_time"] = this.start_shift;
      data["end_time"] = this.end_shift;
      this.$store.dispatch("employees/addShift", data);
      this.getEmployees();
      this.dialog3 = false;
    },
    close() {
      this.dialog = false;
      this.$store.state.employees.selected_object = {};
      this.$store.state.employees.isEdit = false;
    },
    queryChange(val) {
      this.searchDebounce();
    },
    getItem(item, type) {
      if (type == 0) {
        this.item = item;
        this.dialog1 = true;
      } else if (type == 1) {
        this.$store.state.employees.selected_object = {};
        Object.assign(this.$store.state.employees.selected_object, item);
        this.$store.state.employees.isEdit = true;
        this.dialog = true;
      } else if (type == 2) {
        this.item = item;
        this.dialog2 = true;

        console.log(item);
      } else {
        this.item = item;
        this.dialog3 = true;
      }
    },
    deleteEmployee() {
      console.log(this.item);

      this.$store.dispatch("employees/deleteEmployee", this.item);
      this.dialog1 = false;
      this.item = {};
    },
    getEmployees() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
        dropdown: false,
      };
      // // console.log(this.query);
      this.employees_params = par;
      this.$store.dispatch("employees/getEmployees");
    },

    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("employees/resetFields");
        this.pagination.page = 1;
        this.getEmployees();
      }, 1000);
    },
  },
  created() {
    this.$store.dispatch("employees/resetFields");

    // this.getInvoicemnts();
  },
  watch: {
    pagination: {
      handler() {
        this.getEmployees();
        this.employees_params.page = 1;
      },
      deep: true,
    },
  },
};
</script>
<style>
/* هاي تخلي الهدر مرتب كلة */
.v-data-table-header th {
  white-space: nowrap;
}
</style>
