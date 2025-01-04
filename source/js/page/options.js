'use strict'

//-----------
// Variables
//-----------
const local = {
    'ancestor': { // will hold values from background.js
        // bookmarks          (brave)
        // bookmarks_bar      (chrome and opera)
        // bookmarks_menu     (firefox)
        // bookmarks_toolbar  (firefox)
        // favorites_bar      (edge)
        // imported_bookmarks (opera)
        // mobile_bookmarks   (chrome, brave, firefox, and opera)
        // mobile_favorites   (edge)
        // other_bookmarks    (chrome, brave, firefox, and opera)
        // other_favorites    (edge)
        // speed_dials        (opera)
        // trash              (opera)
        // unsorted_bookmarks (opera)
    },
    'class': { // will hold various classes
        // custom_checkbox
        // custom_select
    },
    'element': {
        'content'                  : document.getElementById('content'),
        'html'                     : document.getElementById('html'),
        'loading'                  : document.getElementById('loading'),
        'option_template'          : document.getElementById('option-template'),
        'scroll_nav'               : document.getElementById('scroll-nav'),
        'sort_options'             : document.getElementById('sort-options')
    },
    'function': { // will hold various functions
        // custom_elements_define
        // listener_port_disconnect
        // listener_port_message
        // port_connect
        // port_listeners
        // port_message_init_options
        // setup_sort_options
        // show_content
        // start
        // start_continue
    },
    'option': { // will hold values from background.js
        // automatic_sorting
        // group_folders
        // ... with additional options for each local.ancestor folder
    },
    'port': null, // will be set by port_connect() and used to communicate with the background service worker
    'preference': { // will hold values from background.jsjs
        // browser_is_dark
        // icon_action
        // icon_color
        // theme
    },
    'setting': { // will hold values from background.js
        // show_message
    }
} // local

//---------
// Classes
//---------
const custom_checkbox = local.class.custom_checkbox = class custom_checkbox extends HTMLInputElement {
    /*
    Custom checkbox element.
    */

    constructor() {
        super() // setup object inheritance

        const property = this.dataset.option // for example, automatic_sorting for local.option.automatic_sorting

        // set initial state
        this.checked = local.option[property] // true or false

        this.addEventListener('click', function(e) {
            // listening to click events means we will only get notified about user actions and not our own activity when we set the checked property to true or false
            e.stopPropagation()

            // set local option
            local.option[property] = this.checked

            // relay option to background.js
            const message = {
                'subject': 'option-set',
                'name'   : property,
                'value'  : local.option[property]
            } // message

            local.port.postMessage(message)
        })
    } // constructor
} // custom_checkbox

const custom_select = local.class.custom_select = class custom_select extends HTMLSelectElement {
    /*
    Custom select element.
    */

    constructor() {
        super() // setup object inheritance

        const property = this.dataset.option // for example, bookmarks_bar_sort for local.option.bookmarks_bar_sort

        // set initial state
        this.value = local.option[property] // value like 'alpha'

        this.addEventListener('change', function(e) {
            e.stopPropagation()

            // set local option
            local.option[property] = this.value

            // relay option to background.js
            const message = {
                'subject': 'option-set',
                'name'   : property,
                'value'  : local.option[property]
            } // message

            local.port.postMessage(message)
        })
    } // constructor
} // custom_select

//-----------
// Functions
//-----------
const custom_elements_define = local.function.custom_elements_define = function custom_elements_define() {
    /*
    Define Custom Elements for programmatic use and also upgrade any existing HTML elements with matching "is" properties.
    */

    customElements.define('custom-checkbox', custom_checkbox, { extends: 'input' })
    customElements.define('custom-select', custom_select, { extends: 'select' })
} // custom_elements_define

const listener_port_disconnect = local.function.listener_port_disconnect = function listener_port_disconnect() {
    /*
    Listener for local.port.onDisconnect events.
    */

    // disconnect events will not happen if a background service worker goes inactive however... local.port remains valid and messages can be sent through it to activate an inactive service worker

    log('listener_port_disconnect -> disconnected')

    local.port = null // default

    setTimeout(function() {
        port_connect()
        port_listeners()
    }, 1000)
} // listener_port_disconnect

const listener_port_message = local.function.listener_port_message = function listener_port_message(obj, info) {
    /*
    Listener for local.port.onMessage events.

    @param  {Object}  obj   Object like {subject:'init-options'}
    @param  {Object}  info  Not used. Object with the properties disconnect, name, onDisconnect, onMessage, postMessage, and sender.
    */

    switch (obj.subject) {
        case 'ancestor-and-option':
            log('listener_port_message -> ancestor-and-option')

            local.ancestor = obj.ancestor
            local.option   = obj.option

            setup_sort_options()

            break
        case 'init-options':
            log('listener_port_message -> init-options')

            local.ancestor   = obj.ancestor
            local.option     = obj.option
            local.preference = obj.preference
            local.setting    = obj.setting

            start_continue()

            break
        case 'option-set':
            log('listener_port_message -> option-set -> ' + obj.name + ' =', obj.value)

            local.option[obj.name] = obj.value

            const element = document.querySelector('[data-option=' + obj.name + ']')

            if (element.type === 'checkbox') {
                element.checked = obj.value
            } else if (element.type === 'select-one') {
                element.value = obj.value
            } else {
                log('listener_port_message -> option-set -> error -> unknown type ' + element.type)
            } // if

            break
        case 'preference-set':
            local.preference[obj.name] = obj.value

            log('listener_port_message -> preference-set -> set local.preference.' + obj.name)

            switch (obj.name) {
                case 'browser_is_dark':
                    theme_and_icon() // from shared.js

                    break
                case 'icon_color':
                    theme_and_icon() // from shared.js

                    break
                case 'theme':
                    theme_and_icon() // from shared.js

                    break
            } // switch

            break
        case 'tool-bookmark-history':
            // ignore
            // not used on this page
            break
        default:
            log('listener_port_message -> unknown obj.subject', obj)

            break
    } // switch
} // listener_port_message

const port_connect = local.function.port_connect = function port_connect() {
    /*
    Connect a port to the background service worker.
    */

    /*
    Brave and Opera can resume an open Sprucemarks tab on browser restart and if they do, that browser tab seems to load faster than background.js and that causes the following error...
        Unchecked runtime.lastError: Could not establish connection. Receiving end does not exist.
    The error appears in the Errors area of the extensions page when developer mode is enabled.
    Although the error is annoying, the Sprucemarks tab works and it can both send and receive messages.
    */

    local.port = browser.runtime.connect({
        name: 'options'
    })
} // port_connect

const port_listeners = local.function.port_listeners = function port_listeners() {
    /*
    Add port event listeners.
    */

    local.port.onMessage.addListener(listener_port_message)

    local.port.onDisconnect.addListener(listener_port_disconnect)

    log('port_listeners -> active')
} // port_listeners

const port_message_init_options = local.function.port_message_init_options = function port_message_init_options() {
    /*
    Send a message to the background service worker.
    */

    const message = {
        'subject': 'init-options'
    } // message

    local.port.postMessage(message)
} // port_message_init_options

const setup_sort_options = local.function.setup_sort_options = function setup_sort_options() {
    /*
    Setup sort options for local.ancestor bookmark folders.
    */

    // clear the sort_options area
    local.element.sort_options.textContent = ''

    const ancestors = Object.keys(local.ancestor).sort()
    const sort_order = []

    if (shared.browser.brave) {
        sort_order.push('bookmarks', 'other_bookmarks', 'mobile_bookmarks')
    } else if (shared.browser.chrome) {
        sort_order.push('bookmarks_bar', 'other_bookmarks', 'mobile_bookmarks')
    } else if (shared.browser.edge) {
        sort_order.push('favorites_bar', 'other_favorites', 'mobile_favorites')
    } else if (shared.browser.firefox) {
        sort_order.push('bookmarks_toolbar', 'bookmarks_menu', 'other_bookmarks', 'mobile_bookmarks')
    } else if (shared.browser.opera) {
        sort_order.push('bookmarks_bar', 'other_bookmarks', 'unsorted_bookmarks')
    } // if

    if (sort_order.length > 0) {
        ancestors.sort(function(a, b) {
            let index_a = sort_order.indexOf(a)
            let index_b = sort_order.indexOf(b)

            // if an item is not found in the sort_order index, move that item to the end of the sorted list
            index_a = (index_a >= 0) ? index_a : 100
            index_b = (index_b >= 0) ? index_b : 100

            return index_a - index_b
        })
    } // if

    for (const property of ancestors) {
        if (property === 'imported_bookmarks' || property === 'speed_dials' || property === 'trash') {
            // ignore these bookmark folders
            continue
        } // if

        const template = local.element.option_template.content.cloneNode(true)

        //------------
        // Checkboxes
        //------------
        const checkbox = template.querySelectorAll('input[type=checkbox]')

        checkbox[0].dataset.option = property
        checkbox[1].dataset.option = property + '_sub'

        //--------
        // Labels
        //--------
        const label_span = template.querySelectorAll('label span')

        const property_name = property.replace(/_/g, ' ')

        label_span[0].textContent = property_name
        label_span[1].textContent = property_name

        //---------
        // Selects
        //---------
        const select = template.querySelectorAll('select')

        select[0].dataset.option = property + '_sort'
        select[1].dataset.option = property + '_sub_sort'

        //--------
        // Images
        //--------
        const img     = document.createElement('img')
        const img_sub = document.createElement('img')

        if (shared.browser.brave) {
            if (property === 'bookmarks') {
                img.src    = '/images/options/brave/bookmarks.png'
                img.width  = 151
                img.height = 69

                img_sub.src    = '/images/options/brave/bookmarks-folders.png'
                img_sub.width  = 151
                img_sub.height = 117
            } else if (property === 'mobile_bookmarks') {
                img.src    = '/images/options/brave/mobile-bookmarks.png'
                img.width  = 180
                img.height = 55

                img_sub.src    = '/images/options/brave/mobile-bookmarks-folders.png'
                img_sub.width  = 180
                img_sub.height = 95
            } else if (property === 'other_bookmarks') {
                img.src    = '/images/options/brave/other-bookmarks.png'
                img.width  = 146
                img.height = 117

                img_sub.src    = '/images/options/brave/other-bookmarks-folders.png'
                img_sub.width  = 276
                img_sub.height = 117
            }
        } else if (shared.browser.chrome) {
            if (property === 'bookmarks_bar') {
                img.src    = '/images/options/chrome/bookmarks-bar.png'
                img.width  = 151
                img.height = 68

                img_sub.src    = '/images/options/chrome/bookmarks-bar-folders.png'
                img_sub.width  = 151
                img_sub.height = 116
            } else if (property === 'mobile_bookmarks') {
                img.src    = '/images/options/chrome/mobile-bookmarks.png'
                img.width  = 180
                img.height = 55

                img_sub.src    = '/images/options/chrome/mobile-bookmarks-folders.png'
                img_sub.width  = 180
                img_sub.height = 85
            } else if (property === 'other_bookmarks') {
                img.src    = '/images/options/chrome/other-bookmarks.png'
                img.width  = 151
                img.height = 113

                img_sub.src    = '/images/options/chrome/other-bookmarks-folders.png'
                img_sub.width  = 286
                img_sub.height = 113
            }
        } else if (shared.browser.edge) {
            if (property === 'favorites_bar') {
                img.src    = '/images/options/edge/favorites-bar.png'
                img.width  = 159
                img.height = 74

                img_sub.src    = '/images/options/edge/favorites-bar-folders.png'
                img_sub.width  = 159
                img_sub.height = 119
            } else if (property === 'mobile_favorites') {
                img.src    = '/images/options/edge/mobile-favorites.png'
                img.width  = 188
                img.height = 52

                img_sub.src    = '/images/options/edge/mobile-favorites-folders.png'
                img_sub.width  = 188
                img_sub.height = 84
            } else if (property === 'other_favorites') {
                img.src    = '/images/options/edge/other-favorites.png'
                img.width  = 150
                img.height = 118

                img_sub.src    = '/images/options/edge/other-favorites-folders.png'
                img_sub.width  = 286
                img_sub.height = 118
            }
        } else if (shared.browser.firefox) {
            if (property === 'bookmarks_menu') {
                img.src    = '/images/options/firefox/bookmarks-menu.png'
                img.width  = 158
                img.height = 62

                img_sub.src    = '/images/options/firefox/bookmarks-menu-folders.png'
                img_sub.width  = 158
                img_sub.height = 85
            } else if (property === 'bookmarks_toolbar') {
                img.src    = '/images/options/firefox/bookmarks-toolbar.png'
                img.width  = 157
                img.height = 62

                img_sub.src    = '/images/options/firefox/bookmarks-toolbar-folders.png'
                img_sub.width  = 157
                img_sub.height = 97
            } else if (property === 'mobile_bookmarks') {
                img.src    = '/images/options/firefox/mobile-bookmarks.png'
                img.width  = 164
                img.height = 59

                img_sub.src    = '/images/options/firefox/mobile-bookmarks-folders.png'
                img_sub.width  = 164
                img_sub.height = 83
            } else if (property === 'other_bookmarks') {
                img.src    = '/images/options/firefox/other-bookmarks.png'
                img.width  = 158
                img.height = 59

                img_sub.src    = '/images/options/firefox/other-bookmarks-folders.png'
                img_sub.width  = 158
                img_sub.height = 83
            }
        } else if (shared.browser.opera) {
            if (property === 'bookmarks_bar') {
                img.src    = '/images/options/opera/bookmarks-bar.png'
                img.width  = 138
                img.height = 66

                img_sub.src    = '/images/options/opera/bookmarks-bar-folders.png'
                img_sub.width  = 138
                img_sub.height = 113
            } else if (property === 'other_bookmarks') {
                img.src    = '/images/options/opera/other-bookmarks.png'
                img.width  = 161
                img.height = 45

                img_sub.src    = '/images/options/opera/other-bookmarks-folders.png'
                img_sub.width  = 161
                img_sub.height = 74
            } else if (property === 'unsorted_bookmarks') {
                img.src    = '/images/options/opera/unsorted-bookmarks.png'
                img.width  = 183
                img.height = 45

                // opera version 68.0.3618.56 does not allow sub folders under "Unsorted Bookmarks"

                // hide the sub folders option for opera
                template.querySelectorAll('.option')[1].classList.add('hidden')
            }
        } // if

        if (img.src !== '' || img_sub.src !== '') {
            const option_examples = template.querySelectorAll('.option-example')

            if (img.src !== '') {
                img.src += '?version=2025.1.3.0'
                img.alt = ''

                option_examples[0].appendChild(img)
            } // if

            if (img_sub.src !== '') {
                img.src += '?version=2025.1.3.0'
                img_sub.alt = ''

                option_examples[1].appendChild(img_sub)
            } // if
        } // if

        //--------------------
        // Append Sort Option
        //--------------------
        local.element.sort_options.appendChild(template)
    }
} // setup_sort_options

const show_content = local.function.show_content = function show_content() {
    /*
    Hide the loading aniamtion and show the content area.
    */

    local.element.loading.classList.add('hidden')
    local.element.content.classList.remove('hidden')
} // show_content

const start = local.function.start = async function start() {
    /*
    Start the options page.
    */

    await shared_start() // from shared.js

    // visual functions
    browser_customize() // from shared.js
    browser_body_add_class() // from shared.js

    listen_mouse_events() // from shared.js
    listen_scroll_nav() // from shared.js
    listen_show_message_dismiss() // from shared.js

    port_connect()
    port_listeners()

    // request data from background.js
    port_message_init_options()

    // Startup will continue in start_continue() once listener_port_message() receives a 'init-options' message.
} // start

const start_continue = local.function.start_continue = function start_continue() {
    /*
    Continue to start the options page.
    */

    custom_elements_define()

    setup_sort_options()

    theme_and_icon() // from shared.js
    theme_monitor() // from shared.js, will run once and then keep running once every 10 seconds

    show_message() // from shared.js

    show_content()

    scroll_nav() // from shared.js

    location_hash_scroll_to() // from shared.js
} // start_continue

//-------
// Start
//-------
start()