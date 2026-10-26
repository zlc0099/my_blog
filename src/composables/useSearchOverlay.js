import { ref } from 'vue';

const isSearchOpen = ref(false);

export function useSearchOverlay() {
  return {
    isSearchOpen,
    openSearch: () => {
      isSearchOpen.value = true;
    },
    closeSearch: () => {
      isSearchOpen.value = false;
    },
  };
}
