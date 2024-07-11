import { ref } from 'vue';

const eventBus = ref<{ [key: string]: Function[] }>({});

const on = (event: string, callback: Function): void => {
  if (!eventBus.value[event]) {
    eventBus.value[event] = [];
  }
  eventBus.value[event].push(callback);
};

const emit = (event: string, payload?: any): void => {
  if (eventBus.value[event]) {
    eventBus.value[event].forEach(callback => callback(payload));
  }
};

export { on, emit };