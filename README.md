# svelte-observable

Use observables in svelte components with ease. svelte-observable wraps Observables with svelte's reactive stores so that all you have to do is `{#await $...}` in your templates. This allows you to work with Observable libraries like RxJS and zen-observable with the convenience and built-in support of svelte's reactive stores.

```html
{#await $values}
  Loading until first value
{:then value}
  Will be re-rendered as values come in
{:catch error}
  Errors are handled too
{/await}

<script>
  import { observe } from 'svelte-observable'; 
  import { list } from './api';

  const values = observe(list());
</script>
```

## observe

Wrap an observable as a reactive store with an initial deferred value for compatibility with `{#await ...}`.
Wrapped observables return a chain of promises in one of three promise states:

- pending - No value or error has been received yet
- fulfilled - Received a value
- rejected - Received an error

```html
<script>
  import { observe } from 'svelte-observable';

  const results = query({});
  //    ^ Observable<Result>

  const results_store = observe(results);
  //    ^ Readable<Promise<Result>>

  function query() {
    return new Observable(observer => {
      // ...
    })
  }
</script>

{#await $results_store}
  pending - No value or error has been received yet
{:then result}
  fulfilled - Received a value
{:catch error}
  rejected - Received an error
{/await}
```

## flat

Flatten a store/observable of stores/observables, unsubscribing from the previous store/observable as new values come in. This method is similar to `switchMap` in RxJS.

```html
<script>
  import { writable, derived } from 'svelte/store';
  import { flat } from 'svelte-observable';
  import { query } from './api';

  const search = writable('');

  // query returns an Observable of results
  // -> need to unsubscribe from previous results on search change
  const store_of_observables = derived(search, $search => query($search));
  //    ^ Readable<Observable<Result>>

  const results = flat(store_of_observables);
  //    ^ Readable<Promise<Result>>
</script>

<input value={$search} on:change={e => search.set(e.target.value)} />

{#await $results}
  Loading...
{:then results}
  {results}
{:catch error}
  {error}
{/await}
```
