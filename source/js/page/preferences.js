'use strict'

//-----------
// Variables
//-----------
const local = {
    'class': { // will hold various classes
        // custom_radio
    },
    'element': {
        'content'   : document.getElementById('content'),
        'html'      : document.getElementById('html'),
        'loading'   : document.getElementById('loading'),
        'scroll_nav': document.getElementById('scroll-nav')
    },
    'function': { // will hold various functions
        // custom_elements_define
        // listen_label
        // listener_port_disconnect
        // listener_port_message
        // port_connect
        // port_listeners
        // port_message_init_preferences
        // show_content
        // start
        // start_continue
    },
    'port': null, // will be set by port_connect() and used to communicate with the background service worker
    'preference': { // will hold values from background.js
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
const custom_radio = local.class.custom_radio = class custom_radio extends HTMLInputElement {
    /*
    Custom radio element.
    */

    constructor() {
        super() // setup object inheritance

        const property = this.dataset.preference // for example, theme for local.preference.theme

        // set initial state
        if (this.value === local.preference[property]) {
            this.checked = true
        } // if

        this.addEventListener('click', function(e) {
            // listening to click events means we will only get notified about user actions and not our own activity when we set a checked property to true
            e.stopPropagation()

            // set local option
            local.preference[property] = this.value

            if (property === 'theme') {
                theme_and_icon(this.value) // from shared.js
            } // if

            if (property === 'icon_color') {
                theme_and_icon('', this.value)
            } // if

            // relay option to background.js
            const message = {
                'subject': 'preference-set',
                'name'   : property,
                'value'  : local.preference[property]
            } // message

            local.port.postMessage(message)
        })
    } // constructor
} // custom_radio

//-----------
// Functions
//-----------
const custom_elements_define = local.function.custom_elements_define = function custom_elements_define() {
    /*
    Define Custom Elements for programmatic use and also upgrade any existing HTML elements with matching "is" properties.
    */

    customElements.define('custom-radio', custom_radio, { extends: 'input' })
} // custom_elements_define

const listen_label = local.function.listen_label = function listen_label() {
    /*
    Listen for click events so mouse users do not get persistent focus effects on a radio button after clicking a label.
    */

    const items = document.getElementsByTagName('label')
    const items_length = items.length

    for (let i = 0; i < items_length; i++) {
        items[i].addEventListener('click', function(e) {
            e.preventDefault()

            // click the corresponding radio button for this label
            document.getElementById(this.htmlFor).click()
        })
    } // for
} // listen_label

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

    @param  {Object}  obj   Object like {subject:'preference'}
    @param  {Object}  info  Not used. Object with the properties disconnect, name, onDisconnect, onMessage, postMessage, and sender.
    */

    switch (obj.subject) {
        case 'ancestor-and-option':
            // ignore
            // not used on this page
            break
        case 'init-preferences':
            log('listener_port_message -> init-preferences')

            local.preference = obj.preference
            local.setting    = obj.setting

            start_continue()

            break
        case 'preference-set':
            local.preference[obj.name] = obj.value

            log('listener_port_message -> preference-set -> ' + obj.name + ' =', obj.value)

            const items = document.querySelectorAll('[data-preference=' + obj.name + ']')
            const items_length = items.length

            for (let i = 0; i < items_length; i++) {
                if (items[i].value === obj.value) {
                    items[i].checked = true
                    break
                }
            } // for

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

    local.port = browser.runtime.connect()
} // port_connect

const port_listeners = local.function.port_listeners = function port_listeners() {
    /*
    Add port event listeners.
    */

    local.port.onMessage.addListener(listener_port_message)

    local.port.onDisconnect.addListener(listener_port_disconnect)

    log('port_listeners -> active')
} // port_listeners

const port_message_init_preferences = local.function.port_message_init_preferences = function port_message_init_preferences() {
    /*
    Send a message to the background service worker.
    */

    const message = {
        'subject': 'init-preferences'
    } // message

    local.port.postMessage(message)
} // port_message_init_preferences

const show_content = local.function.show_content = function show_content() {
    /*
    Hide the loading animation and show the content area.
    */

    local.element.loading.classList.add('hidden')
    local.element.content.classList.remove('hidden')
} // show_content

const start = local.function.start = async function start() {
    /*
    Start the preferences page.
    */

    await shared_start() // from shared.js

    browser_body_add_class() // from shared.js

    listen_mouse_events() // from shared.js
    listen_label()
    listen_scroll_nav() // from shared.js
    listen_show_message_dismiss() // from shared.js

    port_connect()
    port_listeners()

    // request data from background.js
    port_message_init_preferences()

    // Startup will continue in start_continue() once listener_port_message() receives a 'init-preferences' message.
} // start

const start_continue = local.function.start_continue = function start_continue() {
    /*
    Continue to start the preferences page.
    */

    custom_elements_define()

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