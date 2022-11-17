<template>
  <v-container class="elevation-1">
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="660">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              تعديل مكافئة
              <v-spacer></v-spacer>
              <v-btn icon color="red" @click="dialog = false">
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
                @click="editBonus()"
              >
                تعديل مكافئة
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    <v-data-table
      :headers="headers"
      :items="bonuses"
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
          <td class="text-start">{{ item.bonus }}</td>
          <td class="text-start">{{ item.date }}</td>
          <td class="text-start">
            <v-chip class="ma-2" color="primary" v-if="item.type == 1"
              >مكافئة</v-chip
            >
            <v-chip class="ma-2" color="orange" v-else>مكافئة خاصة</v-chip>
          </td>

          <br />

          <td class="text-start" style="display: flex; flex-diractions: row">
            <v-btn dark color="success" class="ml-2" @click="getItem(item)"
              >تعديل</v-btn
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
          text: "قيمة المكافئة ",
          value: "value",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "تأريخ المكافئة",
          value: "date",
          align: "start",
          class: "nutty white--text title ",
        },
        {
          text: "نوع المكافئة",
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
    };
  },

  computed: {
    bonuses() {
      return this.$store.state.bouns.bonuses;
    },
    table_loading() {
      return this.$store.state.bouns.table_loading;
    },
    pageCount: function () {
      return this.$store.state.bouns.pageCount;
    },
    totalItems: function () {
      return this.$store.state.bouns.bonuses.length;
    },
    bounsesQuery: {
      set(val) {
        this.$store.state.bouns.bounsesQuery = val;
      },
      get() {
        return this.$store.state.bouns.bounsesQuery;
      },
    },
    bounses_params: {
      set(val) {
        this.$store.state.bouns.params = val;
      },
      get() {
        return this.$store.state.bouns.params;
      },
    },
  },
  methods: {
    getItem(item) {
      this.item = item;
      this.dialog = true;
    },
    editBonus() {
      let data = {};
      data["id"] = this.item.id;
      data["bonus"] = this.bonus;
      console.log(data);
      //   return;
      this.$store.dispatch("bouns/editBonus", data);
      this.dialog = false;
      this.bonus = "";
    },

    queryChange(val) {
      this.searchDebounce();
    },

    getBounses() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
        dropdown: false,
      };
      // // console.log(this.query);
      this.settings_params = par;
      this.$store.dispatch("bouns/getBounses");
    },

    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("bouns/resetFields");
        this.pagination.page = 1;
        this.getBounses();
      }, 1000);
    },
  },
  created() {
    this.$store.dispatch("bouns/resetFields");

    // this.getInvoicemnts();
  },
  watch: {
    pagination: {
      handler() {
        this.getBounses();
        this.bounses_params.page = 1;
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
