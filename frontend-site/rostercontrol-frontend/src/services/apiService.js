const API_BASE_URL = "http://localhost:8080";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Important for cookies/sessions
    };

    let response;
    try {
      response = await fetch(url, config);
    } catch (error) {
      // Network error or fetch failed
      console.error("Network error:", error);
      throw new Error(
        `Network error: Unable to connect to server. Please check if the backend is running on ${this.baseURL}`
      );
    }

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    let data;

    if (!response.ok) {
      // Try to get error message from response
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
        // Include details if available
        const errorMsg =
          data.error ||
          data.message ||
          `HTTP error! status: ${response.status}`;
        const details = data.details ? ` (${data.details})` : "";
        throw new Error(errorMsg + details);
      } else {
        const text = await response.text();
        throw new Error(text || `HTTP error! status: ${response.status}`);
      }
    }

    // Parse successful response
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      return text || {};
    }

    return data;
  }

  // Authentication
  async login(email, password) {
    return this.request("/session", {
      method: "POST",
      body: JSON.stringify({
        LoginEmail: email,
        LoginPassword: password,
      }),
    });
  }

  async getCurrentSession() {
    return this.request("/session", {
      method: "GET",
    });
  }

  async logout() {
    return this.request("/session", {
      method: "DELETE",
    });
  }

  async signup(email, password, displayName, isAdmin = false) {
    return this.request("/user", {
      method: "POST",
      body: JSON.stringify({
        EmailAddress: email,
        Password: password,
        DisplayName: displayName,
        IsAdmin: isAdmin,
      }),
    });
  }

  // Workers
  async getWorkers() {
    return this.request("/worker");
  }

  async getWorker(id) {
    return this.request(`/worker/${id}`);
  }

  async createWorker(workerData) {
    return this.request("/worker", {
      method: "POST",
      body: JSON.stringify(workerData),
    });
  }

  async updateWorker(id, workerData) {
    return this.request(`/worker/${id}`, {
      method: "PUT",
      body: JSON.stringify(workerData),
    });
  }

  async deleteWorker(id) {
    return this.request(`/worker/${id}`, {
      method: "DELETE",
    });
  }

  // Schedules
  async getSchedules() {
    return this.request("/schedule");
  }

  async getSchedule(id) {
    return this.request(`/schedule/${id}`);
  }

  async createSchedule(scheduleData) {
    return this.request("/schedule", {
      method: "POST",
      body: JSON.stringify(scheduleData),
    });
  }

  async updateSchedule(id, scheduleData) {
    return this.request(`/schedule/${id}`, {
      method: "PUT",
      body: JSON.stringify(scheduleData),
    });
  }

  async deleteSchedule(id) {
    return this.request(`/schedule/${id}`, {
      method: "DELETE",
    });
  }

  // Shifts
  async getShifts() {
    return this.request("/shift");
  }

  async getShift(id) {
    return this.request(`/shift/${id}`);
  }

  async createShift(shiftData) {
    return this.request("/shift", {
      method: "POST",
      body: JSON.stringify(shiftData),
    });
  }

  async updateShift(id, shiftData) {
    return this.request(`/shift/${id}`, {
      method: "PUT",
      body: JSON.stringify(shiftData),
    });
  }

  async deleteShift(id) {
    return this.request(`/shift/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();
