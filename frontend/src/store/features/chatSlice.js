import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { API_URL } from "../../axiosInstance";
import { formatDate } from "../../utils/formateDate";

export const getMessages = createAsyncThunk(
  "chat/get-messages",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/messages", {
        params,
      });
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const sendMessage = createAsyncThunk(
  "chat/send-message",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/request/messages", data);
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

const initialState = {
  isLoading: false,
  messages: null,
  isSending: false,
  isUnreadMessage: false,
};
export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getMessages.pending, (state) => {
      state.isLoading = true;
    });
    addCase(getMessages.fulfilled, (state, action) => {
      const data = action.payload;
      const isUnreadMessage = state.messages?.length !== data.length;
      state.messages = data.map((item) => ({
        name: item.name,
        message: item.message,
        time: formatDate(item.created_at),
        image: item?.image_url ? `${API_URL}/${item?.image_url}` : null,
        type: item.user_type,
        id: item.id,
        user_id: item.created_by,
        attachment: item?.file_name
          ? {
              name: item.file_name,
              file_path: item.file_path,
            }
          : null,
      }));
      state.isUnreadMessage = isUnreadMessage;
      state.isLoading = false;
    });
    addCase(getMessages.rejected, (state) => {
      state.isLoading = false;
    });

    addCase(sendMessage.pending, (state, action) => {
      const isAttachment = action.meta.arg.attachment_name;
      state.isSending = isAttachment ? true : false;
    });
    addCase(sendMessage.fulfilled, (state, action) => {
      state.isSending = false;
    });
    addCase(sendMessage.rejected, (state) => {
      state.isSending = false;
    });
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
