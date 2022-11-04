<template>
  <v-container class="elevation-1">
    <v-data-table
      :headers="headers"
      :items="holidays"
      :options.sync="pagination"
      :loading="table_loading || false"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-start">{{ item.title }}</td>
          <td class="text-start">{{ item.body }}</td>
          <td class="text-start" v-if="!item.from_day">_</td>
          <td class="text-start" v-else>
            {{ item.from_day }}
            <!-- <span>{{ item.from_day | moment("dd,MM,YYYY") }}</span> -->
          </td>

          <td class="text-start" v-if="!item.to_day">_</td>
          <td class="text-start" v-else>{{ item.to_day }}</td>

          <td class="text-start" v-if="!item.from_hour">_</td>
          <td class="text-start" v-else>{{ item.from_hour }}</td>

          <td class="text-start" v-if="!item.to_hour">_</td>
          <td class="text-start" v-else>{{ item.to_hour }}</td>

          <td class="text-start">{{ item.user.full_name }}</td>
        </tr>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول العطل</v-toolbar-title>
          <v-row style="margin-top: 15px">
            <v-col>
              <v-text-field
                v-model="holidaysQuery"
                @input="queryChange"
                append-icon="mdi-magnify"
                label="بحث"
                single-line
                hide-details
                class="mr-5"
              ></v-text-field
            ></v-col>
            <!-- <v-col>
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
            </v-col> -->
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

      headers: [
        {
          text: "العنوان",
          value: "title",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "النص",
          value: "body",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "من تأريخ اليوم",
          value: "from_day",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "الى تأريخ اليوم",
          value: "to_day",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "من ساعة",
          value: "from_hour",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "الى ساعة",
          value: "to_hour",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "أسم المستخدم",
          value: "user_id",
          align: "start",
          class: "nutty white--text title ",
        },
      ],
      pagination: {},
      items: [5, 10, 25, 50, 100],
      dialog: false,
      // menu: null,
      // date: "",
    };
  },

  computed: {
    holidays() {
      return this.$store.state.holiday.holidays;
    },
    table_loading() {
      return this.$store.state.holiday.table_loading;
    },
    pageCount: function () {
      return this.$store.state.holiday.pageCount;
    },
    totalItems: function () {
      return this.$store.state.holiday.holidays.length;
    },
    holidaysQuery: {
      set(val) {
        this.$store.state.holiday.holidaysQuery = val;
      },
      get() {
        return this.$store.state.holiday.holidaysQuery;
      },
    },
    holidays_params: {
      set(val) {
        this.$store.state.holiday.params = val;
      },
      get() {
        return this.$store.state.holiday.params;
      },
    },
  },
  methods: {
    // filter() {
    //   var filter = { name: "date", value: this.date };
    //   Object.assign(this.$store.state.holiday.filter, filter);
    //   this.$store.state.holiday.selected_object = {};
    //   this.$store.state.holiday.isEdit = false;
    //   this.$store.dispatch("holiday/getHolidays");
    //   // this.getSalesCategories();
    // },
    getItem(item) {
      this.item = item;
      this.dialog = true;
    },

    queryChange(val) {
      this.searchDebounce();
    },

    getHolidays() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
        dropdown: false,
      };
      // // console.log(this.query);
      this.holidays_params = par;

      // const current = new Date();
      // const moment = require("moment");
      // this.date = moment(current).format("YYYY-MM-DD");
      // var filter = { name: "date", value: this.date };
      // Object.assign(this.$store.state.holiday.filter, filter);
      this.$store.dispatch("holiday/getHolidays");
    },

    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("holiday/resetFields");
        this.pagination.page = 1;
        this.getHolidays();
      }, 1000);
    },
  },
  created() {
    this.$store.dispatch("holiday/resetFields");

    // this.getInvoicemnts();
  },
  watch: {
    pagination: {
      handler() {
        this.getHolidays();
        this.holidays_params.page = 1;
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
