<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4"
  >
    <div class="max-w-3xl w-full">
      <div
        class="w-full bg-white rounded-2xl shadow-xl border border-red-200 overflow-hidden"
      >
        <!-- Header -->
        <div
          class="relative bg-gradient-to-r from-red-600 to-orange-500 p-8 text-center text-white"
        >
          <!-- BUTTON KEMBALI -->
          <button
            @click="$router.back()"
            class="absolute left-4 top-4 flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-semibold rounded-lg transition"
          >
            ← Kembali
          </button>

          <div
            class="absolute -top-10 right-0 w-28 h-28 bg-white/10 rounded-full blur-xl"
          ></div>

          <h1 class="text-3xl font-bold mb-2">File Permanently Removed</h1>
          <p class="text-sm font-medium opacity-90">
            This document is no longer available on the server.
          </p>

          <div class="mt-4 flex justify-center">
            <span
              class="inline-flex items-center px-4 py-2 border border-white/30 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold"
            >
              <span
                class="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"
              ></span>
              Permanently Deleted
            </span>
          </div>
        </div>

        <!-- Body -->
        <div class="p-8 space-y-6">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 class="text-lg font-bold text-red-800 mb-1">File Not Found</h2>
            <p class="text-red-700 text-sm">
              The requested file has been permanently deleted and cannot be
              recovered.
            </p>
          </div>

          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 class="text-lg font-bold text-red-800 mb-1">Next Step</h2>
            <p class="text-red-700 text-sm">
              If you still need this document, please submit a new request.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-red-100 border-t border-red-200 px-6 py-4 text-center">
          <p class="text-red-800 text-xs font-medium">
            This file has been removed permanently based on the retention
            policy.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
