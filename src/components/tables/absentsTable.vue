<template>
  <v-container class="elevation-1">
    <v-data-table
      :headers="headers"
      :items="absents"
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
          <td class="text-start" v-if="item.status == 0">غائب</td>
          <td class="text-start" v-else>مجاز</td>
          <td class="text-start">{{ item.date }}</td>
          <td class="text-start">{{ item.user.absent_count }}</td>
          <td class="text-start">
            <v-btn dark color="error" class="ml-2" @click="getItem(item)"
              >تحويل الى مجاز</v-btn
            >
          </td>
          <br />
        </tr>
      </template>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>جدول الغياب</v-toolbar-title>
          <v-row style="margin-top: 15px">
            <v-col>
              <v-text-field
                v-model="absentsQuery"
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

      headers: [
        {
          text: "أسم الموضف",
          value: "user_name",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "الحالة",
          value: "status",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "التأريخ",
          value: "date",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "عدد ايام الغياب ",
          value: "absent_count",
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
      menu: null,
      date: "",
    };
  },

  computed: {
    absents() {
      return this.$store.state.absent.absents;
    },
    table_loading() {
      return this.$store.state.absent.table_loading;
    },
    pageCount: function () {
      return this.$store.state.absent.pageCount;
    },
    totalItems: function () {
      return this.$store.state.absent.absents.length;
    },
    absentsQuery: {
      set(val) {
        this.$store.state.absent.absentsQuery = val;
      },
      get() {
        return this.$store.state.absent.absentsQuery;
      },
    },
    absents_params: {
      set(val) {
        this.$store.state.absent.params = val;
      },
      get() {
        return this.$store.state.absent.params;
      },
    },
  },
  methods: {
    getItem(item) {
      console.log(item);
      this.item = item;
      this.$store.dispatch("absent/changeStatusAbsent", item);
    },

    queryChange(val) {
      this.searchDebounce();
    },

    getAbsents() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
      };
      // // console.log(this.query);
      this.absents_params = par;
      const current = new Date();
      const moment = require("moment");
      this.date = moment(current).format("YYYY-MM-DD");
      var filter = { name: "date", value: this.date };
      Object.assign(this.$store.state.absent.filter, filter);
      this.$store.dispatch("absent/getAbsents");
    },
    filter() {
      var filter = { name: "date", value: this.date };
      Object.assign(this.$store.state.absent.filter, filter);
      this.$store.state.absent.selected_object = {};
      this.$store.state.absent.isEdit = false;

      this.$store.dispatch("absent/getAbsents");
      // this.getSalesCategories();
    },
    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("absent/resetFields");
        this.pagination.page = 1;
        this.getAbsents();
      }, 1000);
    },
  },
  created() {
    this.$store.dispatch("absent/resetFields");
    // this.getInvoicemnts();
  },
  watch: {
    pagination: {
      handler() {
        this.getAbsents();
        this.absents_params.page = 1;
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
