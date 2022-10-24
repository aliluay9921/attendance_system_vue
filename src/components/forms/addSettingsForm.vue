<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="selected_object.role"
              placeholder="القانون"
              label="القانون"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="selected_object.value"
              placeholder="ألقيمة"
              label="ألقيمة"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" align-self="center" class="text-center">
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn secondary color="secondary" @click="validateField">
                  {{ isEdit ? "تعديل القيد" : "أضافة قيد" }}
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn secondary color="secondary" @click="reset">
                  تصفير الحقول
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-form>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      role: "",
      value: "",

      rules: {
        required: (value) => !!value || "هذا الحقل مطلوب.",
        // min: (v) => v.length >= 6 || "يجب ان تكون كلمة المرور اكثر من 6 عناصر",
      },
    };
  },
  computed: {
    selected_object() {
      return this.$store.state.setting.selected_object;
    },
    isEdit() {
      return this.$store.state.setting.isEdit;
    },
  },
  methods: {
    validateField() {
      if (this.$refs.form.validate()) {
        let data = {};
        data["role"] = this.selected_object.role;
        data["value"] = this.selected_object.value;
        console.log(data);
        if (this.isEdit) {
          data["role_id"] = this.selected_object.id;
          this.editData(data);
          this.reset();
        } else {
          this.addData(data);
          this.reset();
        }
      }
    },
    addData(data) {
      this.$store.dispatch("setting/addSetting", data);
      this.$store.dispatch("setting/getSettings", data);
    },
    editData(data) {
      this.$store.dispatch("setting/editSetting", data);
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>
