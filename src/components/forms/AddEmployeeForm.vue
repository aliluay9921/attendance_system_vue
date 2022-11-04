<template>
  <v-container>
    <v-form ref="form" class="mr-10">
      <v-col cols="12" md="12" lg="12">
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="selected_object.user_name"
              placeholder="أسم المستخدم"
              label="أسم المستخدم"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="selected_object.full_name"
              placeholder="الأسم الكامل"
              label="الأسم الكامل"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4" v-if="!isEdit">
            <v-text-field
              v-model="selected_object.password"
              placeholder="كلمة المرور"
              label="كلمة المرور"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="selected_object.salary"
              placeholder="الراتب"
              label="الراتب"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="selected_object.start_attendance"
              placeholder="وقت الدوام"
              label="وقت الدوام"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="selected_object.leave_attendance"
              placeholder="وقت المغادرة"
              label="وقت المغادرة"
              hide-details="auto"
              :rules="[rules.required]"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="3">
            <v-text-field
              v-model="selected_object.shift"
              placeholder="عدد الشفتات"
              label="عدد الشفتات"
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
      user_name: "",
      full_name: "",
      password: "",
      salary: "",
      start_attendance: "",
      leave_attendance: "",

      rules: {
        required: (value) => !!value || "هذا الحقل مطلوب.",
        // min: (v) => v.length >= 6 || "يجب ان تكون كلمة المرور اكثر من 6 عناصر",
      },
    };
  },
  computed: {
    selected_object() {
      return this.$store.state.employees.selected_object;
    },
    isEdit() {
      return this.$store.state.employees.isEdit;
    },
  },
  methods: {
    validateField() {
      if (this.$refs.form.validate()) {
        let data = {};
        data["user_name"] = this.selected_object.user_name;
        data["full_name"] = this.selected_object.full_name;
        data["password"] = this.selected_object.password;
        data["salary"] = this.selected_object.salary;
        data["shift"] = this.selected_object.shift;
        data["start_attendance"] = this.selected_object.start_attendance;
        data["leave_attendance"] = this.selected_object.leave_attendance;
        console.log(data);
        if (this.isEdit) {
          data["user_id"] = this.selected_object.id;
          this.editData(data);
          this.reset();
        } else {
          this.addData(data);
          this.reset();
        }
      }
    },
    addData(data) {
      this.$store.dispatch("employees/addEmployee", data);
      this.$store.dispatch("employees/getEmployees", data);
    },
    editData(data) {
      this.$store.dispatch("employees/editEmployee", data);
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>
