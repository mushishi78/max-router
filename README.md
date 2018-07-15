# max-router

An opinionated browser routing configuration. Basically a wrapper around 2 libraries [History](https://github.com/ReactTraining/history) and [Url Mapper](https://github.com/cerebral/url-mapper). The purpose being to provide a slightly simpler API for a common use case but without any real flexibility.

## Installation

With npm:

```
> npm install --save-dev max-router
```

Or yarn:

```
> yarn add -D max-router
```

## Usage

```JavaScript
import * as router from 'max-router'

router.route('/badger/:id', async ({ id }) => {
    const badger = await fetch(`example.com/badger/${id}`)
    // Render badger page...
})

router.onMissing(async path => {
    // Render 404
})

router.onError(async error => {
    // Render 500
})

// Listen for changes to the url (also immediately invokes for current url)
router.listen({ catchUnhandledErrors: true }, async location => {
    // Do middleware type stuff, like authentication...

    // Invoke the router
    router.onLocationChange(location)
})

// If you want to navigate somewhere
router.go('/badger/1')

```

The `catchUnhandledErrors` option will set `window.onerror` and `window.onunhandledrejection` to call the router's `onError`, so that unhandled errors can display the 500 page.
