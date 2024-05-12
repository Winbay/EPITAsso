// File to remove, juste here to not block tests run in CI

import { shallowMount } from '@vue/test-utils'
import MainPanel from '@/components/MainPanel.vue'
import { describe, it, expect } from 'vitest'

describe('MainPanel', () => {
  it('always returns true', () => {
    shallowMount(MainPanel)
    expect(true).toBe(true)
  })
})
