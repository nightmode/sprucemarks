'use strict'

//-------
// Notes
//-------
/*
    Functions in this file get added to local.test object in the background page.
    Run all tests by calling "await test()" in the background page.
    Tests cover the "local" object in "background.js" and the "shared" object in "shared.js".
*/

//-----------
// Functions
//-----------
local.test.ancestor = function test_ancestor() {
    /*
    The ancestor object should not be empty and each property should be a string.
    */

    expect(Object.keys(local.ancestor).length > 0,
        'Expected local.ancestor to have one or more properties.'
    )

    for (const property in local.ancestor) {
        const ancestor = local.ancestor[property]

        expect(typeof ancestor === 'string',
            'Expected local.ancestor.' + ancestor + ' to be a string.'
        )
    } // for
} // test_ancestor

local.test.function_add_listeners = function test_function_add_listeners() {
    /*
    Do not test add_listeners() since it should only run once on startup.
    */
} // test_function_add_listeners

local.test.function_badge_set = async function test_function_badge_set() {
    /*
    Make sure badge_set() does not return an error.
    */

    try {
        await badge_set()
    } catch (error) {
        throw error
    }
} // test_function_badge_set

local.test.function_bookmark_ancestor_ignore = function test_function_bookmark_ancestor_ignore() {
    /*
    Make sure bookmark_ancestor_ignore() returns the desired boolean.
    */

    const ancestors = {
        'bookmarks_bar'     : false,
        'imported_bookmarks': true,
        'speed_dials'       : true,
        'trash'             : true
    } // ancestors

    try {
        for (const property in ancestors) {
            expect(bookmark_ancestor_ignore(property) === ancestors[property],
                'Expected bookmark_ancestor_ignore("' + property + '") to return ' + ancestors[property].toString() + '.'
            )
        } // for
    } catch (error) {
        throw error
    } // try
} // test_function_bookmark_ancestor_ignore

local.test.function_bookmark_ancestors = async function test_function_bookmark_ancestors() {
    /*
    Make sure bookmark_ancestors() does not return an error.
    */

    try {
        await bookmark_ancestors()
    } catch (error) {
        throw error
    }
} // test_function_bookmark_ancestors

local.test.function_bookmark_ancestors_to_options = async function test_function_bookmark_ancestors_to_options() {
    /*
    Make sure bookmark_ancestors_to_options() creates ancestor options of the proper type and does not return an error.
    */

    try {
        await bookmark_ancestors_to_options()

        for (const property in local.ancestor) {
            const desired = {
                [property]              : 'boolean',
                [property + '_sort']    : 'string',
                [property + '_sub']     : 'boolean',
                [property + '_sub_sort']: 'string'
            } // desired

            for (const item in desired) {
                expect(typeof local.option[item] === desired[item],
                    'Expected local.option.' + item + ' type to be a ' + desired[item] + '.'
                )
            } // for
        } // for
    } catch (error) {
        throw error
    }
} // test_function_bookmark_ancestors_to_options

local.test.function_bookmark_compare = function test_function_bookmark_compare() {
    /*
    Do not test bookmark_compare() since it will return different results for differing user options and ancestor IDs.
    */
} // test_function_bookmark_compare

local.test.function_bookmark_find_ancestors = async function test_function_bookmark_find_ancestors() {
    /*
    Make sure bookmark_find_ancestors() does not return an error.
    */

    try {
        await bookmark_find_ancestors()
    } catch (error) {
        throw error
    }
} // test_function_bookmark_find_ancestors

local.test.function_bookmark_get = async function test_function_bookmark_get() {
    /*
    Make sure bookmark_get() returns a valid bookmark.
    */

    try {
        const bookmark_children = await bookmark_get_children(bookmark_root())
        const first_bookmark_id = bookmark_children[0].id
        const bookmark = await bookmark_get(first_bookmark_id)

        // example bookmark object
        /*
        {
            dateAdded        : 123,
            dateGroupModified: 123,  // only folders will have this
            id               : "1",
            index            : 123,
            parentId         : "0",
            title            : "abc",
            url              : "abc" // only bookmarks will have this, not folders
        }
        */

        expect(typeof bookmark.dateAdded === 'number')
        expect(typeof bookmark.id === 'string')
        expect(typeof bookmark.index === 'number')
        expect(typeof bookmark.parentId === 'string')
        expect(typeof bookmark.title === 'string')

        if (bookmark.dateGroupModified !== undefined) {
            // folder
            expect(typeof bookmark.dateGroupModified === 'number')
        } else if (bookmark.url !== undefined) {
            // bookmark
            expect(typeof bookmark.url === 'string')
        }
    } catch (error) {
        throw error
    }
} // test_function_bookmark_get

local.test.function_bookmark_get_ancestor_then_sort = function test_function_bookmark_get_ancestor_then_sort() {
    /*
    Do not test bookmark_get_ancestor_then_sort() since it may affect bookmarks.
    */
} // test_function_bookmark_get_ancestor_then_sort

local.test.function_bookmark_get_children = async function test_function_bookmark_get_children() {
    /*
    Make sure bookmark_get() returns an array of bookmark objects.
    */

    try {
        const root = bookmark_root()

        const bookmark_children = await bookmark_get_children(root)

        expect(Array.isArray(bookmark_children))
        expect(bookmark_children.length > 0)
        expect(bookmark_children[0].parentId === root)
    } catch (error) {
        throw error
    }
} // test_function_bookmark_get_children

local.test.function_bookmark_get_hashes = async function test_function_bookmark_get_hashes() {
    /*
    Make sure bookmark_get_hashes() returns an array with one or more strings.
    */

    try {
        const tree = await bookmark_get_tree()

        const hashes = await bookmark_get_hashes(tree) // array of strings

        expect(Array.isArray(hashes),
            'Expected hashes to be an array.'
        )

        expect(hashes.length > 0,
            'Expected hashes array to have one or more entries.'
        )

        for (const hash of hashes) {
            expect(typeof hash === 'string',
                'Expected each hash value to be a string.'
            )
        } // for
    } catch (error) {
        throw error
    }
} // test_function_bookmark_get_hashes

local.test.function_bookmark_get_location = async function test_function_bookmark_get_location() {
    /*
    Make sure bookmark_get_location() returns a valid path for the first available child bookmark of each bookmark ancestor. Also make sure the desired string is returned when a path can not be found.
    */

    try {
        for (const property in local.ancestor) {
            const children = await bookmark_get_children(local.ancestor[property])

            if (children.length > 0) {
                const bookmark = children[0]

                const path = await bookmark_get_location(bookmark.id, bookmark.parentId)

                const path_to_property = path.toLowerCase().replace(/ /g, '_')

                expect(path_to_property === property,
                    'Expected "' + path_to_property + '" to equal "' + property + '".'
                )
            } // if
        } // for

        const bookmark_id = Object.values(local.ancestor)[0]
        const parent_id = bookmark_root()

        const path = await bookmark_get_location(bookmark_id, parent_id)

        expect(path === '(not available)',
            'Expected path to be "(not available)".'
        )
    } catch (error) {
        throw error
    }
} // test_function_bookmark_get_location

local.test.function_bookmark_get_tree = async function test_function_bookmark_get_tree() {
    /*
    Make sure bookmark_get_tree() returns a bookmark tree object that starts with the root bookmark ID. Also make sure that one or more ancestor folders exist and that an ancestor ID can be found in local.ancestors object.
    */

    try {
        const tree = await bookmark_get_tree()

        expect(tree.id === bookmark_root(),
            'Expected tree.id to be the root bookmark.'
        )

        expect(Array.isArray(tree.children),
            'Expected tree.children to be an array.'
        )

        expect(tree.children.length > 0,
            'Expected tree.children to have one or more ancestor bookmarks.'
        )

        const ancestor_values = Object.values(local.ancestor)

        expect(ancestor_values.indexOf(tree.children[0].id) >= 0,
            'Expected to find the tree\'s first child bookmark ID in the local.ancestor object.'
        )
    } catch (error) {
        throw error
    }
} // test_function_bookmark_get_tree

local.test.function_bookmark_index_and_move = function test_function_bookmark_index_and_move() {
    /*
    Do not test bookmark_index_and_move() since it may affect bookmarks.
    */
} // test_function_bookmark_index_and_move

local.test.function_bookmark_move = function test_function_bookmark_move() {
    /*
    Do not test bookmark_move() since it moves bookmarks.
    */
} // test_function_bookmark_move

local.test.function_bookmark_parent_was_in_queue = function test_function_bookmark_parent_was_in_queue() {
    /*
    Make sure bookmark_parent_was_in_queue() can return true and false. If false, it should also add a parent id to the local.queue.parent_folders array.
    */

    try {
        const root_id = bookmark_root()

        expect(bookmark_parent_was_in_queue(root_id) === false)

        // parent id should be in the queue now
        expect(local.queue.parent_folders.indexOf(root_id) >= 0)

        expect(bookmark_parent_was_in_queue(root_id) === true)

        // reset the queue
        local.queue.parent_folders = []
    } catch (error) {
        // reset the queue
        local.queue.parent_folders = []

        throw error
    }
} // test_function_bookmark_parent_was_in_queue

local.test.function_bookmark_remove = function test_function_bookmark_remove() {
    /*
    Do not test bookmark_remove() since it can remove actual bookmarks.
    */
} // test_function_bookmark_remove

local.test.function_bookmark_reorder = function test_function_bookmark_reorder() {
    /*
    Do not test bookmark_reorder() since it may affect bookmarks.
    */
} // test_function_bookmark_reorder

local.test.function_bookmark_resort = function test_function_bookmark_resort() {
    /*
    Do not test bookmark_resort() since it may affect bookmarks.
    */
} // test_function_bookmark_resort

local.test.function_bookmark_root = function test_function_bookmark_root() {
    /*
    Make sure bookmark_root() returns the desired string for the current browser.
    */

    const root = bookmark_root()

    if (shared.browser.firefox) {
        expect(root === 'root________')
    } else {
        expect(root === '0')
    }
} // test_function_bookmark_root

local.test.function_bookmark_sort = function test_function_bookmark_sort() {
    /*
    Do not test bookmark_sort() since it may affect bookmarks.
    */
} // test_function_bookmark_sort

local.test.function_bookmark_sort_buffer = function test_function_bookmark_sort_buffer() {
    /*
    Do not test bookmark_sort_buffer() since it may affect bookmarks.
    */
} // test_function_bookmark_sort_buffer

local.test.function_bookmark_sort_date = function test_function_bookmark_sort_date() {
    /*
    Make sure bookmark_sort_date() returns the desired number for a valid bookmark.dateAdded value or 0 if the dateAdded value was not a number.
    */

    try {
        expect(bookmark_sort_date({'dateAdded': 123}) === 123)
        expect(bookmark_sort_date({'dateAdded': '123'}) === 0)
    } catch (error) {
        throw error
    }
} // test_function_bookmark_sort_date

local.test.function_bookmark_sort_title_locale = function test_function_bookmark_sort_title_locale() {
    /*
    Make sure bookmark_sort_title_locale() returns the desired results.
    */

    const bookmark_one = { 'title': 'Tidal' }
    const bookmark_two = { 'title': 'listen' }

    try {
        expect(bookmark_sort_title_locale(bookmark_one, bookmark_two).join() === '1,0')
        expect(bookmark_sort_title_locale(bookmark_two, bookmark_one).join() === '0,1')
        expect(bookmark_sort_title_locale(bookmark_one, bookmark_one).join() === '0,0')
    } catch (error) {
        throw error
    } // try
} // test_function_bookmark_sort_title_locale

local.test.function_bookmark_sort_url = function test_function_bookmark_sort_url() {
    /*
    Make sure bookmark_sort_url() returns the desired strings.
    */

    try {
        expect(bookmark_sort_url({}) === '')
        expect(bookmark_sort_url({'url': ''}) === '')
        expect(bookmark_sort_url({'url': 'about:preferences'}) === 'preferences')
        expect(bookmark_sort_url({'url': 'chrome://settings'}) === 'settings')
        expect(bookmark_sort_url({'url': 'chrome-extension://sprucemarks'}) === 'sprucemarks')
        expect(bookmark_sort_url({'url': 'FTP://server'}) === 'server')
        expect(bookmark_sort_url({'url': 'http://SERVER'}) === 'server')
        expect(bookmark_sort_url({'url': 'https://server'}) === 'server')
        expect(bookmark_sort_url({'url': 'https://www.server'}) === 'server')
        expect(bookmark_sort_url({'url': 'sub.www.server'}) === 'sub.www.server')
    } catch (error) {
        throw error
    }
} // test_function_bookmark_sort_url

local.test.function_crypto_digest_message = async function test_function_crypto_digest_message() {
    /*
    Make sure crypto_digest_message() returns the desired digest string.
    */

    try {
        const text = 'Blonde, James Blonde'
        const desired_digest = 'e6990bb7423198b941af82bbc07c4f2921cc8872693e6fc712409b0ef4f9cb1b'

        const digest = await crypto_digest_message(text)

        expect(digest === desired_digest,
            'Expected digest to exactly equal the desired_digest.'
        )
    } catch (error) {
        throw error
    } // try
} // test_function_crypto_digest_message

local.test.function_extension_page = function test_function_extension_page() {
    /*
    Do not test extension_page() since it can open a new tab or focus an existing tab.
    */
} // test_function_extension_page

local.test.function_icon_set = async function test_function_icon_set() {
    /*
    Make sure icon_set() does not return an error.
    */

    try {
        await icon_set()
    } catch (error) {
        throw error
    }
} // test_function_icon_set

local.test.function_install_or_upgrade = function test_function_install_or_upgrade() {
    /*
    Do not test install_or_upgrade() since it should only run once on startup.
    */
} // test_function_install_or_upgrade

local.test.function_listener_bookmark_changed = function test_function_listener_bookmark_changed() {
    /*
    Do not test listener_bookmark_changed() since it may affect bookmarks.
    */
} // test_function_listener_bookmark_changed

local.test.function_listener_bookmark_children_reorder = function test_function_listener_bookmark_children_reorder() {
    /*
    Do not test listener_bookmark_children_reorder() since it may affect bookmarks.
    */
} // test_function_listener_bookmark_children_reorder

local.test.function_listener_bookmark_created = function test_function_listener_bookmark_created() {
    /*
    Do not test listener_bookmark_created() since it may affect bookmarks.
    */
} // test_function_listener_bookmark_created

local.test.function_listener_bookmark_import_began = function test_function_listener_bookmark_import_began() {
    /*
    Make sure listener_bookmark_import_began() sets local.status.import_active to true.
    */

    try {
        listener_bookmark_import_began()

        expect(local.status.import_active === true)

        // reset import_active
        local.status.import_active = false
    } catch (error) {
        // reset import_active
        local.status.import_active = false

        throw error
    }
} // test_function_listener_bookmark_import_began

local.test.function_listener_bookmark_import_ended = function test_function_listener_bookmark_import_ended() {
    /*
    Do not test listener_bookmark_import_ended() since it may affect bookmarks.
    */
} // test_function_listener_bookmark_import_ended

local.test.function_listener_bookmark_moved = function test_function_listener_bookmark_moved() {
    /*
    Do not test listener_bookmark_moved() since it may affect bookmarks.
    */
} // test_function_listener_bookmark_moved

local.test.function_listener_bookmark_removed = function test_function_listener_bookmark_removed() {
    /*
    Do not test listener_bookmark_removed() since it only logs a message and then calls refresh functions.
    */
} // test_function_listener_bookmark_removed

local.test.function_listener_browser_action = function test_function_listener_browser_action() {
    /*
    Do not test listener_browser_action() since it would open the options page.
    */
} // test_function_listener_browser_action

local.test.function_listener_port_connect = function test_function_listener_port_connect() {
    /*
    Do not test listener_port_connect() since it is meant for real ports.
    */
} // test_function_listener_port_connect

local.test.function_listener_port_disconnect = function test_function_listener_port_disconnect() {
    /*
    Do not test listener_port_disconnect() since it is meant for real ports.
    */
} // test_function_listener_port_disconnect

local.test.function_listener_port_message = async function test_function_listener_port_message() {
    /*
    Make sure listener_port_message() saves a theme preference successfully.
    */

    try {
        const info = null
        const local_preference_string = local.preference.theme

        const obj = {
            'subject': 'preference-set',
            'name'   : 'theme',
            'value'  : local.preference.theme
        } // obj

        await listener_port_message(obj, info)

        expect(local.preference.theme === local_preference_string)
    } catch (error) {
        throw error
    } // try
} // test_function_listener_port_message

local.test.function_listener_react_to_changes = function test_function_listener_react_to_changes() {
    /*
    Make sure listener_react_to_changes() returns the desired boolean for various conditions.
    */

    try {
        // these defaults should already be set
        /*
        local.status.import_active = false
        local.status.listeners_active = true
        local.status.resort_active = false
        */

        if (local.option.automatic_sorting === true) {
            expect(listener_react_to_changes() === true)

            local.status.import_active = true
            expect(listener_react_to_changes() === false)
            local.status.import_active = false

            local.status.listeners_active = false
            expect(listener_react_to_changes() === false)
            local.status.listeners_active = true

            local.status.resort_active = true
            expect(listener_react_to_changes() === false)
            local.status.resort_active = false
        } else {
            expect(listener_react_to_changes() === false)
        } // if
    } catch (error) {
        // reset defaults
        local.status.import_active = false
        local.status.listeners_active = true
        local.status.resort_active = false

        throw error
    } // try
} // test_function_listener_react_to_changes

local.test.function_listener_service_worker_install = function test_function_listener_service_worker_install() {
    /*
    Do not test listener_service_worker_install() since it is only meant for service worker installs.
    */
} // test_function_listener_service_worker_install

local.test.function_locale_compare = function test_function_locale_compare() {
    /*
    Make sure locale_compare() returns the desired sort order.
    */

    expect(locale_compare('a', 'b') === -1,
        "Expected locale_compare('a', 'b') to return -1."
    )

    expect(locale_compare('b', 'a') === 1,
        "Expected locale_compare('b', 'a') to return 1."
    )

    expect(locale_compare('b', 'b') === 0,
        "Expected locale_compare('b', 'b') to return 0."
    )
} // test_function_locale_compare

local.test.function_option_set_sync_if_needed = async function test_function_option_set_sync_if_needed() {
     /*
     Do not test option_set_sync_if_needed() since it can change corresponding options like "bookmarks_bar" and "bookmarks_bar_sort".
     */
} // test_function_option_set_sync_if_needed

local.test.function_option_to_storage = async function test_function_option_to_storage() {
    /*
    Make sure option_to_storage() saves to storage correctly by reading back from storage to compare.
    */

    try {
        const option_before = local.option.automatic_sorting

        await option_to_storage('automatic_sorting')
        await options_from_storage()

        expect(option_before === local.option.automatic_sorting)
    } catch (error) {
        throw error
    } // try
} // test_function_option_to_storage

local.test.function_options_from_storage = async function test_function_options_from_storage() {
    /*
    Make sure options_from_storage() updates local.option correctly.
    */

    try {
        const local_option_string = JSON.stringify(local.option)

        await options_from_storage()

        expect(JSON.stringify(local.option) === local_option_string)
    } catch (error) {
        throw error
    } // try
} // test_function_options_from_storage

local.test.function_port_message_all = function test_function_port_message_all() {
    /*
    Do not test port_message_all() since it is meant for real ports.
    */
} // test_function_port_message_all

local.test.function_port_message_all_except = function test_function_port_message_all_except() {
    /*
    Do not test port_message_all_except() since it is meant for real ports.
    */
} // test_function_port_message_all_except

local.test.function_preference_to_storage = async function test_function_preference_to_storage() {
    /*
    Make sure preference_to_storage() saves to storage correctly by reading back from storage to compare.
    */

    try {
        const preference_before = local.preference.theme

        await preference_to_storage('theme')
        await preferences_from_storage()

        expect(preference_before === local.preference.theme)
    } catch (error) {
        throw error
    } // try
} // test_function_preference_to_storage

local.test.function_preferences_from_storage = async function test_function_preferences_from_storage() {
    /*
    Make sure preferences_from_storage() updates local.preference correctly.
    */

    try {
        const local_preference_string = JSON.stringify(local.preference)

        await preferences_from_storage()

        expect(JSON.stringify(local.preference) === local_preference_string)
    } catch (error) {
        throw error
    } // try
} // test_function_preferences_from_storage

local.test.function_refresh_about = async function test_function_refresh_about() {
    /*
    Make sure refresh_about() does not return an error.
    */

    try {
        await refresh_about()
    } catch (error) {
        throw error
    } // try
} // test_function_refresh_about

local.test.function_refresh_tools = async function test_function_refresh_tools() {
    /*
    Make sure refresh_tools() does not return an error.
    */

    try {
        await refresh_tools()
    } catch (error) {
        throw error
    } // try
} // test_function_refresh_tools

local.test.function_show_extension_page_if_needed = function test_function_show_extension_page_if_needed() {
    /*
    Do not test show_extension_page_if_needed() since it may open a new tab.
    */
} // test_function_show_extension_page_if_needed

local.test.function_show_message_relayed = function test_function_show_message_relayed() {
    /*
    Do not test show_message_relayed() since it can set properties to false. Any true properties should remain true until the user is notified by other functions.
    */
} // test_function_show_message_relayed

local.test.function_start = function test_function_start() {
    /*
    Do not test start() since it should only be run once on startup.
    */
} // test_function_start

local.test.function_start_done = async function test_function_start_done() {
    /*
    Make sure start_done() does not return an error.
    */

    try {
        await start_done()
    } catch (error) {
        throw error
    } // try
} // test_function_start_done

local.test.function_storage_get = async function test_function_storage_get() {
    /*
    Make sure storage_get() returns the correct value for a valid key and undefined for a missing key.
    */

    try {
        const version = await storage_get('version')

        expect(typeof version === 'string' && version === local.version)

        const missing_option = await storage_get('option_that_does_not_exist')

        expect(missing_option === undefined)
    } catch (error) {
        throw error
    } // try
} // test_function_storage_get

local.test.function_storage_remove = async function test_function_storage_remove() {
    /*
    Make sure storage_remove() does not return an error.
    */

    try {
        await storage_remove('option_that_does_not_exist')
    } catch (error) {
        throw error
    } // try
} // test_function_storage_remove

local.test.function_storage_set = async function test_function_storage_set() {
    /*
    Make sure storage_set() does not return an error.
    */

    try {
        await storage_set({
            'version': local.version
        })
    } catch (error) {
        throw error
    } // try
} // test_function_storage_set

local.test.function_test = function test_function_test() {
    /*
    No need to test test() since we will be running it with "await test()".
    */
} // test_function_test

local.test.function_tool_bookmark_history_clear = function test_function_tool_bookmark_history_clear() {
    /*
    Do not test tool_bookmark_history_clear() since it clears real events.
    */
} // test_function_tool_bookmark_history_clear

local.test.function_tool_bookmark_history_from_storage = async function test_function_tool_bookmark_history_from_storage() {
    /*
    Make sure tool_bookmark_history_from_storage() returns the desired array.
    */

    try {
        // run a trim in case any old events need to be trimmed before we make a note of the previous bookmark history state
        tool_bookmark_history_trim()

        const previous_history = JSON.stringify(local.tool.bookmark_history)

        await tool_bookmark_history_from_storage()

        const new_history = JSON.stringify(local.tool.bookmark_history)

        expect(new_history === previous_history,
            'Expected previous history to equal new history.'
        )
    } catch (error) {
        throw error
    } // try
} // test_function_tool_bookmark_history_from_storage

local.test.function_tool_bookmark_history_log = function test_function_tool_bookmark_history_log() {
    /*
    Do not test tool_bookmark_history_log() since test objects would be visible to the "Bookmark History" tool.
    */
} // test_function_tool_bookmark_history_log

local.test.function_tool_bookmark_history_to_storage = async function test_function_tool_bookmark_history_to_storage() {
    /*
    Make sure tool_bookmark_history_to_storage() saves the desired array.
    */

    try {
        // run a trim in case any old events need to be trimmed before we make a note of the previous bookmark history state
        tool_bookmark_history_trim()

        const previous_history = JSON.stringify(local.tool.bookmark_history)

        await tool_bookmark_history_to_storage()

        await tool_bookmark_history_from_storage()

        const new_history = JSON.stringify(local.tool.bookmark_history)

        expect(new_history === previous_history,
            'Expected previous history to equal new history.'
        )
    } catch (error) {
        throw error
    } // try
} // test_function_tool_bookmark_history_to_storage

local.test.function_tool_bookmark_history_trim = function test_function_tool_bookmark_history_trim() {
    /*
    Make sure tool_bookmark_history_trim() does not return an error.
    */

    try {
        tool_bookmark_history_trim()
    } catch (error) {
        throw error
    } // try
} // test_function_tool_bookmark_history_trim

local.test.function_tool_duplicate_bookmarks_find = async function test_function_tool_duplicate_bookmarks_find() {
    /*
    Make sure tool_duplicate_bookmarks_find() returns a valid object.
    */

    try {
        const duplicate_bookmarks = await tool_duplicate_bookmarks_find()

        expect(typeof duplicate_bookmarks === 'object',
            'Expected return value to be an object.'
        )

        for (const property in duplicate_bookmarks) {
            const bookmarks = duplicate_bookmarks[property]

            expect(bookmarks.length >= 2,
                'Expected bookmarks.length to be 2 or more.'
            )

            for (const bookmark of bookmarks) {
                expect(typeof bookmark === 'object',
                    'Expected bookmark type to be an object.'
                )

                for (const property in bookmark) {
                    const item = bookmark[property]

                    if (property === 'when') {
                        expect(typeof item === 'number',
                            'Expected bookmark[' + property + '] type to be a number.'
                        )
                    } else {
                        expect(typeof item === 'string',
                            'Expected bookmark[' + property + '] type to be a string.'
                        )
                    } // if
                } // for

                expect(bookmark.id.length > 0,
                    'Expected bookmark.id.length to be greater than 0.'
                )

                expect(bookmark.location.length > 0,
                    'Expected bookmark.location.length to be greater than 0.'
                )

                expect(bookmark.type === 'bookmark',
                    'Expected bookmark.type to be the string "bookmark".'
                )
            } // for
        } // for
    } catch (error) {
        throw error
    } // try
} // test_function_tool_duplicate_bookmarks_find

local.test.function_tool_duplicate_bookmarks_remove = function test_function_tool_duplicate_bookmarks_remove() {
    /*
    Do not test tool_duplicate_bookmarks_remove() since it can remove real bookmarks.
    */
} // test_function_tool_duplicate_bookmarks_remove

local.test.function_tool_empty_folders_find = async function test_function_tool_empty_folders_find() {
    /*
    Make sure tool_empty_folders_find() returns an array. If the array contains objects, make sure each object has the desired properties.
    */

    try {
        const empty_folders = await tool_empty_folders_find()

        for (const property in empty_folders) {
            const folder = empty_folders[property]

            expect(typeof folder.id === 'string')
            expect(typeof folder.title === 'string')
            expect(typeof folder.location === 'string')
            expect(typeof folder.when === 'number')

            expect(folder.id.length > 0)
            expect(folder.location.length > 0)
        } // for
    } catch (error) {
        throw error
    } // try
} // test_function_tool_empty_folders_find

local.test.function_tool_empty_folders_remove = function test_function_tool_empty_folders_remove() {
    /*
    Do not test tool_empty_folders_remove() since it can remove actual bookmarks.
    */
} // test_function_tool_empty_folders_remove

local.test.function_tool_similar_bookmarks_find = async function test_function_tool_similar_bookmarks_find() {
    /*
    Make sure tool_similar_bookmarks_find() returns a valid object.
    */

    try {
        const similar_bookmarks = await tool_similar_bookmarks_find()

        expect(typeof similar_bookmarks === 'object',
            'Expected return value to be an object.'
        )

        for (const property in similar_bookmarks) {
            const groups = similar_bookmarks[property]

            expect(typeof groups === 'object',
                'Expected groups type to be an object.'
            )

            for (const group in groups) {
                const bookmarks = groups[group]

                expect(bookmarks.length >= 2,
                    'Expected bookmarks.length to be 2 or more.'
                )

                for (const bookmark of bookmarks) {
                    expect(typeof bookmark === 'object',
                        'Expected bookmark type to be an object.'
                    )

                    for (const property in bookmark) {
                        const item = bookmark[property]

                        if (property === 'when') {
                            expect(typeof item === 'number',
                                'Expected bookmark[' + property + '] type to be a number.'
                            )
                        } else {
                            expect(typeof item === 'string',
                                'Expected bookmark[' + property + '] type to be a string.'
                            )
                        } // if
                    } // for

                    expect(bookmark.id.length > 0,
                        'Expected bookmark.id.length to be greater than 0.'
                    )

                    expect(bookmark.location.length > 0,
                        'Expected bookmark.location.length to be greater than 0.'
                    )

                    expect(bookmark.type === 'bookmark',
                        'Expected bookmark.type to be the string "bookmark".'
                    )
                } // for
            } // for
        } // for
    } catch (error) {
        throw error
    } // try
} // test_function_tool_similar_bookmarks_find

local.test.function_tool_similar_bookmarks_remove = function test_function_tool_similar_bookmarks_remove() {
    /*
    Do not test tool_similar_bookmarks_remove() since it can remove actual bookmarks.
    */
} // test_function_tool_similar_bookmarks_remove

local.test.function_url_setup = function test_function_url_setup() {
    /*
    Make sure url_setup() does not return an error.
    */

    try {
        url_setup()
    } catch (error) {
        throw error
    } // try
} // test_function_url_setup

local.test.function_version_from_storage = async function test_function_version_from_storage() {
    /*
    Make sure version_from_storage() returns the same local.version value.
    */

    try {
        const version = await version_from_storage()

        expect(version === local.version)
    } catch (error) {
        throw error
    } // try
} // test_function_version_from_storage

local.test.function_version_less_than = function test_function_version_less_than() {
    /*
    Make sure version_less_than() returns the desired results.
    */

    try {
        expect(version_less_than(local.version, '2000.12.1.35') === false)
        expect(version_less_than(local.version, local.version) === false)
        expect(version_less_than(local.version, '3000.0.0.0') === true)
    } catch (error) {
        throw error
    } // try
} // test_function_version_less_than

local.test.function_version_to_storage = async function test_function_version_to_storage() {
    /*
    Make sure version_to_storage() saves to storage by reading from storage and comparing that value to our local.version value.
    */

    try {
        await version_to_storage(local.version)

        const version = await version_from_storage()

        expect(version === local.version)
    } catch (error) {
        throw error
    } // try
} // test_function_version_to_storage

local.test.last_time = function test_last_time() {
    /*
    Make sure local.last_time properties are each a number greater than or equal to 0.
    */

    for (const property in local.last_time) {
        expect(typeof local.last_time[property] === 'number',
            'Expected local.last_time.' + property + ' to be a number.'
        )

        expect(local.last_time[property] >= 0,
            'Expected local.last_time.' + property + ' to be greater than or equal to 0.'
        )
    } // for
} // test_last_time

local.test.option = function test_option() {
    /*
    Each option property should be of a certain type.
    */

    const option_type = {
        'automatic_sorting': 'boolean',
        'group_folders': 'boolean'
    } // option_type

    for (const property in local.option) {
        let type = 'boolean' // default

        if (option_type[property] === undefined) {
            // dynamically generated ancestor options
            if (property.indexOf('_sort') >= 0) {
                type = 'string'
            } // if
        } else {
            // always available options
            type = option_type[property]
        } // if

        expect(typeof local.option[property] === type,
            'Expected local.option.' + property + ' type to be a ' + type + '.'
        )
    } // for
} // test_option

local.test.port = function test_port() {
    /*
    The local.port object should be an array.
    */

    expect(Array.isArray(local.port) === true,
        'Expected local.port to be an array.'
    )
} // test_port

local.test.preference = function test_preference() {
    /*
    Each preference property should be of a certain type and not empty.
    */

    const property_type = {
        'browser_is_dark': 'boolean',
        'icon_action'    : 'string',
        'icon_color'     : 'string',
        'theme'          : 'string'
    } // property_type

    for (const property in local.preference) {
        const preference = local.preference[property]
        const type = property_type[property]

        expect(typeof preference === type,
            'Expected local.preference.' + property + ' type to be a ' + type + '.'
        )

        expect(preference !== '',
            'Expected local.preference.' + property + ' to not be empty.'
        )
    } // for
} // test_preference

local.test.queue = function test_queue() {
    /*
    Each queue property should be an empty array.
    */

    const property_type = {
        'reorder'       : 'object',
        'parent_folders': 'object'
    } // property_type

    for (const property in local.queue) {
        const queue = local.queue[property]
        const type = property_type[property]

        expect(typeof queue === type,
            'Expected local.queue.' + property + ' type to be a ' + type + '.'
        )

        expect(Array.isArray(queue),
            'Expected local.queue.' + property + ' to be an array.'
        )

        expect(queue.length === 0,
            'Expected local.queue.' + property + ' to be an empty array.'
        )
    } // for
} // test_queue

local.test.setting = function test_setting() {
    /*
    Each setting property should be of a certain type and set to false.
    */

    const property_type = {
        'resort_requested': 'boolean',
        'show_extension'  : 'boolean',
        'show_message'    : 'object'
    } // property_type

    for (const property in local.setting) {
        const setting = local.setting[property]
        const type = property_type[property]

        expect(typeof setting === type,
            'Expected local.setting.' + property + ' type to be a ' + type + '.'
        )

        if (type === 'boolean') {
            expect(setting === false,
                'Expected local.setting.' + property + ' to be false.'
            )
        }
    } // for

    for (const property in local.setting.show_message) {
        const show_message = local.setting.show_message[property]

        expect(typeof show_message === 'boolean',
            'Expected local.setting.show_message.' + property + ' type to be a boolean.'
        )

        expect(show_message === false,
            'Expected local.setting.show_message.' + property + ' to false.'
        )
    } // for
} // test_setting

local.test.status = function test_status() {
    /*
    Each status property should be of a certain type and value.
    */

    const property_type = {
        'import_active'       : 'boolean',
        'listeners_active'    : 'boolean',
        'resort_active'       : 'boolean',
        'sprucemarks_active'  : 'boolean',
        'start_done'          : 'boolean'
    } // property_type

    const property_value = {
        'import_active'       : false,
        'listeners_active'    : true,
        'resort_active'       : false,
        'sprucemarks_active'  : true,
        'start_done'          : true
    } // property_value

    for (const property in local.status) {
        const status = local.status[property]
        const type = property_type[property]
        const value = property_value[property]

        expect(typeof status === type,
            'Expected local.status.' + property + ' type to be a ' + type + '.'
        )

        expect(status === value,
            'Expected local.status.' + property + ' to be ' + value + '.'
        )
    } // for
} // test_status

local.test.test = function test_test() {
    /*
    Each local.test property should be a function.
    */

    for (const property in local.test) {
        expect(typeof local.test[property] === 'function',
            'Expected local.test[' + property + '] to be a function.'
        )
    } // for
} // test_test

local.test.timer = function test_timer() {
    /*
    Each local.timer property should be one of two types.
    */

    for (const property in local.timer) {
        const type_of = typeof local.timer[property]

        expect(type_of === 'number' || type_of === 'string',
            'Expected local.timer.' + property + ' type to be a number or string.'
        )
    } // for
} // test_timer

local.test.tool = function test_tool() {
    /*
    Make sure local.tool is an object.
    */

    expect(typeof local.tool === 'object',
        'Expected local.tool to be an object.'
    )
} // test_tool

local.test.tool_bookmark_history = function test_tool_bookmark_history() {
    /*
    Make sure tool.bookmark_history is an array. Also make sure the array contains valid objects, if any.
    */

    expect(Array.isArray(local.tool.bookmark_history),
        'Expected tool.bookmark_history to be an array.'
    )

    if (local.tool.bookmark_history.length > 0) {
        for (const bookmark of local.tool.bookmark_history) {
            expect(typeof bookmark === 'object',
                'Expected bookmark to be an object.'
            )

            const desired = {
                activity: 'string',
                id      : 'string',
                location: 'string',
                title   : 'string',
                when    : 'number'
            } // desired

            for (const item in desired) {
                if (shared.browser.firefox && item === 'title') {
                    // titles may be a string or undefined in firefox
                    expect(typeof bookmark[item] === desired[item] || bookmark[item] === undefined,
                        'Expected bookmark.title to be a ' + desired[item] + ' or undefined.'
                    )
                } else {
                    expect(typeof bookmark[item] === desired[item],
                        'Expected bookmark.' + item + ' to be a ' + desired[item] + '.'
                    )
                } // if
            } // for

            if (bookmark.url !== undefined) {
                expect(typeof bookmark.url === 'string',
                    'Expected bookmark.url to be an object.'
                )
            } // if
        } // for
    } // if
} // test_tool_bookmark_history

local.test.troubleshoot = function test_troubleshoot() {
    /*
    Make sure local.troubleshoot is null as in no errors have replaced the default value.
    */

    expect(local.troubleshoot === null,
        'Expected local.troubleshoot to be null.'
    )
} // test_troubleshoot

local.test.url = function test_url() {
    /*
    Make sure local.url theme objects only contain strings with an instance of their parent theme in their path.
    */

    for (const theme in local.url) {
        // theme will be 'dark' or 'light'
        for (const icon in local.url[theme]) {
            // icon will be 'dark', 'green', or 'light'
            for (const page in local.url[theme][icon]) {
                const url = local.url[theme][icon][page]

                expect(typeof url === 'string',
                    'Expected local.url.' + theme + '.' + icon + '.' + page + ' to be a string.'
                )

                expect(url.indexOf(shared.url.extension) === 0,
                    'Expected local.url.' + theme + '.' + icon + '.' + page + ' to start with "' + shared.url.extension + '".'
                )

                expect(url.indexOf('/page/' + theme + '/' + icon + '/' + page + '.html') >= 0,
                    'Expected local.url.' + theme + '.' + icon + '.' + page + ' to contain the string "/page/' + theme + '/' + icon + '/' + page + '.html".'
                )
            } // for
        } // for
    } // for
} // test_url

local.test.version = function test_version() {
    /*
    Make sure local.version is a string of numbers and dots.
    */

    const all_integers = local.version.split('.').every(i => parse_integer(i) == i)

    expect(typeof local.version === 'string' && all_integers === true,
        'Expected local.version to be a string of numbers and dots.'
    )
} // test_version

//--------------------
// Functions - Shared
//--------------------
local.test.shared_browser = function test_shared_browser() {
    /*
    Make sure each browser property is a boolean and that only one of them is currently true.
    */

    let true_value_count = 0 // keep track of how many properties are true

    for (const property in shared.browser) {
        const value = shared.browser[property]

        expect(typeof value === 'boolean',
            'Expected shared.browser.' + property + ' type to be a boolean.'
        )

        if (value === true) {
            true_value_count++
        } // if
    } // for

    expect(true_value_count === 1,
        'Expected one shared.browser property to be true but instead found ' + true_value_count + '.'
    )
} // test_shared_browser

local.test.shared_function_browser_body_add_class = function test_shared_function_browser_body_add_class() {
    /*
    Do not test browser_body_add_class() since it should only run on pages that use it.
    */
} // test_shared_function_browser_body_add_class

local.test.shared_function_browser_customize = function test_shared_function_browser_customize() {
    /*
    Do not test browser_customize() since it should only run on pages that use it.
    */
} // test_shared_function_browser_customize

local.test.shared_function_delay = async function test_shared_function_delay() {
    /*
    Make sure delay() does not return before the requested amount of milliseconds.
    */

    try {
        const begin = Date.now()
        const duration = 500 // milliseconds

        await delay(duration)

        const end = Date.now()

        expect(end >= (begin + duration))
    } catch (error) {
        throw error
    } // try
} // test_shared_function_delay

local.test.shared_function_expect = function test_shared_function_expect() {
    /*
    Make sure expect() only throws errors when it encounters results that are not exactly true.
    */

    try {
        expect(true, 'true should not throw an error')
        expect(false, 'false should throw an error')
    } catch (error) {
        if (error.message !== 'false should throw an error') {
            throw error
        }
    } // try
} // test_shared_function_expect

local.test.shared_function_human_time_since = function test_shared_function_human_time_since() {
    /*
    Make sure human_time_since() returns the desired results.
    */

    const now = Date.now()

    const seconds = {
        'year'  : 31536000, // 365 days
        'month' : 2592000,  //  30 days
        'day'   : 86400,    //   1 day
        'hour'  : 3600,
        'minute': 60
    } // seconds

    try {
        for (const property in seconds) {
            const milliseconds = seconds[property] * 1000
            const time_ago = now - milliseconds - 1000 // minus one second to make sure we are a little bit older then the minimum time it should take to get the desired result

            const result = human_time_since(time_ago)

            expect(result.indexOf(property) >= 0,
                'Expected to find "' + property + '" in "' + result + '".'
            )
        } // for
    } catch (error) {
        throw error
    } // try
} // test_shared_function_human_time_since

local.test.shared_function_human_time_to = function test_shared_function_human_time_to() {
    /*
    Make sure human_time_to() returns the desired results.
    */

    const now = Date.now()

    const seconds = {
        'year'  : 31536000, // 365 days
        'month' : 2592000,  //  30 days
        'day'   : 86400,    //   1 day
        'hour'  : 3600,
        'minute': 60
    } // seconds

    try {
        for (const property in seconds) {
            const milliseconds = seconds[property] * 1000
            const time_until = now + milliseconds + 1000 // plus one second to make sure we are a little bit further then the minimum time it would take to get the desired result

            const result = human_time_to(time_until)

            expect(result.indexOf(property) >= 0,
                'Expected to find "' + property + '" in "' + result + '".'
            )
        } // for
    } catch (error) {
        throw error
    } // try
} // test_shared_function_human_time_to

local.test.shared_function_listen_mouse_events = function test_shared_function_listen_mouse_events() {
    /*
    Do not test listen_mouse_events() since it should only run once on pages that use it.
    */
} // test_shared_function_listen_mouse_events

local.test.shared_function_listen_scroll_nav = function test_shared_function_listen_scroll_nav() {
    /*
    Do not test listen_scroll_nav() since it should only run once on pages that use it.
    */
} // test_shared_function_listen_scroll_nav

local.test.shared_function_listen_scroll_to_links = function test_shared_function_listen_scroll_to_links() {
    /*
    Do not test listen_scroll_to_links() since it should only run once on pages with links that use the class name "scroll-to".
    */
} // test_shared_function_listen_scroll_to_links

local.test.shared_function_listen_show_message_dismiss = function test_shared_function_listen_show_message_dismiss() {
    /*
    Do not test listen_show_message_dismiss() since it should only run once on pages with links that use the class name "show-message-dismiss".
    */
} // test_shared_function_listen_show_message_dismiss

local.test.shared_function_location_hash_scroll_to = async function test_shared_function_location_hash_scroll_to() {
    /*
    Do not test location_hash_scroll_to() since it should only run on human visible pages.
    */
} // test_shared_function_location_hash_scroll_to

local.test.shared_function_log = function test_shared_function_log() {
    /*
    No need to test log() since it only console.logs if shared.setting.log is true.
    */
} // test_shared_function_log

local.test.shared_function_parse_integer = function test_shared_function_parse_integer() {
    /*
    Make sure parse_integer() returns a number when given a string or number.
    */

    try {
        expect(parse_integer('10') === 10)
        expect(parse_integer(1) === 1)
    } catch (error) {
        throw error
    } // try
} // test_shared_function_parse_integer

local.test.shared_function_scroll_nav = function test_shared_function_scroll_nav() {
    /*
    Do not test scroll_nav() since it should only run on pages that use it.
    */
} // test_shared_function_scroll_nav

local.test.shared_function_scroll_to = function test_shared_function_scroll_to() {
    /*
    Do not test scroll_to() since it can only be used on user visible pages.
    */
} // test_shared_function_scroll_to


local.test.shared_function_scroll_to_id = function test_shared_function_scroll_to_id() {
    /*
    Do not test scroll_to_id() since it can only be used on user visible pages.
    */
} // test_shared_function_scroll_to_id

local.test.shared_function_shared_start = async function test_shared_function_shared_start() {
    /*
    Make sure shared_start() does not alter the current shared.browser object.
    */

    try {
        const browser_before = JSON.stringify(shared.browser)

        await shared_start()

        const browser_after = JSON.stringify(shared.browser)

        expect(browser_before === browser_after)
    } catch (error) {
        throw error
    } // try
} // test_shared_function_shared_start

local.test.shared_function_show_message = function test_shared_function_show_message() {
    /*
    Do not test show_message() since it is only meant to be used on pages viewed by humans. Also do not test show_message() since it can change local.setting.show_message properties from true to false and that should only be done by the "show_message_relayed" function of the background page.
    */
} // test_shared_function_show_message

local.test.shared_function_show_message_dismiss = function test_shared_function_show_message_dismiss() {
    /*
    Do not test show_message_dismiss() since it is only meant to be used on HTML elements that are visible to a human.
    */
} // test_shared_function_show_message_dismiss

local.test.shared_function_theme_and_icon = function test_shared_function_theme_and_icon() {
    /*
    No need to test theme_and_icon() since it changes the appearance of visible extension pages for humans.
    */
} // test_shared_function_theme_and_icon

local.test.shared_function_time_remove_precision = function test_shared_function_time_remove_precision() {
    /*
    Make sure time_remove_precision() returns the desired result.
    */

    expect(time_remove_precision(1234) === 1000,
        'Expected time_remove_precision(1234) to return 1000.'
    )
} // test_shared_function_time_remove_precision

local.test.shared_function_time_to_tick = function test_shared_function_time_to_tick() {
    /*
    Make sure time_to_tick() returns the desired result.
    */

    expect(time_to_tick(1000, 100, 1000) === 901,
        'Expected time_to_tick(1000, 100, 1000) to return 901.'
    )
} // test_shared_function_time_to_tick

local.test.shared_setting = function test_shared_setting() {
    /*
    Each setting property should be of a certain type and set to false.
    */

    const property_type = {
        'log': 'boolean'
    } // property_type

    for (const property in shared.setting) {
        const setting = shared.setting[property]
        const type = property_type[property]

        expect(typeof setting === type,
            'Expected shared.setting.' + property + ' type to be a ' + type + '.'
        )

        if (property === 'log' && setting === true) {
            // just warn about the log setting since it is nice to have on while developing
            console.warn('Expected shared.setting.log to be false.')
        } else {
            expect(setting === false,
                'Expected shared.setting.' + property + ' to be false.'
            )
        } // if
    } // for
} // test_shared_setting

local.test.shared_url = function test_shared_url() {
    /*
    Make sure shared.url is an object and shared.url.extension is a string with a correct looking value.
    */

    expect(typeof shared.url === 'object',
        'Expected shared.url to be an object.'
    )

    expect(typeof shared.url.extension === 'string',
        'Expected shared.url.extension to be a string.'
    )

    expect(shared.url.extension.indexOf(':') > 0,
        'Expected shared.url.extension to contain a ":" character.'
    )

    expect(shared.url.extension.slice(-1) === '/',
        'Expected shared.url.extension to end with a "/" character.'
    )
} // test_shared_url