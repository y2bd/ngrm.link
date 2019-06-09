import Header from './Header.svelte';

const app = new Header({
  target: document.body,
  props: {
    name: 'world 22'
  }
});

export default app;
