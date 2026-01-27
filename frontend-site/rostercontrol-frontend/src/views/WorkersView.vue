<template>
  <div class="workers-page">
    <h1 class="page-title">Workers</h1>
    <p class="page-subtitle">All workers in the roster</p>

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
            <th>Workload</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="worker in workers" :key="worker.WorkerID">
            <td>{{ worker.FirstName }} {{ worker.LastName }}</td>
            <td>{{ worker.RoleName || "—" }}</td>
            <td>{{ worker.Workload != null ? worker.Workload : "—" }}</td>
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
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { apiService } from "../services/apiService";

export default {
  name: "WorkersView",
  data() {
    return {
      workers: [],
      isLoading: true,
      errorMessage: "",
    };
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
