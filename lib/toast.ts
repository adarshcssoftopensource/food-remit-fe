import { toast as sonnerToast, type ExternalToast } from "sonner";

const defaultOptions: ExternalToast = {
  duration: 4000,
};

export const toast = {
  success(message: string, description?: string, opts?: ExternalToast) {
    return sonnerToast.success(message, {
      description,
      ...defaultOptions,
      ...opts,
    });
  },

  error(message: string, description?: string, opts?: ExternalToast) {
    return sonnerToast.error(message, {
      description,
      ...defaultOptions,
      ...opts,
    });
  },

  warning(message: string, description?: string, opts?: ExternalToast) {
    return sonnerToast.warning(message, {
      description,
      ...defaultOptions,
      ...opts,
    });
  },

  info(message: string, description?: string, opts?: ExternalToast) {
    return sonnerToast.info(message, {
      description,
      ...defaultOptions,
      ...opts,
    });
  },

  loading(message: string, opts?: ExternalToast) {
    return sonnerToast.loading(message, { ...defaultOptions, ...opts });
  },

  dismiss(id?: string | number) {
    return sonnerToast.dismiss(id);
  },

  promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    },
    opts?: ExternalToast,
  ) {
    return sonnerToast.promise(promise, {
      ...messages,
      ...defaultOptions,
      ...opts,
    });
  },
};
