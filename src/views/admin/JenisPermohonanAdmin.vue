<template>
  <div
    class="w-full p-6 bg-gradient-to-b from-gray-50 to-slate-100 min-h-screen"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h1
        class="text-3xl font-bold text-gray-800 border-b-4 border-gray-400 pb-2 flex items-center gap-2"
      >
        🗂️ Manajemen Jenis Permohonan
      </h1>

      <button
        @click="showCreateModal = true"
        class="px-4 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-800 transition shadow"
      >
        + Tambah Jenis
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-10">
      <div
        class="animate-spin rounded-full h-10 w-10 border-t-4 border-gray-500 border-gray-200"
      ></div>
      <p class="ml-3 text-gray-700 font-medium">Memuat data...</p>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="text-center text-red-600 bg-red-50 border border-red-200 p-4 rounded-lg shadow-sm"
    >
      ⚠️ {{ error }}
    </div>

    <!-- Table -->
    <div
      v-else-if="jenisList.length > 0"
      class="overflow-x-auto w-full shadow-lg rounded-xl border border-gray-300 bg-white"
    >
      <table class="min-w-full text-sm text-center text-gray-800">
        <thead
          class="bg-gradient-to-r from-gray-500 to-slate-600 text-white uppercase text-xs tracking-wider"
        >
          <tr>
            <th class="px-5 py-3 w-12">#</th>
            <th class="px-5 py-3">Nama Jenis</th>
            <th class="px-5 py-3">Deskripsi</th>
            <th class="px-5 py-3">Path</th>
            <th class="px-5 py-3 w-32">Status</th>
            <th class="px-5 py-3 w-40">Aksi</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="(item, index) in jenisList"
            :key="item.id"
            class="hover:bg-gray-50 transition"
          >
            <td class="px-5 py-3 font-semibold">{{ index + 1 }}</td>

            <td class="px-5 py-3 font-semibold text-gray-900">
              {{ item.nama_jenis_permohonan }}
            </td>

            <td class="px-5 py-3 text-gray-600">
              {{ item.deskripsi || "-" }}
            </td>
            <td class="px-5 py-3 text-gray-600">
              {{ item.route_path || "-" }}
            </td>

            <td class="px-5 py-3">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-bold border',
                  item.is_active
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : 'bg-red-100 text-red-700 border-red-300',
                ]"
              >
                {{ item.is_active ? "Aktif" : "Nonaktif" }}
              </span>
            </td>

            <td class="px-5 py-3 space-x-2">
              <button
                v-if="!item.is_active"
                @click="activate(item.id)"
                class="px-3 py-1 text-xs font-semibold rounded-md bg-gray-700 text-white hover:bg-gray-800 transition"
              >
                Aktifkan
              </button>

              <button
                v-else
                @click="deactivate(item.id)"
                class="px-3 py-1 text-xs font-semibold rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                Nonaktifkan
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty -->
    <div
      v-else
      class="text-center mt-8 text-gray-700 bg-white py-10 border border-gray-300 rounded-lg shadow-sm"
    >
      Tidak ada jenis permohonan.
    </div>

    <!-- CREATE MODAL -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <div class="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">
          ➕ Tambah Jenis Permohonan
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Nama Jenis
            </label>
            <input
              v-model="form.nama_jenis_permohonan"
              type="text"
              class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-gray-300"
              placeholder="Contoh: Izin Cuti"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Deskripsi
            </label>
            <textarea
              v-model="form.deskripsi"
              rows="3"
              class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-gray-300"
              placeholder="Deskripsi singkat"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">
              Route Path
            </label>
            <textarea
              v-model="form.route_path"
              rows="1"
              class="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-gray-300"
              readonly
              placeholder="Route default"
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-2 mt-6">
          <button
            @click="showCreateModal = false"
            class="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            @click="createJenisPermohonan"
            class="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 font-semibold"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { apiClient } from "@/lib/axios";
import Swal from "sweetalert2";

interface JenisPermohonan {
  id: number;
  nama_jenis_permohonan: string;
  deskripsi?: string;
  route_path: string;
  is_active: boolean;
}

const jenisList = ref<JenisPermohonan[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const showCreateModal = ref(false);

const form = ref({
  nama_jenis_permohonan: "",
  deskripsi: "",
  route_path: "/PermohonanTTD",
});

const fetchJenisPermohonan = async () => {
  loading.value = true;
  try {
    const { data } = await apiClient.get("/jenis-permohonan/");
    jenisList.value = data.data || [];
  } catch (err: any) {
    error.value =
      err?.response?.data?.message || "Gagal memuat jenis permohonan.";
  } finally {
    loading.value = false;
  }
};

const createJenisPermohonan = async () => {
  if (!form.value.nama_jenis_permohonan) {
    Swal.fire("Oops", "Nama jenis wajib diisi", "warning");
    return;
  }

  try {
    await apiClient.post("/jenis-permohonan/", form.value);
    showCreateModal.value = false;

    form.value = {
      nama_jenis_permohonan: "",
      deskripsi: "",
      route_path: "/PermohonanTTD",
    };

    await fetchJenisPermohonan();

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Jenis permohonan berhasil ditambahkan",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err: any) {
    Swal.fire(
      "Gagal",
      err?.response?.data?.message || "Gagal menambah data",
      "error",
    );
  }
};

const activate = async (id: number) => {
  const result = await Swal.fire({
    title: "Aktifkan Jenis Permohonan?",
    text: "Data ini akan diaktifkan kembali.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya, Aktifkan",
    cancelButtonText: "Batal",
  });

  if (!result.isConfirmed) return;

  try {
    await apiClient.patch(`/jenis-permohonan/${id}/activate`);
    await fetchJenisPermohonan();

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Jenis permohonan berhasil diaktifkan.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err: any) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: err?.response?.data?.message || "Gagal mengaktifkan data.",
    });
  }
};

const deactivate = async (id: number) => {
  const result = await Swal.fire({
    title: "Nonaktifkan Jenis Permohonan?",
    text: "Data ini akan dinonaktifkan.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Nonaktifkan",
    cancelButtonText: "Batal",
    confirmButtonColor: "#dc2626",
  });

  if (!result.isConfirmed) return;

  try {
    await apiClient.patch(`/jenis-permohonan/${id}/deactivate`);
    await fetchJenisPermohonan();

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Jenis permohonan berhasil dinonaktifkan.",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err: any) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: err?.response?.data?.message || "Gagal menonaktifkan data.",
    });
  }
};

onMounted(fetchJenisPermohonan);
</script>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
}

th:first-child {
  border-top-left-radius: 0.75rem;
}

th:last-child {
  border-top-right-radius: 0.75rem;
}
</style>
