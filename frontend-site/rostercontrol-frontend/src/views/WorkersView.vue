<template>
  <div class="workers-page">
    <h1 class="page-title">Workers</h1>
    <p class="page-subtitle">All workers in the roster</p>

    <!-- Admin: Add worker button + Add/Edit form -->
    <div v-if="isAdmin" class="admin-actions">
      <button
        v-if="!showForm"
        type="button"
        class="btn btn-primary"
        @click="openAddForm"
      >
        Add worker
      </button>
      <div v-else class="worker-form-card">
        <h3 class="form-title">
          {{ editingWorkerId ? "Edit worker" : "Add worker" }}
        </h3>
        <form @submit.prevent="submitWorkerForm" class="worker-form">
          <div class="form-row">
            <div class="form-group">
              <label for="worker-first">First name</label>
              <input
                id="worker-first"
                v-model="form.FirstName"
                type="text"
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label for="worker-last">Last name</label>
              <input
                id="worker-last"
                v-model="form.LastName"
                type="text"
                required
                class="form-input"
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="worker-role">Role</label>
              <input
                id="worker-role"
                v-model="form.RoleName"
                type="text"
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label for="worker-workload">Workload</label>
              <input
                id="worker-workload"
                v-model.number="form.Workload"
                type="number"
                min="0"
                required
                class="form-input"
              />
            </div>
          </div>
          <div class="form-group form-group-checkbox">
            <label>
              <input v-model="form.IsActive" type="checkbox" />
              Active
            </label>
          </div>
          <div v-if="formError" class="form-error">{{ formError }}</div>
          <div class="form-actions">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="formSaving"
            >
              {{ formSaving ? "Saving…" : editingWorkerId ? "Save" : "Add" }}
            </button>
            <button type="button" class="btn btn-secondary" @click="cancelForm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="isLoading" class="loading">Loading workers…</div>
    <div v-else-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    <div v-else-if="workers.length === 0" class="empty-state">
      No workers found.
    </div>
    <div v-else class="workers-table-wrapper">
      <table class="workers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th v-if="isAdmin">Workload</th>
            <th>Active</th>
            <th v-if="isAdmin" class="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="worker in workers" :key="worker.WorkerID">
            <td>{{ worker.FirstName }} {{ worker.LastName }}</td>
            <td>{{ worker.RoleName || "—" }}</td>
            <td v-if="isAdmin">
              {{ worker.Workload != null ? worker.Workload : "—" }}
            </td>
            <td>
              <span
                :class="[
                  'badge',
                  worker.IsActive ? 'badge-active' : 'badge-inactive',
                ]"
              >
                {{ worker.IsActive ? "Yes" : "No" }}
              </span>
            </td>
            <td v-if="isAdmin" class="cell-actions">
              <button
                type="button"
                class="btn btn-small btn-edit"
                @click="openEditForm(worker)"
              >
                Edit
              </button>
              <button
                type="button"
                class="btn btn-small btn-delete"
                @click="deleteWorker(worker)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { apiService } from "../services/apiService";
import { authStore } from "../store/auth";

const emptyForm = () => ({
  FirstName: "",
  LastName: "",
  RoleName: "",
  Workload: 0,
  IsActive: true,
});

export default {
  name: "WorkersView",
  data() {
    return {
      authState: authStore.getState(),
      workers: [],
      isLoading: true,
      errorMessage: "",
      showForm: false,
      editingWorkerId: null,
      form: emptyForm(),
      formError: "",
      formSaving: false,
    };
  },
  computed: {
    isAdmin() {
      return (
        this.authState.currentUser &&
        this.authState.currentUser.IsAdmin === true
      );
    },
  },
  async mounted() {
    await this.loadWorkers();
  },
  methods: {
    async loadWorkers() {
      this.isLoading = true;
      this.errorMessage = "";
      try {
        this.workers = await apiService.getWorkers();
      } catch (error) {
        this.errorMessage = error.message || "Failed to load workers.";
        this.workers = [];
      } finally {
        this.isLoading = false;
      }
    },
    openAddForm() {
      this.editingWorkerId = null;
      this.form = emptyForm();
      this.formError = "";
      this.showForm = true;
    },
    openEditForm(worker) {
      this.editingWorkerId = worker.WorkerID;
      this.form = {
        FirstName: worker.FirstName,
        LastName: worker.LastName,
        RoleName: worker.RoleName || "",
        Workload:
          worker.Workload != null && worker.Workload !== ""
            ? Number(worker.Workload)
            : 0,
        IsActive: !!worker.IsActive,
      };
      this.formError = "";
      this.showForm = true;
    },
    cancelForm() {
      this.showForm = false;
      this.editingWorkerId = null;
      this.formError = "";
    },
    async submitWorkerForm() {
      this.formError = "";
      this.formSaving = true;
      const payload = {
        FirstName: this.form.FirstName.trim(),
        LastName: this.form.LastName.trim(),
        RoleName: this.form.RoleName.trim(),
        Workload: Number(this.form.Workload),
        IsActive: !!this.form.IsActive,
      };
      try {
        if (this.editingWorkerId) {
          await apiService.updateWorker(this.editingWorkerId, payload);
        } else {
          await apiService.createWorker(payload);
        }
        this.cancelForm();
        await this.loadWorkers();
      } catch (error) {
        this.formError = error.message || "Failed to save worker.";
      } finally {
        this.formSaving = false;
      }
    },
    async deleteWorker(worker) {
      const name =
        `${worker.FirstName} ${worker.LastName}`.trim() || "this worker";
      if (!confirm(`Delete ${name}?`)) return;
      try {
        await apiService.deleteWorker(worker.WorkerID);
        await this.loadWorkers();
        if (this.editingWorkerId === worker.WorkerID) {
          this.cancelForm();
        }
      } catch (error) {
        this.errorMessage = error.message || "Failed to delete worker.";
      }
    },
  },
};
</script>

<style scoped>
.workers-page {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  text-align: left;
}

.page-title {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 600;
}

.page-subtitle {
  color: #7f8c8d;
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
}

.admin-actions {
  margin-bottom: 1.5rem;
}

.worker-form-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid #eee;
}

.form-title {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.worker-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-row .form-group {
  flex: 1;
  min-width: 140px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #42b983;
}

.form-group-checkbox label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.form-group-checkbox input[type="checkbox"] {
  width: 1.1rem;
  height: 1.1rem;
}

.form-error {
  color: #c33;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: #42b983;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #35a372;
}

.btn-primary:disabled {
  background: #aaa;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

.btn-small {
  padding: 0.35rem 0.6rem;
  font-size: 0.85rem;
  margin-right: 0.5rem;
}

.btn-edit {
  background: #5bc0de;
  color: #222;
}

.btn-edit:hover {
  background: #46b8da;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background: #c0392b;
}

.loading,
.empty-state {
  color: #7f8c8d;
  padding: 2rem;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid #fcc;
}

.workers-table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.workers-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.workers-table th,
.workers-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.workers-table th {
  background-color: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.9rem;
}

.th-actions,
.cell-actions {
  width: 1%;
  white-space: nowrap;
}

.workers-table tbody tr:hover {
  background-color: #f8f9fa;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
}

.badge-active {
  background-color: #d4edda;
  color: #155724;
}

.badge-inactive {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
