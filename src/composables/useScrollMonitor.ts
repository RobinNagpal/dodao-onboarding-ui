import scrollMonitor from 'scrollmonitor';
import { onBeforeUnmount, onMounted, ref } from 'vue';

export function useScrollMonitor(fn) {
  let elementWatcher;

  const endElement = ref(null);

  onMounted(() => {
    elementWatcher = scrollMonitor.create(endElement.value);
    elementWatcher.enterViewport(() => {
      fn();
    });
  });

  onBeforeUnmount(() => elementWatcher.destroy());

  return { endElement };
}
