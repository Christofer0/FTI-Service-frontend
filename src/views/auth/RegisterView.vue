<template>
  <div
    class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-white via-stone-100 to-zinc-100"
  >
    <!-- Card -->
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
      <!-- Step 1: Check Email -->
      <div v-if="step === 'check-email'" class="space-y-6">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="flex justify-center mb-4">
            <img
              src="@/assets/logo.png"
              alt="FTI-Service Logo"
              class="w-16 h-16"
            />
          </div>

          <h1 class="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            Daftar Akun Baru 🚀
          </h1>
          <p class="text-gray-600 text-sm">
            Masukkan email UKSW Anda untuk memulai
          </p>
        </div>

        <!-- Error Alert -->
        <transition name="fade">
          <div
            v-if="error"
            class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
          >
            <svg
              class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>
        </transition>

        <!-- Email Form -->
        <form @submit.prevent="handleCheckEmail" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email UKSW <span class="text-red-500">*</span>
            </label>
            <input
              v-model="emailForm.email"
              type="email"
              placeholder="672021001@student.uksw.edu"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p class="mt-2 text-xs text-gray-500">
              • Mahasiswa: <span class="font-medium">@student.uksw.edu</span
              ><br />
              • Dosen/Admin: <span class="font-medium">@uksw.edu</span>
            </p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            <svg
              v-if="loading"
              class="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span v-if="loading">Memeriksa...</span>
            <span v-else>Lanjutkan</span>
          </button>
        </form>

        <!-- Login Link -->
        <div class="text-center text-sm text-gray-500">
          Sudah punya akun?
          <RouterLink
            to="/login"
            class="font-medium text-blue-600 hover:text-blue-700 hover:underline transition"
          >
            Login
          </RouterLink>
        </div>

        <!-- Footer -->
        <footer class="mt-8 text-gray-400 text-xs text-center">
          © {{ new Date().getFullYear() }} FTI-Service<br />
          Fakultas Teknologi Informasi UKSW
        </footer>
      </div>

      <!-- Step 2: Complete Profile - Mahasiswa -->
      <div
        v-else-if="
          step === 'complete-profile' && profileData?.role === 'mahasiswa'
        "
        class="space-y-6"
      >
        <div class="text-center">
          <div
            class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-1">
            Lengkapi Profil Mahasiswa
          </h2>
          <p class="text-gray-500 text-xs">{{ profileData.email }}</p>
          <span
            class="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full mt-2"
          >
            Mahasiswa
          </span>
        </div>

        <!-- Error Alert -->
        <transition name="fade">
          <div
            v-if="error"
            class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
          >
            <svg
              class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>
        </transition>

        <!-- Form Mahasiswa -->
        <form @submit.prevent="handleRegisterMahasiswa" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              NIM
            </label>
            <input
              type="text"
              :value="profileData.nomor_induk"
              disabled
              class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap <span class="text-red-500">*</span>
            </label>
            <input
              v-model="mahasiswaForm.nama"
              type="text"
              placeholder="John Doe"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Password <span class="text-red-500">*</span>
            </label>
            <input
              v-model="mahasiswaForm.password"
              type="password"
              placeholder="Minimal 6 karakter"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minlength="6"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Semester <span class="text-red-500">*</span>
            </label>
            <select
              v-model="mahasiswaForm.semester"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="" disabled>Pilih Semester</option>
              <option v-for="sem in 14" :key="sem" :value="sem">
                Semester {{ sem }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nomor HP <span class="text-red-500">*</span>
            </label>
            <input
              v-model="mahasiswaForm.no_hp"
              type="tel"
              placeholder="081234567890"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="step = 'check-email'"
              class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg transition duration-200"
            >
              Kembali
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              <svg
                v-if="loading"
                class="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span v-if="loading">Mendaftar...</span>
              <span v-else>Daftar</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Step 2: Complete Profile - Admin -->
      <div
        v-else-if="step === 'complete-profile' && profileData?.role === 'admin'"
        class="space-y-6"
      >
        <div class="text-center">
          <div
            class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-10 h-10 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-1">
            Lengkapi Profil Admin
          </h2>
          <p class="text-gray-500 text-xs">{{ profileData.email }}</p>
          <span
            class="inline-block px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full mt-2"
          >
            Administrator
          </span>
          <p class="text-xs text-purple-600 mt-2">
            ⚠️ Anda adalah admin pertama sistem
          </p>
        </div>

        <!-- Error Alert -->
        <transition name="fade">
          <div
            v-if="error"
            class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
          >
            <svg
              class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>
        </transition>

        <!-- Form Admin -->
        <form @submit.prevent="handleRegisterAdmin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap <span class="text-red-500">*</span>
            </label>
            <input
              v-model="adminForm.nama"
              type="text"
              placeholder="Admin UKSW"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Password <span class="text-red-500">*</span>
            </label>
            <input
              v-model="adminForm.password"
              type="password"
              placeholder="Minimal 6 karakter"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
              minlength="6"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nomor Induk <span class="text-red-500">*</span>
            </label>
            <input
              v-model="adminForm.nomor_induk"
              type="text"
              placeholder="A001"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            <p class="mt-1 text-xs text-gray-500">Contoh: A001, ADM001, dll</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nomor HP <span class="text-red-500">*</span>
            </label>
            <input
              v-model="adminForm.no_hp"
              type="tel"
              placeholder="081234567890"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="step = 'check-email'"
              class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg transition duration-200"
            >
              Kembali
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition duration-200 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              <svg
                v-if="loading"
                class="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span v-if="loading">Mendaftar...</span>
              <span v-else>Daftar</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Step 2: Complete Profile - Dosen -->
      <div
        v-else-if="step === 'complete-profile' && profileData?.role === 'dosen'"
        class="space-y-6 max-h-[80vh] overflow-y-auto"
      >
        <div class="text-center sticky top-0 bg-white pb-4 z-10">
          <div
            class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-1">
            Lengkapi Profil Dosen
          </h2>
          <p class="text-gray-500 text-xs">{{ profileData.email }}</p>
          <span
            class="inline-block px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full mt-2"
          >
            Dosen
          </span>
        </div>

        <!-- Error Alert -->
        <transition name="fade">
          <div
            v-if="error"
            class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
          >
            <svg
              class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>
        </transition>

        <!-- Form Dosen -->
        <form @submit.prevent="handleRegisterDosen" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap <span class="text-red-500">*</span>
            </label>
            <input
              v-model="dosenForm.nama"
              type="text"
              placeholder="Dr. John Doe"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Password <span class="text-red-500">*</span>
            </label>
            <input
              v-model="dosenForm.password"
              type="password"
              placeholder="Minimal 6 karakter"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
              minlength="6"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              NIP/NIDN <span class="text-red-500">*</span>
            </label>
            <input
              v-model="dosenForm.nomor_induk"
              type="text"
              placeholder="1234567890"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nomor HP <span class="text-red-500">*</span>
            </label>
            <input
              v-model="dosenForm.no_hp"
              type="tel"
              placeholder="081234567890"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Gelar Depan
              </label>
              <input
                v-model="dosenForm.gelar_depan"
                type="text"
                placeholder="Dr."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Gelar Belakang
              </label>
              <input
                v-model="dosenForm.gelar_belakang"
                type="text"
                placeholder="M.Kom"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Jabatan
            </label>
            <input
              v-model="dosenForm.jabatan"
              type="text"
              placeholder="Lektor"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fakultas <span class="text-red-500">*</span>
            </label>
            <select
              v-model="dosenForm.fakultas_id"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="" disabled>Pilih Fakultas</option>
              <option :value="1">Fakultas Teknologi Informasi</option>
              <!-- Add more fakultas as needed -->
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tanda Tangan <span class="text-gray-500 text-xs">(Optional)</span>
            </label>
            <SignatureCreator
              @update:finalImage="signatureFinalBlob = $event"
            />
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="step = 'check-email'"
              class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg transition duration-200"
            >
              Kembali
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition duration-200 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              <svg
                v-if="loading"
                class="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span v-if="loading">Mendaftar...</span>
              <span v-else>Daftar</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Step 3: Success -->
      <div v-else-if="step === 'success'" class="text-center space-y-4 py-8">
        <div
          class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
        >
          <svg
            class="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900">Registrasi Berhasil!</h2>
        <p class="text-gray-600">Anda akan dialihkan ke dashboard...</p>
        <svg
          class="w-6 h-6 animate-spin text-blue-600 mx-auto"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { apiClient } from "@/lib/axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import SignatureCreator from "@/components/dosen/SignatureCreator.vue";

// =========================
// Types
// =========================
interface ProfileData {
  needs_profile: boolean;
  role: string;
  nomor_induk?: string;
  prodi_id?: number;
  fakultas_id?: number;
  email: string;
}

// =========================
// Router & Store
// =========================
const router = useRouter();
const authStore = useAuthStore();

// =========================
// State
// =========================
const step = ref<"check-email" | "complete-profile" | "success">("check-email");
const loading = ref(false);
const error = ref("");
const profileData = ref<ProfileData | null>(null);

// Email form
const emailForm = ref({
  email: "",
});

// Mahasiswa form
const mahasiswaForm = ref({
  nama: "",
  password: "",
  semester: "",
  no_hp: "",
});

// Admin form
const adminForm = ref({
  nama: "",
  password: "",
  nomor_induk: "",
  no_hp: "",
});

// Dosen form
const dosenForm = ref({
  nama: "",
  password: "",
  nomor_induk: "",
  no_hp: "",
  gelar_depan: "",
  gelar_belakang: "",
  jabatan: "",
  fakultas_id: "",
});

const signatureFinalBlob = ref<Blob | null>(null);

// =========================
// Step 1: Check Email
// =========================
const handleCheckEmail = async () => {
  loading.value = true;
  error.value = "";

  try {
    const res = await apiClient.post("/auth_manual/register/check-email", {
      email: emailForm.value.email,
    });

    const data = res.data;

    if (data.success && data.data.needs_profile) {
      profileData.value = data.data;
      step.value = "complete-profile";
    } else {
      error.value = data.message || "Gagal memeriksa email";
    }
  } catch (err: any) {
    error.value =
      err.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// =========================
// Step 2: Register Mahasiswa
// =========================
const handleRegisterMahasiswa = async () => {
  loading.value = true;
  error.value = "";

  try {
    const res = await apiClient.post(
      "/auth_manual/register/complete-profile/mahasiswa",
      {
        email: profileData.value?.email,
        nama: mahasiswaForm.value.nama,
        password: mahasiswaForm.value.password,
        semester: parseInt(mahasiswaForm.value.semester),
        no_hp: mahasiswaForm.value.no_hp,
      },
    );

    const data = res.data;

    if (data.success) {
      // Save tokens
      localStorage.setItem("access_token", data.data.access_token);
      localStorage.setItem("refresh_token", data.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      // Update auth store
      authStore.setAccessToken(data.data.access_token);
      authStore.setRefreshToken(data.data.refresh_token);
      authStore.setUser(data.data.user);

      if (data.data.mahasiswa) {
        authStore.setMahasiswa(data.data.mahasiswa);
      }

      step.value = "success";

      setTimeout(() => {
        router.push("/mahasiswa/dashboard");
      }, 1500);
    } else {
      error.value = data.message || "Registrasi gagal";
    }
  } catch (err: any) {
    error.value =
      err.response?.data?.message || "Terjadi kesalahan saat registrasi.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// =========================
// Step 2: Register Admin
// =========================
const handleRegisterAdmin = async () => {
  loading.value = true;
  error.value = "";

  try {
    const res = await apiClient.post(
      "/auth_manual/register/complete-profile/admin",
      {
        email: profileData.value?.email,
        nama: adminForm.value.nama,
        password: adminForm.value.password,
        nomor_induk: adminForm.value.nomor_induk,
        no_hp: adminForm.value.no_hp,
      },
    );

    const data = res.data;

    if (data.success) {
      localStorage.setItem("access_token", data.data.access_token);
      localStorage.setItem("refresh_token", data.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      authStore.setAccessToken(data.data.access_token);
      authStore.setRefreshToken(data.data.refresh_token);
      authStore.setUser(data.data.user);

      step.value = "success";

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 1500);
    } else {
      error.value = data.message || "Registrasi gagal";
    }
  } catch (err: any) {
    error.value =
      err.response?.data?.message || "Terjadi kesalahan saat registrasi.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// =========================
// Step 2: Register Dosen
// =========================
const handleRegisterDosen = async () => {
  loading.value = true;
  error.value = "";

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("email", profileData.value?.email || "");
    formDataToSend.append("nama", dosenForm.value.nama);
    formDataToSend.append("password", dosenForm.value.password);
    formDataToSend.append("nomor_induk", dosenForm.value.nomor_induk);
    formDataToSend.append("no_hp", dosenForm.value.no_hp);
    formDataToSend.append("gelar_depan", dosenForm.value.gelar_depan || "");
    formDataToSend.append(
      "gelar_belakang",
      dosenForm.value.gelar_belakang || "",
    );
    formDataToSend.append("jabatan", dosenForm.value.jabatan || "");
    formDataToSend.append(
      "fakultas_id",
      dosenForm.value.fakultas_id.toString(),
    );

    if (signatureFinalBlob.value) {
      const signatureFileToSend = new File(
        [signatureFinalBlob.value],
        `signature_${Date.now()}.png`,
        { type: "image/png" },
      );
      formDataToSend.append("signature", signatureFileToSend);
    }

    const res = await apiClient.post(
      "/auth_manual/register/complete-profile/dosen",
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const data = res.data;

    if (data.success) {
      localStorage.setItem("access_token", data.data.access_token);
      localStorage.setItem("refresh_token", data.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      authStore.setAccessToken(data.data.access_token);
      authStore.setRefreshToken(data.data.refresh_token);
      authStore.setUser(data.data.user);

      if (data.data.dosen) {
        authStore.setDosen(data.data.dosen);
      }

      step.value = "success";

      setTimeout(() => {
        router.push("/dosen/dashboard");
      }, 1500);
    } else {
      error.value = data.message || "Registrasi gagal";
    }
  } catch (err: any) {
    error.value =
      err.response?.data?.message || "Terjadi kesalahan saat registrasi.";
    console.error(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
