<template>
  <v-container class="elevation-1">
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              الموقع
              <v-spacer></v-spacer>
              <v-btn icon color="red" @click="dialog = false">
                <v-icon dark> mdi-close </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <iframe
                width="500"
                height="360"
                frameborder="0"
                scrolling="no"
                marginheight="0"
                marginwidth="0"
                :src="
                  googleMapDomain +
                  item.lat_tude +
                  ',' +
                  item.lang_tude +
                  googleMapEnd
                "
              >
                <small>
                  <a
                    href="https://maps.google.com/maps?q='+data.lat+','+data.lon+'&hl=es;z=14&amp;output=embed"
                    style="color: #0000ff; text-align: left"
                    target="_blank"
                  >
                    See map bigger
                  </a>
                </small>
              </iframe>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <v-btn dark color="primary" class="ml-2 mt-2" @click="addAbsent()"
      >بدأ تسجيل الغياب
    </v-btn>

    <v-data-table
      :headers="headers"
      :items="attendances"
      :options.sync="pagination"
      :loading="table_loading || false"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-start">{{ item.user.full_name }}</td>
          <td class="text-start">{{ item.attendance_time }}</td>
          <td class="text-start">{{ item.user.start_attendance }}</td>
          <td class="text-start">{{ item.leaving_time }}</td>
          <td class="text-start">{{ item.user.leave_attendance }}</td>
          <td class="text-start">{{ item.mac_address }}</td>
          <td class="text-start">{{ item.ip_mobile }}</td>
          <td class="text-start">{{ item.date }}</td>
          <td class="text-start">{{ item.over_time }}</td>

          <br />

          <td class="text-start" style="display: flex; flex-diractions: row">
            <v-btn dark color="success" class="ml-2" @click="getItem(item)"
              >الموقع</v-btn
            >
            <v-btn dark color="info" class="ml-2" @click="getItem(item)"
              >أضافة مكافئة</v-btn
            >
          </td>
        </tr>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول الحضور</v-toolbar-title>
          <v-row style="margin-top: 15px">
            <v-col>
              <v-text-field
                v-model="attendancesQuery"
                @input="queryChange"
                append-icon="mdi-magnify"
                label="بحث"
                single-line
                hide-details
                class="mr-5"
              ></v-text-field
            ></v-col>
            <v-col>
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
                style="margin-top: 60px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="التأريخ"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  @input="menu = false"
                  @change="filter"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
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
export default {
  data() {
    return {
      search: "",
      item: {},
      lat: "",
      lang: "",
      //               <!-- < iframe src="//maps.google.com/maps?q=53.3381768,-6.2613077&z=15&output=embed"></iframe > -->

      googleMapDomain: "https://maps.google.com/maps?q=",
      googleMapEnd: "&z=18&output=embed",

      headers: [
        {
          text: "أسم الموضف",
          value: "user_name",
          align: "start",
          class: "secondary white--text title ",
        },
        {
          text: "وقت الحضور",
          value: "attendance_time",
          align: "start",
          class: "secondary white--text title ",
        },
        {
          text: "وقت الحضور المطلوب",
          value: "start_attendance",
          align: "start",
          class: "secondary white--text title ",
        },
        {
          text: "وقت المغادرة",
          value: "leaving_time",
          align: "start",
          class: "secondary white--text title ",
        },
        {
          text: "وقت المغادرةالمطلوب",
          value: "leave_attendance",
          align: "start",
          class: "secondary white--text title ",
        },
        {
          text: "الماك ادريس",
          value: "mac_address",
          align: "start",
          class: "secondary white--text title ",
        },
        {
          text: "عنوان الموبايل",
          value: "ip_mobile",
          align: "start",
          class: "secondary white--text title ",
        },
        {
          text: "التأريخ ",
          value: "date",
          align: "start",
          class: "secondary white--text title ",
        },
        {
          text: "الوقت الأضافي",
          value: "over_time",
          align: "start",
          class: "secondary white--text title ",
        },
        {
          text: "العمليات",
          value: "actions",
          align: "start",
          class: "secondary white--text title ",
        },
      ],
      pagination: {},
      items: [5, 10, 25, 50, 100],
      dialog: false,
      menu: null,
      date: "",
    };
  },

  computed: {
    attendances() {
      return this.$store.state.attendance.attendances;
    },
    table_loading() {
      return this.$store.state.attendance.table_loading;
    },
    pageCount: function () {
      return this.$store.state.attendance.pageCount;
    },
    totalItems: function () {
      return this.$store.state.attendance.attendances.length;
    },
    attendancesQuery: {
      set(val) {
        this.$store.state.attendance.attendancesQuery = val;
      },
      get() {
        return this.$store.state.attendance.attendancesQuery;
      },
    },
    attendances_params: {
      set(val) {
        this.$store.state.attendance.params = val;
      },
      get() {
        return this.$store.state.attendance.params;
      },
    },
  },
  methods: {
    addAbsent() {
      this.$store.dispatch("absent/addAbsent");
    },
    filter() {
      var filter = { name: "date", value: this.date };
      Object.assign(this.$store.state.attendance.filter, filter);
      this.$store.state.attendance.selected_object = {};
      this.$store.state.attendance.isEdit = false;

      this.$store.dispatch("attendance/getAttendances");
      // this.getSalesCategories();
    },
    getItem(item) {
      this.item = item;
      this.dialog = true;
    },

    queryChange(val) {
      this.searchDebounce();
    },

    getAttendances() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
        dropdown: false,
      };
      // // console.log(this.query);
      this.attendances_params = par;

      const current = new Date();
      const moment = require("moment");
      this.date = moment(current).format("YYYY-MM-DD");
      var filter = { name: "date", value: this.date };
      Object.assign(this.$store.state.attendance.filter, filter);
      this.$store.dispatch("attendance/getAttendances");
    },

    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("attendance/resetFields");
        this.pagination.page = 1;
        this.getAttendances();
      }, 1000);
    },
  },
  created() {
    this.$store.dispatch("attendance/resetFields");

    // this.getInvoicemnts();
  },
  watch: {
    pagination: {
      handler() {
        this.getAttendances();
        this.attendances_params.page = 1;
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
