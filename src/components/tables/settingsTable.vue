<template>
  <v-container class="elevation-1">
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="1000">
          <v-card>
            <v-card-title class="text-h5 secondary white--text">
              أضافة قانون جديد
              <v-spacer></v-spacer>
              <v-btn icon color="red" @click="dialog = false">
                <v-icon dark> mdi-close </v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <addSettingsForm></addSettingsForm>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
    <v-btn
      style="color: black"
      dark
      color="creamy"
      rounded
      elevation="6"
      @click="dialog = true"
    >
      أضافة قانون جديد
    </v-btn>
    <v-data-table
      :headers="headers"
      :items="settings"
      :options.sync="pagination"
      :loading="table_loading || false"
      :page.sync="pagination.page"
      :items-per-page="pagination.itemsPerPage"
      hide-default-footer
      loading-text="جاري التحميل يرجى الأنتظار"
    >
      <template v-slot:item="{ item }">
        <tr>
          <td class="text-start">{{ item.role }}</td>
          <td class="text-start">{{ item.value }}</td>

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
import addSettingsForm from "../forms/addSettingsForm.vue";

export default {
  data() {
    return {
      search: "",
      item: {},

      //               <!-- < iframe src="//maps.google.com/maps?q=53.3381768,-6.2613077&z=15&output=embed"></iframe > -->

      headers: [
        {
          text: "القانون ",
          value: "role",
          align: "start",
          class: "secondary white--text title ",
        },
        {
          text: "القيمة ",
          value: "value",
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
    };
  },
  components: {
    addSettingsForm,
  },

  computed: {
    settings() {
      return this.$store.state.setting.settings;
    },
    table_loading() {
      return this.$store.state.setting.table_loading;
    },
    pageCount: function () {
      return this.$store.state.setting.pageCount;
    },
    totalItems: function () {
      return this.$store.state.setting.settings.length;
    },
    settingsQuery: {
      set(val) {
        this.$store.state.setting.settingsQuery = val;
      },
      get() {
        return this.$store.state.setting.settingsQuery;
      },
    },
    settings_params: {
      set(val) {
        this.$store.state.setting.params = val;
      },
      get() {
        return this.$store.state.setting.params;
      },
    },
  },
  methods: {
    getItem(item) {
      this.item = item;
      this.$store.state.setting.selected_object = {};
      Object.assign(this.$store.state.setting.selected_object, item);
      this.$store.state.setting.isEdit = true;
      this.dialog = true;
    },

    queryChange(val) {
      this.searchDebounce();
    },

    getSettings() {
      let pagination = this.pagination;
      let par = {
        ...pagination,
        dropdown: false,
      };
      // // console.log(this.query);
      this.settings_params = par;
      this.$store.dispatch("setting/getSettings");
    },

    searchDebounce() {
      clearTimeout(this._timerId);
      // delay new call 1000ms
      this._timerId = setTimeout(() => {
        this.$store.dispatch("setting/resetFields");
        this.pagination.page = 1;
        this.getSettings();
      }, 1000);
    },
  },
  created() {
    this.$store.dispatch("setting/resetFields");

    // this.getInvoicemnts();
  },
  watch: {
    pagination: {
      handler() {
        this.getSettings();
        this.settings_params.page = 1;
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
