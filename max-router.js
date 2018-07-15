var history = require('history')
var UrlMapper = require('url-mapper')

// Private singletons
var history;
var urlMapper;
var routes = {}
var onMissing = function() { console.error('max-router onMissing handler not set') }
var onError = function() { console.error('max-router onError handler not set') }

exports.route = function(pattern, handler) {
    if (routes[pattern] != null) {
        console.warn('max-router pattern already is use: ' + pattern)
    }

    routes[pattern] = handler
}

exports.onMissing = function(handler) {
    onMissing = handler
}

exports.onError = function(handler) {
    onError = handler
}

exports.go = function(url) {
    if (history == null) {
        onError(new Error('max-router go called before start'))
        return
    }

    history.push(url)
}

exports.listen = function(opts, callback) {
    if (opts != null && opts.catchUnhandledErrors) {
        window.addEventListener('error', function(event) {
            onError(event.error)
        })
        window.addEventListener('unhandledrejection', function(event) {
            onError(event.reason)
        })
    }

    history = history.createBrowserHistory()
    history.listen(function(location) {
        safelyInvoke(function() {
            callback(location)
        })
    })

    safelyInvoke(function () {
        callback(window.location)
    })
}

exports.onLocationChange = function(location) {
    urlMapper = urlMapper || UrlMapper({ query: true })

    var route = urlMapper.map(location.pathname + location.search, routes)
    if (route == null) {
        onMissing(location.pathname)
        return
    }

    safelyInvoke(function() {
        return route.match(route.values)
    })
}

function safelyInvoke(fn) {
    try {
        var promise = fn()

        // If promise not returned, ignore result
        if (promise == null || promise.catch == null) return
    
        // Otherwise catch errors
        promise.catch(onError)
    } catch (error) {
        onError(error)
    }
}
