import toasteventbus from 'primevue/toasteventbus'
import type {ToastMessageOptions} from "primevue/toast";

export function add(message: ToastMessageOptions) {
  toasteventbus.emit('add', message)
}

export function info(summary: string, detail: string, life: number = 8000) {
  toasteventbus.emit('add', { severity: 'info', summary, detail, life })
}

export function warn(summary: string, detail: string, life: number = 8000) {
  toasteventbus.emit('add', { severity: 'warn', summary, detail, life })
}

export function success(summary: string, detail: string, life: number = 8000) {
  toasteventbus.emit('add', { severity: 'success', summary, detail, life })
}

export function error(summary: string, detail: string, life: number = 8000) {
  toasteventbus.emit('add', { severity: 'error', summary, detail, life })
}