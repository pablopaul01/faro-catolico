'use client'

import { create } from 'zustand'

interface SettingsStore {
  copyrightMode:    boolean
  setCopyrightMode: (value: boolean) => void
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  copyrightMode:    false,
  setCopyrightMode: (value) => set({ copyrightMode: value }),
}))
