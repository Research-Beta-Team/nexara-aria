import useStore from '../store/useStore';

/**
 * useToast — convenience hook for firing toasts.
 *
 * Usage:
 *   const toast = useToast();
 *   toast.success('Saved!');
 *   toast.error('Something went wrong');
 *   toast.warning('Check your inputs');
 *   toast.info('Campaign syncing...');
 *   toast.show({ message: 'Custom', type: 'success', duration: 5000 });
 */
const useToast = () => {
  const addToast = useStore((s) => s.addToast);

  return {
    success: (message, duration) => addToast({ message, type: 'success', duration }),
    error:   (message, duration) => addToast({ message, type: 'error',   duration }),
    warning: (message, duration) => addToast({ message, type: 'warning', duration }),
    info:    (message, duration) => addToast({ message, type: 'info',    duration }),
    show:    (opts)              => addToast(opts),
  };
};

export default useToast;
