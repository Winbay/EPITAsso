import type {ToastMessageOptions} from "primevue/toast";

export interface CustomToast {
  add(message: ToastMessageOptions): void;
}