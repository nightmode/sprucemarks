'use strict'

//-----------
// Variables
//-----------
const local = {
    'bookmark_history': {
        'filter': 'all', // can be set to "all", "added", "modified", or "removed"
        'view': 'first-page', // can be set to "first-page", "last-page", or a combination of information to uniquely identify the first visible bookmark when paging through history
    },
    'class': { // will hold various classes
        // custom_checkbox_duplicate_bookmarks
        // custom_checkbox_empty_folders
        // custom_checkbox_similar_bookmarks
    },
    'element': {
        'bookmark_viewer_activity'               : document.getElementById('bookmark-viewer-activity'),
        'bookmark_viewer_heading'                : document.getElementById('bookmark-viewer-heading'),
        'bookmark_viewer_id'                     : document.getElementById('bookmark-viewer-id'),
        'bookmark_viewer_info'                   : document.getElementById('bookmark-viewer-info'),
        'bookmark_viewer_info_extra'             : document.getElementById('bookmark-viewer-info-extra'),
        'bookmark_viewer_location'               : document.getElementById('bookmark-viewer-location'),
        'bookmark_viewer_title'                  : document.getElementById('bookmark-viewer-title'),
        'bookmark_viewer_url'                    : document.getElementById('bookmark-viewer-url'),
        'bookmark_viewer_url_text'               : document.getElementById('bookmark-viewer-url-text'),
        'bookmark_viewer_url_row'                : document.getElementById('bookmark-viewer-url-row'),
        'bookmark_viewer_when'                   : document.getElementById('bookmark-viewer-when'),
        'button_clear_history'                   : document.getElementById('button-clear-history'),
        'button_clear_history_busy'              : document.getElementById('button-clear-history-busy'),
        'button_close'                           : document.getElementById('button-close'),
        'button_remove_bookmarks'                : document.getElementById('button-remove-bookmarks'),
        'button_remove_bookmarks_busy'           : document.getElementById('button-remove-bookmarks-busy'),
        'button_remove_duplicates'               : document.getElementById('button-remove-duplicates'),
        'button_remove_duplicates_busy'          : document.getElementById('button-remove-duplicates-busy'),
        'button_remove_folders'                  : document.getElementById('button-remove-folders'),
        'button_remove_folders_busy'             : document.getElementById('button-remove-folders-busy'),
        'content'                                : document.getElementById('content'),
        'html'                                   : document.getElementById('html'),
        'loading'                                : document.getElementById('loading'),
        'overlay'                                : document.getElementById('overlay'),
        'scroll_nav'                             : document.getElementById('scroll-nav'),
        'template_bookmark_history_grid_row'     : document.getElementById('template-bookmark-history-grid-row'),
        'template_bookmark_history_no_results'   : document.getElementById('template-bookmark-history-no-results'),
        'template_duplicate_bookmarks_grid_row'  : document.getElementById('template-duplicate-bookmarks-grid-row'),
        'template_duplicate_bookmarks_no_results': document.getElementById('template-duplicate-bookmarks-no-results'),
        'template_empty_folders_grid_row'        : document.getElementById('template-empty-folders-grid-row'),
        'template_empty_folders_no_results'      : document.getElementById('template-empty-folders-no-results'),
        'template_similar_bookmarks_grid_row'    : document.getElementById('template-similar-bookmarks-grid-row'),
        'template_similar_bookmarks_no_results'  : document.getElementById('template-similar-bookmarks-no-results'),
        'tool_bookmark_history'                  : document.getElementById('tool-bookmark-history'),
        'tool_bookmark_history_rows'             : document.getElementById('tool-bookmark-history-rows'),
        'tool_bookmark_history_nav'              : document.getElementById('tool-bookmark-history-nav'),
        'tool_bookmark_history_nav_first'        : document.getElementById('tool-bookmark-history-nav-first'),
        'tool_bookmark_history_nav_last'         : document.getElementById('tool-bookmark-history-nav-last'),
        'tool_bookmark_history_nav_next'         : document.getElementById('tool-bookmark-history-nav-next'),
        'tool_bookmark_history_nav_previous'     : document.getElementById('tool-bookmark-history-nav-previous'),
        'tool_bookmark_history_nav_total'        : document.getElementById('tool-bookmark-history-nav-total'),
        'tool_bookmark_history_nav_view'         : document.getElementById('tool-bookmark-history-nav-view'),
        'tool_duplicate_bookmarks'               : document.getElementById('tool-duplicate-bookmarks'),
        'tool_empty_folders'                     : document.getElementById('tool-empty-folders'),
        'tool_similar_bookmarks'                 : document.getElementById('tool-similar-bookmarks'),
        'wrapper'                                : document.getElementById('wrapper')
    },
    'function': { // will hold various functions
        // browser_customize_local
        // custom_elements_define
        // grid_min_height
        // listen_bookmark_history_bookmarks
        // listen_bookmark_history_nav
        // listen_duplicate_bookmarks_bookmarks
        // listen_empty_folders_bookmarks
        // listen_input_click
        // listen_keydown
        // listen_label_click
        // listen_viewing_show_all
        // listen_viewing_show_less
        // listen_resize
        // listen_similar_bookmarks_bookmarks
        // listener_button_clear_history
        // listener_button_remove_bookmarks
        // listener_button_remove_duplicates
        // listener_button_remove_folders
        // listener_port_disconnect
        // listener_port_message
        // locale_compare
        // port_connect
        // port_listeners
        // port_message_init_tools
        // show_content
        // start
        // start_continue
        // tool_bookmark_history_button
        // tool_bookmark_history_display
        // tool_bookmark_history_process
        // tool_bookmark_history_time
        // tool_bookmark_viewer_hide
        // tool_bookmark_viewer_show
        // tool_duplicate_bookmarks_button
        // tool_duplicate_bookmarks_display
        // tool_duplicate_bookmarks_process
        // tool_empty_folders_button
        // tool_empty_folders_display
        // tool_empty_folders_process
        // tool_similar_bookmarks_button
        // tool_similar_bookmarks_display
        // tool_similar_bookmarks_process
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
    'timer': { // setTimeout references
        'bookmark_history_time': '' // will become a setTimeout call to run tool_bookmark_history_time() when needed
    },
    'tool': { // will hold values from background.js
        'bookmark_history': {
            'array': [
                // { activity: '...', id: '...', location: '...', title: '...', type: '...', url: '...', when: 123 }
            ],
            'build': true, // true means the display function for this tool should build
            'string': '' // JSON.stringify version of the array for detecting when an updated array is different from the previous array
        },
        'duplicate_bookmarks': {
            'build': true, // true means the display function for this tool should build
            'checked': {
                // 'id': false
            },
            'display_limit': true, // true means limit the display of duplicate bookmarks to a subset by default, the user can choose to display all
            'object': {
                /*
                'url:' [
                    { id: '...', location: '...', title: '...', type: 'bookmark', url: '...', when: 123 },
                    { id: '...', location: '...', title: '...', type: 'bookmark', url: '...', when: 123 }
                ]
                */
            },
            'string': '' // JSON.stringify version of the object for detecting when an updated object is different from the previous object
        },
        'empty_folders': {
            'build': true, // true means the display function for this tool should build
            'display_limit': true, // true means limit the display of empty folders to a subset by default, the user can choose to display all
            'object': {
                // 'id': { checked: false, id: '...', location: '...', title: '...', type: 'folder', when: 123 }
            },
            'string': '' // JSON.stringify version of the object for detecting when an updated object is different from the previous object
        },
        'similar_bookmarks': {
            'build': true, // true means the display function for this tool should build
            'checked': {
                // 'id': false
            },
            'display_limit': true, // true means limit the display of similar bookmarks to a subset by default, the user can choose to display all
            'object': {
                /*
                'url:' [
                    { id: '...', location: '...', title: '...', type: 'bookmark', url: '...', when: 123 },
                    { id: '...', location: '...', title: '...', type: 'bookmark', url: '...', when: 123 }
                ]
                */
            },
            'string': '' // JSON.stringify version of the object for detecting when an updated object is different from the previous object
        }
    }
} // local

//---------
// Classes
//---------
const custom_checkbox_duplicate_bookmarks = local.class.custom_checkbox_duplicate_bookmarks = class custom_checkbox_duplicate_bookmarks extends HTMLInputElement {
    /*
    Custom checkbox element for the "Duplicate Bookmarks" tool.
    */

    constructor() {
        super() // setup object inheritance

        const property = this.dataset.id // bookmark id like '10'

        // set initial state
        this.checked = local.tool.duplicate_bookmarks.checked[property]

        this.addEventListener('click', function(e) {
            // listening to click events means we will only get notified about user actions and not our own activity when we set the checked property to true or false
            e.stopPropagation()

            // save checked status to memory so it can persist through a rebuild of the grid row that contains this checkbox
            local.tool.duplicate_bookmarks.checked[property] = this.checked

            // enable or disable the "Remove Duplicates" button
            tool_duplicate_bookmarks_button()
        })
    } // constructor
} // custom_checkbox_duplicate_bookmarks

const custom_checkbox_empty_folders = local.class.custom_checkbox_empty_folders = class custom_checkbox_empty_folders extends HTMLInputElement {
    /*
    Custom checkbox element for the "Empty Folders" tool.
    */

    constructor() {
        super() // setup object inheritance

        const property = this.dataset.id // bookmark id like '10'

        // set initial state
        this.checked = local.tool.empty_folders.object[property].checked

        this.addEventListener('click', function(e) {
            // listening to click events means we will only get notified about user actions and not our own activity when we set the checked property to true or false
            e.stopPropagation()

            // save checked status to memory so it can persist through a rebuild of the grid row that contains this checkbox
            local.tool.empty_folders.object[property].checked = this.checked

            // enable or disable the "Remove Folders" button
            tool_empty_folders_button()
        })
    } // constructor
} // custom_checkbox_empty_folders

const custom_checkbox_similar_bookmarks = local.class.custom_checkbox_similar_bookmarks = class custom_checkbox_similar_bookmarks extends HTMLInputElement {
    /*
    Custom checkbox element for the "Similar Bookmarks" tool.
    */

    constructor() {
        super() // setup object inheritance

        const property = this.dataset.id // bookmark id like '10'

        // set initial state
        this.checked = local.tool.similar_bookmarks.checked[property]

        this.addEventListener('click', function(e) {
            // listening to click events means we will only get notified about user actions and not our own activity when we set the checked property to true or false
            e.stopPropagation()

            // save checked status to memory so it can persist through a rebuild of the grid row that contains this checkbox
            local.tool.similar_bookmarks.checked[property] = this.checked

            // enable or disable the "Remove Bookmarks" button
            tool_similar_bookmarks_button()
        })
    } // constructor
} // custom_checkbox_similar_bookmarks

//-----------
// Functions
//-----------
const browser_customize_local = local.function.browser_customize_local = function browser_customize_local() {
    /*
    Customize anything specific to this page that is not handled by the shared browser_customize() function.
    */

    if (shared.browser.edge) {
        local.element.button_remove_bookmarks.value = 'Remove Favorites'
    }
} // browser_customize_local

const custom_elements_define = local.function.custom_elements_define = function custom_elements_define() {
    /*
    Define Custom Elements for programmatic use and also upgrade any existing HTML elements with matching "is" properties.
    */

    customElements.define(
        'custom-checkbox-empty-folders',
        custom_checkbox_empty_folders,
        { extends: 'input' }
    )

    customElements.define(
        'custom-checkbox-duplicate-bookmarks',
        custom_checkbox_duplicate_bookmarks,
        { extends: 'input' }
    )

    customElements.define(
        'custom-checkbox-similar-bookmarks',
        custom_checkbox_similar_bookmarks,
        { extends: 'input' }
    )
} // custom_elements_define

const grid_min_height = local.function.grid_min_height = function grid_min_height(element_id) {
    /*
    Remove, figure out, and then set minimum heights so bookmark rows inside a groups of two or more bookmarks all share the same height.

    @param  {String}  element_id  ID of an element already setup in local.element like 'tool_duplicate_bookmarks' or 'tool_similar_bookmarks'.
    */

    const tool_grid = local.element[element_id]

    const grid_area = tool_grid.querySelector('.grid-area')
    const grid_rows = tool_grid.querySelectorAll('.grid-row')

    // temporarily set the min height of the tool grid to its current height
    // this will stop a jumping effect from happening when individual min-height settings are removed and recalculated for grid rows
    grid_area.style.minHeight = tool_grid.offsetHeight.toString() + 'px'

    // also temporarily set visibility hidden
    grid_area.classList.add('visibility-hidden')

    const group_min_height = [] // array of pixel values like [70, 120]

    let group_position = 0 // keep track of which group we are working when setting values by going through the group_min_height array

    let max_height = 0     // keep track of the maximum height seen when checking elements with a "min-height" class
    let min_height = '0px' // height to use when setting min-height values, will be set to the largest max_height seen

    // loop through rows and remove css min-height values
    for (const row of grid_rows) {
        const grid_items = row.querySelectorAll('.min-height')

        for (const item of grid_items) {
            item.style.minHeight = 0
        } // for
    } // for

    // loop through rows to figure out maximum heights
    for (const row of grid_rows) {
        if (row.classList.contains('group-begin')) {
            // reset max_height
            max_height = 0
        } // if

        const grid_items = row.querySelectorAll('.min-height')

        for (const item of grid_items) {
            const height = item.offsetHeight

            if (height > max_height && height <= 150) {
                // height is not too tall so set max_height
                max_height = height
            } // if
        } // for

        if (row.classList.contains('group-end')) {
            // make a note of the maximum height for later use when we loop around again to set min-height values
            group_min_height.push(max_height)
        } // if
    } // for

    // loop through rows to set css min-height values
    for (const row of grid_rows) {
        if (row.classList.contains('group-begin')) {
            // set min_height value to use for all rows in this group
            min_height = group_min_height[group_position].toString() + 'px'
        } // if

        const grid_items = row.querySelectorAll('.min-height')

        for (const item of grid_items) {
            item.style.minHeight = min_height
        } // for

        if (row.classList.contains('group-end')) {
            group_position += 1
        } // if
    } // for

    // remove min-height in case the grid_area needs to resize
    grid_area.style.minHeight = ''

    // remove visibility hidden
    grid_area.classList.remove('visibility-hidden')
} // grid_min_height

const listen_bookmark_history_bookmarks = local.function.listen_bookmark_history_bookmarks = function listen_bookmark_history_bookmarks() {
    /*
    Listen for events on bookmark title links inside the "Bookmark History" area.
    */

    local.element.tool_bookmark_history_rows.addEventListener('click', function(e) {
        if (e.target.classList.contains('bookmark')) {
            e.preventDefault()

            const dataset = e.target.dataset.id.split('/')

            const index = local.tool.bookmark_history.array.findIndex(function(bookmark) {
                const match_id       = bookmark.id       === dataset[0]
                const match_activity = bookmark.activity === dataset[1]
                const match_when     = bookmark.when     === parse_integer(dataset[2])

                return match_id === true && match_activity === true && match_when === true
            })

            if (index < 0) {
                log('listen_bookmark_history_bookmarks -> oops, could not find a bookmark in tool.bookmark_history using the dataset "' + e.target.dataset.id + '"')

                return 'early'
            } // if

            const bookmark = local.tool.bookmark_history.array[index]

            tool_bookmark_viewer_show(bookmark)
        } // if
    })
} // listen_bookmark_history_bookmarks

const listen_bookmark_history_nav = local.function.listen_bookmark_history_nav = function listen_bookmark_history_nav() {
    /*
    Listen for click events for navigation links in the "Bookmark History" area.
    */

    const links = local.element.tool_bookmark_history_nav.querySelectorAll('a')
    const links_length = links.length

    for (let i = 0; i < links_length; i++) {
        links[i].addEventListener('click', function(e) {
            e.preventDefault()

            tool_bookmark_history_button()
            tool_bookmark_history_display(this.dataset.link)
            tool_bookmark_history_time()
        })
    } // for
} // listen_bookmark_history_nav

const listen_duplicate_bookmarks_bookmarks = local.function.listen_duplicate_bookmarks_bookmarks = function listen_duplicate_bookmarks_bookmarks() {
    /*
    Listen for events on bookmark title links inside the "Duplicate Bookmarks" area.
    */

    local.element.tool_duplicate_bookmarks.addEventListener('click', function(e) {
        if (e.target.classList.contains('bookmark')) {
            e.preventDefault()

            for (const property in local.tool.duplicate_bookmarks.object) {
                const group = local.tool.duplicate_bookmarks.object[property]

                const group_filter = group.filter(bookmark => bookmark.id === e.target.dataset.id)

                if (group_filter.length > 0) {
                    tool_bookmark_viewer_show(group_filter[0]) // we should only have one result but just in case, only use the first result

                    break // out of for loop
                } // if
            } // for
        } // if
    })
} // listen_duplicate_bookmarks_bookmarks

const listen_empty_folders_bookmarks = local.function.listen_empty_folders_bookmarks = function listen_empty_folders_bookmarks() {
    /*
    Listen for events on bookmark title links inside the "Empty Folders" area.
    */

    local.element.tool_empty_folders.addEventListener('click', function(e) {
        if (e.target.classList.contains('bookmark')) {
            e.preventDefault()

            const bookmark = local.tool.empty_folders.object[e.target.dataset.id]

            tool_bookmark_viewer_show(bookmark)
        } // if
    })
} // listen_empty_folders_bookmarks

const listen_input_click = local.function.listen_input_click = function listen_input_click() {
    /*
    Listen for various input element clicks.
    */

    local.element.button_clear_history.addEventListener('click', listener_button_clear_history)

    local.element.button_remove_bookmarks.addEventListener('click', listener_button_remove_bookmarks)

    local.element.button_remove_duplicates.addEventListener('click', listener_button_remove_duplicates)

    local.element.button_remove_folders.addEventListener('click', listener_button_remove_folders)

    local.element.button_close.addEventListener('click', function(e) {
        /*
        Listener for click events on the "Close" button within the Bookmark Viewer.
        */

        e.preventDefault()

        tool_bookmark_viewer_hide()
    })

    local.element.overlay.addEventListener('click', function(e) {
        /*
        Listener for click events on the overlay div that can cover the entire page.
        */

        if (e.target.id === 'overlay') {
            tool_bookmark_viewer_hide()
        }
    })
} // listen_input_click

const listen_keydown = local.function.listen_keydown = function listen_keydown() {
    /*
    Listen to keydown events so the escape key can be used to close an open bookmark viewing overlay.
    */

    document.addEventListener('keydown', function(e) {
        const code = (e.code !== undefined) ? e.code : e.key

        if (code === 'Escape') {
            if (local.element.overlay.classList.contains('fade-in')) {
                tool_bookmark_viewer_hide()
            }
        } // if
    })
} // listen_keydown

const listen_label_click = local.function.listen_label_click = function listen_label_click() {
    /*
    Listen for activity filter click events in the "Bookmarks History" area.
    */

    const labels = local.element.tool_bookmark_history.querySelectorAll('label')
    const labels_length = labels.length

    for (let i = 0; i < labels_length; i++) {
        labels[i].addEventListener('click', function(e) {
            const input = this.querySelector('input')

            const activity = input.value || 'all'

            if (e.target.nodeName.toLowerCase() === 'label') {
                e.preventDefault()
                input.checked = true
            } // if

            // reset bookmark_history_view
            local.bookmark_history.view = 'first-page'

            // set filter
            local.bookmark_history.filter = activity

            // set build to true for tool_bookmark_history_display()
            local.tool.bookmark_history.build = true

            tool_bookmark_history_button()
            tool_bookmark_history_display()
            tool_bookmark_history_time()
        })
    } // for
} // listen_label_click

const listen_viewing_show_all = local.function.listen_viewing_show_all = function listen_viewing_show_all() {
    /*
    Listen for click events on any link with a "viewing-show-all" class.
    */

    const links = document.querySelectorAll('a.viewing-show-all')
    const links_length = links.length

    for (let i = 0; i < links_length; i++) {
        links[i].addEventListener('click', function(e) {
            e.preventDefault()

            switch (e.target.dataset.show) {
                case 'duplicate-bookmarks':
                    // turn off the duplicate display limit
                    local.tool.duplicate_bookmarks.display_limit = false

                    // set build to true for the display function
                    local.tool.duplicate_bookmarks.build = true

                    // update the display
                    tool_duplicate_bookmarks_display()

                    break
                case 'empty-folders':
                    // turn off the empty folders display limit
                    local.tool.empty_folders.display_limit = false

                    // set build to true for the display function
                    local.tool.empty_folders.build = true

                    // update the display
                    tool_empty_folders_display()

                    break
                case 'similar-bookmarks':
                    // turn off the similar bookmarks display limit
                    local.tool.similar_bookmarks.display_limit = false

                    // set build to true for the display function
                    local.tool.similar_bookmarks.build = true

                    // update the display
                    tool_similar_bookmarks_display()

                    break
            } // switch
        })
    } // for
} // listen_viewing_show_all

const listen_viewing_show_less = local.function.listen_viewing_show_less = function listen_viewing_show_less() {
    /*
    Listen for click events on any link with a "viewing-show-less" class.
    */

    const links = document.querySelectorAll('a.viewing-show-less')
    const links_length = links.length

    for (let i = 0; i < links_length; i++) {
        links[i].addEventListener('click', function(e) {
            e.preventDefault()

            switch (e.target.dataset.show) {
                case 'duplicate-bookmarks':
                    // turn on the duplicate display limit
                    local.tool.duplicate_bookmarks.display_limit = true

                    // set build to true for the display function
                    local.tool.duplicate_bookmarks.build = true

                    // update the display
                    tool_duplicate_bookmarks_display()

                    // update the button in case any previously displayed bookmarks were unchecked
                    tool_duplicate_bookmarks_button()

                    break
                case 'empty-folders':
                    // turn on the empty folders display limit
                    local.tool.empty_folders.display_limit = true

                    // set build to true for the display function
                    local.tool.empty_folders.build = true

                    // update the display
                    tool_empty_folders_display()

                    // update the button in case any previously displayed folders were unchecked
                    tool_empty_folders_button()

                    break
                case 'similar-bookmarks':
                    // turn on the similar bookmarks display limit
                    local.tool.similar_bookmarks.display_limit = true

                    // set build to true for the display function
                    local.tool.similar_bookmarks.build = true

                    // update the display
                    tool_similar_bookmarks_display()

                    // update the button in case any previously displayed bookmarks were unchecked
                    tool_similar_bookmarks_button()

                    break
            } // switch
        })
    } // for
} // listen_viewing_show_less

const listen_resize = local.function.listen_resize = function listen_resize() {
    /*
    Listen for window resize events and run grid_min_height() to remove, figure out, and set minimum height values for bookmark rows located in the "Duplicate Bookmarks" and "Similar Bookmarks" tool areas.
    */

    window.addEventListener('resize', function(e) {
        grid_min_height('tool_duplicate_bookmarks')
        grid_min_height('tool_similar_bookmarks')
    })
} // listen_resize

const listen_similar_bookmarks_bookmarks = local.function.listen_similar_bookmarks_bookmarks = function listen_similar_bookmarks_bookmarks() {
    /*
    Listen for click events on bookmark title links inside the "Similar Bookmarks" area.
    */

    local.element.tool_similar_bookmarks.addEventListener('click', function(e) {
        if (e.target.classList.contains('bookmark')) {
            e.preventDefault()

            const bookmark_id = e.target.dataset.id

            the_ice: {
                for (const domain_path in local.tool.similar_bookmarks.object) {
                    const groups = local.tool.similar_bookmarks.object[domain_path]

                    for (const group in groups) {
                        const bookmarks = groups[group]

                        for (const bookmark of bookmarks) {
                            if (bookmark.id === bookmark_id) {
                                tool_bookmark_viewer_show(bookmark)

                                break the_ice // break out of the main for loop
                            }
                        } // for
                    } // for
                } // for
            } // the_ice
        } // if
    })
} // listen_similar_bookmarks_bookmarks

const listener_button_clear_history = local.function.listener_button_clear_history = function listener_button_clear_history(e) {
    /*
    Listener for click events for the "Clear History" button.
    */

    e.preventDefault()

    // hide the normal button
    local.element.button_clear_history.classList.add('hidden')

    // show the busy button
    local.element.button_clear_history_busy.classList.remove('hidden')

    // relay message to background.js
    const message = {
        'subject': 'tool-bookmark-history-clear',
        'activity': local.bookmark_history.filter
    } // message

    local.port.postMessage(message)
} // listener_button_clear_history

const listener_button_remove_bookmarks = local.function.listener_button_remove_bookmarks = function listener_button_remove_bookmarks(e) {
    /*
    Listener for click events on the "Remove Bookmarks" button.
    */

    e.preventDefault()

    const bookmarks = []

    for (const property in local.tool.similar_bookmarks.checked) {
        if (local.tool.similar_bookmarks.checked[property] === true) {
            bookmarks.push(property)
        } // if
    } // for

    if (bookmarks.length > 0) {
        // hide the normal button
        local.element.button_remove_bookmarks.classList.add('hidden')

        // show the busy button
        local.element.button_remove_bookmarks_busy.classList.remove('hidden')

        // relay message to background.js
        const message = {
            'subject': 'tool-similar-bookmarks-remove',
            'bookmarks': bookmarks
        } // message

        local.port.postMessage(message)
    } // if
} // listener_button_remove_bookmarks

const listener_button_remove_duplicates = local.function.listener_button_remove_duplicates = function listener_button_remove_duplicates(e) {
    /*
    Listener for click events on the "Remove Duplicates" button.
    */

    e.preventDefault()

    const bookmarks = []

    for (const property in local.tool.duplicate_bookmarks.checked) {
        if (local.tool.duplicate_bookmarks.checked[property] === true) {
            bookmarks.push(property)
        } // if
    } // for

    if (bookmarks.length > 0) {
        // hide the normal button
        local.element.button_remove_duplicates.classList.add('hidden')

        // show the busy button
        local.element.button_remove_duplicates_busy.classList.remove('hidden')

        // relay message to background.js
        const message = {
            'subject': 'tool-duplicate-bookmarks-remove',
            'bookmarks': bookmarks
        } // message

        local.port.postMessage(message)
    } // if
} // listener_button_remove_duplicates

const listener_button_remove_folders = local.function.listener_button_remove_folders = function listener_button_remove_folders(e) {
    /*
    Listener for click events on the "Remove Folders" button.
    */

    e.preventDefault()

    const folders = []

    for (const id in local.tool.empty_folders.object) {
        if (local.tool.empty_folders.object[id].checked === true) {
            folders.push(id)
        } // if
    } // for

    if (folders.length > 0) {
        // hide the normal button
        local.element.button_remove_folders.classList.add('hidden')

        // show the busy button
        local.element.button_remove_folders_busy.classList.remove('hidden')

        // relay message to background.js
        const message = {
            'subject': 'tool-empty-folders-remove',
            'folders': folders
        } // message

        local.port.postMessage(message)
    } // if
} // listener_button_remove_folders

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

    @param  {Object}  obj   Object like {subject:'init-tools'}
    @param  {Object}  info  Not used. Object with the properties disconnect, name, onDisconnect, onMessage, postMessage, and sender.
    */

    switch (obj.subject) {
        case 'ancestor-and-option':
            // ignore
            // not used on this page
            break
        case 'init-tools':
            log('listener_port_message -> init-tools')

            local.preference = obj.preference
            local.setting    = obj.setting

            // empty folders
            tool_empty_folders_process(obj.empty_folders)
            tool_empty_folders_button()
            tool_empty_folders_display()

            // duplicate bookmarks
            tool_duplicate_bookmarks_process(obj.duplicate_bookmarks)
            tool_duplicate_bookmarks_button()
            tool_duplicate_bookmarks_display()

            // similar bookmarks
            tool_similar_bookmarks_process(obj.similar_bookmarks)
            tool_similar_bookmarks_button()
            tool_similar_bookmarks_display()

            // bookmark history
            tool_bookmark_history_process(obj.bookmark_history)
            tool_bookmark_history_button()
            tool_bookmark_history_display()
            tool_bookmark_history_time()

            start_continue()

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
        case 'refresh-tools':
            log('listener_port_message -> refresh-tools')

            // empty folders
            tool_empty_folders_process(obj.empty_folders)
            tool_empty_folders_button() // run early in case the display function takes awhile
            tool_empty_folders_display()
            tool_empty_folders_button() // run again in case any folders were unchecked

            // duplicate bookmarks
            tool_duplicate_bookmarks_process(obj.duplicate_bookmarks)
            tool_duplicate_bookmarks_button() // run early in case the display function takes awhile
            tool_duplicate_bookmarks_display()
            tool_duplicate_bookmarks_button() // run again in case any bookmarks were unchecked

            // similar bookmarks
            tool_similar_bookmarks_process(obj.similar_bookmarks)
            tool_similar_bookmarks_button() // run early in case the display function takes awhile
            tool_similar_bookmarks_display()
            tool_similar_bookmarks_button() // run again in case any bookmarks were unchecked

            // bookmark history
            tool_bookmark_history_process(obj.bookmark_history)
            tool_bookmark_history_button()
            tool_bookmark_history_display()
            tool_bookmark_history_time()

            break
        case 'tool-bookmark-history':
            log('listener_port_message -> tool-bookmark-history')

            tool_bookmark_history_process(obj.bookmark_history)
            tool_bookmark_history_button()
            tool_bookmark_history_display()
            tool_bookmark_history_time()

            // hide the busy button
            local.element.button_clear_history_busy.classList.add('hidden')

            // show the normal button
            local.element.button_clear_history.classList.remove('hidden')

            break
        case 'tool-duplicate-bookmarks-removed':
            log('listener_port_message -> tool-duplicate-bookmarks-removed')

            // hide the busy button
            local.element.button_remove_duplicates_busy.classList.add('hidden')

            // show the normal button
            local.element.button_remove_duplicates.classList.remove('hidden')

            break
        case 'tool-empty-folders-removed':
            log('listener_port_message -> tool-empty-folders-removed')

            // hide the busy button
            local.element.button_remove_folders_busy.classList.add('hidden')

            // show the normal button
            local.element.button_remove_folders.classList.remove('hidden')

            break
        case 'tool-similar-bookmarks-removed':
            log('listener_port_message -> tool-similar-bookmarks-removed')

            // hide the busy button
            local.element.button_remove_bookmarks_busy.classList.add('hidden')

            // show the normal button
            local.element.button_remove_bookmarks.classList.remove('hidden')

            break
        default:
            log('listener_port_message -> unknown obj.subject', obj)

            break
    } // switch
} // listener_port_message

const locale_compare = local.function.locale_compare = new Intl.Collator('en-US', {
    caseFirst: 'upper',
    ignorePunctuation: false,
    localeMatcher: 'best fit',
    numeric: true,
    sensitivity: 'variant',
    usage: 'sort'
}).compare // alias function

const port_connect = local.function.port_connect = function port_connect() {
    /*
    Connect a port to the background service worker.
    */

    local.port = browser.runtime.connect({
        name: 'tools'
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

const port_message_init_tools = local.function.port_message_init_tools = function port_message_init_tools() {
    /*
    Send a message to the background service worker.
    */

    const message = {
        'subject': 'init-tools'
    } // message

    local.port.postMessage(message)
} // port_message_init_tools

const show_content = local.function.show_content = function show_content() {
    /*
    Hide the loading animation and show the content area.
    */

    local.element.loading.classList.add('hidden')
    local.element.content.classList.remove('hidden')
} // show_content

const start = local.function.start = async function start() {
    /*
    Start the tools page.
    */

    await shared_start() // from shared.js

    browser_customize() // from shared.js
    browser_customize_local()
    browser_body_add_class() // from shared.js

    listen_mouse_events() // from shared.js
    listen_input_click()
    listen_keydown()
    listen_label_click()
    listen_viewing_show_all()
    listen_viewing_show_less()
    listen_empty_folders_bookmarks()
    listen_duplicate_bookmarks_bookmarks()
    listen_similar_bookmarks_bookmarks()
    listen_bookmark_history_bookmarks()
    listen_bookmark_history_nav()
    listen_scroll_to_links() // from shared.js
    listen_resize()
    listen_scroll_nav() // from shared.js
    listen_show_message_dismiss() // from shared.js

    port_connect()
    port_listeners()

    port_message_init_tools()

    // Startup will continue in start_continue() once listener_port_message() receives a 'init-tools' message.
} // start

const start_continue = local.function.start_continue = function start_continue() {
    /*
    Continue to start the tools page.
    */

    custom_elements_define()

    theme_and_icon() // from shared.js
    theme_monitor() // from shared.js, will run once and then keep running once every 10 seconds

    show_message() // from shared.js

    show_content()

    scroll_nav() // from shared.js

    location_hash_scroll_to() // from shared.js
} // start_continue

const tool_bookmark_history_button = local.function.tool_bookmark_history_button = function tool_bookmark_history_button() {
    /*
    For the "Bookmark History" tool, enable the "Clear History" button if any bookmark history is available for the current activity filter, otherwise disable the button.
    */

    let bookmark_history_exists = (local.tool.bookmark_history.array.length > 0)

    if (bookmark_history_exists && local.bookmark_history.filter !== 'all') {
        bookmark_history_exists = local.tool.bookmark_history.array.some(bookmark => bookmark.activity === local.bookmark_history.filter)
    } // if

    const disable = (bookmark_history_exists) ? false : true

    if (local.element.button_clear_history.disabled !== disable) {
        local.element.button_clear_history.disabled = disable
    } // if
} // tool_bookmark_history_button

const tool_bookmark_history_display = local.function.tool_bookmark_history_display = function tool_bookmark_history_display(nav_request='') {
    /*
    Reset, rebuild, and then display the "Bookmark History" area.

    @param  {String}  [nav_request]  Optional. Navigation request like "first", "previous", "next", or "last".
    */

    if (local.tool.bookmark_history.build === false && nav_request === '') {
        // no need to rebuild so return early
        return 'early'
    } else {
        // rebuild needed so set build to false for next time
        local.tool.bookmark_history.build = false
    } // if

    const div     = local.element.tool_bookmark_history
    const div_nav = local.element.tool_bookmark_history_nav

    const div_content   = div.querySelector('.tool-content')
    const div_grid_area = div.querySelector('.grid-area')
    const div_grid_rows = div.querySelector('.grid-rows')
    const div_loading   = div.querySelector('.loading')

    // temporarily set min-height value
    div_grid_area.style.minHeight = div_grid_area.offsetHeight.toString() + 'px'

    // temporarily set visibility hidden
    div_grid_area.classList.add('visibility-hidden')

    // reset the grid rows area
    div_grid_rows.textContent = ''

    let bookmark_history = local.tool.bookmark_history.array

    if (local.bookmark_history.filter !== 'all') {
        bookmark_history = bookmark_history.filter(bookmark => bookmark.activity === local.bookmark_history.filter)
    } // if

    const history_length = bookmark_history.length

    if (history_length === 0) {
        // show no results row
        const template = local.element.template_bookmark_history_no_results.content.cloneNode(true)

        if (shared.browser.edge) {
            template.querySelector('.bookmark-or-favorite').textContent = 'favorites'
        } // if

        div_grid_rows.appendChild(template)

        // reset bookmark_history_view since there is no history
        local.bookmark_history.view = 'first-page'

        // hide navigation
        div_nav.classList.add('hidden')
    } else {
        // show bookmark history rows

        const pages = Math.ceil(history_length / 5)

        let index = 0 // default

        if (local.bookmark_history.view === 'first-page') {
            index = 0
        } else if (local.bookmark_history.view === 'last-page') {
            index = (pages * 5) - 5
        } else {
            // try to use a previously saved index
            const previous_index = bookmark_history.findIndex(bookmark => bookmark.id + '/' + bookmark.activity + '/' + bookmark.when === local.bookmark_history.view)

            if (previous_index >= 0) {
                // previous index found
                index = previous_index
            } else {
                // previous index could not be found

                // reset bookmark_history_view
                local.bookmark_history.view = 'first-page'
            } // if
        } // if

        if (nav_request !== '') {
            // user has requested a navigation change
            switch (nav_request) {
                case 'first':
                    local.bookmark_history.view = 'first-page'

                    break
                case 'previous':
                    index -= 5

                    if (index <= 0) {
                        local.bookmark_history.view = 'first-page'
                    } else {
                        // set bookmark_history_view for a valid index
                        local.bookmark_history.view = bookmark_history[index].id + '/' + bookmark_history[index].activity + '/' + bookmark_history[index].when
                    } // if

                    break
                case 'next':
                    index += 5

                    if ((index + 1) > history_length) {
                        local.bookmark_history.view = 'last-page'
                    } else {
                        // set bookmark_history_view for a valid index
                        local.bookmark_history.view = bookmark_history[index].id + '/' + bookmark_history[index].activity + '/' + bookmark_history[index].when
                    } // if

                    break
                case 'last':
                    local.bookmark_history.view = 'last-page'

                    break
            } // switch
        } // if

        if (local.bookmark_history.view === 'first-page') {
            index = 0
        } else if (local.bookmark_history.view === 'last-page') {
            index = (pages * 5) - 5
        } // if

        let length = 5 // default length to loop to

        if (index > 0) {
            length += index
        } // if

        if (length > bookmark_history.length) {
            length = bookmark_history.length
        } // if

        let display_count = 0 // keep track of how many rows are being displayed

        for (index; index < length; index++) {
            const bookmark = bookmark_history[index]

            const template = local.element.template_bookmark_history_grid_row.content.cloneNode(true)

            const a        = template.querySelector('a')
            const location = template.querySelector('.location')
            const activity = template.querySelector('.activity')
            const when     = template.querySelector('.when')

            //-------
            // Title
            //-------
            let title = (bookmark.title === undefined) ? '' : bookmark.title.trim()

            if (title.length === 0) {
                title = '(no title)'
            } // if

            if (bookmark.type === 'folder') {
                a.classList.add('bookmark-folder')
            } // if

            a.textContent = title

            a.dataset.id = bookmark.id + '/' + bookmark.activity + '/' + bookmark.when

            //----------
            // Location
            //----------
            if (bookmark.location.indexOf('/') < 0) {
                // no path separators needed
                location.textContent = bookmark.location || '(no location)'
            } else {
                // add path separators
                const span = document.createElement('span')
                span.classList.add('path-separator')
                span.textContent = ' / '

                const path_array = bookmark.location.split('/')

                for (let index = 0; index < path_array.length; index++) {
                    const text = document.createTextNode(path_array[index])

                    if (index === 0) {
                        location.textContent = ''
                    } // if

                    if (index > 0) {
                        location.appendChild(span.cloneNode(true))
                    } // if

                    location.appendChild(text)
                } // for
            } // if

            //----------
            // Activity
            //----------
            activity.textContent = bookmark.activity

            //------
            // When
            //------
            when.dataset.when = bookmark.when
            when.textContent = human_time_since(bookmark.when) + ' ago'

            //------------
            // Append Row
            //------------
            div_grid_rows.appendChild(template)

            //---------------
            // Display Count
            //---------------
            display_count += 1
        } // for

        //------------
        // Navigation
        //------------
        const total = history_length

        if (total > 5) {
            // update and show navigation

            const nav_first    = local.element.tool_bookmark_history_nav_first
            const nav_last     = local.element.tool_bookmark_history_nav_last
            const nav_next     = local.element.tool_bookmark_history_nav_next
            const nav_previous = local.element.tool_bookmark_history_nav_previous

            if (local.bookmark_history.view === 'first-page') {
                // fade first and previous links
                nav_first.classList.add('fade-nav')
                nav_previous.classList.add('fade-nav')

                if (bookmark_history.length > 5) {
                    // show next and last links
                    nav_next.classList.remove('fade-nav')
                    nav_last.classList.remove('fade-nav')
                } else {
                    // fade next and last links
                    nav_next.classList.add('fade-nav')
                    nav_last.classList.add('fade-nav')
                }
            } else if (local.bookmark_history.view === 'last-page' || length === bookmark_history.length) {
                // fade next and last links
                nav_next.classList.add('fade-nav')
                nav_last.classList.add('fade-nav')

                // show first and previous links
                nav_first.classList.remove('fade-nav')
                nav_previous.classList.remove('fade-nav')
            } else {
                // show first and previous links
                nav_first.classList.remove('fade-nav')
                nav_previous.classList.remove('fade-nav')

                // show next and last links
                nav_next.classList.remove('fade-nav')
                nav_last.classList.remove('fade-nav')
            } // if

            const viewing_from = (length + 1) - display_count

            local.element.tool_bookmark_history_nav_view.textContent = viewing_from + '-' + length

            local.element.tool_bookmark_history_nav_total.textContent = ' of ' + total

            // show navigation
            div_nav.classList.remove('hidden')
        } else {
            // hide navigation
            div_nav.classList.add('hidden')
        }
    } // if

    // reset min-height value
    div_grid_area.style.minHeight = ''

    // remove visibility hidden
    div_grid_area.classList.remove('visibility-hidden')

    // hide the loading animation and show the content area
    div_loading.classList.add('hidden')
    div_content.classList.remove('hidden')
} // tool_bookmark_history_display

const tool_bookmark_history_process = local.function.tool_bookmark_history_process = function tool_bookmark_history_process(new_bookmark_history) {
    /*
    Reverse the new bookmark history array and then set that array as the active array.

    @param  {Object}  new_bookmark_history  Array like [{ activity: '...', id: '...', location: '...', title: '...', type: '...', url: '...', when: 123 }]
    */

    const new_bookmark_history_string = JSON.stringify(new_bookmark_history)

    if (new_bookmark_history_string !== local.tool.bookmark_history.string) {
        // set build to true for tool_bookmark_history_display()
        local.tool.bookmark_history.build = true

        local.tool.bookmark_history.string = new_bookmark_history_string
    } // if

    local.tool.bookmark_history.array = new_bookmark_history.reverse() // prefer latest events first

} // tool_bookmark_history_process

const tool_bookmark_history_time = local.function.tool_bookmark_history_time = function tool_bookmark_history_time() {
    /*
    Update any visible "Bookmark History" rows with human friendly time offsets like "1 minute ago", "2 hours ago", and so on. Also clear a timeout and if bookmark history rows exist, create a setTimeout call to run this function again.
    */

    clearTimeout(local.timer.bookmark_history_time)

    const now = Date.now()

    const one_minute_ago = now - 60000

    let next_update = 10000 // 10 seconds from now

    const rows = local.element.tool_bookmark_history_rows.querySelectorAll('.when')
    const rows_length = rows.length

    for (let i = 0; i < rows_length; i++) {
        const when = rows[i].dataset.when

        rows[i].textContent = human_time_since(rows[i].dataset.when) + ' ago'

        if (when > one_minute_ago) {
            next_update = 1000 // 1 second from now
        } // if
    } // for

    const time_reference = time_remove_precision(one_minute_ago)

    next_update = time_to_tick(time_reference, now, next_update)

    if (rows_length > 0) {
        local.timer.bookmark_history_time = setTimeout(tool_bookmark_history_time, next_update)
    } // if
} // tool_bookmark_history_time

const tool_bookmark_viewer_hide = local.function.tool_bookmark_viewer_hide = function tool_bookmark_viewer_hide() {
    /*
    Close the "Bookmark Viewer" overlay.
    */

    //--------------------------------
    // Enable Wrapper Tab Navigation
    //--------------------------------
    const links = local.element.wrapper.querySelectorAll('a, input')

    for (const link of links) {
        link.tabIndex = 0
    } // for

    //----------------------
    // Hide Bookmark Viewer
    //----------------------
    local.element.bookmark_viewer_url.tabIndex = -1
    local.element.button_close.tabIndex = -1

    local.element.overlay.classList.remove('fade-in')
    local.element.overlay.classList.add('fade-out')

    local.element.wrapper.classList.remove('to-gray')
    local.element.wrapper.classList.add('from-gray')
} // tool_bookmark_viewer_hide

const tool_bookmark_viewer_show = local.function.tool_bookmark_viewer_show = function tool_bookmark_viewer_show(bookmark) {
    /*
    Populate and show the "Bookmark Viewer" overlay.

    @param  {Object}  bookmark  Bookmark object with the properties "activity", "id", "location", "title", "type", "url", and "when".
    */

    //---------
    // Heading
    //---------
    let heading = (shared.browser.edge) ? 'Favorite' : 'Bookmark'

    if (bookmark.type === 'folder') {
        heading = 'Folder'
    } // if

    local.element.bookmark_viewer_heading.textContent = heading

    //----
    // ID
    //----
    local.element.bookmark_viewer_id.textContent = bookmark.id

    //-------
    // Title
    //-------
    let title = (bookmark.title === undefined) ? '' : bookmark.title.trim()

    if (title.length === 0) {
        title = '(no title)'
    } // if

    local.element.bookmark_viewer_title.textContent = title

    //----------
    // Location
    //----------
    const location = local.element.bookmark_viewer_location

    if (bookmark.location.indexOf('/') < 0) {
        // no path separators needed
        location.textContent = bookmark.location || '(no location)'
    } else {
        // add path separators
        const span = document.createElement('span')
        span.classList.add('path-separator')
        span.textContent = ' / '

        const path_array = bookmark.location.split('/')

        for (let index = 0; index < path_array.length; index++) {
            const text = document.createTextNode(path_array[index])

            if (index === 0) {
                location.textContent = ''
            } // if

            if (index > 0) {
                location.appendChild(span.cloneNode(true))
            } // if

            location.appendChild(text)
        } // for
    } // if

    //----------
    // Activity
    //----------
    const activity = bookmark.activity || 'added'

    local.element.bookmark_viewer_activity.textContent = activity // css will capitalize this text

    //------
    // When
    //------
    const when_date = new Date(bookmark.when).toLocaleDateString('en-US', { day : 'numeric', month : 'long', year : 'numeric' })
    const when_time = new Date(bookmark.when).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })

    local.element.bookmark_viewer_when.textContent = when_date + ' at ' + when_time

    //-----
    // URL
    //-----
    let url = bookmark.url

    if (url === undefined) {
        // hide the url table row
        local.element.bookmark_viewer_url_row.classList.add('hidden')
    } else {
        // url property exists

        url = url.trim()

        if (url === '') {
            url = '(no url)'
        } // if

        if (url.toLowerCase().indexOf('http') !== 0) {
            // hide url link
            local.element.bookmark_viewer_url.classList.add('hidden')
            local.element.bookmark_viewer_url.href = ''
            local.element.bookmark_viewer_url.textContent = ''

            local.element.bookmark_viewer_url.tabIndex = -1

            // show text description
            local.element.bookmark_viewer_url_text.textContent = url
            local.element.bookmark_viewer_url_text.classList.remove('hidden')
        } else {
            // hide text description
            local.element.bookmark_viewer_url_text.classList.add('hidden')
            local.element.bookmark_viewer_url_text.textContent = ''

            let human_url = url

            try {
                human_url = decodeURI(url)
            } catch (error) {
                // do nothing
            } // try

            // show url link
            local.element.bookmark_viewer_url.href = url
            local.element.bookmark_viewer_url.textContent = human_url

            local.element.bookmark_viewer_url.tabIndex = 0

            local.element.bookmark_viewer_url.classList.remove('hidden')
        } // if

        // show the url table row
        local.element.bookmark_viewer_url_row.classList.remove('hidden')
    } // if

    //------
    // Info
    //------
    if (shared.browser.firefox) {
        const info       = local.element.bookmark_viewer_info
        const info_extra = local.element.bookmark_viewer_info_extra

        let text       = '' // default
        let text_extra = '' // default

        if (activity === 'removed') {
            if (bookmark.type === 'folder') {
                // folder
                text = 'Firefox did not provide a title for this removed folder.'

                if (title !== '(no title)') {
                    text += ' The title \'' + title + '\' is the last known title.'
                } // if

                text_extra = 'Firefox did not provide a list of what was affected by removing this folder. Any items within the removed folder may have also been removed.'
            } else {
                // bookmark.type === "bookmark"
                text = 'Firefox did not provide a title for this removed bookmark.'

                if (title !== '(no title)') {
                    text += ' The title \'' + title + '\' is the last known title.'
                } // if
            } // if
        } // if

        if (text === '') {
            // hide info
            info.textContent = ''
            info.classList.add('hidden')

            info_extra.textContent = ''
            info_extra.classList.add('hidden')
        } else {
            // show info
            info.textContent = text
            info.classList.remove('hidden')

            if (text_extra !== '') {
                // show extra info
                info_extra.textContent = text_extra
                info_extra.classList.remove('hidden')
            } else {
                // hide extra info
                info_extra.textContent = ''
                info_extra.classList.remove('hidden')
            } // if
        } // if
    } // if

    //--------------------------------
    // Disable Wrapper Tab Navigation
    //--------------------------------
    const links = local.element.wrapper.querySelectorAll('a, input')

    for (const link of links) {
        link.tabIndex = -1
    } // for

    //--------
    // Button
    //--------
    local.element.button_close.tabIndex = 0

    //----------------------
    // Show Bookmark Viewer
    //----------------------
    local.element.overlay.classList.remove('fade-out')
    local.element.overlay.classList.add('fade-in')

    local.element.wrapper.classList.remove('from-gray')
    local.element.wrapper.classList.add('to-gray')
} // tool_bookmark_viewer_show

const tool_duplicate_bookmarks_button = local.function.tool_duplicate_bookmarks_button = function tool_duplicate_bookmarks_button() {
    /*
    For the "Duplicate Bookmarks" tool, enable the "Remove Duplicates" button if any bookmarks are selected, otherwise disable the button.
    */

    let disable = true // default

    for (const property in local.tool.duplicate_bookmarks.checked) {
        if (local.tool.duplicate_bookmarks.checked[property] === true) {
            disable = false
            break // out of for loop
        } // if
    } // for

    if (local.element.button_remove_duplicates.disabled !== disable) {
        local.element.button_remove_duplicates.disabled = disable
    } // if
} // tool_duplicate_bookmarks_button

const tool_duplicate_bookmarks_display = local.function.tool_duplicate_bookmarks_display = function tool_duplicate_bookmarks_display() {
    /*
    Reset, rebuild, and then display the "Duplicate Bookmarks" area, if needed.
    */

    if (local.tool.duplicate_bookmarks.build === false) {
        // no need to rebuild so return early
        return 'early'
    } else {
        // rebuild needed so set build to false for next time
        local.tool.duplicate_bookmarks.build = false
    } // if

    const div = local.element.tool_duplicate_bookmarks

    const a_viewing_show_all  = div.querySelector('.viewing-show-all')
    const a_viewing_show_less = div.querySelector('.viewing-show-less')
    const div_content         = div.querySelector('.tool-content')
    const div_grid_area       = div.querySelector('.grid-area')
    const div_grid_rows       = div.querySelector('.grid-rows')
    const div_loading         = div.querySelector('.loading')
    const span_viewing        = div.querySelector('.viewing')
    const span_viewing_text   = div.querySelector('.viewing-text')

    // temporarily set min-height value
    div_grid_area.style.minHeight = div_grid_area.offsetHeight.toString() + 'px'

    // temporarily set visibility hidden
    div_grid_area.classList.add('visibility-hidden')

    // reset the grid rows area
    div_grid_rows.textContent = ''

    let display_group_count = 0
    let display_bookmark_count = 0

    const duplicate_bookmarks_object_keys = Object.keys(local.tool.duplicate_bookmarks.object)

    if (duplicate_bookmarks_object_keys.length === 0) {
        // show no results row
        const template = local.element.template_duplicate_bookmarks_no_results.content.cloneNode(true)

        if (shared.browser.edge) {
            template.querySelector('.bookmarks-or-favorites').textContent = 'favorites'
        } // if

        div_grid_rows.appendChild(template)
    } else {
        // show bookmark rows

        // bookmark rows will be sorted by their URL, then location, and then ID (if needed)

        const duplicate_bookmarks = duplicate_bookmarks_object_keys.sort(locale_compare)

        for (const item of duplicate_bookmarks) {
            display_group_count += 1

            const bookmarks = local.tool.duplicate_bookmarks.object[item]

            if (display_group_count > 3 && local.tool.duplicate_bookmarks.display_limit) {
                for (const bookmark of bookmarks) {
                    // bookmarks that are not visible should be unchecked for safety
                    local.tool.duplicate_bookmarks.checked[bookmark.id] = false
                } // for

                continue // to the next for loop
            } // if

            const group_count = bookmarks.length

            const group_id_begin = bookmarks[0].id
            const group_id_end = bookmarks.slice(-1)[0].id

            for (const bookmark of bookmarks) {
                display_bookmark_count += 1

                const template = local.element.template_duplicate_bookmarks_grid_row.content.cloneNode(true)

                const a        = template.querySelector('a')
                const checkbox = template.querySelector('input')
                const grid_row = template.querySelector('.grid-row')
                const grid_url = template.querySelector('.grid-url')
                const location = template.querySelector('.location')
                const url      = template.querySelector('.url')
                const url_text = template.querySelector('.url-text')

                //----------
                // Grid Row
                //----------
                if (bookmark.id === group_id_begin) {
                    // add a class to mark the beginning of a group for css
                    grid_row.classList.add('group-begin')

                    // add a row span to the url column
                    grid_url.style.gridRowEnd = 'span ' + group_count
                } else {
                    // remove the url column
                    grid_row.removeChild(grid_url)

                    if (bookmark.id === group_id_end) {
                        // add a class to mark the end of a group for css
                        grid_row.classList.add('group-end')
                    } // if
                } // if

                //-------
                // Title
                //-------
                let title = (bookmark.title === undefined) ? '' : bookmark.title.trim()

                if (title.length === 0) {
                    title = '(no title)'
                } // if

                a.textContent = title

                a.dataset.id = bookmark.id

                //----------
                // Location
                //----------
                if (bookmark.location.indexOf('/') < 0) {
                    // no path separators needed
                    location.textContent = bookmark.location || '(no location)'
                } else {
                    // add path separators
                    const span = document.createElement('span')
                    span.classList.add('path-separator')
                    span.textContent = ' / '

                    const path_array = bookmark.location.split('/')

                    for (let index = 0; index < path_array.length; index++) {
                        const text = document.createTextNode(path_array[index])

                        if (index === 0) {
                            location.textContent = ''
                        } // if

                        if (index > 0) {
                            location.appendChild(span.cloneNode(true))
                        } // if

                        location.appendChild(text)
                    } // for
                } // if

                //-----
                // URL
                //-----
                if (bookmark.id === group_id_begin) {
                    // only the first bookmark in a group will display a url
                    const url_lowercase = bookmark.url.toLowerCase()

                    if (url_lowercase.indexOf('http://') === 0 || url_lowercase.indexOf('https://') === 0) {
                        // clickable url
                        url.href = bookmark.url

                        let human_url = bookmark.url

                        try {
                            human_url = decodeURI(human_url)
                        } catch (error) {
                            // do nothing
                        } // try

                        url.textContent = human_url.replace(/^https?:\/\//i, '').replace(/\/$/, '') // remove http(s) prefix and trailing slash

                        grid_url.removeChild(url_text)
                    } else {
                        // text only url
                        url_text.textContent = bookmark.url || '(no url)'

                        grid_url.removeChild(url)
                    } // if
                } // if

                //----------
                // Checkbox
                //----------
                checkbox.dataset.id = bookmark.id
                checkbox.checked = local.tool.duplicate_bookmarks.checked[bookmark.id]

                //------------
                // Append Row
                //------------
                div_grid_rows.appendChild(template)
            } // for
        } // for
    } // if

    //--------------
    // Viewing Area
    //--------------
    if (duplicate_bookmarks_object_keys.length > 0) {
        let view_total = 0

        // figure out the total number of duplicate bookmarks
        for (const property in local.tool.duplicate_bookmarks.object) {
            view_total += local.tool.duplicate_bookmarks.object[property].length
        } // for

        const favorites_or_bookmarks = (shared.browser.edge) ? 'favorites' : 'bookmarks'

        if (local.tool.duplicate_bookmarks.display_limit && display_group_count > 3) {
            // only showing the first three groups of duplicate bookmarks even though are are more than three groups

            span_viewing_text.textContent = 'Viewing 1-' + display_bookmark_count + ' of ' + view_total + ' duplicate ' + favorites_or_bookmarks + '.'

            // display the show all link
            a_viewing_show_all.classList.remove('hidden')

            // hide the show less link
            a_viewing_show_less.classList.add('hidden')
        } else {
            // showing all duplicate bookmarks
            span_viewing_text.textContent = 'Viewing ' + view_total + ' duplicate ' + favorites_or_bookmarks + '.'

            // hide the show all link
            a_viewing_show_all.classList.add('hidden')

            if (display_group_count > 3) {
                // display the show less link
                a_viewing_show_less.classList.remove('hidden')
            } else {
                // hide the show less link
                a_viewing_show_less.classList.add('hidden')
            } // if
        } // if

        // show the span viewing area
        span_viewing.classList.remove('hidden-from-view')
    } else {
        // hide the span viewing area
        span_viewing.classList.add('hidden-from-view')

        // no duplicate bookmarks
        span_viewing_text.textContent = ''

        // hide the show all link
        a_viewing_show_all.classList.add('hidden')

        // hide the show less link
        a_viewing_show_less.classList.add('hidden')
    } // if

    //----------------------------
    // Micro Delay and Min Height
    //----------------------------
    setTimeout(function() {
        grid_min_height('tool_duplicate_bookmarks')

        // reset min-height values
        div_grid_area.style.minHeight = ''

        // remove visibility hidden
        div_grid_area.classList.remove('visibility-hidden')

        // hide the loading animation and show the content area
        div_loading.classList.add('hidden')
        div_content.classList.remove('hidden')
    }, 0) // micro delay in order for css to catch up and have height values available
} // tool_duplicate_bookmarks_display

const tool_duplicate_bookmarks_process = local.function.tool_duplicate_bookmarks_process = function tool_duplicate_bookmarks_process(new_duplicate_bookmarks) {
    /*
    Sort bookmark groups and then persist any previously checked bookmarks from tool.duplicate_bookmarks.object to the new duplicate bookmarks object. Then replace tool.duplicate_bookmarks.object with the new object.

    @param  {Object}  new_duplicate_bookmarks  Object with zero or more duplicate bookmark groups like { 'url:' [{ id: '...', location: '...', title: '...', type: 'bookmark', url: '...', when: 123 }, { id: '...', location: '...', title: '...', type: 'bookmark', url: '...', when: 123 }] }
    */

    // sort bookmark groups by location and then id
    for (const property in new_duplicate_bookmarks) {
        new_duplicate_bookmarks[property] = new_duplicate_bookmarks[property].sort(function(a, b) {
            let result = locale_compare(a.location, b.location)

            if (result === 0) {
                // location strings are equal so sort by id instead
                result = locale_compare(a.id, b.id)
            } // if

            return result
        })
    } // for

    const new_duplicate_bookmarks_string = JSON.stringify(new_duplicate_bookmarks)

    if (new_duplicate_bookmarks_string !== local.tool.duplicate_bookmarks.string) {
        // set build to true for tool_duplicate_bookmarks_display()
        local.tool.duplicate_bookmarks.build = true

        local.tool.duplicate_bookmarks.string = new_duplicate_bookmarks_string
    } // if

    const new_duplicate_bookmarks_checked = {} // keep track of which bookmarks are checked

    // populate new_duplicate_bookmarks_checked object
    for (const property in new_duplicate_bookmarks) {
        const bookmarks = new_duplicate_bookmarks[property]

        for (const bookmark of bookmarks) {
            new_duplicate_bookmarks_checked[bookmark.id] = false // default
        } // for
    } // for

    // persist checked states from the previous object
    for (const property in new_duplicate_bookmarks_checked) {
        if (local.tool.duplicate_bookmarks.checked[property] === true) {
            new_duplicate_bookmarks_checked[property] = true
        } // if
    } // for

    local.tool.duplicate_bookmarks.object  = new_duplicate_bookmarks
    local.tool.duplicate_bookmarks.checked = new_duplicate_bookmarks_checked
} // tool_duplicate_bookmarks_process

const tool_empty_folders_button = local.function.tool_empty_folders_button = function tool_empty_folders_button() {
    /*
    For the "Empty Folders" tool, enable the "Remove Folders" button if any bookmarks are selected, otherwise disable the button.
    */

    let disable = true // default

    for (const property in local.tool.empty_folders.object) {
        if (local.tool.empty_folders.object[property].checked === true) {
            disable = false
            break // out of for loop
        } // if
    } // for

    if (local.element.button_remove_folders.disabled !== disable) {
        local.element.button_remove_folders.disabled = disable
    } // if
} // tool_empty_folders_button

const tool_empty_folders_display = local.function.tool_empty_folders_display = function tool_empty_folders_display() {
    /*
    Reset, rebuild, and then display the "Empty Folders" area, if needed.
    */

    if (local.tool.empty_folders.build === false) {
        // no need to rebuild so return early
        return 'early'
    } else {
        // rebuild needed so set build to false for next time
        local.tool.empty_folders.build = false
    } // if

    const div = local.element.tool_empty_folders

    const a_viewing_show_all  = div.querySelector('.viewing-show-all')
    const a_viewing_show_less = div.querySelector('.viewing-show-less')
    const div_content         = div.querySelector('.tool-content')
    const div_grid_area       = div.querySelector('.grid-area')
    const div_grid_rows       = div.querySelector('.grid-rows')
    const div_loading         = div.querySelector('.loading')
    const span_viewing        = div.querySelector('.viewing')
    const span_viewing_text   = div.querySelector('.viewing-text')

    // temporarily set min-height value
    div_grid_area.style.minHeight = div_grid_area.offsetHeight.toString() + 'px'

    // temporarily set visibility hidden
    div_grid_area.classList.add('visibility-hidden')

    // reset the grid rows area
    div_grid_rows.textContent = ''

    let display_folder_count = 0

    const empty_folders = []

    for (const property in local.tool.empty_folders.object) {
        empty_folders.push(local.tool.empty_folders.object[property])
    } // for

    empty_folders.sort(function(a, b) {
        let result = locale_compare(a.location, b.location)

        if (result === 0) {
            // location strings are equal so sort by title instead
            result = locale_compare(a.title, b.title)

            if (result === 0) {
                // title strings are equal so sort by id instead
                result = locale_compare(a.id, b.id)
            } // if
        } // if

        return result
    })

    if (empty_folders.length === 0) {
        // show no results row
        const template = local.element.template_empty_folders_no_results.content.cloneNode(true)

        div_grid_rows.appendChild(template)
    } else {
        // show folder rows

        // folder rows will be shown in the order of their ID strings which make them immune from jumping around if there is a frequent or endless sorting situation going on

        for (const item in empty_folders) {
            if (display_folder_count >= 5 && local.tool.empty_folders.display_limit) {
                // folders that are not visible should be unchecked for safety
                empty_folders[item].checked = false

                continue // to the next for loop
            } // if

            display_folder_count += 1

            const folder = empty_folders[item]

            const template = local.element.template_empty_folders_grid_row.content.cloneNode(true)

            const a        = template.querySelector('a')
            const location = template.querySelector('.location')
            const checkbox = template.querySelector('input')

            //-------
            // Title
            //-------
            let title = (folder.title === undefined) ? '' : folder.title.trim()

            if (title.length === 0) {
                title = '(no title)'
            } // if

            a.textContent = title

            a.dataset.id = folder.id

            //----------
            // Location
            //----------
            if (folder.location.indexOf('/') < 0) {
                // no path separators needed
                location.textContent = folder.location || '(no location)'
            } else {
                // add path separators
                const span = document.createElement('span')
                span.classList.add('path-separator')
                span.textContent = ' / '

                const path_array = folder.location.split('/')

                for (let index = 0; index < path_array.length; index++) {
                    const text = document.createTextNode(path_array[index])

                    if (index === 0) {
                        location.textContent = ''
                    } // if

                    if (index > 0) {
                        location.appendChild(span.cloneNode(true))
                    } // if

                    location.appendChild(text)
                } // for
            } // if

            //----------
            // Checkbox
            //----------
            checkbox.dataset.id = folder.id

            //------------
            // Append Row
            //------------
            div_grid_rows.appendChild(template)
        } // for
    } // if

    //--------------
    // Viewing Area
    //--------------
    if (empty_folders.length > 0) {
        let view_total = empty_folders.length

        if (local.tool.empty_folders.display_limit && view_total > 5) {
            // only showing the first five empty folders even though there are more than five empty folders

            span_viewing_text.textContent = 'Viewing 1-' + display_folder_count + ' of ' + view_total + ' empty folders.'

            // display the show all link
            a_viewing_show_all.classList.remove('hidden')

            // hide the show less link
            a_viewing_show_less.classList.add('hidden')
        } else {
            const folder_or_folders = (view_total === 1) ? 'folder' : 'folders'

            // showing all empty folders
            span_viewing_text.textContent = 'Viewing ' + view_total + ' empty ' + folder_or_folders + '.'

            // hide the show all link
            a_viewing_show_all.classList.add('hidden')

            if (view_total > 5) {
                // display the show less link
                a_viewing_show_less.classList.remove('hidden')
            } else {
                // hide the show less link
                a_viewing_show_less.classList.add('hidden')
            } // if
        } // if

        // show the span viewing area
        span_viewing.classList.remove('hidden-from-view')
    } else {
        // hide the span viewing area
        span_viewing.classList.add('hidden-from-view')

        // no empty folders
        span_viewing_text.textContent = ''

        // hide the show all link
        a_viewing_show_all.classList.add('hidden')

        // hide the show less link
        a_viewing_show_less.classList.add('hidden')
    } // if

    //---------------------------
    // Min Height and Visibility
    //---------------------------

    // reset min-height value
    div_grid_area.style.minHeight = ''

    // remove visibility hidden
    div_grid_area.classList.remove('visibility-hidden')

    // hide the loading animation and show the content area
    div_loading.classList.add('hidden')
    div_content.classList.remove('hidden')
} // tool_empty_folders_display

const tool_empty_folders_process = local.function.tool_empty_folders_process = function tool_empty_folders_process(new_empty_folders) {
    /*
    Persist any previously checked bookmark folders from tool.empty_folders.object to the new empty folders object and then replace tool.empty_folders.object with the new object.

    @param  {Object}  new_empty_folders  Object with zero or more empty folders like { 'id': {id: '...', location: '...', title: '...', type: 'folder', when: 123 } }
    */

    const new_empty_folders_string = JSON.stringify(new_empty_folders)

    if (new_empty_folders_string !== local.tool.empty_folders.string) {
        // set build to true for tool_empty_folders_display()
        local.tool.empty_folders.build = true

        local.tool.empty_folders.string = new_empty_folders_string
    } // if

    for (const property in new_empty_folders) {
        let checked = false // default

        const local_empty_folder = local.tool.empty_folders.object[property]

        if (local_empty_folder !== undefined) {
            if (local_empty_folder.checked === true) {
                checked = true
            }
        } // if

        new_empty_folders[property].checked = checked
    } // for

    local.tool.empty_folders.object = new_empty_folders
} // tool_empty_folders_process

const tool_similar_bookmarks_button = local.function.tool_similar_bookmarks_button = function tool_similar_bookmarks_button() {
    /*
    For the "Similar Bookmarks" tool, enable the "Remove Bookmarks" button if any bookmarks are selected, otherwise disable the button.
    */

    let disable = true // default

    for (const property in local.tool.similar_bookmarks.checked) {
        if (local.tool.similar_bookmarks.checked[property] === true) {
            disable = false
            break // out of for loop
        }
    } // for

    if (local.element.button_remove_bookmarks.disabled !== disable) {
        local.element.button_remove_bookmarks.disabled = disable
    }
} // tool_similar_bookmarks_button

const tool_similar_bookmarks_display = local.function.tool_similar_bookmarks_display = function tool_similar_bookmarks_display() {
    /*
    Reset, rebuild, and then display the "Similar Bookmarks" area, if needed.
    */

    if (local.tool.similar_bookmarks.build === false) {
        // no need to rebuild so return early
        return 'early'
    } else {
        // rebuild needed so set build to false for next time
        local.tool.similar_bookmarks.build = false
    } // if

    const div = local.element.tool_similar_bookmarks

    const a_viewing_show_all  = div.querySelector('.viewing-show-all')
    const a_viewing_show_less = div.querySelector('.viewing-show-less')
    const div_content         = div.querySelector('.tool-content')
    const div_grid_area       = div.querySelector('.grid-area')
    const div_grid_rows       = div.querySelector('.grid-rows')
    const div_loading         = div.querySelector('.loading')
    const span_viewing        = div.querySelector('.viewing')
    const span_viewing_text   = div.querySelector('.viewing-text')

    // temporarily set min-height value
    div_grid_area.style.minHeight = div_grid_area.offsetHeight.toString() + 'px'

    // temporarily set visibility hidden
    div_grid_area.classList.add('visibility-hidden')

    // reset the grid rows area
    div_grid_rows.textContent = ''

    let display_group_count = 0
    let display_bookmark_count = 0

    const similar_bookmarks_object_keys = Object.keys(local.tool.similar_bookmarks.object)

    if (similar_bookmarks_object_keys.length === 0) {
        // show no results row
        const template = local.element.template_similar_bookmarks_no_results.content.cloneNode(true)

        if (shared.browser.edge) {
            template.querySelector('.bookmarks-or-favorites').textContent = 'favorites'
        } // if

        div_grid_rows.appendChild(template)
    } else {
        // show bookmark rows

        // bookmark rows will be sorted by their domain path, (and optionally the order of how they were found if multiple groups share the same domain path), then location, and then ID (if needed)

        const similar_bookmarks = similar_bookmarks_object_keys.sort(locale_compare)

        for (const item of similar_bookmarks) {
            const groups = local.tool.similar_bookmarks.object[item]

            for (const group in groups) {
                display_group_count += 1

                const bookmarks = groups[group]

                if (display_group_count > 3 && local.tool.similar_bookmarks.display_limit) {
                    for (const bookmark of bookmarks) {
                        // bookmarks that are not visible should be unchecked for safety
                        local.tool.similar_bookmarks.checked[bookmark.id] = false
                    } // for

                    continue // to the next for loop
                } // if

                const group_count = bookmarks.length

                const group_id_begin = bookmarks[0].id
                const group_id_end = bookmarks.slice(-1)[0].id

                for (const bookmark of bookmarks) {
                    display_bookmark_count += 1

                    const template = local.element.template_similar_bookmarks_grid_row.content.cloneNode(true)

                    const a        = template.querySelector('a')
                    const checkbox = template.querySelector('input')
                    const grid_row = template.querySelector('.grid-row')
                    const grid_url = template.querySelector('.grid-url')
                    const location = template.querySelector('.location')
                    const url      = template.querySelector('.url')
                    const url_text = template.querySelector('.url-text')

                    //----------
                    // Grid Row
                    //----------
                    if (bookmark.id === group_id_begin) {
                        // add a class to mark the beginning of a group for css
                        grid_row.classList.add('group-begin')
                    } else if (bookmark.id === group_id_end) {
                        // add a class to mark the end of a group for css
                        grid_row.classList.add('group-end')
                    } // if

                    //-------
                    // Title
                    //-------
                    let title = (bookmark.title === undefined) ? '' : bookmark.title.trim()

                    if (title.length === 0) {
                        title = '(no title)'
                    } // if

                    a.textContent = title

                    a.dataset.id = bookmark.id

                    //----------
                    // Location
                    //----------
                    if (bookmark.location.indexOf('/') < 0) {
                        // no path separators needed
                        location.textContent = bookmark.location || '(no location)'
                    } else {
                        // add path separators
                        const span = document.createElement('span')
                        span.classList.add('path-separator')
                        span.textContent = ' / '

                        const path_array = bookmark.location.split('/')

                        for (let index = 0; index < path_array.length; index++) {
                            const text = document.createTextNode(path_array[index])

                            if (index === 0) {
                                location.textContent = ''
                            } // if

                            if (index > 0) {
                                location.appendChild(span.cloneNode(true))
                            } // if

                            location.appendChild(text)
                        } // for
                    } // if

                    //-----
                    // URL
                    //-----
                    const url_lowercase = bookmark.url.toLowerCase()

                    if (url_lowercase.indexOf('http://') === 0 || url_lowercase.indexOf('https://') === 0) {
                        // clickable url
                        url.href = bookmark.url

                        let human_url = bookmark.url

                        try {
                            human_url = decodeURI(human_url)
                        } catch (error) {
                            // do nothing
                        } // try

                        url.textContent = human_url

                        grid_url.removeChild(url_text)
                    } else {
                        // text only url
                        url_text.textContent = bookmark.url || '(no url)'

                        grid_url.removeChild(url)
                    } // if

                    //----------
                    // Checkbox
                    //----------
                    checkbox.dataset.id = bookmark.id
                    checkbox.checked = local.tool.similar_bookmarks.checked[bookmark.id]

                    //------------
                    // Append Row
                    //------------
                    div_grid_rows.appendChild(template)
                } // for
            } // for
        } // for
    } // if

    //--------------
    // Viewing Area
    //--------------
    if (similar_bookmarks_object_keys.length > 0) {
        let view_total = 0

        // figure out the total number of similar bookmarks
        for (const property in local.tool.similar_bookmarks.object) {
            const groups = local.tool.similar_bookmarks.object[property]

            for (const group in groups) {
                const bookmarks = groups[group]

                view_total += bookmarks.length
            } // for
        } // for

        const favorites_or_bookmarks = (shared.browser.edge) ? 'favorites' : 'bookmarks'

        if (local.tool.similar_bookmarks.display_limit && display_group_count > 3) {
            // only showing the first three groups of similar bookmarks even though are are more than three groups

            span_viewing_text.textContent = 'Viewing 1-' + display_bookmark_count + ' of ' + view_total + ' similar ' + favorites_or_bookmarks + '.'

            // display the show all link
            a_viewing_show_all.classList.remove('hidden')

            // hide the show less link
            a_viewing_show_less.classList.add('hidden')
        } else {
            // showing all similar bookmarks
            span_viewing_text.textContent = 'Viewing ' + view_total + ' similar ' + favorites_or_bookmarks + '.'

            // hide the show all link
            a_viewing_show_all.classList.add('hidden')

            if (display_group_count > 3) {
                // display the show less link
                a_viewing_show_less.classList.remove('hidden')
            } else {
                // hide the show less link
                a_viewing_show_less.classList.add('hidden')
            } // if
        } // if

        // show the span viewing area
        span_viewing.classList.remove('hidden-from-view')
    } else {
        // hide the span viewing area
        span_viewing.classList.add('hidden-from-view')

        // no similar bookmarks
        span_viewing_text.textContent = ''

        // hide the show all link
        a_viewing_show_all.classList.add('hidden')

        // hide the show less link
        a_viewing_show_less.classList.add('hidden')
    } // if

    //----------------------------
    // Micro Delay and Min Height
    //----------------------------
    setTimeout(function() {
        grid_min_height('tool_similar_bookmarks')

        // reset min-height value
        div_grid_area.style.minHeight = ''

        // remove visibility hidden
        div_grid_area.classList.remove('visibility-hidden')

        // hide the loading animation and show the content area
        div_loading.classList.add('hidden')
        div_content.classList.remove('hidden')
    }, 0) // micro delay in order for css to catch up and have height values available
} // tool_similar_bookmarks_display

const tool_similar_bookmarks_process = local.function.tool_similar_bookmarks_process = function tool_similar_bookmarks_process(new_similar_bookmarks) {
    /*
    Sort bookmark groups and then persist any previously checked bookmarks from tool.similar_bookmarks.object to the new similar bookmarks object. Then replace tool.similar_bookmarks.object with the new object.

    @param  {Object}  new_similar_bookmarks  Object with zero or more similar bookmark groups like { 'domain/path': 'group_0': [{ id: '...', location: '...', title: '...', type: 'bookmark', url: '...', when: 123 }, { id: '...', location: '...', title: '...', type: 'bookmark', url: '...', when: 123 }] }
    */

    // sort bookmark groups by location and then id
    for (const property in new_similar_bookmarks) {
        const domain_path = new_similar_bookmarks[property]

        for (const group in domain_path) {
            domain_path[group] = domain_path[group].sort(function(a, b) {
                let result = locale_compare(a.location, b.location)

                if (result === 0) {
                    // location strings are equal so sort by id instead
                    result = locale_compare(a.id, b.id)
                } // if

                return result
            })
        } // for
    } // for

    const new_similar_bookmarks_string = JSON.stringify(new_similar_bookmarks)

    if (new_similar_bookmarks_string !== local.tool.similar_bookmarks.string) {
        // set build to true for tool_similar_bookmarks_display()
        local.tool.similar_bookmarks.build = true

        local.tool.similar_bookmarks.string = new_similar_bookmarks_string
    } // if

    const new_similar_bookmarks_checked = {} // keep track of which bookmarks are checked

    // populate new_similar_bookmarks_checked object
    for (const property in new_similar_bookmarks) {
        const groups = new_similar_bookmarks[property]

        for (const group in groups) {
            const bookmarks = groups[group]

            for (const bookmark of bookmarks) {
                new_similar_bookmarks_checked[bookmark.id] = false // default
            } // for
        }
    } // for

    // persist checked states from the previous object
    for (const property in new_similar_bookmarks_checked) {
        if (local.tool.similar_bookmarks.checked[property] === true) {
            new_similar_bookmarks_checked[property] = true
        }
    } // for

    local.tool.similar_bookmarks.object  = new_similar_bookmarks
    local.tool.similar_bookmarks.checked = new_similar_bookmarks_checked
} // tool_similar_bookmarks_process

//-------
// Start
//-------
start()