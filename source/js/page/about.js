'use strict'

//-----------
// Variables
//-----------
const local = {
    'ancestor': { // will be retrieved by sending a message to background.js
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
    'bookmark_hashes': [ // will be retrieved by sending a message to background.js
        // bookmarks_bar-ba5e53b29915158af7c89c8f8de5fd5a03918b25ee0cdfe4b3313a99b20cc949
        // other_bookmarks-1c78e11a91e14ea4a733035dd08d1ed48a453228afdd5d9a4ff50095c31890a9
        // mobile_bookmarks-6ec287dad5ff82aeb10165e04cbede00929f2cb974bfbbd825db0a449c6812bc
    ],
    'element': {
        'about_browser'    : document.getElementById('about-browser'),
        'about_version'    : document.getElementById('about-version'),
        'content'          : document.getElementById('content'),
        'html'             : document.getElementById('html'),
        'loading'          : document.getElementById('loading'),
        'scroll_nav'       : document.getElementById('scroll-nav'),
        'trouble_ancestors': document.getElementById('trouble-ancestors'),
        'trouble_browser'  : document.getElementById('trouble-browser'),
        'trouble_copy'     : document.getElementById('trouble-copy'),
        'trouble_copy_busy': document.getElementById('trouble-copy-busy'),
        'trouble_hashes'   : document.getElementById('trouble-hashes'),
        'trouble_options'  : document.getElementById('trouble-options'),
        'trouble_version'  : document.getElementById('trouble-version')
    },
    'function': { // will hold various functions
        // display_browser_type
        // display_ancestors
        // display_hashes
        // display_options

        // listen_trouble_copy

        // listener_port_disconnect
        // listener_port_message

        // port_connect
        // port_listeners
        // port_message_init_about

        // show_content

        // start
        // start_continue

        // stringify
    },
    'option': { // will hold values from background.js
        // automatic_sorting
        // group_folders
        // ... with additional options for each local.ancestor folder
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
    },
    'version': null // will hold a value from background.js
} // local

//-----------
// Functions
//-----------
const display_browser_type = local.function.display_browser_type = function display_browser_type() {
    /*
    Display the current browser type.
    */

    let text = ''

    if (shared.browser.chrome) {
        text = 'on Google Chrome.'
    } else if (shared.browser.edge) {
        text = 'on Microsoft Edge.'
    } else if (shared.browser.firefox) {
        text = 'on Mozilla Firefox.'
    } else {
        text = 'on what appears to be an unsupported browser. Supported browsers include Google Chrome, Microsoft Edge, and Mozilla Firefox.'
    } // if

    local.element.about_browser.textContent = text
} // display_browser_type

const display_ancestors = local.function.display_ancestors = function display_ancestors() {
    /*
    Display bookmark ancestor information within the troubleshooting area.
    */

    local.element.trouble_ancestors.textContent = stringify(local.ancestor)
} // display_ancestors

const display_hashes = local.function.display_hashes = function display_hashes() {
    /*
    Display bookmark hash information within the troubleshooting area.
    */

    local.element.trouble_hashes.textContent = stringify(local.bookmark_hashes)
} // display_hashes

const display_options = local.function.display_options = function display_options() {
    /*
    Display options information within the troubleshooting area.
    */

    local.element.trouble_options.textContent = stringify(local.option)
} // display_options

const listen_trouble_copy = local.function.listen_trouble_copy = function listen_trouble_copy() {
    /*
    Listener for the "Copy Information" button at the bottom of the troubleshooting information area.
    */

    local.element.trouble_copy.addEventListener('click', async function(e) {
        e.preventDefault()

        const bookmark_term = (shared.browser.edge === true) ? 'Favorite' : 'Bookmark'

        let trouble_text = ''

        trouble_text += bookmark_term + ' Ancestors' + '\n'
        trouble_text += stringify(local.ancestor) + '\n\n'

        trouble_text += bookmark_term + ' Hashes' + '\n'
        trouble_text += stringify(local.bookmark_hashes) + '\n\n'

        trouble_text += 'Options' + '\n'
        trouble_text += stringify(local.option) + '\n\n'

        trouble_text += 'Sprucemarks Version' + '\n'
        trouble_text += local.version + '\n\n'

        trouble_text += 'Web Browser Version' + '\n'
        trouble_text += navigator.userAgent

        try {
            // copy to clipboard
            await navigator.clipboard.writeText(trouble_text)

            // hide button
            local.element.trouble_copy.classList.add('hidden')

            // show busy button
            local.element.trouble_copy_busy.classList.remove('hidden')

            await delay(3000)

            // hide busy button
            local.element.trouble_copy_busy.classList.add('hidden')

            // show button
            local.element.trouble_copy.classList.remove('hidden')
        } catch (error) {
            alert('Oops. Information could not be automatically copied to your clipboard.\n\nPlease select and copy the information manually.')
        } // try
    })
} // listen_trouble_copy

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

const listener_port_message = local.function.listener_port_message = async function listener_port_message(obj, info) {
    /*
    Listener for local.port.onMessage events.

    @param  {Object}  obj   Object like {subject:'init-about'}
    @param  {Object}  info  Not used. Object with the properties disconnect, name, onDisconnect, onMessage, postMessage, and sender.
    */

    switch (obj.subject) {
        case 'ancestor-and-option':
            log('listener_port_message -> ancestor-and-option')

            local.ancestor = obj.ancestor
            local.option   = obj.option

            display_ancestors()
            display_options()

            break
        case 'init-about':
            log('listener_port_message -> init-about')

            local.ancestor        = obj.ancestor
            local.bookmark_hashes = obj.bookmark_hashes
            local.option          = obj.option
            local.preference      = obj.preference
            local.setting         = obj.setting
            local.version         = obj.version

            await start_continue()

            break
        case 'option-set':
            log('listener_port_message -> option-set -> ' + obj.name + ' =', obj.value)

            local.option[obj.name] = obj.value

            display_options()

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
        case 'refresh-about':
            log('listener_port_message -> refresh-about')

            local.bookmark_hashes = obj.bookmark_hashes

            // display bookmark hashes
            display_hashes()

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

    local.port = browser.runtime.connect({
        name: 'about'
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

const port_message_init_about = local.function.port_message_init_about = function port_message_init_about() {
    /*
    Send a message to the background service worker.
    */

    const message = {
        'subject': 'init-about'
    } // message

    local.port.postMessage(message)
} // port_message_init_about

const show_content = local.function.show_content = function show_content() {
    /*
    Hide the loading animation and show the content area.
    */

    local.element.loading.classList.add('hidden')
    local.element.content.classList.remove('visibility-hidden')
} // show_content

const start = local.function.start = async function start() {
    /*
    Start the about page.
    */

    await shared_start() // from shared.js

    browser_customize() // from shared.js
    browser_body_add_class() // from shared.js

    listen_mouse_events() // from shared.js
    listen_scroll_to_links() // from shared.js
    listen_scroll_nav() // from shared.js
    listen_show_message_dismiss() // from shared.js
    listen_trouble_copy()

    port_connect()
    port_listeners()

    port_message_init_about()

    // Startup will continue in start_continue() once listener_port_message() receives a 'init-about' message.
} // start

const start_continue = local.function.start_continue = function start_continue() {
    /*
    Continue to start the about page.
    */

    //--------------------------
    // Update the About section
    //--------------------------

    // display the sprucemarks version
    local.element.about_version.textContent = local.version.replace('.0', '')

    // display the current browser type
    display_browser_type()

    //------------------------------------
    // Update the Troubleshooting section
    //------------------------------------

    // display bookmark ancestor info
    display_ancestors()

    // display bookmark hashes
    display_hashes()

    // display options info
    display_options()

    // display the sprucemarks version
    local.element.trouble_version.textContent = local.version

    // display the web browser version
    local.element.trouble_browser.textContent = navigator.userAgent

    //----------
    // Continue
    //----------
    theme_and_icon() // from shared.js
    theme_monitor() // from shared.js, will run once and then keep running once every 10 seconds

    show_message() // from shared.js

    show_content()

    scroll_nav() // from shared.js

    location_hash_scroll_to() // from shared.js
} // start_continue

const stringify = local.function.stringify = function stringify(obj) {
    /*
    Stringify a JavaScript object and return a string without the default wrapping parentheses. Defaults to returning "Unknown" if there is a problem with the in object parameter.

    @param   {Object}  obj   Object.
    @return  {String}
    */

    let text = 'Unknown'

    try {
        text = JSON.stringify(obj)
        text = text.slice(1, text.length - 1) // remove first and last characters
    } catch (error) {
        // do nothing
    } // try

    return text
} // stringify

//-------
// Start
//-------
start()