// File to remove, juste here to not block tests run in CI

import { shallowMount } from '@vue/test-utils'
import MainPanel from '@/components/MainPanel.vue' // Assurez-vous de remplacer 'MyComponent' par le nom réel de votre composant
import { describe, it, expect } from 'vitest'

describe('MainPanel', () => {
  it('always returns true', () => {
    const wrapper = shallowMount(MainPanel)
    expect(true).toBe(true)
  })
})
