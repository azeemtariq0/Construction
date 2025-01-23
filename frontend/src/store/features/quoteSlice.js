import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import api from "../../axiosInstance";

export const getQuotesList = createAsyncThunk(
  "quote/lists",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/request", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const createQuote = createAsyncThunk(
  "quote/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/request", data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const updateQuote = createAsyncThunk(
  "quote/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/request/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const deleteQuote = createAsyncThunk(
  "quote/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/request/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const bulkDeleteQuotes = createAsyncThunk(
  "quote/bulkDelete",
  async (ids, { rejectWithValue }) => {
    try {
      await api.post("/request/bulk-delete", {
        quote_request_ids: ids,
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const getQuote = createAsyncThunk(
  "quote/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/request/${id}`);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const getQuoteLogs = createAsyncThunk(
  "quoteLogs/getLogs",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get(`/log-history`, {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const startReview = createAsyncThunk(
  "quote/startReview",
  async (data, { rejectWithValue }) => {
    try {
      await api.post(`/request/add-assignee`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const changeAssignee = createAsyncThunk(
  "quote/changeAssignee",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/request/change-assignee", data);
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

const initialState = {
  isFormSubmitting: false,
  isLoading: false,
  selectRequestTypeModal: false,
  selectedRequestType: null,
  list: [],
  logs: [],
  deleteIDs: [],
  isQuoteGetting: false,
  initialFormValues: null,
  attachments: [],
  old_files: [],
  finalQuote: null,
  oldFinalQuote: null,
  comments: "",
  isLogsGetting: false,
  isAssigneeChanging: false,
  params: {
    page: 1,
    limit: 50,
    search: "",
    sort_column: null,
    sort_direction: null,
    name: "",
    description: "",
  },
  paginationInfo: {
    total_records: 0,
    total_pages: 0,
  },
  logParams: {
    page: 1,
    limit: 50,
    sort_column: null,
    sort_direction: null,
  },
  logPaginationInfo: {
    total_records: 0,
    total_pages: 0,
  },
};

export const quoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: {
    setQuoteListParams: (state, action) => {
      state.params = { ...state.params, ...action.payload };
    },

    setLogParams: (state, action) => {
      state.logParams = { ...state.logParams, ...action.payload };
    },

    setQuoteDeleteIDs: (state, action) => {
      state.deleteIDs = action.payload;
    },

    addAttachment: (state, action) => {
      state.attachments.push(action.payload);
      // state.old_files.unshift(null);
    },

    removeAttachment: (state, action) => {
      // const deleteIndex = state.attachments.findIndex(
      //   (item) => item.uid === action.payload,
      // );
      // state.attachments.splice(deleteIndex, 1);
      // state.old_files.splice(deleteIndex, 1);
      const fileName = action.payload;
      state.attachments = state.attachments.filter(
        (item) => item.name !== fileName,
      );
      state.old_files.push(fileName);
    },

    setFinalQuote: (state, action) => {
      state.finalQuote = action.payload;

      if (!action.payload) {
        state.oldFinalQuote = null;
      }
    },

    setInitialFormData: (state, action) => {
      const { tab, data } = action.payload;
      state.initialFormValues = Object.assign(state.initialFormValues || {}, {
        [tab]: { ...state.initialFormValues?.[tab], ...data },
      });
    },

    setComments: (state, action) => {
      state.comments = action.payload;
    },

    setSelectRequestTypeModal: (state, action) => {
      state.selectRequestTypeModal = action.payload;
    },

    setSelectedRequestType: (state, action) => {
      state.selectedRequestType = action.payload;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getQuotesList.pending, (state, action) => {
      state.isLoading = true;
      state.initialFormValues = null;
      state.attachments = [];
      state.old_files = [];
      state.finalQuote = null;
      state.selectedRequestType = null;
    });
    addCase(getQuotesList.fulfilled, (state, action) => {
      state.isLoading = false;
      const { data, ...rest } = action.payload;
      state.list = data;
      state.paginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getQuotesList.rejected, (state, action) => {
      state.isLoading = false;
    });

    addCase(getQuoteLogs.pending, (state, action) => {
      state.isLogsGetting = true;
    });
    addCase(getQuoteLogs.fulfilled, (state, action) => {
      state.isLogsGetting = false;
      const { data, ...rest } = action.payload;
      state.logs = data;
      state.logPaginationInfo = {
        total_records: rest.total,
        total_pages: rest.last_page,
      };
    });
    addCase(getQuoteLogs.rejected, (state, action) => {
      state.isLogsGetting = false;
    });

    addCase(createQuote.pending, (state) => {
      state.isFormSubmitting = true;
    });
    addCase(createQuote.fulfilled, (state, action) => {
      state.isFormSubmitting = false;
    });
    addCase(createQuote.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(updateQuote.pending, (state, action) => {
      const isSubmitBy = action.meta.arg.data?.submitted_by || false;
      state.isFormSubmitting =
        isSubmitBy && isSubmitBy !== "Internal" ? "submitting" : true;
    });
    addCase(updateQuote.fulfilled, (state) => {
      state.isFormSubmitting = false;
    });
    addCase(updateQuote.rejected, (state) => {
      state.isFormSubmitting = false;
    });

    addCase(getQuote.pending, (state) => {
      state.isQuoteGetting = true;
    });
    addCase(getQuote.fulfilled, (state, action) => {
      const data = action.payload;

      const burnFeedSystem = {
        single_feed_station: null,
        single_feed_type: null,
        single_anti_bully: false,
        double_feed_station: null,
        double_feed_type: null,
        double_anti_bully: null,
        quad_feed_station: null,
        quad_feed_type: null,
        quad_anti_bully: null,
      };

      state.selectedRequestType = data.request_type;

      if (data.burn_feed_system) {
        if (data.burn_feed_system[0]) {
          burnFeedSystem.single_feed_station =
            data.burn_feed_system[0]["feed_stations"];
          burnFeedSystem.single_feed_type =
            data.burn_feed_system[0]["feed_type"];
          burnFeedSystem.single_anti_bully =
            data.burn_feed_system[0]["anti_bully_bars"] === 1;
        }

        if (data.burn_feed_system[1]) {
          burnFeedSystem.double_feed_station =
            data.burn_feed_system[1]["feed_stations"];
          burnFeedSystem.double_feed_type =
            data.burn_feed_system[1]["feed_type"];
          burnFeedSystem.double_anti_bully =
            data.burn_feed_system[1]["anti_bully_bars"] === 1;
        }

        if (data.burn_feed_system[2]) {
          burnFeedSystem.quad_feed_station =
            data.burn_feed_system[2]["feed_stations"];
          burnFeedSystem.quad_feed_type = data.burn_feed_system[2]["feed_type"];
          burnFeedSystem.quad_anti_bully =
            data.burn_feed_system[2]["anti_bully_bars"] === 1;
        }
      }
      state.initialFormValues = {
        status: data.status,
        step1: {
          document_no: data.document_no,
          document_date: data.document_date ? dayjs(data.document_date) : null,
          est_delivery_date: data.est_delivery_date
            ? dayjs(data.est_delivery_date)
            : null,
          name: data.name,
          house: data.house,
          road: data.road,
          town: data.town,
          postcode: data.postcode,
          phone_no: data.phone_no,
          email: data.email,
          no_of_milking_units: data.no_of_milking_units,
          no_of_cow_stalls: data.no_of_cow_stalls,
          no_of_cows: data.no_of_cows,
          express_fit: data.express_fit,
          county_id: data.county_id,
          country_id: data.country_id
            ? {
                value: data.country_id,
                label: data.country_name,
              }
            : null,
          parlour_style_id: data.parlour_style_id
            ? {
                value: data.parlour_style_id,
                label: data.parlour_style_name,
              }
            : null,
          rotary_style_id: data.rotary_style_id
            ? {
                value: data.rotary_style_id,
                label: data.rotary_style_name,
              }
            : null,
          cow_standing_id: data.cow_standing_id
            ? {
                value: data.cow_standing_id,
                label: data.cow_standing_name,
              }
            : null,
          type_of_cow_id: data.type_of_cow_id
            ? {
                value: data.type_of_cow_id,
                label: data.type_of_cow_name,
              }
            : null,
          installation_id: data.installation_id
            ? {
                value: data.installation_id,
                label: data.installation_name,
              }
            : null,
          delivery_id: data.delivery_id
            ? {
                value: data.delivery_id,
                label: data.delivery_name,
              }
            : null,
          electricity_id: data.electricity_id
            ? {
                value: data.electricity_id,
                label: data.electricity_name,
              }
            : null,
        },
        step2: {
          rump_rail_id: data.rump_rail_id
            ? {
                value: data.rump_rail_id,
                label: data.rump_rail_name,
              }
            : null,
          front_guide_rail_id: data.front_guide_rail_id
            ? {
                value: data.front_guide_rail_id,
                label: data.front_guide_rail_name,
              }
            : null,
          back_guide_rail_id: data.back_guide_rail_id
            ? {
                value: data.back_guide_rail_id,
                label: data.back_guide_rail_name,
              }
            : null,
          front_exit_gate_id: data.front_exit_gate_id
            ? {
                value: data.front_exit_gate_id,
                label: data.front_exit_gate_name,
              }
            : null,
          back_entrance_gate_id: data.back_entrance_gate_id
            ? {
                value: data.back_entrance_gate_id,
                label: data.back_entrance_gate_name,
              }
            : null,
          gate_control_id: data.gate_control_id
            ? {
                value: data.gate_control_id,
                label: data.gate_control_name,
              }
            : null,
          pit_kerb_rail_id: data.pit_kerb_rail_id
            ? {
                value: data.pit_kerb_rail_id,
                label: data.pit_kerb_rail_name,
              }
            : null,
          stalling_id: data.stalling_id
            ? {
                value: data.stalling_id,
                label: data.stalling_name,
              }
            : null,
          stalling_extra_id: data.stalling_extra_id
            ? {
                value: data.stalling_extra_id,
                label: data.stalling_extra_name,
              }
            : null,
          parlour_stall_extras: data.parlour_stall_extras
            ? JSON.parse(data.parlour_stall_extras)
            : null,

          in_parlour_feeding: data.in_parlour_feeding,
          rotary_deck_id: data.rotary_deck_id
            ? {
                value: data.rotary_deck_id,
                label: data.rotary_deck_name,
              }
            : null,
          bail_type_id: data.bail_type_id
            ? {
                value: data.bail_type_id,
                label: data.bail_type_name,
              }
            : null,
          retention_arm_id: data.retention_arm_id
            ? {
                value: data.retention_arm_id,
                label: data.retention_arm_name,
              }
            : null,
          rotation_id: data.rotation_id
            ? {
                value: data.rotation_id,
                label: data.rotation_name,
              }
            : null,
          pace_entrance_system_id: data.pace_entrance_system_id
            ? {
                value: data.pace_entrance_system_id,
                label: data.pace_entrance_system_name,
              }
            : null,
          outer_nib_id: data.outer_nib_id
            ? {
                value: data.outer_nib_id,
                label: data.outer_nib_name,
              }
            : null,
          inner_nib_id: data.inner_nib_id
            ? {
                value: data.inner_nib_id,
                label: data.inner_nib_name,
              }
            : null,
          rotary_rail_ramp_id: data.rotary_rail_ramp_id
            ? {
                value: data.rotary_rail_ramp_id,
                label: data.rotary_rail_ramp_name,
              }
            : null,
          pro_floor_id: data.pro_floor_id
            ? {
                value: data.pro_floor_id,
                label: data.pro_floor_name,
              }
            : null,
        },
        step3: {
          rotary_vacuum_line_id: data.rotary_vacuum_line_id
            ? {
                value: data.rotary_vacuum_line_id,
                label: data.rotary_vacuum_line_name,
              }
            : null,
          herringbone_vacuum_line_id: data.herringbone_vacuum_line_id
            ? {
                value: data.herringbone_vacuum_line_id,
                label: data.herringbone_vacuum_line_name,
              }
            : null,
          vacuum_outfit_id: data.vacuum_outfit_id
            ? {
                value: data.vacuum_outfit_id,
                label: data.vacuum_outfit_name,
              }
            : null,
          pump_type_id: data.pump_type_id
            ? {
                value: data.pump_type_id,
                label: data.pump_type_name,
              }
            : null,
          motors: data.motors,
          vdrive_system: data.vdrive_system,
          pulsation_system_id: data.pulsation_system_id
            ? {
                value: data.pulsation_system_id,
                label: data.pulsation_system_name,
              }
            : null,
          pulsation_type_id: data.pulsation_type_id
            ? {
                value: data.pulsation_type_id,
                label: data.pulsation_type_name,
              }
            : null,
          fresh_air_line: data.fresh_air_line,
          cluster_unit_id: data.cluster_unit_id
            ? {
                value: data.cluster_unit_id,
                label: data.cluster_unit_name,
              }
            : null,
          herringbone_cluster_support_id: data.herringbone_cluster_support_id
            ? {
                value: data.herringbone_cluster_support_id,
                label: data.herringbone_cluster_support_name,
              }
            : null,
          rotary_cluster_support_id: data.rotary_cluster_support_id
            ? {
                value: data.rotary_cluster_support_id,
                label: data.rotary_cluster_support_name,
              }
            : null,
        },
        step4: {
          delivery_milk_pump_id: data.delivery_milk_pump_id
            ? {
                value: data.delivery_milk_pump_id,
                label: data.delivery_milk_pump_name,
              }
            : null,
          mdrive_system: data.mdrive_system,
          delivery_receiving_vessel: data.delivery_receiving_vessel,
          sanitary_vessel: data.sanitary_vessel,
          milk_wash_line: data.milk_wash_line,
          inline_filters: data.inline_filters,
          qty: data.qty,
          airforce_air_purge: data.airforce_air_purge,
          plate_cooler_id: data.plate_cooler_id
            ? {
                value: data.plate_cooler_id,
                label: data.plate_cooler_name,
              }
            : null,
          plate_cooler_solenoid: data.plate_cooler_solenoid,
          bulk_tank_filling_id: data.bulk_tank_filling_id
            ? {
                value: data.bulk_tank_filling_id,
                label: data.bulk_tank_filling_name,
              }
            : null,

          diversion_milk_pump_id: data.diversion_milk_pump_id
            ? {
                value: data.diversion_milk_pump_id,
                label: data.diversion_milk_pump_name,
              }
            : null,
          diversion_receiving_vessel: data.diversion_receiving_vessel,
          divert_line: data.divert_line,
          easy_milk_line: data.easy_milk_line,
          bucket_assembly_id: data.bucket_assembly_id
            ? {
                value: data.bucket_assembly_id,
                label: data.bucket_assembly_name,
              }
            : null,
          bucket_qty_id: data.bucket_qty_id
            ? {
                value: data.bucket_qty_id,
                label: data.bucket_qty_name,
              }
            : null,
        },
        step5: {
          unit_control_id: data.unit_control_id
            ? {
                value: data.unit_control_id,
                label: data.unit_control_name,
              }
            : null,
          milk_sensor_id: data.milk_sensor_id
            ? {
                value: data.milk_sensor_id,
                label: data.milk_sensor_name,
              }
            : null,
          sampling_device_id: data.sampling_device_id
            ? {
                value: data.sampling_device_id,
                label: data.sampling_device_name,
              }
            : null,
          herringbone_easy_start_id: data.herringbone_easy_start_id
            ? {
                value: data.herringbone_easy_start_id,
                label: data.herringbone_easy_start_name,
              }
            : null,
          rotary_easy_start_id: data.rotary_easy_start_id
            ? {
                value: data.rotary_easy_start_id,
                label: data.rotary_easy_start_name,
              }
            : null,
          parlour_identification_id: data.parlour_identification_id
            ? {
                value: data.parlour_identification_id,
                label: data.parlour_identification_name,
              }
            : null,
          transponder_type_id: data.transponder_type_id
            ? {
                value: data.transponder_type_id,
                label: data.transponder_type_name,
              }
            : null,
          touch_screen: data.touch_screen,
          voice_assist: data.voice_assist,
          vision_herd_management_extras: data.vision_herd_management_extras
            ? JSON.parse(data.vision_herd_management_extras)
            : null,
        },
        step6: {
          cip_id: data.cip_id
            ? {
                value: data.cip_id,
                label: data.cip_name,
              }
            : null,
          daytona_wash: data.daytona_wash,
          wash_system_id: data.wash_system_id
            ? {
                value: data.wash_system_id,
                label: data.wash_system_name,
              }
            : null,
          chemical_pump_id: data.chemical_pump_id
            ? {
                value: data.chemical_pump_id,
                label: data.chemical_pump_name,
              }
            : null,
          water_boiler: data.water_boiler,
          water_heater: data.water_heater,
          herringbone_parlour_wash_drop_id:
            data.herringbone_parlour_wash_drop_id
              ? {
                  value: data.herringbone_parlour_wash_drop_id,
                  label: data.herringbone_parlour_wash_drop_name,
                }
              : null,
          rotary_parlour_wash_drop_id: data.rotary_parlour_wash_drop_id
            ? {
                value: data.rotary_parlour_wash_drop_id,
                label: data.rotary_parlour_wash_drop_name,
              }
            : null,
          wash_pump_unit_id: data.wash_pump_unit_id
            ? {
                value: data.wash_pump_unit_id,
                label: data.wash_pump_unit_name,
              }
            : null,
          rota_clean_wash_boom_id: data.rota_clean_wash_boom_id
            ? {
                value: data.rota_clean_wash_boom_id,
                label: data.rota_clean_wash_boom_name,
              }
            : null,
          rotary_platform_brush: data.rotary_platform_brush,
        },
        step7: {
          animal_selection_id: data.animal_selection_id
            ? {
                value: data.animal_selection_id,
                label: data.animal_selection_name,
              }
            : null,
          crowd_gate_id: data.crowd_gate_id
            ? {
                value: data.crowd_gate_id,
                label: data.crowd_gate_name,
              }
            : null,
          width: data.width,
          length: data.length,
          airstream_cluster_flush: data.airstream_cluster_flush,
          rotary_teat_spray_id: data.rotary_teat_spray_id
            ? {
                value: data.rotary_teat_spray_id,
                label: data.rotary_teat_spray_name,
              }
            : null,
          herringbone_teat_spray_id: data.herringbone_teat_spray_id
            ? {
                value: data.herringbone_teat_spray_id,
                label: data.herringbone_teat_spray_name,
              }
            : null,
          leg_divider_id: data.leg_divider_id
            ? {
                value: data.leg_divider_id,
                label: data.leg_divider_name,
              }
            : null,
          udder_washer_id: data.udder_washer_id
            ? {
                value: data.udder_washer_id,
                label: data.udder_washer_name,
              }
            : null,
          smart_collar_type_id: data.smart_collar_type_id
            ? {
                value: data.smart_collar_type_id,
                label: data.smart_collar_type_name,
              }
            : null,
          base_station: data.base_station,
          extender_unit_id: data.extender_unit_id
            ? {
                value: data.extender_unit_id,
                label: data.extender_unit_name,
              }
            : null,
          nedap_now: data.nedap_now,
        },
        step8: {
          feed_type_id: data.feed_type_id
            ? {
                value: data.feed_type_id,
                label: data.feed_type_name,
              }
            : null,
          feed_control_id: data.feed_control_id
            ? {
                value: data.feed_control_id,
                label: data.feed_control_name,
              }
            : null,
          feeding_trough_id: data.feeding_trough_id
            ? {
                value: data.feeding_trough_id,
                label: data.feeding_trough_name,
              }
            : null,
          feed_hopper: data.feed_hopper,
          extra_long_auger: data.extra_long_auger,
          feed_unit_id: data.feed_unit_id
            ? {
                value: data.feed_unit_id,
                label: data.feed_unit_name,
              }
            : null,
          feed_system_protection_rails: data.feed_system_protection_rails,
          in_parlour_feed_control_id: data.in_parlour_feed_control_id
            ? {
                value: data.in_parlour_feed_control_id,
                label: data.in_parlour_feed_control_name,
              }
            : null,
          flex_auger_system: data.flex_auger_system,
          drop_box_assembly: data.drop_box_assembly,
          burn_id: data.burn_feed_system
            ? data.burn_feed_system.map((item) => item.id)
            : null,
          ...burnFeedSystem,
        },
      };

      if (data.attachments) {
        state.attachments = data.attachments.map((item) => ({
          uid: item.id,
          name: item.file_name,
          file_path: item.file_path,
        }));
      }

      state.finalQuote = data.final_quote
        ? {
            name: data.final_quote,
            file_path: data.final_quote_path,
          }
        : null;
      state.oldFinalQuote = data.final_quote || null;
      state.comments = data.comments || "";
      state.isQuoteGetting = false;
    });
    addCase(getQuote.rejected, (state) => {
      state.isQuoteGetting = false;
      state.initialFormValues = null;
      state.attachments = [];
      state.old_files = [];
      state.finalQuote = null;
    });

    addCase(changeAssignee.pending, (state) => {
      state.isAssigneeChanging = true;
    });
    addCase(changeAssignee.fulfilled, (state) => {
      state.isAssigneeChanging = false;
    });
    addCase(changeAssignee.rejected, (state) => {
      state.isAssigneeChanging = false;
    });
  },
});

export const {
  setQuoteListParams,
  setLogParams,
  setQuoteDeleteIDs,
  addAttachment,
  setInitialFormData,
  removeAttachment,
  setFinalQuote,
  setComments,
  setSelectRequestTypeModal,
  setSelectedRequestType,
} = quoteSlice.actions;
export default quoteSlice.reducer;
