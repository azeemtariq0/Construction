import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axiosInstance";

export const getPortalList = createAsyncThunk(
  "portal/list",
  async (params, { rejectWithValue }) => {
    try {
      const res = await api.get("/portal", {
        params,
      });
      return res.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const createPortal = createAsyncThunk(
  "portal/create",
  async (data, { rejectWithValue }) => {
    try {
      return await api.post("/portal", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const deletePortal = createAsyncThunk(
  "portal/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/portal/${id}`);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const updatePortal = createAsyncThunk(
  "portal/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/portal/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const createFolderOrFile = createAsyncThunk(
  "directory/create",
  async (data, { rejectWithValue }) => {
    try {
      return await api.post("/directory", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const getFolderData = createAsyncThunk(
  "directory/get",
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/directory/${id}`, {
        params,
      });
      return res.data.data;
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const renameFolder = createAsyncThunk(
  "directory/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await api.put(`/directory/${id}`, data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const deleteFolderOrFile = createAsyncThunk(
  "directory/delete",
  async ({ id, params }, { rejectWithValue }) => {
    try {
      await api.delete(`/directory/${id}`, {
        params,
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const downloadPortalFiles = createAsyncThunk(
  "directory/downloadFiles",
  async (data, { rejectWithValue }) => {
    try {
      return await api.post("/directory/download-zip", data, {
        responseType: "blob",
      });
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

export const deletePortalFiles = createAsyncThunk(
  "directory/deleteFiles",
  async (data, { rejectWithValue }) => {
    try {
      return await api.post("/directory/bulk-delete-files", data);
    } catch (err) {
      throw rejectWithValue(err);
    }
  },
);

const initialState = {
  selectedFiles: [],
  isPortalListGetting: false,
  portalList: [],
  isPortalFormSubmitting: false,
  search: "",
  folderSearch: "",
  isFolderGetting: false,
  folders: [],
  files: [],
  isDownloading: false,
  isDeleting: false,
  breadcrumbs: [],
  isFolderOrFileCreating: false,
  isFolderOrFileDeleting: false,
};

export const portalSlice = createSlice({
  name: "portal",
  initialState,
  reducers: {
    addToSelectedFiles: (state, action) => {
      state.selectedFiles.push(action.payload);
    },
    removeToSelectedFiles: (state, action) => {
      state.selectedFiles = state.selectedFiles.filter(
        (item) => item !== action.payload,
      );
    },

    clearSelectedFiles: (state) => {
      state.selectedFiles = [];
    },

    setSearch: (state, action) => {
      state.search = action.payload;
    },

    setFolderSearch: (state, action) => {
      state.folderSearch = action.payload;
    },
  },
  extraReducers: ({ addCase }) => {
    addCase(getPortalList.pending, (state) => {
      state.isPortalListGetting = true;
    });
    addCase(getPortalList.fulfilled, (state, action) => {
      state.isPortalListGetting = false;
      const data = action.payload;
      state.portalList = data;
    });
    addCase(getPortalList.rejected, (state) => {
      state.isPortalListGetting = false;
    });

    addCase(createPortal.pending, (state) => {
      state.isPortalFormSubmitting = true;
    });
    addCase(createPortal.fulfilled, (state, action) => {
      state.isPortalFormSubmitting = false;
      const { created_by, ...newPortal } = action.payload.data.data;
      state.portalList.unshift(newPortal);
    });
    addCase(createPortal.rejected, (state) => {
      state.isPortalFormSubmitting = false;
    });

    addCase(updatePortal.pending, (state) => {
      state.isPortalFormSubmitting = true;
    });
    addCase(updatePortal.fulfilled, (state, action) => {
      state.isPortalFormSubmitting = false;
      const updatedPortal = action.meta.arg.data;
      const id = action.meta.arg.id;

      console.log(id, updatedPortal);

      state.portalList = state.portalList.map((portal) => {
        if (portal.id === id) {
          return {
            id,
            ...updatedPortal,
          };
        }
        return portal;
      });
    });
    addCase(updatePortal.rejected, (state) => {
      state.isPortalFormSubmitting = false;
    });

    addCase(deletePortal.pending, (state) => {
      state.isPortalFormSubmitting = true;
    });
    addCase(deletePortal.fulfilled, (state, action) => {
      state.isPortalFormSubmitting = false;
      const id = action.meta.arg;
      state.portalList = state.portalList.filter((portal) => portal.id !== id);
    });
    addCase(deletePortal.rejected, (state) => {
      state.isPortalFormSubmitting = false;
    });

    addCase(createFolderOrFile.pending, (state) => {
      state.isFolderOrFileCreating = true;
    });
    addCase(createFolderOrFile.fulfilled, (state, action) => {
      state.isFolderOrFileCreating = false;
      const data = action.payload.data.data;
      if (data.file_type === "I") {
        state.files.unshift({ ...data, isNew: true });
      } else {
        state.folders.unshift({ ...data, isNew: true });
      }
    });
    addCase(createFolderOrFile.rejected, (state) => {
      state.isFolderOrFileCreating = false;
    });

    addCase(getFolderData.pending, (state) => {
      state.isFolderGetting = true;
      state.folders = [];
      state.files = [];
    });
    addCase(getFolderData.fulfilled, (state, action) => {
      state.isFolderGetting = false;
      const data = action.payload;

      state.breadcrumbs = [
        {
          name: data.portal,
          url: null,
        },
        ...data.breadcrumbs,
      ];

      state.folders = data.data;
      state.files = data.files;
    });
    addCase(getFolderData.rejected, (state) => {
      state.isFolderGetting = false;
    });

    addCase(renameFolder.pending, (state, action) => {
      const id = action.meta.arg.id;
      const data = action.meta.arg.data;
      state.folders = state.folders.map((folder) => {
        if (folder.id === id) {
          return {
            ...folder,
            isNew: false,
            folder_name: data.name,
          };
        }
        return folder;
      });
    });

    addCase(deleteFolderOrFile.pending, (state) => {
      state.isFolderOrFileDeleting = true;
    });
    addCase(deleteFolderOrFile.fulfilled, (state, action) => {
      state.isFolderOrFileDeleting = false;

      const { id } = action.meta.arg;
      const file_type = action.meta.arg.params.file_type;

      if (file_type === "I") {
        state.files = state.files.filter((file) => file.id !== id);
      } else {
        state.folders = state.folders.filter((folder) => folder.id !== id);
      }
    });
    addCase(deleteFolderOrFile.rejected, (state) => {
      state.isFolderOrFileDeleting = false;
    });

    addCase(downloadPortalFiles.pending, (state) => {
      state.isDownloading = true;
    });
    addCase(downloadPortalFiles.fulfilled, (state, action) => {
      state.isDownloading = false;
      state.selectedFiles = [];
      const data = action.payload.data;

      try {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "files.zip");
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.log(error);
      }
    });
    addCase(downloadPortalFiles.rejected, (state) => {
      state.isDownloading = false;
    });

    addCase(deletePortalFiles.pending, (state) => {
      state.isDeleting = true;
    });
    addCase(deletePortalFiles.fulfilled, (state, action) => {
      state.isDeleting = false;
      state.files = state.files.filter((file) => {
        return !state.selectedFiles.includes(file.file_name);
      });
      state.selectedFiles = [];
    });
    addCase(deletePortalFiles.rejected, (state) => {
      state.isDeleting = false;
    });
  },
});

export const {
  addToSelectedFiles,
  removeToSelectedFiles,
  clearSelectedFiles,
  setSearch,
  setFolderSearch,
} = portalSlice.actions;
export default portalSlice.reducer;
