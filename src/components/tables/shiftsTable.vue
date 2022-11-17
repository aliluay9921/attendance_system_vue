<template>
  <v-container class="elevation-1">
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="660">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              تعديل الشفت
              <v-spacer></v-spacer>
              <v-btn icon color="red" @click="dialog = false">
                <v-icon dark> mdi-close </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="start_time"
                    placeholder="وقت البدء"
                    label="وقت البدء"
                    hide-details="auto"
                    clearable
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="end_time"
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
                @click="dialog = false"
              >
                غلق
              </v-btn>
              <v-btn
                class="secondary"
                color="white darken-1"
                text
                @click="editShift()"
              >
                تعديل الشفت
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog1" persistent max-width="660">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              حذف الشفت
              <v-spacer></v-spacer>
              <v-btn icon color="red" @click="dialog1 = false">
                <v-icon dark> mdi-close </v-icon>
              </v-btn>
            </v-card-title>

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
                @click="deleteShift()"
              >
                حذف
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <v-data-table
      :headers="headers"
      :items="shifts"
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
          <td class="text-start">
            <v-chip class="ma-2" color="primary">
              الشفت ال
              <span style="font-size: 18px">{{ item.shift }}</span></v-chip
            >
          </td>
          <td class="text-start">{{ item.start_time }}</td>
          <td class="text-start">{{ item.end_time }}</td>

          <br />

          <td class="text-start" style="display: flex; flex-diractions: row">
            <v-btn
              dark
              color="success"
              class="ml-2"
              @click="getItem(item, (type = 0))"
              >تعديل</v-btn
            >
            <v-btn
              dark
              color="red"
              class="ml-2"
              @click="getItem(item, (type = 1))"
              >حذف</v-btn
            >
          </td>
        </tr>
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
      bonus: "",

      //               <!-- < iframe src="//maps.google.com/maps?q=53.3381768,-6.2613077&z=15&output=embed"></iframe > -->

      headers: [
        {
          text: "أسم المستخدم ",
          value: "user",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "عدد الشفتات",
          value: "value",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "وقت الدخول",
          value: "date",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "وقت الخروج",
          value: "type",
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
      start_time: "",
      end_time: "",
    };
  },

  computed: {
    shifts() {
      return this.$store.state.shift.shifts;
    },
    table_loading() {
      return this.$store.state.shift.table_loading;
    },
    pageCount: function () {
      return this.$store.state.shift.pageCount;
    },
    totalItems: function () {
      return this.$store.state.shift.shifts.length;
    },
    shiftsQuery: {
      set(val) {
        this.$store.state.shift.shiftsQuery = val;
      },
      get() {
        return this.$store.state.shift.shiftsQuery;
      },
    },
    shifts_params: {
      set(val) {
        this.$store.state.shift.params = val;
      },
      get() {
        return this.$store.state.shift.params;
      },
    },
  },
  methods: {
    getItem(item, type) {
      this.item = item;
      if (type == 0) {
        this.start_time = item.start_time;
        this.end_time = item.end_time;
        this.dialog = true;
      } else {
        this.deleteShift(item);
        this.dialog1 = true;
      }
    },
    editShift() {
      let data = {};
      data["id"] = this.item.id;
      data["start_time"] = this.start_time;
      data["end_time"] = this.end_time;
      console.log(data);
      //   return;
      this.$store.dispatch("shift/editShift", data);
      this.dialog = false;
      this.start_time = "";
      this.end_time = "";
    },
    deleteShift(item) {
      this.$store.dispatch("shift/deleteShift", item);
    },

    queryChange(val) {
      this.searchDebounce();
    },

    getShifts() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
        dropdown: false,
      };
      // // console.log(this.query);
      this.settings_params = par;
      this.$store.dispatch("shift/getShifts");
    },

    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("shift/resetFields");
        this.pagination.page = 1;
        this.getShifts();
      }, 1000);
    },
  },
  created() {
    this.$store.dispatch("shift/resetFields");

    // this.getInvoicemnts();
  },
  watch: {
    pagination: {
      handler() {
        this.getShifts();
        this.shifts_params.page = 1;
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
