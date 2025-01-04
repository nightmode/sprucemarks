'use strict'

//-------
// Notes
//-------
/*
    This shared JavaScript file is meant to be shared between different pages. It will also be included in the root level service worker which is built from more than one file.
*/

//-----------
// Variables
//-----------
const shared = {
    'browser': {
        'brave'  : false, // default which can be set true by shared_start()
        'chrome' : navigator.userAgent.toLowerCase().indexOf('chrome/')  > 1,
        'edge'   : navigator.userAgent.toLowerCase().indexOf('edg/')     > 1,
        'firefox': navigator.userAgent.toLowerCase().indexOf('firefox/') > 1,
        'opera'  : navigator.userAgent.toLowerCase().indexOf('opr/')     > 1
    },
    'function': { // will hold various functions
        // browser_body_add_class
        // browser_customize

        // delay

        // expect

        // human_time_since
        // human_time_to

        // listen_mouse_events
        // listen_scroll_nav
        // listen_scroll_to_links
        // listen_show_message_dismiss

        // location_hash_scroll_to

        // log

        // parse_integer

        // scroll_nav
        // scroll_to
        // scroll_to_id

        // shared_start

        // show_message
        // show_message_dismiss

        // theme_and_icon
        // theme_monitor

        // time_remove_precision
        // time_to_tick
    },
    'setting': { // settings used internally, not customizable by the user
        'log': true // verbose logging for development, make sure this is false when publishing for end users
    },
    'timer': { // setTimeout references
        'theme_monitor': '' // will become a setTimeout call to run theme_monitor() every 10 seconds
    },
    'url': {
        'extension': browser.runtime.getURL('/')  // returns a string like "chrome-extension://asdfghjkl/"
    }
} // shared

//-----------
// Functions
//-----------
const browser_body_add_class = shared.function.browser_body_add_class = function browser_body_add_class() {
    /*
    If needed, add a "firefox" class to the body element for CSS use.
    */

    if (shared.browser.firefox) {
        document.body.classList.add('firefox')
    }
} // browser_body_add_class

const browser_customize = shared.function.browser_customize = function browser_customize() {
    /*
    Hide human visible elements that are not relevant to this web browser.
    */

    const hide_class_names = []

    for (const property in shared.browser) {
        if (shared.browser[property] === false) {
            hide_class_names.push('only-' + property)
        }
    } // for

    if (shared.browser.edge) {
        // hide areas that are only for non-edge browsers
        hide_class_names.push('only-non-edge')
    } // if

    for (const class_name of hide_class_names) {
        const elements = document.getElementsByClassName(class_name)

        for (const item of elements) {
            item.classList.add('hidden')
        } // for
    } // for
} // browser_customize

const delay = shared.function.delay = function delay(ms) {
    /*
    Promise that will delay the desired number of milliseconds before resolving.

    @param   {Number}   ms  Number of milliseconds to delay.
    @return  {Promise}
    */

    return new Promise(resolve => setTimeout(resolve, ms))
} // delay

const expect = shared.function.expect = function expect(result, error_message) {
    /*
    Expect function for testing. Only throw an error if the result is not exactly true.

    @param  {Boolean}  result           True or false.
    @param  {String}   [error_message]  Optional. Error message to throw if result is not exactly true.
    */

    if (result !== true) {
        throw new Error(error_message)
    } // if
} // expect

const human_time_since = shared.function.human_time_since = function human_time_since(epoch_time) {
    /*
    Return a human friendly version of how much time has passed since an epoch time.

    @param  {Number}  epoch_time  Milliseconds since epoch time.
    */

    const seconds_elapsed = Math.floor((new Date() - epoch_time) / 1000)

    const seconds_in = {
        year  : 31536000, // 365 days
        month : 2592000,  //  30 days
        day   : 86400,    //   1 day
        hour  : 3600,
        minute: 60
    } // seconds_in

    let time_since = Math.floor(seconds_elapsed / seconds_in.year)

    let word = ''

    if (time_since >= 1) {
        word = 'year'
    } else {
        time_since = Math.floor(seconds_elapsed / seconds_in.month)

        if (time_since >= 1) {
            word = 'month'
        } else {
            time_since = Math.floor(seconds_elapsed / seconds_in.day)

            if (time_since >= 1) {
                word = 'day'
            } else {
                time_since = Math.floor(seconds_elapsed / seconds_in.hour)

                if (time_since >= 1) {
                    word = 'hour'
                } else {
                    time_since = Math.floor(seconds_elapsed / seconds_in.minute)

                    if (time_since >= 1) {
                        word = 'minute'
                    } else {
                        time_since = seconds_elapsed
                        word = 'second'
                    } // if
                } // if
            } // if
        } // if
    } // if

    if (time_since > 1 || time_since === 0) {
        word += 's'
    } // if

    if (time_since < 0) {
        // user may have manually updated their system time so default to showing "1 day"
        return '1 day'
    } // if

    return time_since + ' ' + word
} // human_time_since

const human_time_to = shared.function.human_time_to = function human_time_to(epoch_time) {
    /*
    Return a human friendly version of how much time until an epoch time.

    @param  {Number}  epoch_time  Milliseconds since epoch time.
    */

    const seconds_until = Math.floor((epoch_time - new Date()) / 1000)

    const seconds_in = {
        year  : 31536000, // 365 days
        month : 2592000,  //  30 days
        day   : 86400,    //   1 day
        hour  : 3600,
        minute: 60
    } // seconds_in

    let time_to = Math.floor(seconds_until / seconds_in.year)

    let word = ''

    if (time_to >= 1) {
        word = 'year'
    } else {
        time_to = Math.floor(seconds_until / seconds_in.month)

        if (time_to >= 1) {
            word = 'month'
        } else {
            time_to = Math.floor(seconds_until / seconds_in.day)

            if (time_to >= 1) {
                word = 'day'
            } else {
                time_to = Math.floor(seconds_until / seconds_in.hour)

                if (time_to >= 1) {
                    word = 'hour'
                } else {
                    time_to = Math.floor(seconds_until / seconds_in.minute)

                    if (time_to >= 1) {
                        word = 'minute'
                    } else {
                        time_to = seconds_until
                        word = 'second'
                    } // if
                } // if
            } // if
        } // if
    } // if

    if (time_to > 1 || time_to === 0) {
        word += 's'
    } // if

    if (time_to < 0) {
        // user may have manually updated their system time so default to showing "1 day"
        return '1 day'
    } // if

    return time_to + ' ' + word
} // human_time_to

const listen_mouse_events = shared.function.listen_mouse_events = function listen_mouse_events() {
    /*
    Listen for mousedown and mouseup events so mouse users do not get persistent focus effects after a click.
    */

    document.addEventListener('mousedown', function(e) {
        const node_name = e.target.nodeName.toLowerCase()

        if (node_name === 'a' || node_name === 'input') {
            e.preventDefault() // prevents focus state for mouse users
        } // if
    })

    document.addEventListener('mouseup', function(e) {
        const node_name = e.target.nodeName.toLowerCase()

        if (node_name === 'a' || node_name === 'input') {
            // blur anything that has focus since we just had a mouse click
            document.activeElement.blur()
        } // if
    })
} // listen_mouse_events

const listen_scroll_nav = shared.function.listen_scroll_nav = function listen_scroll_nav() {
    /*
    Listener for scroll events, resize events, and scroll nav clicks.
    */

    window.addEventListener('scroll', scroll_nav)

    window.addEventListener('resize', scroll_nav)

    local.element.scroll_nav.addEventListener('click', function(e) {
        e.preventDefault()
        location.hash = 'none' // since an empty hash would instantly jump the user to the top of the page, set a hash that does not exist to allow smooth scrolling to the top of the page
        scroll_to(0)
    })
} // listen_scroll_nav

const listen_scroll_to_links = shared.function.listen_scroll_to_links = function listen_scroll_to_links() {
    /*
    Setup event listeners for links with a "scroll-to" class in order to call scroll_to_id() for an HTML ID when clicked on.
    */

    const elements = document.getElementsByClassName('scroll-to')

    for (const item of elements) {
        item.addEventListener('click', function(e) {
            e.preventDefault()

            scroll_to_id(this.dataset.scrollTo)
        })
    } // for
} // listen_scroll_to_links

const listen_show_message_dismiss = shared.function.listen_show_message_dismiss = function listen_show_message_dismiss() {
    /*
    Setup event listeners for links with a "show-message-dismiss" class in order to call show_message_dismiss() for an HTML ID when clicked on.
    */

    const elements = document.getElementsByClassName('show-message-dismiss')

    for (const item of elements) {
        item.addEventListener('click', function(e) {
            e.preventDefault()

            // set the cursor on this button to the default cursor so a pointer cursor does not remain for anyone hovering over this button when show_message_dismiss() does its fade out and disappear animation
            e.target.classList.add('no-click')

            show_message_dismiss(this.dataset.id)
        })
    } // for
} // listen_show_message_dismiss

const location_hash_scroll_to = shared.function.location_hash_scroll_to = async function location_hash_scroll_to() {
    /*
    If a location hash starts with "#smooth-", scroll to an HTML element ID specified by whatever came after "#smooth-".
    */

    if (location.hash.indexOf('#smooth') === 0) {
        // slight delay so a user can notice a navigation change before scrolling down
        await delay(250)

        scroll_to_id(location.hash.replace('#smooth-', ''))
    }
} // location_hash_scroll_to

const log = shared.function.log = function log(...any) {
    /*
    Log to the console, if allowed.

    @param  {*}  any  Any one or more things that can be logged to the console.
    */

    if (shared.setting.log) {
        console.log(...any)
    }
} // log

const parse_integer = shared.function.parse_integer = function parse_integer(value) {
    /*
    Return an integer version of a string or number, if possible.

    @param   {*}       value  A string or number.
    @return  {Number}         An integer, if possible.
    */

    return parseInt(value, 10)
} // parse_integer

const scroll_nav = shared.function.scroll_nav = function scroll_nav() {
    /*
    Show or hide the scroll to top navigation link near the scroll bar.
    */

    const element = local.element.html

    if (element.scrollHeight <= element.clientHeight) {
        // no scroll navigation needed
        local.element.scroll_nav.classList.add('hidden')

        return 'early'
    } // if

    if (element.scrollTop === 0) {
        // we are scrolled all the way to the top
        local.element.scroll_nav.classList.remove('fade-in')
        local.element.scroll_nav.classList.add('fade-out')
    } else {
        local.element.scroll_nav.classList.remove('fade-out', 'hidden')
        local.element.scroll_nav.classList.add('fade-in')
    } // if
} // scroll_nav

const scroll_to = shared.function.scroll_to = function scroll_to(offset_top) {
    /*
    Scroll the entire window to a specified pixel value offset from the top.

    @param  {Number}  num  Pixel value like 0 or 400.
    */

    if (typeof offset_top !== 'number') {
        // offset_top must be a number
        return 'early'
    } // if

    if (offset_top < 0) {
        offset_top = 0
    } // if

    window.scroll({
        behavior: 'smooth',
        left: 0,
        top: offset_top
    })
} // scroll_to

const scroll_to_id = shared.function.scroll_to_id = function scroll_to_id(html_id) {
    /*
    Scroll the entire window to a specified ID for an HTML element.

    @param  {String}  html_id  ID of an HTML element to scroll to.
    */

    const element = document.getElementById(html_id)

    if (element === null) {
        // element not found
        return 'early'
    } // if

    let offset_top = element.offsetTop - 32

    if (offset_top < 0) {
        offset_top = 0
    } // if

    scroll_to(offset_top)

    // Setting a smooth prefixed hash will keep the browser from jumping directly to a matching element. It also enables a smooth scroll back to the same element after a reload or after a bookmark to a Sprucemarks page with a location hash is clicked.
    location.hash = 'smooth-' + html_id
} // scroll_to_id

const shared_start = shared.function.shared_start = async function shared_start() {
    /*
    Shared start tasks that need to run before other scripts rely on the shared object. Must be run by other scripts so they can honor any await calls in this function.
    */

    // brave browser
    if (typeof navigator.brave === 'object') {
        if (typeof navigator.brave.isBrave === 'function') {
            shared.browser.brave = (await navigator.brave.isBrave() === true) ? true : false

            if (shared.browser.brave) {
                // set browser.chrome to false since brave looks like chrome when checking its navigator.userAgent string
                shared.browser.chrome = false
            } // if
        } // if
    } // if

    // edge and opera browsers
    if (shared.browser.edge || shared.browser.opera) {
        // set browser.chrome to false since these browsers look like chrome when checking their navigator.userAgent strings
        shared.browser.chrome = false
    } // if
} // shared_start

const show_message = shared.function.show_message = function show_message() {
    /*
    Show one or more messages to the user.
    */

    for (const property in local.setting.show_message) {
        if (local.setting.show_message[property] === true) {
            const html_id = 'show-message-' + property.replace(/_/g, '-')

            // unhide the message
            document.getElementById(html_id).classList.remove('hidden')

            // set the property to false
            local.setting.show_message[property] = false
        } // if
    } // for
} // show_message

const show_message_dismiss = shared.function.show_message_dismiss = function show_message_dismiss(html_id) {
    /*
    Hide an HTML element specified by an ID by using a fade out and disappear animation.

    @param  {String}  html_id  ID of an HTML element to fade out and disappear.
    */

    const element = document.getElementById(html_id)

    if (element.style.animationName === 'fade-out-disappear') {
        // we are already in the process of dismissing this element
        return 'early'
    } // if

    element.style.setProperty('--height', element.offsetHeight + 'px')

    element.style.animationName = 'fade-out-disappear'
} // show_message_dismiss

const theme_and_icon = shared.function.theme_and_icon = function theme_and_icon() {
    /*
    Update navigation links and if needed, change the URL location, body class, and favicon to match the current theme and icon color.
    */

    let browser_is_dark = local.preference.browser_is_dark
    let icon_color      = local.preference.icon_color
    let theme           = local.preference.theme

    const current_browser_is_dark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (browser_is_dark !== current_browser_is_dark) {
        // update our own local preference
        browser_is_dark = local.preference.browser_is_dark = current_browser_is_dark

        // relay changed information to the background service worker
        const message = {
            'subject': 'preference-set',
            'name'   : 'browser_is_dark',
            'value'  : browser_is_dark
        } // message

        try {
            local.port.postMessage(message)
        } catch (error) {
            log('theme_and_icon -> post message error ->', error)
        } // try
    } // if

    if (theme !== 'automatic' && theme !== 'dark' && theme !== 'light') {
        // set a valid default
        theme = 'automatic'
    } // if

    if (icon_color !== 'automatic' && icon_color !== 'dark' && icon_color !== 'green' && icon_color !== 'light') {
        // set a valid default
        icon_color = 'automatic'
    } // if

    if (theme === 'automatic') {
        if (browser_is_dark === true) {
            theme = 'dark'
        } else {
            theme = 'light'
        } // if
    } // if

    if (icon_color === 'automatic') {
        if (browser_is_dark === true) {
            icon_color = 'light'
        } else {
            icon_color = 'dark'
        } // if
    } // if

    let theme_or_icon_changed = false // default

    const location_array = location.pathname.split('/') // results in an array like ["", "page", "dark", "light", "options.html"]

    const current_theme      = location_array[2] // dark
    const current_icon_color = location_array[3] // light
    const current_page       = location_array[4] // options.html

    if (theme !== current_theme) {
        // update body class
        document.body.classList.remove('dark', 'light')
        document.body.classList.add(theme)

        theme_or_icon_changed = true
    } // if

    if (icon_color !== current_icon_color) {
        // update favicon
        const favicon = document.querySelector("link[rel=icon]")

        if (favicon === null) {
            // popup pages do not use favicons
        } else {
            // update the favicon
            favicon.href = '/images/icon/icon-' + icon_color + '-32.png?version=2025.1.3.0'
        } // if

        theme_or_icon_changed = true
    } // if

    if (theme_or_icon_changed === true) {
        if (local.page !== 'popup') {
            // update nav links
            const links = document.querySelectorAll('a.page')

            links.forEach(function(link) {
                if (link.href !== '') {
                    const location_array = link.href.replace(location.origin, '').split('/') // results in an array like ["", "page", "dark", "light", "about.html"]

                    // set theme
                    location_array[2] = theme

                    // set icon color
                    location_array[3] = icon_color

                    link.href = location_array.join('/')
                } // if
            })
        } // if

        const new_page_url = shared.url.extension + 'page/' + theme + '/' + icon_color + '/' + current_page + location.hash

        // update the location without affecting the back button
        history.replaceState(undefined, undefined, new_page_url)
    } // if
} // theme_and_icon

const theme_monitor = shared.function.theme_monitor = function theme_monitor() {
    /*
    Monitor the browser preferred color scheme every 10 seconds and call the "theme_and_icon" function as needed.
    */

    clearTimeout(shared.timer.theme_monitor)

    if (local.preference.browser_is_dark !== window.matchMedia('(prefers-color-scheme: dark)').matches) {
        log('theme_monitor -> prefers color scheme change')
        theme_and_icon()
    } // if

    shared.timer.theme_monitor = setTimeout(theme_monitor, 10000) // 10 seconds
} // theme_monitor

const time_remove_precision = shared.function.time_remove_precision = function time_remove_precision(time) {
    /*
    Remove the last three digits of precision.

    @param   {Number}  time   Epoch time like 1000000004567.
    @return  {Number}         Epoch time like 1000000004000.
    */

    return parse_integer(time.toString().slice(0, -3) + '000')
} // time_remove_precision

const time_to_tick = shared.function.time_to_tick = function time_to_tick(event_time, now, delay) {
    /*
    Figure out the next time a timer should tick in order to tick 1 millisecond after the next closest tick time.

    @param   {Number}  event_time  Epoch time of an event.
    @param   {Number}  now         Current epoch time.
    @param   {Number}  delay       Desired delay in milliseconds between ticks.
    @return  {Number}              Time to the next closest tick in milliseconds plus 1 millisecond.
    */

    const time_difference = Math.abs(now - event_time)

    let next_tick = delay - (time_difference % delay)

    if (now < event_time) {
        // event is in the future
        next_tick = (delay - next_tick) || delay // default to delay if next_tick is 0
    } // if

    return next_tick + 1 // plus 1 millisecond
} // time_to_tick