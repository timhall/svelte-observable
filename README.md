# svelte-observable

Use observables in svelte components with ease. svelte-observable looks for observables in `data` and `computed` and handles subscriptions so that all you have to do is `{#await ...}` in your templates.

```html
{#await values}
  Loading until first value
{:then value}
  Will be re-rendered as values come in
{:catch error}
  Errors are handled too
{/await}

<input type="text" bind:value=query />

{#await results}
  Loading...
{:then result}
  {result}
{:catch error}
  Error: {error}
{/await}

<script>
  import { observe, subscribe } from 'svelte-observable'; 
  import { list, search } from './api';

  export default {
    data() {
      return {
        values: observe(list()),
        //      ^ observe lets svelte-observable know to subscribe to this value
        query: ''
      };
    },
    computed: {
      results: ({ query }) => observe(search(query))
    },

    onstate: subscribe
    //       ^ subscribe to any new observables on state change
  }
</script>
```

## observe

Mark an observable to be watched and create an initial deferred value for compatibility with `{#await ...}`.
`subscribe` will unsubscribe any previous observables for a given key, so it is safe to return `observe` in computed values.

```js
<script>
  import { observe } from 'svelte-observable';
  import { list, search } from './api';

  export default {
    data() {
      return {
        values: observe(list()),
        query: ''
      };
    },

    computed: {
      results: ({ query }) => observe(search(query))
    }
  }
</script>
```

## subscribe

Subscribe to any new observables on state change. Handles unsubscribe when an observable is replaced or the component is destroyed.

```js
<script>
  import { subscribe } from 'svelte-observable';

  export default {
    onstate: subscribe

    // or

    onstate({ changed, current }) {
      // ...

      subscribe.call(this, { changed, current });
    }
  }
</script>
```
