'use strict' // not technically needed since this file will be included in another file that will specify 'use strict' first

//-------
// Notes
//-------
/*
    This background JavaScript file is only meant to be included in the root level service worker.

    This software uses snake case (underscores) for variables.
*/

//-----------
// Variables
//-----------
const local = {
    'ancestor': { // bookmark ids for root level bookmarks, will be set by bookmark_find_ancestors()
        // bookmarks          (brave)
        // bookmark_bar       (chrome and opera)
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
    'function': { // will hold various functions
        // add_listeners

        // badge_set

        // bookmark_ancestor_ignore
        // bookmark_ancestors
        // bookmark_ancestors_to_options
        // bookmark_compare
        // bookmark_find_ancestors
        // bookmark_get
        // bookmark_get_ancestor_then_sort
        // bookmark_get_children
        // bookmark_get_hashes
        // bookmark_get_location
        // bookmark_get_tree
        // bookmark_index_and_move
        // bookmark_move
        // bookmark_parent_was_in_queue
        // bookmark_remove
        // bookmark_reorder
        // bookmark_resort
        // bookmark_root
        // bookmark_sort
        // bookmark_sort_buffer
        // bookmark_sort_date
        // bookmark_sort_title_locale
        // bookmark_sort_url

        // crypto_digest_message

        // extension_page

        // icon_set

        // install_or_upgrade

        // listener_bookmark_changed
        // listener_bookmark_children_reorder
        // listener_bookmark_created
        // listener_bookmark_import_began
        // listener_bookmark_import_ended
        // listener_bookmark_moved
        // listener_bookmark_removed
        // listener_browser_action
        // listener_port_connect
        // listener_port_disconnect
        // listener_port_message
        // listener_react_to_changes
        // listener_service_worker_install

        // locale_compare

        // option_set_sync_if_needed
        // option_to_storage
        // options_from_storage

        // port_message_all
        // port_message_all_except

        // preference_to_storage
        // preferences_from_storage

        // refresh_about
        // refresh_tools

        // show_extension_page_if_needed

        // show_message_relayed

        // start
        // start_done

        // storage_get
        // storage_remove
        // storage_set

        // test

        // tool_bookmark_history_clear
        // tool_bookmark_history_from_storage
        // tool_bookmark_history_log
        // tool_bookmark_history_to_storage
        // tool_bookmark_history_trim
        // tool_duplicate_bookmarks_find
        // tool_duplicate_bookmarks_remove
        // tool_empty_folders_find
        // tool_empty_folders_remove
        // tool_similar_bookmarks_find
        // tool_similar_bookmarks_remove

        // url_setup

        // version_from_storage
        // version_less_than
        // version_to_storage
    },
    'last_time': {
        'refresh_about': 0, // milliseconds from epoch, last time the background page sent a "refresh-about" message to any about page
        'refresh_tools': 0 // milliseconds from epoch, last time the background page sent a "refresh-tools" message to any tools page
    },
    'option': { // defaults for user customizable values which may get replaced with values from storage
        'automatic_sorting': false,
        'group_folders'    : true
    },
    'port': [], // array of port objects used to communicate with other scripts
    'preference': { // defaults for user customizable values which may get replaced with values from storage
        'browser_is_dark': false,       // true or false
        'icon_action'    : 'options',   // "options", "preferences", or "tools"
        'icon_color'     : 'automatic', // "automatic", "dark", "green", or "light"
        'theme'          : 'light'      // "automatic", "dark", or "light"
    },
    'queue': { // arrays
        'reorder'       : [], // keep track of the sort order for a particular folder while it is being processed
        'parent_folders': []  // keep track of which parent folder IDs have been queued for sorting
    },
    'setting': { // settings used internally by sprucemarks, not customizable by the user
        'resort_requested': false, // will be set true by bookmark_resort() if another resort request comes in while it is working on a resort
        'show_extension': false, // can be set true by install_or_upgrade()
        'show_message': { // properties which can be set true by install_or_upgrade()
            'chrome_extensions_toolbar': false,
            'edge_extensions_toolbar': false,
            'firefox_extensions_toolbar': false,
            'upgrade_complete': false
        }
    },
    'status': {
        'import_active': false, // true if bookmarks are actively being imported from a local file or via chrome/edge online sync
        'listeners_active': false, // true if all listeners are active
        'resort_active': false, // true if we are doing a full bookmark resort
        'sprucemarks_active': false, // true if the start_sprucemarks function has already run
        'start_done': false // true once the start function is completely done
    },
    'test': { // functions which will be populated by "background-test.js" once "await test()" is run
        // ancestor
        // function_* (tests for various functions under local.function)
        // last_time
        // option
        // port
        // queue
        // setting
        // shared_browser (test for shared.browser)
        // shared_function_* (tests for various functions under shared.function)
        // shared_setting (test for shared.setting)
        // shared_url (test for shared.url)
        // status
        // test
        // theme
        // timer
        // tool
        // tool_bookmark_history
        // troubleshoot
        // url
        // version
    },
    'timer': { // setTimeout references
        'refresh_about': '', // will become a setTimeout call to run refresh_about() when needed
        'refresh_tools': ''  // will become a setTimeout call to run refresh_tools() when needed
    },
    'tool': { // default states which may get replaced with values from storage
        'bookmark_history': [
            // { activity: '...', id: '...', location: '...', title: '...', type: '...', url: '...', when: 123 }
        ]
    },
    'troubleshoot': null, // generic troubleshooting placeholder
    'url': { // will be populated by url_setup()
        // 'dark': {
        //     'dark': {
        //         'about'      : '/dark/dark/about.html',
        //         'options'    : '/dark/dark/options.html',
        //         'preferences': '/dark/dark/preferences.html',
        //         'tools'      : '/dark/dark/tools.html'
        //     },
        //     'green': {
        //         'about'      : '/dark/green/about.html',
        //         'options'    : '/dark/green/options.html',
        //         'preferences': '/dark/green/preferences.html',
        //         'tools'      : '/dark/green/tools.html'
        //     },
        //     'light': {
        //         'about'      : '/dark/light/about.html',
        //         'options'    : '/dark/light/options.html',
        //         'preferences': '/dark/light/preferences.html',
        //         'tools'      : '/dark/light/tools.html'
        //     }
        // },
        // 'light': {
        //     'dark': {
        //         'about'      : '/light/dark/about.html',
        //         'options'    : '/light/dark/options.html',
        //         'preferences': '/light/dark/preferences.html',
        //         'tools'      : '/light/dark/tools.html'
        //     },
        //     'green': {
        //         'about'      : '/light/green/about.html',
        //         'options'    : '/light/green/options.html',
        //         'preferences': '/light/green/preferences.html',
        //         'tools'      : '/light/green/tools.html'
        //     },
        //     'light': {
        //         'about'      : '/light/light/about.html',
        //         'options'    : '/light/light/options.html',
        //         'preferences': '/light/light/preferences.html',
        //         'tools'      : '/light/light/tools.html'
        //     }
        // }
    },
    'version': browser.runtime.getManifest().version // getManifest is not a promise
} // local

//-----------
// Functions
//-----------
const add_listeners = local.function.add_listeners = function add_listeners() {
    /*
    Add various listeners.
    */
    browser.bookmarks.onChanged.addListener(listener_bookmark_changed)
    browser.bookmarks.onCreated.addListener(listener_bookmark_created)
    browser.bookmarks.onMoved.addListener(listener_bookmark_moved)
    browser.bookmarks.onRemoved.addListener(listener_bookmark_removed)

    if (shared.browser.firefox === false) {
        // chromium browsers only
        browser.bookmarks.onChildrenReordered.addListener(listener_bookmark_children_reorder)
        browser.bookmarks.onImportBegan.addListener(listener_bookmark_import_began)
        browser.bookmarks.onImportEnded.addListener(listener_bookmark_import_ended)
    } // if

    browser.action.onClicked.addListener(listener_browser_action)

    browser.runtime.onConnect.addListener(listener_port_connect)

    // all listeners are now active
    local.status.listeners_active = true

    log('add_listeners -> listeners active')
} // add_listeners

const badge_set = local.function.badge_set = async function badge_set() {
    /*
    Set the text and background color of the browser action badge.
    */

    let color = '#35363a' // default gray

    if (shared.browser.brave) {
        color = '#393939'
    } else if (shared.browser.chrome) {
        color = '#35363a'
    } else if (shared.browser.edge) {
        color = '#3b3b3b'
    } else if (shared.browser.firefox) {
        color = '#323234'
    } else if (shared.browser.opera) {
        color = '#394551'
    } // if

    await browser.action.setBadgeText({ 'text': '' })
    await browser.action.setBadgeBackgroundColor({ 'color': color })
} // badge_set

const bookmark_ancestor_ignore = local.function.bookmark_ancestor_ignore = function bookmark_ancestor_ignore(ancestor) {
    /*
    Return true if a bookmark ancestor should be ignored, otherwise false.

    @param   {String}   ancestor  String like 'bookmarks_bar'.
    @return  {Boolean}            True or false.
    */

    if (ancestor === 'imported_bookmarks'
        || ancestor === 'speed_dials'
        || ancestor === 'trash') {
        // imported_bookmarks (opera)
        // speed_dials        (opera)
        // trash              (opera)
        return true
    } else {
        return false
    }
} // bookmark_ancestor_ignore

const bookmark_ancestors = local.function.bookmark_ancestors = async function bookmark_ancestors() {
    /*
    Update the local.ancestor object and if it changed, init and load options from storage, and then notify all pages about the change.
    */

    const ancestor_before = JSON.stringify(local.ancestor)

    await bookmark_find_ancestors()

    const ancestor_after = JSON.stringify(local.ancestor)

    if (ancestor_before !== ancestor_after) {
        if (ancestor_before === '{}') {
            log('bookmark_ancestors -> ancestors init')
        } else {
            log('bookmark_ancestors -> ancestors have changed')
        } // if

        // ancestors have changed
        bookmark_ancestors_to_options()

        await options_from_storage()

        port_message_all({
            'subject' : 'ancestor-and-option',
            'ancestor': local.ancestor,
            'option'  : local.option
        })
    }
} // bookmark_ancestors

const bookmark_ancestors_to_options = local.function.bookmark_ancestors_to_options = function bookmark_ancestors_to_options() {
    /*
    Create local.option properties for each local.ancestor bookmark, if needed.
    */

    for (const property in local.ancestor) {
        if (local.option[property] === undefined) {
            // set defaults
            local.option[property] = false // checkbox
            local.option[property + '_sort'] = '' // select

            local.option[property + '_sub'] = false // checkbox
            local.option[property + '_sub_sort'] = '' // select
        } // if
    } // for
} // bookmark_ancestors_to_options

const bookmark_compare = local.function.bookmark_compare = function bookmark_compare(bookmark_a, bookmark_b, parent_id, ancestor) {
    /*
    Compare two bookmark objects and always return a positive or negative number for sorting.

    @param   {Object}  bookmark_a  Bookmark object to compare.
    @param   {Object}  bookmark_b  Bookmark object to compare.
    @param   {String}  parent_id   Parent ID of the bookmarks to compare.
    @param   {String}  ancestor    Eldest ancestor ID of the bookmarks to compare.
    @return  {Number}              The number 1 or -1.
    */

    let sort_result = 0 // we never want to return a 0 and will check bookmarks down to their id strings if needed to always return 1 or -1 as the result

    const is_folder_a = (bookmark_a.url === undefined) ? true : false
    const is_folder_b = (bookmark_b.url === undefined) ? true : false

    if (local.option.group_folders) { // sort favoring folders first then files
        if (is_folder_a && is_folder_b === false) {
            sort_result = -1
        } else if (is_folder_a === false && is_folder_b) {
            sort_result = 1
        } // if
    } // if

    if (sort_result === 0) {
        let val_a = ''
        let val_b = ''

        if (local.option.group_folders && is_folder_a && is_folder_b) {
            // sort by title
            [val_a, val_b] = bookmark_sort_title_locale(bookmark_a, bookmark_b)
        } else {
            let sort_order = ''

            for (const property in local.ancestor) {
                if (parent_id === local.ancestor[property]) {
                    sort_order = local.option[property + '_sort']
                    break
                } else if (ancestor !== parent_id && ancestor === local.ancestor[property]) {
                    sort_order = local.option[property + '_sub_sort']
                    break
                } // if
            } // for

            if (sort_order === 'alpha' || sort_order === '') {
                [val_a, val_b] = bookmark_sort_title_locale(bookmark_a, bookmark_b)
            } else if (sort_order === 'alphaReverse') {
                [val_a, val_b] = bookmark_sort_title_locale(bookmark_b, bookmark_a)
            } else if (sort_order === 'date') {
                val_a = bookmark_sort_date(bookmark_b)
                val_b = bookmark_sort_date(bookmark_a)
            } else if (sort_order === 'dateReverse') {
                val_a = bookmark_sort_date(bookmark_a)
                val_b = bookmark_sort_date(bookmark_b)
            } else if (sort_order === 'url') {
                val_a = bookmark_sort_url(bookmark_a)
                val_b = bookmark_sort_url(bookmark_b)
            } else if (sort_order === 'urlReverse') {
                val_a = bookmark_sort_url(bookmark_b)
                val_b = bookmark_sort_url(bookmark_a)
            } else {
                [val_a, val_b] = bookmark_sort_title_locale(bookmark_a, bookmark_b)
            } // if
        } // if

        if (val_a < val_b) {
            sort_result = -1
        } else if (val_a > val_b) {
            sort_result = 1
        } else {
            // sort result is still 0 so get more specific and avoid an edge case where two items with the same name can endlessly trade places every sort

            // sort on case
            if (bookmark_a.title < bookmark_b.title) {
                sort_result = -1
            } else if (bookmark_a.title > bookmark_b.title) {
                sort_result = 1
            } else {
                // sort result is still 0 so get more specific
                if (bookmark_a.url < bookmark_b.url) {
                    sort_result = -1
                } else if (bookmark_a.url > bookmark_b.url) {
                    sort_result = 1
                } else {
                    // item with the earlier id is going to be first
                    if (bookmark_a.id < bookmark_b.id) {
                        sort_result = -1
                    } else {
                        sort_result = 1
                    } // if
                } // if
            } // if
        } // if
    } // if

    return sort_result
} // bookmark_compare

const bookmark_find_ancestors = local.function.bookmark_find_ancestors = async function bookmark_find_ancestors() {
    /*
    Find and set local.ancestor values for root level bookmark folders.
    */

    const bookmarks = await bookmark_get_children(bookmark_root())

    // reset ancestor object
    local.ancestor = {}

    for (const item of bookmarks) {
        const property = item.title.toLowerCase().replace(/ /g, '_')

        local.ancestor[property] = item.id
    } // for
} // bookmark_find_ancestors

const bookmark_get = local.function.bookmark_get = async function bookmark_get(id) {
    /*
    Get a single bookmark object.

    @param   {String}  id  ID of the bookmark to retrieve.
    @return  {Object}      Bookmark object or undefined if the bookmark was not found.
    */

    try {
        const bookmark_array = await browser.bookmarks.get(id)
        return bookmark_array[0]
    } catch (error) {
        return undefined
    } // try
} // bookmark_get

const bookmark_get_ancestor_then_sort = local.function.bookmark_get_ancestor_then_sort = async function bookmark_get_ancestor_then_sort(id, relay_id, parent_id, recurse) {
    /*
    Get the eldest ancestor like "bookmarks bar" and then sort.

    @param  {String}   id         Bookmark ID that will be used to check ancestry. Changes if recursion is needed.
    @param  {String}   relay_id   Bookmark ID that will be relayed to the bookmark_sort function once the eldest ancestor is found.
    @param  {String}   parent_id  Parent ID of the relay_id bookmark.
    @param  {Boolean}  recurse    True or false.
    */

    const bookmark = await bookmark_get(id)

    if (typeof bookmark === 'undefined') {
        // oops, the bookmark we wanted to sort has been deleted before we could get to it
        await bookmark_sort(relay_id, parent_id, recurse, id)
    } else {
        const bookmark_parent_id = bookmark.parentId

        if (bookmark_parent_id === bookmark_root()) {
            const ancestor_known = (Object.values(local.ancestor).indexOf(id) >= 0) ? true : false

            if (ancestor_known === false) {
                log('bookmark_get_ancestor_then_sort -> ancestor id "' + id  + '" is unknown so calling bookmark_ancestors()')

                // this ancestor is unknown
                await bookmark_ancestors()
            } // if

            await bookmark_sort(relay_id, parent_id, recurse, id)
        } else {
            // keep searching for the eldest ancestor
            await bookmark_get_ancestor_then_sort(bookmark_parent_id, relay_id, parent_id, recurse)
        } // if
    } // if
} // bookmark_get_ancestor_then_sort

const bookmark_get_children = local.function.bookmark_get_children = async function bookmark_get_children(parent_id) {
    /*
    Get the children bookmark objects that belong to a single parent bookmark.

    @param   {String}  parent_id  Parent ID to get the children bookmarks of.
    @return  {Object}             Array of bookmark objects or undefined if the parent ID was not found.
    */

    try {
        return await browser.bookmarks.getChildren(parent_id)
    } catch (error) {
        return undefined
    } // try
} // bookmark_get_children

const bookmark_get_hashes = local.function.bookmark_get_hashes = async function bookmark_get_hashes(tree) {
    /*
    Return an array of hash strings, one for each bookmark ancestor.

    @param   {Object}  tree  Object tree of bookmarks and folders from bookmark_get_tree()
    @return  {Array}         Array of hashes like ['bookmarks_bar-0']
    */

    const catalog = {
        // bookmarks_folder: ["daily", "projects"]
        // other_bookmarks: ["music", "software"]
    } // catalog

    const hashes = [] // will contain hashes like "bookmarks_bar-0"

    function catalog_bookmarks(ancestor, bookmarks, path) {
        /*
        Recursively find all bookmark titles within one bookmark ancestor folder.

        @param   {String}  ancestor  Normalized ancestor title like "bookmarks_bar" or "other_bookmarks".
        @param   {Array}   bookmarks  Array of bookmark objects.
        @param   {String}  [path]     Optional. Path to the current array of bookmark objects.
        */

        path = path || ''

        for (const bookmark of bookmarks) {
            const bookmark_path = (path === '') ? bookmark.title : path + '/' + bookmark.title

            if (bookmark.children === undefined) {
                // regular bookmark, not a folder
                catalog[ancestor].push(bookmark_path)
            } else if (bookmark.children.length === 0) {
                // bookmark folder with no children
                catalog[ancestor].push(bookmark_path + '/')
            } else {
                // bookmark folder with children
                catalog[ancestor].push(bookmark_path + '/')

                catalog_bookmarks(ancestor, bookmark.children, bookmark_path)
            } // if
        } // for
    } // catalog_bookmarks

    // loop through ancestor bookmark folders
    for (const ancestor of tree.children) {
        const ancestor_title = ancestor.title.toLowerCase().replace(/ /g, '_')

        if (bookmark_ancestor_ignore(ancestor_title)) {
            continue
        } // if

        // create array for this ancestor to store its bookmark titles
        catalog[ancestor_title] = []

        if (ancestor.children.length !== 0) {
            catalog_bookmarks(ancestor_title, ancestor.children)
        } // if
    } // for

    for (const ancestor in catalog) {
        // sort ancestor catalog of bookmark strings
        catalog[ancestor].sort(locale_compare)

        // create hash of sorted bookmark strings
        const hash = await crypto_digest_message(catalog[ancestor].join(''))

        hashes.push(ancestor + '-' + hash)
    } // for

    return hashes
} // bookmark_get_hashes

const bookmark_get_location = local.function.bookmark_get_location = async function bookmark_get_location(id, parent_id) {
    /*
    Figure out and return the full path to a bookmark, if possible. Otherwise return a default string. Will only return a full path for bookmarks that are children of a bookmark ancestor.

    @param   {String}  id           Bookmark ID to get a location for.
    @param   {String}  [parent_id]  Optional. Parent ID of the bookmark to get a location for.
    @return  {String}               A location like "Folder\Sub Folder" if possible otherwise "(not available)".
    */

    let location   = '' // location like "Folder\Sub Folder" or "(not available)"
    let path       = '' // will be used to incrementally build a path
    let path_depth = 0  // keep track of how deep we have traveled when building a path

    const root = bookmark_root()

    if (parent_id !== undefined) {
        // start one level deeper
        id = parent_id
        path_depth = 1
    } // if

    do {
        const bookmark = await bookmark_get(id)

        if (typeof bookmark === 'undefined') {
            // oops, the bookmark was deleted before we could get to it
            location = '(not available)'
        } else {
            id = bookmark.parentId

            if (path_depth > 1 && path !== '') {
                path = '/' + path
            } // if

            if (path_depth > 0) {
                path = bookmark.title + path
            } // if

            if (id === root) {
                // no need to traverse any further
                location = path
            } // if
        } // if

        path_depth += 1
    } while (location === '')

    if (location !== '(not available)') {
        // title case the ancestor folder to avoid mixed case strings like "Bookmarks bar" in some browsers, on some operating systems
        const location_array = location.split('/')

        location_array[0] = location_array[0].split(' ').map(word => word.slice(0, 1).toUpperCase() + word.slice(1)).join(' ')

        location = location_array.join('/')
    } // if

    return location
} // bookmark_get_location

const bookmark_get_tree = local.function.bookmark_get_tree = async function bookmark_get_tree() {
    /*
    Get the entire bookmark tree, starting from the root bookmark element.

    @return  {Object}  A BookmarkTreeNode object.
        https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons
    */

    const tree = (await browser.bookmarks.getTree())[0]

    return tree
} // bookmark_get_tree

const bookmark_index_and_move = local.function.bookmark_index_and_move = async function bookmark_index_and_move(parent_id) {
    /*
    Figure out the correct index for each bookmark in a folder and call bookmark_move as needed.

    @param  {String}  parent_id  Parent ID to index and move children bookmarks for.
    */

    const array = local.queue.reorder.filter(item => item[0] === parent_id)[0]

    if (array === undefined) {
        log('bookmark_index_and_move -> array is undefined')
    } else {
        const sorted_bookmarks = array[1]
        const sorted_bookmarks_length = sorted_bookmarks.length

        for (let index = 0; index < sorted_bookmarks_length; index++) {
            const id = sorted_bookmarks[index].id

            try {
                // get the real bookmark so we can check its current index
                const bookmark = await bookmark_get(id)

                if (typeof bookmark === 'undefined') {
                    // oops, the bookmark was deleted before we could get to it
                } else {
                    if (bookmark.parentId === parent_id) {
                        // good, this bookmark is still in the folder we are sorting

                        if (index !== bookmark.index) {
                            // log('bookmark_index_and_move -> move id ' + sorted_bookmarks[index].id + ' to position ' + index + ' inside parent ' + parent_id)

                            await bookmark_move(id, parent_id, index)
                        } // if
                    } // if
                } // if
            } catch (error) {
                local.troubleshoot = error

                log('bookmark_index_and_move -> error', error)
            } // try
        } // for
    } // if

    local.queue.parent_folders = local.queue.parent_folders.filter(item => item !== parent_id)

    local.queue.reorder = local.queue.reorder.filter(item => item[0] !== parent_id)

    log('bookmark_index_and_move -> finished parent ' + parent_id)
} // bookmark_index_and_move

const bookmark_move = local.function.bookmark_move = async function bookmark_move(id, parent_id, index) {
    /*
    Move a bookmark.

    @param  {String}  id         Bookmark ID to move.
    @param  {String}  parent_id  Parent ID of the bookmark.
    @param  {Number}  index      Index or position to move the bookmark to.
    */

    const destination = {
        parentId: parent_id,
        index: index
    } // destination

    try {
        await browser.bookmarks.move(id, destination)

        log('bookmark_move -> moved id ' + id + ' to position ' + index)
    } catch (error) {
        local.troubleshoot = error

        log('bookmark_move -> error', error)
    } // try
} // bookmark_move

const bookmark_parent_was_in_queue = local.function.bookmark_parent_was_in_queue = function bookmark_parent_was_in_queue(parent_id) {
    /*
    Check the parent_folders queue for the parent id of a bookmark.
    If the parent id does not exist, add it to the queue before returning.

    @param   {String}   parent_id  Parent ID of a bookmark.
    @return  {Boolean}             True of false.
    */

    if (local.queue.parent_folders.indexOf(parent_id) >= 0) {
        // we are already sorting this folder
        return true
    } else {
        local.queue.parent_folders.push(parent_id)
        return false
    } // if
} // bookmark_parent_was_in_queue

const bookmark_remove = local.function.bookmark_remove = async function bookmark_remove(id) {
    /*
    Remove one bookmark.

    @param  {String}  id   Bookmark ID to remove.
    */

    if (typeof id !== 'string') {
        // oops, bookmark ID is not a string
        log('bookmark_remove -> oops, bookmark ID is not a string ->', id)
        return 'early'
    } // if

    if (id === bookmark_root()) {
        // oops, bookmark ID is the root which should never be removed
        log('tool_empty_folders_remove -> bookmark ID ' + id + ' is the root which should never be removed')
        return 'early'
    } // if

    const ancestors = Object.values(local.ancestor)

    if (ancestors.indexOf(id) >= 0) {
        // oops, bookmark ID is an ancestor folder which should never be removed
        log('bookmark_remove -> oops, bookmark ID ' + id + ' is an ancestor folder which should never be removed')
        return 'early'
    } // if

    try {
        await browser.bookmarks.remove(id)
    } catch (error) {
        // do nothing
    } // try
} // bookmark_remove

const bookmark_reorder = local.function.bookmark_reorder = async function bookmark_reorder(bookmarks) {
    /*
    Call bookmark_index_and_move if we are not already aware of the folder being sorted.

    @param  {Object}  bookmarks  Array of bookmark objects.
    */

    const parent_id = bookmarks[0].parentId

    if (local.queue.reorder.some(item => item[0] === parent_id)) {
        // we are already working on this folder
        return 'early'
    } // if

    local.queue.reorder.push([parent_id, bookmarks]) // parent id, sorted bookmarks array

    await bookmark_index_and_move(parent_id)
} // bookmark_reorder

const bookmark_resort = local.function.bookmark_resort = async function bookmark_resort() {
    /*
    Find ancestors and then recursively sort all bookmarks.
    */

    if (local.status.resort_active === true) {
        // a resort is currently in progress

        // set resort_requested to true so the current resort will run another resort once the current resort is done
        local.setting.resort_requested = true

        log('bookmark_resort -> resort already running, additional resort requested')

        return 'early'
    } // if

    await bookmark_ancestors()

    if (local.option.automatic_sorting === true) {
        /*
        Set resort_active to true so...
            Only one bookmark_resort() runs at a time.
            Listener functions can choose to ignore any resorting activity.
        */
        local.status.resort_active = true

        log('bookmark_resort -> resort begin')

        try {
            const bookmarks = await bookmark_get_children(bookmark_root())

            const recurse = true

            for (const item of bookmarks) {
                const id = item.id

                await bookmark_sort(id, id, recurse)
            } // for
        } catch (error) {
            log('bookmark_resort -> error', error)
        } // try

        log('bookmark_resort -> resort end')

        // set resort_active to false so listener functions can resume normal duties
        local.status.resort_active = false

        if (local.setting.resort_requested === true) {
            // another resort was requested while we were sorting so clear the resort_request and run another resort
            local.setting.resort_requested = false

            log('bookmark_resort -> running another resort')

            await bookmark_resort()
        } // if
    } // if
} // bookmark_resort

const bookmark_root = local.function.bookmark_root = function bookmark_root() {
    /*
    Return the root level bookmark ID.

    @return  {String}  Root bookmark ID.
    */

    let root_id = '0' // default for chromium browsers

    if (shared.browser.firefox) {
        root_id = 'root________'
    } // if

    return root_id
} // bookmark_root

const bookmark_sort = local.function.bookmark_sort = async function bookmark_sort(id, parent_id, recurse, ancestor) {
    /*
    Sort bookmarks in a folder, optionally recurse, and call the bookmark_reorder function as needed.

    @param  {String}   id          Bookmark ID.
    @param  {String}   parent_id   Parent ID of the bookmark.
    @param  {Boolean}  [recurse]   Optional, true or false.
    @param  {String}   [ancestor]  Optional, eldest ancestor ID of the bookmark. For example, if "Other Bookmarks" is the eldest ancestor, the ancestor ID is most likely '1' in Chrome/Edge or 'unfiled_____' in Firefox.
    */

    parent_id = parent_id === undefined ? id : parent_id
    recurse = recurse || false

    bookmark_parent_was_in_queue(parent_id) // make sure parent_id is in the parent_folders queue so listeners can ignore our own sort events

    if (Object.values(local.ancestor).indexOf(id) >= 0) {
        ancestor = id // be your own ancestor with time travel!
    } // if

    if (ancestor === undefined) {
        await bookmark_get_ancestor_then_sort(id, id, parent_id, recurse)
    } else {
        const bookmarks = await bookmark_get_children(parent_id) || [] // array of bookmark objects or empty array

        let allow_recurse = true
        let break_sort = false

        for (const property in local.ancestor) {
            if (parent_id === local.ancestor[property] &&
                (local.option[property] === false || local.option[property] === undefined)) {
                log('bookmark_sort -> no need to sort ' + property)

                break_sort = true

                if (local.option[property + '_sub'] === false || local.option[property + '_sub'] === undefined) {
                    log('bookmark_sort -> no need to sort ' + property + ' sub folders')
                    allow_recurse = false
                } // if
            } else if (ancestor !== parent_id && ancestor === local.ancestor[property] &&
                (local.option[property + '_sub'] === false || local.option[property + '_sub'] === undefined)) {
                log('bookmark_sort -> no need to sort ' + property + ' sub folders')

                allow_recurse = false
                break_sort = true
            } // if

            if (break_sort) {
                break // out of for loop
            } // if
        } // for

        if (allow_recurse && recurse) {
            for (const item of bookmarks) {
                if (item.url === undefined) {
                    // we have a folder so recursively call our own function to support unlimited folder depth
                    const id = item.id

                    await bookmark_sort(id, id, recurse, ancestor)
                } // if
            } // for
        } // if

        if (break_sort || bookmarks.length < 2) {
            local.queue.parent_folders = local.queue.parent_folders.filter(item => item !== parent_id)

            if (break_sort === false) {
                log('bookmark_sort -> no need to reorder parent ' + parent_id + ' (return early)')
            } // if

            return 'early'
        } // if

        if (bookmarks.length > 1) {
            // we have a non-empty folder with more than 1 item

            // build a string of index values so we can compare against a sorted string to determine if we need to call the bookmark_reorder function
            let indexBefore = ''

            for (const item of bookmarks) {
                indexBefore += item.index
            } // for

            bookmarks.sort(function(bookmark_a, bookmark_b) {
                return bookmark_compare(bookmark_a, bookmark_b, parent_id, ancestor)
            })

            let indexAfter = ''

            for (const item of bookmarks) {
                indexAfter += item.index
            } // for

            if (indexBefore !== indexAfter) {
                log('bookmark_sort -> index ' + indexBefore + ' to ' + indexAfter + ' for parent ' + parent_id)

                await bookmark_reorder(bookmarks)
            } else {
                log('bookmark_sort -> no need to reorder parent ' + parent_id)

                local.queue.parent_folders = local.queue.parent_folders.filter(item => item !== parent_id)
            } // if
        } // if
    } // if
} // bookmark_sort

const bookmark_sort_buffer = local.function.bookmark_sort_buffer = async function bookmark_sort_buffer(id, parent_id) {
    /*
    Wait for half a second and then run bookmark_sort. Then do the procedure again for good measure.

    @param  {String}  id         ID of a bookmark.
    @param  {String}  parent_id  Parent ID of a bookmark.
    */

    log('bookmark_sort_buffer -> id ' + id + ', parent ' + parent_id)

    // Chrome can lock bookmarks for a short time after a user does something.
    // Wait half a second before sorting.
    await delay(500) // milliseconds
    await bookmark_sort(id, parent_id)

    // in case any events occurred while we were sorting, wait another half a second and then sort again
    await delay(500) // milliseconds
    await bookmark_sort(id, parent_id)
} // bookmark_sort_buffer

const bookmark_sort_date = local.function.bookmark_sort_date = function bookmark_sort_date(bookmark) {
    /*
    Return the date added of a bookmark or 0 if date added is not a number.

    @param  {Object}  bookmark  Bookmark object.
    */

    return (typeof(bookmark.dateAdded) === 'number') ? bookmark.dateAdded : 0
} // bookmark_sort_date

const bookmark_sort_title_locale = local.function.bookmark_sort_title_locale = function bookmark_sort_title_locale(bookmark_one, bookmark_two) {
    /*
    Figure out if the first of two bookmark titles should come before, after, or is equal to the second bookmark title.

    @param   {Object}  bookmark_one  Bookmark object.
    @param   {Object}  bookmark_two  Bookmark object.
    @return  {Object}                Array like [0,0]
    */

    let val_a = 0
    let val_b = 0

    const result = locale_compare(bookmark_one.title, bookmark_two.title)

    if (result < 0) {
        // bookmark one should come before bookmark two
        val_a = '0'
        val_b = '1'
    } else if (result > 0) {
        // bookmark one should come after bookmark two
        val_a = '1'
        val_b = '0'
    } else {
        // bookmark one and two are equal
        val_a = '0'
        val_b = '0'
    } // if

    return [val_a, val_b]
} // bookmark_sort_title_locale

const crypto_digest_message = local.function.crypto_digest_message = async function crypto_digest_message(text) {
    /*
    Return a SHA-256 digest message from the crypto API.

    @param   {String}  text  String like "bookmarks"
    @return  {String}        String like "37d15b9571f56ffbb7494a02efdebc7390f796c20ea0c477229e1711c86a90be"
    */

    // the code below is based on https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string

    try {
        // encode as (utf-8) Uint8Array
        const msgUint8 = new TextEncoder().encode(text)

        // hash the message
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)

        // convert buffer to byte array
        const hashArray = Array.from(new Uint8Array(hashBuffer))

        // convert bytes to hex string
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

        return hashHex
    } catch (error) {
        return 'unknown'
    } // try
} // crypto_digest_message

const bookmark_sort_url = local.function.bookmark_sort_url = function bookmark_sort_url(bookmark) {
    /*
    Return the url of a bookmark after lowercasing and replacing unwanted strings or return an empty string for bookmarks that are folders for other bookmarks.

    @param  {Object}  bookmark  Bookmark object.
    */
    let result = bookmark.url || ''

    if (result !== '') {
        result = result.toLowerCase()
            .replace(/^about:/, '')
            .replace('chrome://', '')
            .replace('chrome-extension://', '')
            .replace('moz-extension://', '')
            .replace('edge://', '')
            .replace('ftp://', '')
            .replace('http://', '')
            .replace('https://', '')
            .replace(/^www\./, '')
    } // if

    return result
} // bookmark_sort_url

const extension_page = local.function.extension_page = async function extension_page() {
    /*
    Focus an already open extension page or open a new extension page.
    */

    let open_new_page = true // default

    let theme = local.preference.theme

    if (theme === 'automatic') {
        theme = (local.preference.browser_is_dark) ? 'dark' : 'light'
    } // if

    let icon = local.preference.icon_color

    if (icon === 'automatic') {
        icon = (local.preference.browser_is_dark) ? 'light' : 'dark'
    } // if

    let url = local.url[theme][icon].options // default

    // open the users preferred page
    if (local.preference.icon_action === 'preferences') {
        url = local.url[theme][icon].preferences
    } else if (local.preference.icon_action === 'tools') {
        url = local.url[theme][icon].tools
    } // if

    if (local.port.length > 0) {
        // focus an existing page
        const tab = local.port[0].sender.tab

        try {
            await browser.windows.update(tab.windowId, { focused: true })
            await browser.tabs.update(tab.id, { active: true, url: url })

            open_new_page = false
        } catch (error) {
            log('extension_page -> error', error)
        } // try
    } // if

    if (open_new_page) {
        // open a new page
        await browser.tabs.create({ url: url })
    } // if
} // extension_page

const icon_set = local.function.icon_set = async function icon_set() {
    /*
    Set the current browser action icon.
    */

    let color = local.preference.icon_color

    if (color === 'automatic') {
        color = (local.preference.browser_is_dark) ? 'light' : 'dark'
    } // if

    const details = {
        'path': {
            '16':  'images/icon/icon-' + color + '-16.png',
            '24':  'images/icon/icon-' + color + '-24.png',
            '32':  'images/icon/icon-' + color + '-32.png',
            '48':  'images/icon/icon-' + color + '-48.png',
            '64':  'images/icon/icon-' + color + '-64.png',
            '96':  'images/icon/icon-' + color + '-96.png',
            '128': 'images/icon/icon-' + color + '-128.png'
        }
    } // details

    try {
        await browser.action.setIcon(details)
    } catch (error) {
        log('icon_set -> error ->', error.message)
    } // try
} // icon_set

const install_or_upgrade = local.function.install_or_upgrade = async function install_or_upgrade() {
    /*
    If needed, run any install or upgrade tasks.
    */

    const version_in_storage = await version_from_storage()

    if (local.version !== version_in_storage) {
        // manifest version does not match the version in storage so this is a first install or upgrade

        if (version_in_storage === '') {
            // first install
            log('install_or_upgrade -> first install')

            // save default options to storage
            for (const property in local.option) {
                await option_to_storage(property)
            } // for

            // save default preferences to storage
            for (const property in local.preference) {
                await preference_to_storage(property)
            } // for

            // show extension page since this is a first install
            local.setting.show_extension = true

            if (shared.browser.chrome === true) {
                // show a one-time message about the chrome extensions toolbar menu and how it likes to hide icons by default
                local.setting.show_message.chrome_extensions_toolbar = true
            } else if (shared.browser.edge === true) {
                // show a one-time message about the edge extensions toolbar menu and how it likes to hide icons by default
                local.setting.show_message.edge_extensions_toolbar = true
            } else if (shared.browser.firefox === true) {
                // show a one-time message about the firefox extensions toolbar menu and how it likes to hide icons by default
                local.setting.show_message.firefox_extensions_toolbar = true
            } // if
        } else {
            // upgrade
            log('install_or_upgrade -> upgrade')

            let check_version = ''
            const message_upgrade = 'install_or_upgrade -> upgrade for version less than '

            check_version = '2025.1.3.0'
            if (version_less_than(version_in_storage, check_version)) {
                // version_storage is less than check_version
                log(message_upgrade + check_version)

                // upgrade logic
            } // if

            /*
            // show a one-time message
            local.setting.show_message.upgrade_complete = true

            // show extension page
            local.setting.show_extension = true
            */
        } // upgrade

        if (local.setting.show_extension === true) {
            log('install_or_upgrade -> show extension')
        } // if

        // save the current version to storage
        await version_to_storage()
    } // if
} // install_or_upgrade

const listener_bookmark_changed = local.function.listener_bookmark_changed = async function listener_bookmark_changed(id, change_info) {
    /*
    Listener function for browser.bookmarks.onChanged events.

    @param  {String}  id            ID of the bookmark that was changed.
    @param  {Object}  change_info   Object with the properties dateAdded, id, index, parentId, title, and url in Chromium browsers. Object with a title or url property in Firefox.
    */

    // log('listener_bookmark_changed -> id', id, change_info)

    if (shared.browser.firefox) {
        // firefox only provides the title or url of a changed bookmark so try to get more information from the bookmark directly
        const bookmark = await bookmark_get(id)

        if (bookmark !== undefined) {
            if (change_info.title === undefined) {
                change_info.title = bookmark.title
            } // if

            if (change_info.url === undefined) {
                change_info.url = bookmark.url
            } // if

            change_info.type = bookmark.type
        } // if
    } // if

    await tool_bookmark_history_log(
        'modified',           // activity
        undefined,            // children
        id,                   // id
        change_info.parentId, // parent_id
        change_info.title,    // title
        change_info.type,     // type
        change_info.url       // url
    )

    if (listener_react_to_changes()) {
        const bookmark = await bookmark_get(id)

        if (typeof bookmark === 'undefined') {
            // oops, the bookmark was deleted before we could get to it
        } else {
            const parent_id = bookmark.parentId

            if (bookmark_parent_was_in_queue(parent_id) === false) {
                log('listener_bookmark_changed -> id ' + id)

                await bookmark_sort_buffer(id, parent_id)
            } // if
        } // if
    } // if

    await refresh_about()
    await refresh_tools()
} // listener_bookmark_changed

const listener_bookmark_children_reorder = local.function.listener_bookmark_children_reorder = async function listener_bookmark_children_reorder(parent_id, reorder_info) {
    /*
    Listener function for browser.bookmarks.onChildrenReordered events.

    This listener is only called in Chrome and Edge.

    This listener may only be called after using the 'Sort by name' feature of the chrome://bookmarks page.
    Edge does not seem to have a manual sort by name feature as of February 2, 2020.

    @param  {String}  parent_id      Parent ID of the folder which had its children reordered.
    @param  {Object}  reorder_info   Not used. Object like {"childIds":["968","966","967"]}
    */

    if (listener_react_to_changes()) {
        if (bookmark_parent_was_in_queue(parent_id) === false) {
            log('listener_bookmark_children_reorder -> parent ' + parent_id)

            await bookmark_sort_buffer(parent_id, parent_id)
        } // if
    } // if
} // listener_bookmark_children_reorder

const listener_bookmark_created = local.function.listener_bookmark_created = async function listener_bookmark_created(id, bookmark) {
    /*
    Listener function for browser.bookmarks.onCreated events.

    @param  {String}  id        ID of the bookmark that was created.
    @param  {Object}  bookmark  Bookmark object with the properties dateAdded, id, index, parentId, title, and url. Firefox will also include a type property.
    */

    // log('listener_bookmark_created -> id', id, bookmark)

    if (shared.browser.firefox && bookmark.type === 'separator') {
        // ignore bookmark separators
        return 'early'
    } // if

    await tool_bookmark_history_log(
        'added',           // activity
        undefined,         // children
        id,                // id
        bookmark.parentId, // parent_id
        bookmark.title,    // title
        bookmark.type,     // type
        bookmark.url       // url
    )

    if (listener_react_to_changes()) {
        const parent_id = bookmark.parentId

        if (bookmark_parent_was_in_queue(parent_id) === false) {
            log('listener_bookmark_created -> id ' + id)

            await bookmark_sort_buffer(id, parent_id)
        } // if
    } // if

    await refresh_about()
    await refresh_tools()
} // listener_bookmark_created

const listener_bookmark_import_began = local.function.listener_bookmark_import_began = function listener_bookmark_import_began() {
    /*
    Listener function for browser.bookmarks.onImportBegan events.

    This listener is only called in Chrome and Edge.

    Besides importing from a file, this event will also happen when Chrome/Edge sync is being used to sync bookmarks.
    */

    local.status.import_active = true

    log('listener_bookmark_import_began -> import began')
} // listener_bookmark_import_began

const listener_bookmark_import_ended = local.function.listener_bookmark_import_ended = async function listener_bookmark_import_ended() {
    /*
    Listener function for browser.bookmarks.onImportEnded events.

    This listener is only called in Chrome and Edge.

    Besides importing from a file, this event will also happen when Chrome/Edge sync is being used to sync bookmarks.
    */

    log('listener_bookmark_import_ended -> import ended')

    await bookmark_resort()

    local.status.import_active = false

    await refresh_about()
    await refresh_tools()
} // listener_bookmark_import_ended

const listener_bookmark_moved = local.function.listener_bookmark_moved = async function listener_bookmark_moved(id, move_info) {
    /*
    Listener function for browser.bookmarks.onMoved events.

    @param  {String}  id         ID of the bookmark that was moved.
    @param  {Object}  move_info  Object with the properties index, oldIndex, oldParentId, and parentId.
    */

    if (listener_react_to_changes()) {
        const parent_id = move_info.parentId

        if (bookmark_parent_was_in_queue(parent_id) === false) {
            log('listener_bookmark_moved -> id ' + id + ', parent ' + parent_id)

            await bookmark_sort_buffer(id, parent_id)
        } // if
    } // if

    await refresh_about()
    await refresh_tools()
} // listener_bookmark_moved

const listener_bookmark_removed = local.function.listener_bookmark_removed = async function listener_bookmark_removed(id, remove_info) {
    /*
    Listener function for browser.bookmarks.onRemoved events.

    @param  {String}  id           ID of the bookmark that was removed.
    @param  {Object}  remove_info  Object with the properties index and parentId. Also contains a sub object "node" with the properties children, dateAdded, id, title, and url in Chromium browsers and id, index, parentId, type, and url in Firefox.
    */

    log('listener_bookmark_removed -> id ' + id + ', parent ' + remove_info.parentId)

    if (shared.browser.firefox) {
        if (remove_info.node.type === 'separator') {
            // ignore bookmark separators
            return 'early'
        } // if

        if (remove_info.node.title === undefined) {
            // try to use the last known title from history since firefox does not provide a title when bookmarks are removed

            const history = local.tool.bookmark_history.filter(bookmark => bookmark.id === id && bookmark.activity !== 'removed')

            if (history.length > 0) {
                // history is available for this bookmark
                remove_info.node.title = history.slice(-1)[0].title
            } // if
        } // if
    } // if

    await tool_bookmark_history_log(
        'removed',                 // activity
        remove_info.node.children, // children
        remove_info.node.id,       // id
        remove_info.parentId,      // parent_id
        remove_info.node.title,    // title
        remove_info.node.type,     // type
        remove_info.node.url       // url
    )

    await refresh_about()
    await refresh_tools()
} // listener_bookmark_removed

const listener_browser_action = local.function.listener_browser_action = async function listener_browser_action() {
    /*
    Listener function for browser.action.onClicked events.
    */

    await extension_page()
} // listener_browser_action

const listener_port_connect = local.function.listener_port_connect = function listener_port_connect(port) {
    /*
    Listener for browser.runtime.onConnect events.

    @param  {Object}  port  Object with the properties onDisconnect, name, sender, onMessage, disconnect, and postMessage.
    */

    // log('listener_port_connect -> port connected')

    local.port.push(port)

    port.onDisconnect.addListener(listener_port_disconnect)

    port.onMessage.addListener(listener_port_message)
} // listener_port_connect

const listener_port_disconnect = local.function.listener_port_disconnect = function listener_port_disconnect(port) {
    /*
    Listener for port.onDisconnect events.

    @param  {Object}  port  Object with the properties onDisconnect, name, sender, onMessage, disconnect, and postMessage.
    */

    // log('listener_port_disconnect -> disconnected')

    local.port = local.port.filter(keep => keep !== port)
} // listener_port_disconnect

const listener_port_message = local.function.listener_port_message = async function listener_port_message(obj, port) {
    /*
    Listener for port.onMessage events.

    @param  {Object}  obj   Object like {subject:'link-sprucemarks'}
    @param  {Object}  port  Object with the properties onDisconnect, name, sender, onMessage, disconnect, and postMessage.
    */

    // manifest version 3 service workers must register their listeners early, so early that start() may not have had a chance to finish yet
    try {
        await start_done()
    } catch (error) {
        log('listener_port_message -> error ->', error)

        return 'early'
    } // try

    switch (obj.subject) {
        case 'init-about': {
            log('listener_port_message -> init-about')

            const tree = await bookmark_get_tree()

            const bookmark_hashes = await bookmark_get_hashes(tree) // array of strings

            port.postMessage({
                'subject'        : 'init-about',
                'ancestor'       : local.ancestor,
                'bookmark_hashes': bookmark_hashes,
                'option'         : local.option,
                'preference'     : local.preference,
                'setting'        : {
                    'show_message': local.setting.show_message
                },
                'version': local.version
            })

            show_message_relayed()

            break
        } // init-about
        case 'init-options':
            log('listener_port_message -> init-options')

            port.postMessage({
                'subject'   : 'init-options',
                'ancestor'  : local.ancestor,
                'option'    : local.option,
                'preference': local.preference,
                'setting'   : {
                    'show_message': local.setting.show_message
                }
            })

            show_message_relayed()

            break
        case 'init-preferences':
            log('listener_port_message -> init-preferences')

            port.postMessage({
                'subject'   : 'init-preferences',
                'preference': local.preference,
                'setting'   : {
                    'show_message': local.setting.show_message
                }
            })

            show_message_relayed()

            break
        case 'init-tools': {
            log('listener_port_message -> init-tools')

            const tree = await bookmark_get_tree()

            const duplicate_bookmarks = await tool_duplicate_bookmarks_find(tree)

            const empty_folders = await tool_empty_folders_find(tree)

            const similar_bookmarks = await tool_similar_bookmarks_find(tree)

            port.postMessage({
                'subject'            : 'init-tools',
                'bookmark_history'   : local.tool.bookmark_history,
                'duplicate_bookmarks': duplicate_bookmarks,
                'empty_folders'      : empty_folders,
                'preference'         : local.preference,
                'setting'            : {
                    'show_message': local.setting.show_message
                },
                'similar_bookmarks'  : similar_bookmarks
            })

            show_message_relayed()

            break
        } // init-tools
        case 'link-sprucemarks': {
            // content script would like to open an extension page

            let theme = local.preference.theme

            if (theme === 'automatic') {
                theme = (local.preference.browser_is_dark) ? 'dark' : 'light'
            } // if

            let icon = local.preference.icon_color

            if (icon === 'automatic') {
                icon = (local.preference.browser_is_dark) ? 'light' : 'dark'
            } // if

            const url = local.url[theme][icon].options

            await browser.tabs.update(port.sender.tab.id, { url: url })

            break
        } // link-sprucemarks
        case 'option-set':
            log('listener_port_message -> option-set -> ' + obj.name + ' =', obj.value)

            if (local.option[obj.name] === undefined) {
                // this option does not exist
                break
            } // if

            if (local.option[obj.name] === obj.value) {
                // this option has not changed
                break
            } // if

            // save option
            local.option[obj.name] = obj.value

            // save option to storage
            await option_to_storage(obj.name)

            // send updated option to all ports except the port that messaged us
            port_message_all_except(port, {
                'subject': 'option-set',
                'name'   : obj.name,
                'value'  : obj.value
            })

            if (obj.name === 'automatic_sorting' || obj.name === 'group_folders') {
                // do nothing
            } else {
                // Figure out if a user visible select or checkbox choice should also affect its corresponding option and if yes, message all ports with the updated corresponding option.
                await option_set_sync_if_needed(obj)
            } // if

            await bookmark_resort()

            break
        case 'preference':
            log('listener_port_message -> preference')

            port.postMessage({
                'subject': 'preference',
                'preference': local.preference
            })

            break
        case 'preference-set':
            log('listener_port_message -> preference-set -> ' + obj.name + ' =', obj.value)

            if (local.preference[obj.name] === undefined) {
                // this preference does not exist
                break
            } // if

            if (local.preference[obj.name] === obj.value) {
                // this preference has not changed
                break
            } // if

            // save preference
            local.preference[obj.name] = obj.value

            // save preference to storage
            await preference_to_storage(obj.name)

            if (obj.name === 'icon_color' || obj.name === 'browser_is_dark') {
                await icon_set()
            } // if

            // send updated preference to all ports except the port that messaged us
            port_message_all_except(port, {
                'subject': 'preference-set',
                'name'   : obj.name,
                'value'  : obj.value
            })

            if (obj.name ==='icon_color') {
                port_message_all_except(port, {
                    'subject': 'icon',
                    'icon': local.preference.icon_color
                })
            } // if

            if (obj.name === 'theme') {
                port_message_all_except(port, {
                    'subject': 'theme',
                    'theme': local.preference.theme
                })
            } // if

            break
        case 'tool-bookmark-history-clear':
            log('listener_port_message -> tool-bookmark-history-clear', obj.activity)

            // delay one second so humans might notice the "Processing" button in the "Bookmark History" area of the tools page
            // the delay also makes the history clearing process feel more natural and less twitchy
            await delay(1000)

            await tool_bookmark_history_clear(obj.activity) // will clear history, save to storage, and notify all open pages of the change

            break
        case 'tool-duplicate-bookmarks-remove':
            log('listener_port_message -> tool-duplicate-bookmarks-remove', obj.bookmarks)

            // delay one second so humans might notice the "Processing" button in the "Duplicate Bookmarks" area of the tools page
            // the delay also makes the duplicate removal process feel more natural and less twitchy
            await delay(1000)

            // fudge last_time.refresh_about so we do not send a immediate "refresh-about" message for the first removed bookmark
            // fudging the time may also allow us to complete all our work before it comes time to send the next "refresh-about" message
            local.last_time.refresh_about = Date.now() + 1000 // 1 second from now

            // fudge last_time.refresh_tools so we do not send a immediate "refresh-tools" message for the first removed bookmark
            // fudging the time may also allow us to complete all our work before it comes time to send the next "refresh-tools" message
            local.last_time.refresh_tools = Date.now() + 1000 // 1 second from now

            await tool_duplicate_bookmarks_remove(obj.bookmarks)

            await refresh_about(true)
            await refresh_tools(true)

            port.postMessage({
                'subject': 'tool-duplicate-bookmarks-removed'
            })

            break
        case 'tool-empty-folders-remove':
            log('listener_port_message -> tool-empty-folders-remove', obj.folders)

            // delay one second so humans might notice the "Processing" button in the "Empty Folders" area of the tools page
            // the delay also makes the folder removal process feel more natural and less twitchy
            await delay(1000)

            // fudge last_time.refresh_about so we do not send a immediate "refresh-about" message for the first removed folder
            // fudging the time may also allow us to complete all our work before it comes time to send the next "refresh-about" message
            local.last_time.refresh_about = Date.now() + 1000 // 1 second from now

            // fudge last_time.refresh_tools so we do not send a immediate "refresh-tools" message for the first removed folder
            // fudging the time may also allow us to complete all our work before it comes time to send the next "refresh-tools" message
            local.last_time.refresh_tools = Date.now() + 1000 // 1 second from now

            await tool_empty_folders_remove(obj.folders)

            await refresh_about(true)
            await refresh_tools(true)

            port.postMessage({
                'subject': 'tool-empty-folders-removed'
            })

            break
        case 'tool-similar-bookmarks-remove':
            log('listener_port_message -> tool-similar-bookmarks-remove', obj.bookmarks)

            // delay one second so humans might notice the "Processing" button in the "Similar Bookmarks" area of the tools page
            // the delay also makes the bookmark removal process feel more natural and less twitchy
            await delay(1000)

            // fudge last_time.refresh_about so we do not send a immediate "refresh-about" message for the first removed bookmark
            // fudging the time may also allow us to complete all our work before it comes time to send the next "refresh-about" message
            local.last_time.refresh_about = Date.now() + 1000 // 1 second from now

            // fudge last_time.refresh_tools so we do not send a immediate "refresh-tools" message for the first removed bookmark
            // fudging the time may also allow us to complete all our work before it comes time to send the next "refresh-tools" message
            local.last_time.refresh_tools = Date.now() + 1000 // 1 second from now

            await tool_similar_bookmarks_remove(obj.bookmarks)

            await refresh_about(true)
            await refresh_tools(true)

            port.postMessage({
                'subject': 'tool-similar-bookmarks-removed'
            })

            break
        default:
            log('listener_port_message -> unknown obj.subject', obj)

            break
    } // switch
} // listener_port_message

const listener_react_to_changes = local.function.listener_react_to_changes = function listener_react_to_changes() {
    /*
    Figure out if listeners that react to changes, should be allowed to run right now.

    @return  {Boolean}  True or false.
    */

    const result = (
        local.option.automatic_sorting === true &&
        local.status.import_active === false &&
        local.status.listeners_active === true &&
        local.status.resort_active === false
    )

    return result
} // listener_react_to_changes

const listener_service_worker_install = local.function.listener_service_worker_install = function listener_service_worker_install(event) {
    /*
    Listener for service worker install events.

    @param  {Object}  event  Object with a type property that should be "install".
    */

    log('listener_service_worker_install -> event.type ->', event.type)

    self.skipWaiting() // a promise we do not need to wait for

    log('listener_service_worker_install -> skipped waiting')
} // listener_service_worker_install

const locale_compare = local.function.locale_compare = new Intl.Collator('en-US', {
    caseFirst: 'upper',
    ignorePunctuation: false,
    localeMatcher: 'best fit',
    numeric: true,
    sensitivity: 'variant',
    usage: 'sort'
}).compare // alias function

const option_set_sync_if_needed = local.function.option_set_sync_if_needed = async function option_set_sync_if_needed(obj) {
    /*
    Figure out if a user visible select or checkbox choice should also affect its corresponding option and if yes, message all ports with the updated corresponding option.

    @param  {Object}  obj  Object like {name:'bookmarks_bar',value:true}
    */

    let option_changed = false
    let property = ''

    if (obj.name.slice(-5) === '_sort') {
        // sort option which displays as a select for users

        property = obj.name.slice(0, -5) // remove "_sort" to find the boolean which displays as a checkbox for users

        if (obj.value === '' && local.option[property] === true) {
            // turn off this boolean since the user selected no sorting
            local.option[property] = false

            option_changed = true
        } else if (obj.value !== '' && local.option[property] === false) {
            // turn on this boolean since the user selected a specific sort order
            local.option[property] = true

            option_changed = true
        } // if
    } else {
        // an option which may have a corresponding "_sort" option
        property = obj.name + '_sort'

        if (local.option[property] !== undefined) {
            // sort option which displays as a checkbox for users

            if (obj.value === true && local.option[property] === '') {
                // set default sort
                local.option[property] = 'alpha'

                option_changed = true
            } else if (obj.value === false && local.option[property] !== '') {
                // remove sort
                local.option[property] = ''

                option_changed = true
            } // if
        } // if
    } // if

    if (option_changed === true) {
        // save option to storage
        await option_to_storage(property)

        log('option_set_sync_if_needed -> set option -> ' + property + ' =', local.option[property])

        port_message_all({
            'subject': 'option-set',
            'name'   : property,
            'value'  : local.option[property]
        })
    } // if
} // option_set_sync_if_needed

const option_to_storage = local.function.option_to_storage = async function option_to_storage(property) {
    /*
    Save a single local option to storage.

    @param  {String}  property  Property name like 'automatic_sorting'.
    */

    await storage_set({
        ['option_' + property]: local.option[property]
    })
} // option_to_storage

const options_from_storage = local.function.options_from_storage = async function options_from_storage() {
    /*
    Set local options using values from storage, if any.
    */

    for (const property in local.option) {
        const current_option = local.option[property]

        switch(typeof current_option) {
            case 'boolean':
                // historically, options may have been saved as '1' or true
                // use a double equal to check and then set true or false as needed
                local.option[property] = (await storage_get('option_' + property) == 1) ? true : false
                break
            case 'number':
                local.option[property] = parse_integer(await storage_get('option_' + property)) || current_option
                break
            case 'string':
                local.option[property] = await storage_get('option_' + property) || current_option
                break
        } // switch
    } // for
} // options_from_storage

const port_message_all = local.function.port_message_all = function port_message_all(obj) {
    /*
    Send an object to all connected ports.

    @param  {Object}  obj  An object.
    */

    for (let i = 0; i < local.port.length; i++) {
        local.port[i].postMessage(obj)
    } // for
} // port_message_all

const port_message_all_except = local.function.port_message_all_except = function port_message_all_except(port, obj) {
    /*
    Send an object to all connected ports except one.

    @param  {Object}  port  A port object that should not have anything sent to it.
    @param  {Object}  obj   An object to send.
    */

    for (let i = 0; i < local.port.length; i++) {
        if (local.port[i] !== port) {
            local.port[i].postMessage(obj)
        } // if
    } // for
} // port_message_all_except

const preference_to_storage = local.function.preference_to_storage = async function preference_to_storage(property) {
    /*
    Save a single local preference to storage.

    @param  {String}  property  Property name like 'theme'.
    */

    await storage_set({
        ['preference_' + property]: local.preference[property]
    })
} // preference_to_storage

const preferences_from_storage = local.function.preferences_from_storage = async function preferences_from_storage() {
    /*
    Set local preferences using values from storage, if any.
    */

    for (const property in local.preference) {
        const current_preference = local.preference[property]

        switch(typeof current_preference) {
            case 'string':
                local.preference[property] = await storage_get('preference_' + property) || current_preference
                break
        } // switch
    } // for
} // preferences_from_storage

const refresh_about = local.function.refresh_about = async function refresh_about(force) {
    /*
    Send a "refresh-about" message to any connected about page. Throttle messaging so messages will not be sent more than twice a second. Override throttling with the force parameter.

    @param  {Boolean}  [force]  Optional. If true, ignore any throttling and force a refresh. Defaults to false.
    */

    force = force || false

    clearTimeout(local.timer.refresh_about)

    const about_connected = local.port.some(port => port.name === 'about')

    if (about_connected === false) {
        return 'early'
    } // if

    const now = Date.now()

    if (force === false && now < (local.last_time.refresh_about + 500)) {
        // not enough time has passed since we last notified any about page to refresh
        // log('refresh_about -> not enough time has passed, will try again in 100 ms')

        // try again in 0.1 seconds
        local.timer.refresh_about = setTimeout(refresh_about, 100)

        return 'early'
    } // if

    // save the current time for throttling purposes
    local.last_time.refresh_about = now

    const tree = await bookmark_get_tree()

    const bookmark_hashes = await bookmark_get_hashes(tree)

    for (let index = 0; index < local.port.length; index++) {
        const port = local.port[index]

        if (port.name === 'about') {
            // send a message to this about page
            port.postMessage({
                'subject': 'refresh-about',
                'bookmark_hashes': bookmark_hashes
            })
        } // if
    } // for
} // refresh_about

const refresh_tools = local.function.refresh_tools = async function refresh_tools(force) {
    /*
    Send a "refresh-tools" message to any connected tools page. Throttle messaging so messages will not be sent more than twice a second. Override throttling with the force parameter.

    @param  {Boolean}  [force]  Optional. If true, ignore any throttling and force a refresh. Defaults to false.
    */

    force = force || false

    clearTimeout(local.timer.refresh_tools)

    const tools_connected = local.port.some(port => port.name === 'tools')

    if (tools_connected === false) {
        return 'early'
    } // if

    const now = Date.now()

    if (force === false && now < (local.last_time.refresh_tools + 500)) {
        // not enough time has passed since we last notified any tools page to refresh
        // log('refresh_tools -> not enough time has passed, will try again in 100 ms')

        // try again in 0.1 seconds
        local.timer.refresh_tools = setTimeout(refresh_tools, 100)

        return 'early'
    } // if

    // save the current time for throttling purposes
    local.last_time.refresh_tools = now

    const tree = await bookmark_get_tree()

    const duplicate_bookmarks = await tool_duplicate_bookmarks_find(tree)

    const empty_folders = await tool_empty_folders_find(tree)

    const similar_bookmarks = await tool_similar_bookmarks_find(tree)

    for (let index = 0; index < local.port.length; index++) {
        const port = local.port[index]

        if (port.name === 'tools') {
            // send a message to this tools page
            port.postMessage({
                'subject'            : 'refresh-tools',
                'bookmark_history'   : local.tool.bookmark_history,
                'duplicate_bookmarks': duplicate_bookmarks,
                'empty_folders'      : empty_folders,
                'similar_bookmarks'  : similar_bookmarks
            })
        } // if
    } // for
} // refresh_tools

const show_extension_page_if_needed = local.function.show_extension_page_if_needed = async function show_extension_page_if_needed() {
    /*
    Open an extension page, if needed.
    */

    if (local.setting.show_extension === true) {
        local.setting.show_extension = false

        await extension_page()
    } // if
} // show_extension_page_if_needed

const show_message_relayed = local.function.show_message_relayed = function show_message_relayed() {
    /*
    Set all local.setting.show_message properties to false, if needed.
    */

    for (const property in local.setting.show_message) {
        if (local.setting.show_message[property] === true) {
            // set property to false since a client page has already received this information from a port.postMessage call
            local.setting.show_message[property] = false
        } // if
    } // for
} // show_message_relayed

const start = local.function.start = async function start() {
    /*
    Start Sprucemarks.
    */

    if (local.status.sprucemarks_active) {
        return 'early'
    } // if

    local.status.sprucemarks_active = true

    await shared_start() // from shared.js

    url_setup()

    await install_or_upgrade()

    await bookmark_ancestors() // will call bookmark_find_ancestors(), bookmark_ancestors_to_options(), and options_from_storage()

    await preferences_from_storage()

    await tool_bookmark_history_from_storage()

    await icon_set()

    await badge_set()

    add_listeners()

    await bookmark_resort() // sort all bookmarks

    await show_extension_page_if_needed()

    local.status.start_done = true

    log('start -> done')
} // start

const start_done = local.function.start_done = function start_done() {
    /*
    Wait until the "start" function is done before returning.

    @return  {Promise}
    */

    if (local.status.start_done === true) {
        return 'early'
    } // if

    let timer = '' // will become a setInterval timer that will be cleared after we no longer need it

    let count = 0 // keep track of how many times we have checked to see if the "start" function is done

    return new Promise(function(resolve, reject) {
        // check every every 5 milliseconds to see if the "start" function is done
        timer = setInterval(function() {
            count++

            if (local.status.start_done === true) {
                clearInterval(timer)

                resolve()
            } else if (count > 25000) { // 25 seconds
                // start should have finished a long time ago
                clearInterval(timer)

                reject('timeout waiting for start')
            } // if
        }, 5)
    }) // promise
} // start_done

const storage_get = local.function.storage_get = async function storage_get(key) {
    /*
    Get a value from storage by providing a named key.

    @param   {String}  key  String like "option_group_folders".
    @return  {*}            Boolean, Object, Number or String.
    */

    const obj = await browser.storage.local.get(key)

    return obj[key] // this may return undefined since we are asking for a key that may not exist
} // storage_get

const storage_remove = local.function.storage_remove = async function storage_remove(key) {
    /*
    Remove an object from storage by providing a named key.

    @param  {String}  key  String like "option_defunct".
    */

    await browser.storage.local.remove(key)
} // storage_remove

const storage_set = local.function.storage_set = async function storage_set(obj) {
    /*
    Save an object to storage.

    @param  {Object}  obj  Object like {version:0}
    */

    await browser.storage.local.set(obj)
} // storage_set

const test = local.function.test = async function test() {
    /*
    Run all tests.
    */

    try {
        for (const property in local.test) {
            try {
                await local.test[property]()
            } catch (error) {
                console.warn('test -> error in local.test.' + property)
                throw error
            } // try
        } // for

        const number_of_tests = Object.keys(local.test).length

        console.log('test -> all ' + number_of_tests + ' tests passed')
    } catch (error) {
        console.error(error)
    } // try
} // test

const tool_bookmark_history_clear = local.function.tool_bookmark_history_clear = async function tool_bookmark_history_clear(activity='all') {
    /*
    Clear all or just one type of bookmark activity. Also send the updated bookmark_history object to all ports.

    @param  {String}  activity  Activity to clear like "all", "added", "modified", or "removed".
    */

    if (activity === 'all') {
        local.tool.bookmark_history = []
    } else {
        local.tool.bookmark_history = local.tool.bookmark_history.filter(bookmark => bookmark.activity !== activity)
    } // if

    await tool_bookmark_history_to_storage()

    port_message_all({
        'subject' : 'tool-bookmark-history',
        'bookmark_history': local.tool.bookmark_history
    })
} // tool_bookmark_history_clear

const tool_bookmark_history_from_storage = local.function.tool_bookmark_history_from_storage = async function tool_bookmark_history_from_storage() {
    /*
    Load tool.bookmark_history from storage, if possible.
    */

    local.tool.bookmark_history = await storage_get('bookmark_history') || []

    tool_bookmark_history_trim()
} // tool_bookmark_history_from_storage

const tool_bookmark_history_log = local.function.tool_bookmark_history_log = async function tool_bookmark_history_log(activity, children, id, parent_id, title, type, url) {
    /*
    Log bookmark events to tool.bookmark_history and then save those events to storage.

    @param  {String}  activity     Activity like "added", "modified", or "removed".
    @param  {Object}  [children]   Optional. Array of child bookmark objects that were affected by the same activity. Each child bookmark object can have its own array of child bookmark objects to represent a tree structure of bookmarks. This object should be available in Chromium browsers when a folder with bookmarks is removed. Firefox does not seem to provide this information when a folder with bookmarks is removed.
    @param  {String}  id           Bookmark ID.
    @param  {String}  [parent_id]  Optional. Bookmark Parent ID.
    @param  {String}  title        Bookmark title.
    @param  {String}  [type]       Optional. String like "bookmark", "folder", or "separator". Only provided by Firefox.
    @param  {String}  url          Bookmark URL.
    */

    const location = await bookmark_get_location(id, parent_id)

    const when = parse_integer(Date.now().toString().slice(0, -3) + '000') // drop the last three digits of precision

    if (Array.isArray(children)) {
        // create individual history events from bookmark tree structure

        function recurse(bookmarks, path) {
            for (const bookmark of bookmarks) {
                if (Array.isArray(bookmark.children)) {
                    recurse(bookmark.children, path + '/' + bookmark.title)
                } // if

                const bookmark_type = (bookmark.url === undefined) ? 'folder' : 'bookmark'

                local.tool.bookmark_history.push({
                    activity: activity,
                    id      : bookmark.id,
                    location: path,
                    title   : bookmark.title,
                    type    : bookmark_type,
                    url     : bookmark.url,
                    when    : when
                })
            } // for
        } // recurse

        recurse(children, location + '/' + title)
    } // if

    if (type === 'bookmark' || type === 'folder') {
        // firefox provided a valid type for the current bookmark event
    } else {
        // in Chromium browsers, type will be undefined here
        // in Firefox, type may be undefined or "separator" here
        type = (url === undefined) ? 'folder' : 'bookmark'
    } // if

    local.tool.bookmark_history.push({
        activity: activity,
        id      : id,
        location: location,
        title   : title,
        type    : type,
        url     : url,
        when    : when
    })

    await tool_bookmark_history_to_storage()
} // tool_bookmark_history_log

const tool_bookmark_history_to_storage = local.function.tool_bookmark_history_to_storage = async function tool_bookmark_history_to_storage() {
    /*
    Save tool.bookmark_history to storage.
    */

    tool_bookmark_history_trim()

    await storage_set({
        'bookmark_history': local.tool.bookmark_history
    })
} // tool_bookmark_history_to_storage

const tool_bookmark_history_trim = local.function.tool_bookmark_history_trim = function tool_bookmark_history_trim() {
    /*
    Trim the tool.bookmark_history array so it only has events from the last four days. Also trim the array if it has more than 1000 events.
    */

    const four_days_ago = Date.now() - (1000 * 60 * 60 * 24 * 4)

    const trim_needed = local.tool.bookmark_history.some(bookmark => bookmark.when < four_days_ago)

    if (trim_needed) {
        local.tool.bookmark_history = local.tool.bookmark_history.filter(bookmark => bookmark.when > four_days_ago)
    } // if

    if (local.tool.bookmark_history.length > 1000) {
        // trim history to one-thousand of the most recent events
        local.tool.bookmark_history = local.tool.bookmark_history.slice(-1000)
    } // if
} // tool_bookmark_history_trim

const tool_duplicate_bookmarks_find = local.function.tool_duplicate_bookmarks_find = async function tool_duplicate_bookmarks_find(tree) {
    /*
    Find bookmarks that have the exact same URL by searching the entire bookmark tree.

    @param   {Object}  [tree]  Optional. A BookmarkTreeNode object.
        https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/BookmarkTreeNode
    @return  {Object}          Object with zero or more properties, each of which with an array of two or more bookmarks that share the exact same URL.
    {
        'url:' [
            { id: '...', location: '...', title: '...', type: 'bookmark', url: '...', when: 123 },
            { id: '...', location: '...', title: '...', type: 'bookmark', url: '...', when: 123 }
        ]
    }
    */

    tree = tree || await bookmark_get_tree()

    let result = {} // default result

    const urls = { // keep track of every url seen when examining the entire bookmark tree in order to detect when a url has been seen two or more times
        // 'https://twitter.com': true
    } // urls

    const duplicate_urls = [] // keep track of which urls have been seen two times or more

    const duplicate_bookmarks = {
        /*
        'url': [
            { id: '...', location: '...', title: '...', type: 'bookmark', url: '...', when: 123 },
            { id: '...', location: '...', title: '...', type: 'bookmark', url: '...', when: 123 },
        ]
        */
    } // duplicate_bookmarks

    function find_duplicate_urls(bookmark) {
        /*
        Recursively note every bookmark URL by adding that URL to the "urls" object and once a duplicate is found, append that URL to the "duplicate_urls" array.

        @param  {Array}  bookmark  Bookmark object.
        */

        if (shared.browser.firefox && bookmark.type === 'separator') {
            // ignore bookmark separators
            return 'early'
        } // if

        if (bookmark.children === undefined) {
            // regular bookmark, not a folder
            if (urls[bookmark.url] === undefined) {
                // make a note of this new url
                urls[bookmark.url] = true
            } else {
                // this url has already been seen so we have detected a duplicate
                duplicate_urls.push(bookmark.url)
            } // if
        } else if (bookmark.children.length === 0) {
            // bookmark folder with no children
        } else {
            // bookmark folder with children

            for (let index = 0; index < bookmark.children.length; index++) {
                // recurse
                find_duplicate_urls(bookmark.children[index])
            } // for
        } // if
    } // find_duplicate_urls

    // loop through ancestors and when children bookmarks or folders exist, call find_duplicate_urls() for each of those children
    for (let index = 0; index < tree.children.length; index++) {
        const ancestor = tree.children[index]
        const ancestor_title = ancestor.title.toLowerCase().replace(/ /g, '_')

        if (bookmark_ancestor_ignore(ancestor_title)) {
            continue
        } // if

        if (ancestor.children.length === 0) {
            // log('tool_duplicate_bookmarks_find -> ignoring empty ancestor')
            continue
        } // if

        find_duplicate_urls(ancestor)
    } // for

    // log('tool_duplicate_bookmarks_find -> urls', urls)
    // log('tool_duplicate_bookmarks_find -> duplicate_urls', duplicate_urls)

    if (duplicate_urls.length === 0) {
        log('tool_duplicate_bookmarks_find -> no duplicate bookmarks')
        return duplicate_bookmarks // return an empty object
    } // if

    function note_duplicate_urls(bookmark, path) {
        /*
        Recursively add bookmark information to the "duplicate_bookmarks" object when a bookmark URL for an actual bookmark matches a URL in the "duplicate_urls" array.

        @param  {Array}   bookmark  Bookmark object.
        @param  {String}  [path]    Optional. Path to the current bookmark object.
        */

        path = path || ''

        if (shared.browser.firefox && bookmark.type === 'separator') {
            // ignore bookmark separators
            return 'early'
        } // if

        if (bookmark.children === undefined) {
            // regular bookmark, not a folder

            if (duplicate_urls.indexOf(bookmark.url) >= 0) {
                // a bookmark with a duplicate URL

                const url_replace = bookmark.url.replace(/^https?:\/\//i, '').replace(/\/$/, '') // remove http(s) prefix and trailing slash

                if (duplicate_bookmarks[url_replace] === undefined) {
                    // create empty array for duplicate bookmarks
                    duplicate_bookmarks[url_replace] = []
                } // if

                // add duplicate bookmark
                duplicate_bookmarks[url_replace].push({
                    id      : bookmark.id,
                    location: path,
                    title   : bookmark.title,
                    type    : 'bookmark',
                    url     : bookmark.url,
                    when    : bookmark.dateAdded
                })
            } // if
        } else if (bookmark.children.length === 0) {
            // bookmark folder with no children
        } else {
            // bookmark folder with children

            if (path === '') {
                path += bookmark.title
            } else {
                path += '/' + bookmark.title
            } // if

            for (let index = 0; index < bookmark.children.length; index++) {
                // recurse
                note_duplicate_urls(bookmark.children[index], path)
            } // for
        } // if
    } // note_duplicate_urls

    // loop through ancestors and when children bookmarks or folders exist, call note_duplicate_urls() for each of those children
    for (let index = 0; index < tree.children.length; index++) {
        const ancestor = tree.children[index]
        const ancestor_title = ancestor.title.toLowerCase().replace(/ /g, '_')

        if (bookmark_ancestor_ignore(ancestor_title)) {
            continue
        } // if

        if (ancestor.children.length === 0) {
            // log('tool_duplicate_bookmarks_find -> ignoring empty ancestor')
            continue
        } // if

        note_duplicate_urls(ancestor)
    } // for

    // log('tool_duplicate_bookmarks_find -> duplicate_bookmarks', duplicate_bookmarks)

    return duplicate_bookmarks
} // tool_duplicate_bookmarks_find

const tool_duplicate_bookmarks_remove = local.function.tool_duplicate_bookmarks_remove = async function tool_duplicate_bookmarks_remove(bookmarks) {
    /*
    Remove bookmarks for the "Duplicate Bookmarks" tool.

    @param  {Object}  bookmarks  Array of bookmark IDs to remove like ['10', '11']
    */

    for (const id of bookmarks) {
        await bookmark_remove(id)
    } // for
} // tool_duplicate_bookmarks_remove

const tool_empty_folders_find = local.function.tool_empty_folders_find = async function tool_empty_folders_find(tree) {
    /*
    Find empty bookmark folders by searching the entire bookmark tree.

    @param   {Object}  [tree]  Optional. A BookmarkTreeNode object.
        https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/BookmarkTreeNode
    @return  {Object}          Object with zero or more empty bookmark folders like { 'id': { id: '...', location: '...', title: '...', type: 'folder', when: 123 } }
    */

    tree = tree || await bookmark_get_tree()

    const empty_folders = {
        // 'id': { id: '...', location: '...', title: '...', type: 'folder', when: 123 }
    } // empty_folders

    function find_empty(bookmark, path) {
        /*
        Recursively find and add empty bookmark folders to the "empty_folders" object.

        @param  {Array}   bookmark   Bookmark object.
        @param  {String}  [path]     Optional. Path to the current bookmark object.
        */

        path = path || ''

        if (bookmark.children === undefined) {
            // regular bookmark, not a folder
        } else if (bookmark.children.length === 0) {
            // bookmark folder with no children

            if (path === '') {
                // bookmark ancestor like 'Bookmarks Bar' or 'Other Bookmarks' which is ok to be empty
            } else {
                empty_folders[bookmark.id] = {
                    id      : bookmark.id,
                    location: path,
                    title   : bookmark.title,
                    type    : 'folder',
                    when    : bookmark.dateAdded
                }
            } // if
        } else {
            // bookmark folder with children

            if (path === '') {
                path += bookmark.title
            } else {
                path += '/' + bookmark.title
            } // if

            for (let index = 0; index < bookmark.children.length; index++) {
                // recurse to find all empty folders
                find_empty(bookmark.children[index], path)
            } // for
        } // if
    } // find_empty

    for (let index = 0; index < tree.children.length; index++) {
        const ancestor = tree.children[index]
        const ancestor_title = ancestor.title.toLowerCase().replace(/ /g, '_')

        if (bookmark_ancestor_ignore(ancestor_title)) {
            continue
        } // if

        if (ancestor.children.length === 0) {
            log('tool_empty_folders_find -> ignoring empty ancestor')
            continue
        } // if

        find_empty(ancestor)
    } // for

    if (Object.keys(empty_folders).length === 0) {
        log('tool_empty_folders_find -> no empty folders')
    } // if

    return empty_folders
} // tool_empty_folders_find

const tool_empty_folders_remove = local.function.tool_empty_folders_remove = async function tool_empty_folders_remove(folders) {
    /*
    Remove folders that are empty, after confirming the requested bookmark IDs are indeed empty bookmark folders.

    @param  {Object}  folders  Array of folder IDs to remove like ['10', '11']
    */

    if (Array.isArray(folders) === false) {
        return 'early'
    } // if

    if (folders.length === 0) {
        return 'early'
    } // if

    const ancestors = Object.values(local.ancestor)

    for (let index = 0; index < folders.length; index++) {
        if (typeof folders[index] !== 'string') {
            // oops, folders[index] is not a string
            log('tool_empty_folders_remove -> oops, folders[index] is not a string')
            continue
        } // if

        if (folders[index] === bookmark_root()) {
            // oops, bookmark is the root folder which should never be modified
            log('tool_empty_folders_remove -> oops, bookmark is the root folder which should never be modified')
            continue
        } // if

        const bookmark = await bookmark_get(folders[index])
        const children = await bookmark_get_children(folders[index]) || [] // array of bookmark objects or empty array

        if (bookmark === undefined) {
            // oops, this bookmark no longer exists
            log('tool_empty_folders_remove -> oops, bookmark no longer exists')
            continue
        } // if

        if (ancestors.indexOf(bookmark.id) >= 0) {
            // oops, this is an ancestor folder which should never be modified
            log('tool_empty_folders_remove -> oops, bookmark is an ancestor folder which should never be modified')
            continue
        } // if

        if (bookmark.url !== undefined) {
            // oops, this is a regular bookmark and not a folder
            log('tool_empty_folders_remove -> oops, bookmark is a regular bookmark and not a folder')
            continue
        } // if

        if (children.length > 0) {
            // oops, this bookmark folder has bookmarks in it
            log('tool_empty_folders_remove -> oops, bookmark folder has bookmarks in it')
            continue
        } // if

        // remove this empty bookmark folder
        await bookmark_remove(bookmark.id)
    } // for
} // tool_empty_folders_remove

const tool_similar_bookmarks_find = local.function.tool_similar_bookmarks_find = async function tool_similar_bookmarks_find(tree) {
    /*
    Find bookmarks that have similar URLs by searching the entire bookmark tree.

    @param   {Object}  [tree]  Optional. A BookmarkTreeNode object.
        https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/BookmarkTreeNode
    @return  {Object}          Object with zero or more properties. Each property an array of two or more bookmarks that share a similar URL.
    {
        'url:' [
            { id: '...', location: '...', title: '...', type: 'bookmark', url: '...', when: 123 },
            { id: '...', location: '...', title: '...', type: 'bookmark', url: '...', when: 123 }
        ]
    }
    */

    //-----------
    // Variables
    //-----------
    tree = tree || await bookmark_get_tree()

    let domain_path_urls = { // keep track of every URL seen for a domain + path when examining the entire bookmark tree
        // 'domain/path': ['url', 'url']
    } // domain_path_urls

    let result = {} // default return result

    const similar_bookmarks = {}

    const similar_urls = {
        // 'domain/path': ['url', 'url']
    } // similar_urls

    let similar_urls_list = [] // simpler list of urls added to the similar_urls object in order to enable easier searching

    //-----------
    // Functions
    //-----------
    function find_domain_path_urls(bookmark) {
        /*
        Recursively figure out all the domain + path properties and URLs belonging to those properties by appending that information to the "domain_path_urls" object.

        @param  {Array}  bookmark  Bookmark object.
        */

        if (shared.browser.firefox && bookmark.type === 'separator') {
            // ignore bookmark separators
            return 'early'
        } // if

        if (bookmark.children === undefined) {
            // regular bookmark, not a folder

            try {
                const bookmark_url = new URL(bookmark.url)

                const domain_path = bookmark_url.hostname + (bookmark_url.pathname.toLowerCase().replace(/\/+$/, '')) // lowercase and then remove trailing slashes

                if (domain_path_urls[domain_path] === undefined) {
                    // create an empty array for this new domain path
                    domain_path_urls[domain_path] = []
                } // if

                if (domain_path_urls[domain_path].indexOf(bookmark.url) >= 0) {
                    // exact URL match found
                    // ignore this URL since it will show up in the duplicate bookmarks tool
                } else {
                    // unique url detected
                    domain_path_urls[domain_path].push(bookmark.url)
                } // if
            } catch (error) {
                // could not parse this URL so ignore it
            } // try
        } else if (bookmark.children.length === 0) {
            // bookmark folder with no children
        } else {
            // bookmark folder with children

            for (let index = 0; index < bookmark.children.length; index++) {
                // recurse
                find_domain_path_urls(bookmark.children[index])
            } // for
        } // if
    } // find_domain_path_urls

    function note_similar_urls(bookmark, path) {
        /*
        Recursively add bookmark information to the "similar_bookmarks" object when a bookmark URL for an actual bookmark is similar to a URL in the "similar_urls" object.

        @param  {Array}   bookmark  Bookmark object.
        @param  {String}  [path]    Optional. Path to the current bookmark object.
        */

        path = path || ''

        if (shared.browser.firefox && bookmark.type === 'separator') {
            // ignore bookmark separators
            return 'early'
        } // if

        if (bookmark.children === undefined) {
            // regular bookmark, not a folder

            if (similar_urls_list.indexOf(bookmark.url) >= 0) {
                // a bookmark with a similar URL

                const bookmark_url = new URL(bookmark.url)

                const domain_path = bookmark_url.hostname + (bookmark_url.pathname.toLowerCase().replace(/\/+$/, '')) // lowercase and then remove trailing slashes

                for (const group in similar_urls[domain_path]) {
                    const urls = similar_urls[domain_path][group]

                    if (urls.indexOf(bookmark.url) >= 0) {
                        // we found the correct group so make a note of this bookmarks info

                        if (similar_bookmarks[domain_path] === undefined) {
                            similar_bookmarks[domain_path] = {}
                        } // if

                        if (similar_bookmarks[domain_path][group] === undefined) {
                            similar_bookmarks[domain_path][group] = []
                        } // if

                        similar_bookmarks[domain_path][group].push({
                            id      : bookmark.id,
                            location: path,
                            title   : bookmark.title,
                            type    : 'bookmark',
                            url     : bookmark.url,
                            when    : bookmark.dateAdded
                        })

                        break // out of for loop
                    } // if
                } // for
            } // if
        } else if (bookmark.children.length === 0) {
            // bookmark folder with no children
        } else {
            // bookmark folder with children

            if (path === '') {
                path += bookmark.title
            } else {
                path += '/' + bookmark.title
            } // if

            for (let index = 0; index < bookmark.children.length; index++) {
                // recurse
                note_similar_urls(bookmark.children[index], path)
            } // for
        } // if
    } // note_similar_urls

    function similar_urls_in_array(bookmark_url, urls) {
        /*
        Return an array of similar URLs from an array, if any.

        @param   {String}  bookmark_url  URL to check.
        @param   {Object}  urls          Array of URLs to check.
        @return  {Object}                Array with zero or more URLs that are similar to each other.
        */

        bookmark_url = new URL(bookmark_url)

        return urls.filter(function(url) {
            url = new URL(url)

            // similar bookmarks can have different hashes, different ports (if all ports are empty, 80, or 443), different protocols, different searches, and different search parameters

            // similar bookmarks can NOT have different usernames, different passwords, or different ports (if some or all ports are not empty, 80, or 443)

            if (bookmark_url.username !== url.username) {
                // this URLs should not be considered similar
                return false
            } // if

            if (bookmark_url.password !== url.password) {
                // these URLs should not be considered similar
                return false
            } // if

            if (bookmark_url.port !== url.port) {
                // examine ports in more detail
                const bookmark_url_standard = (bookmark_url.port === '' || bookmark_url.port === '80' || bookmark_url.port === '443')

                const url_standard = (url.port === '' || url.port === '80' || url.port === '443')

                if (bookmark_url_standard === false && url_standard === false) {
                    // these URLs should not be considered similar since they are both using non standard ports and their port numbers are different
                    return false
                } else if (bookmark_url_standard === false || url_standard === false) {
                    // these URLs should not be considered similar since one of them is using non standard ports and their port numbers are different
                    return false
                } // if
            } // if

            return true
        })
    } // similar_urls_in_array

    //-------
    // Logic
    //-------

    // loop through ancestors and when children bookmarks or folders exist, call find_domain_path_urls() for each of those children
    for (let index = 0; index < tree.children.length; index++) {
        const ancestor = tree.children[index]
        const ancestor_title = ancestor.title.toLowerCase().replace(/ /g, '_')

        if (bookmark_ancestor_ignore(ancestor_title)) {
            continue
        } // if

        if (ancestor.children.length === 0) {
            // log('tool_similar_bookmarks_find -> ignoring empty ancestor')
            continue
        } // if

        find_domain_path_urls(ancestor)
    } // for

    // cleanup the "domain_path_urls" object by removing any property that has less than two URLs
    for (const property in domain_path_urls) {
        if (domain_path_urls[property].length < 2) {
            // remove any property without two or more similar bookmarks
            delete domain_path_urls[property]
        } // if
    } // for

    // figure out if URLs are similar to each other and if yes, populate the "similar_urls" object with url groups under each domain path
    for (const property in domain_path_urls) {
        const urls = domain_path_urls[property]

        let group_count = 0 // will increment to keep unique groups of similar bookmarks separate

        for (const url of urls) {
            const matches = similar_urls_in_array(url, urls)

            if (matches.length >= 2) {
                // similar urls detected
                group_count += 1

                if (similar_urls[property] === undefined) {
                    similar_urls[property] = {}
                } // if

                let save_matches = true // default

                for (const group in similar_urls[property]) {
                    if (matches.toString() === similar_urls[property][group].toString()) {
                        // we have already saved these matches
                        save_matches = false
                    } // if
                } // for

                if (save_matches === true) {
                    similar_urls[property][group_count] = matches

                    similar_urls_list = similar_urls_list.concat(matches)
                } // if
            } // if
        } // for
    } // for

    if (similar_urls_list.length === 0) {
        log('tool_similar_bookmarks_find -> no similar bookmarks')
        return similar_bookmarks // return an empty object
    } // if

    // loop through ancestors and when children bookmarks or folders exist, call note_similar_urls() for each of those children
    for (let index = 0; index < tree.children.length; index++) {
        const ancestor = tree.children[index]
        const ancestor_title = ancestor.title.toLowerCase().replace(/ /g, '_')

        if (bookmark_ancestor_ignore(ancestor_title)) {
            continue
        } // if

        if (ancestor.children.length === 0) {
            // log('tool_similar_bookmarks_find -> ignoring empty ancestor')
            continue
        } // if

        note_similar_urls(ancestor)
    } // for

    // log('tool_similar_bookmarks_find -> similar_bookmarks', similar_bookmarks)

    return similar_bookmarks
} // tool_similar_bookmarks_find

const tool_similar_bookmarks_remove = local.function.tool_similar_bookmarks_remove = async function tool_similar_bookmarks_remove(bookmarks) {
    /*
    Remove bookmarks for the "Similar Bookmarks" tool.

    @param  {Object}  bookmarks  Array of bookmark IDs to remove like ['10', '11']
    */

    for (const id of bookmarks) {
        await bookmark_remove(id)
    } // for
} // tool_similar_bookmarks_remove

const url_setup = local.function.url_setup = function url_setup() {
    /*
    Setup the local.url object.
    */

    const root = browser.runtime.getURL('/')

    // each of the following arrays list their elements in alpha order
    const themes = ['dark', 'light']
    const icons  = ['dark', 'green', 'light']
    const pages  = ['about', 'options', 'preferences', 'tools']

    for (const theme of themes) {
        local.url[theme] = {}

        for (const icon of icons) {
            local.url[theme][icon] = {}

            for (const page of pages) {
                local.url[theme][icon][page] = root + 'page/' + theme + '/' + icon + '/' + page + '.html'
            } // for
        } // for
    } // for
} // url_setup

const version_from_storage = local.function.version_from_storage = async function version_from_storage() {
    /*
    Return the last known version from storage or an empty string.

    @return  {String}  Version string like "2020.1.1.0" or ""
    */

    return await storage_get('version') || ''
} // version_from_storage

const version_less_than = local.function.version_less_than = function version_less_than(version, compare) {
    /*
    Compare version strings and return true if "version" is less than "compare".

    @param   {String}   version  Version string like "2020.1.1.0"
    @param   {String}   compare  Version string like "2020.1.1.0"
    @return  {Boolean}           True or False.
    */
    let outcome = false // default

    const versionArray = version.split('.').map(string => parse_integer(string))
    const compareArray = compare.split('.').map(string => parse_integer(string))

    const compareArrayLength = compareArray.length

    for (let index = 0; index < compareArrayLength; index++) {
        const version_number = versionArray[index]
        const compare_number = compareArray[index]

        if (version_number < compare_number) {
            outcome = true
            break // break for loop
        } else if (version_number > compare_number) {
            break // break for loop
        } // if

        // keep looping until we break out of the for loop or run out of array items to compare
    } // for

    return outcome
} // version_less_than

const version_to_storage = local.function.version_to_storage = async function version_to_storage() {
    /*
    Save the current Sprucemarks version to storage.
    */

    await storage_set({
        'version': local.version
    })
} // version_to_storage

//-----------
// Listeners
//-----------
// the listener below must be present during the initial evaluation of a service worker otherwise it will create an error in Chrome if you attempt to add the listener later via a function call
self.addEventListener('install', listener_service_worker_install)

//-------
// Start
//-------
start()