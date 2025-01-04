'use strict'

//-------
// Notes
//-------
/*
    This file will provide a "browser" object which will contain aliases to the "chrome" object. More importantly, it will also contain promise based versions of callback functions normally found in the "chrome" object.
*/

const browser = { // will hold various functions
    'action': {
        // onClicked
        // setBadgeBackgroundColor
        // setBadgeText
        // setIcon
    },
    'bookmarks': {
        // get
        // getChildren
        // getTree
        // move
        // onChanged
        // onChildrenReordered
        // onCreated
        // onImportBegan
        // onImportEnded
        // onMoved
        // onRemoved
        // remove
    },
    'runtime': {
        // connect
        // getManifest
        // getURL
        // onConnect
    },
    'storage': {
        'local': {
            // get
            // remove
            // set
        }
    },
    'tabs': {
        // create
        // update
    },
    'windows': {
        // update
    }
} // browser

//---------
// Aliases
//---------
browser.action.onClicked               = chrome.action.onClicked
browser.action.setBadgeBackgroundColor = chrome.action.setBadgeBackgroundColor
browser.action.setBadgeText            = chrome.action.setBadgeText
browser.action.setIcon                 = chrome.action.setIcon

browser.bookmarks.get                 = chrome.bookmarks.get
browser.bookmarks.getChildren         = chrome.bookmarks.getChildren
browser.bookmarks.getTree             = chrome.bookmarks.getTree
browser.bookmarks.move                = chrome.bookmarks.move
browser.bookmarks.onChanged           = chrome.bookmarks.onChanged
browser.bookmarks.onChildrenReordered = chrome.bookmarks.onChildrenReordered
browser.bookmarks.onCreated           = chrome.bookmarks.onCreated
browser.bookmarks.onImportBegan       = chrome.bookmarks.onImportBegan
browser.bookmarks.onImportEnded       = chrome.bookmarks.onImportEnded
browser.bookmarks.onMoved             = chrome.bookmarks.onMoved
browser.bookmarks.onRemoved           = chrome.bookmarks.onRemoved
browser.bookmarks.remove              = chrome.bookmarks.remove

browser.runtime.connect     = chrome.runtime.connect
browser.runtime.getManifest = chrome.runtime.getManifest
browser.runtime.getURL      = chrome.runtime.getURL
browser.runtime.onConnect   = chrome.runtime.onConnect

browser.tabs.create = chrome.tabs.create
browser.tabs.update = chrome.tabs.update

browser.windows.update = chrome.windows.update

//-----------
// Functions
//-----------
browser.action.setIcon = function browser_action_setIcon(details) {
    /*
    Set the browser action icon for one or all tabs.

    @param   {Object}   details  Details object. More info at https://developer.chrome.com/docs/extensions/reference/action/#method-setIcon
    @return  {*}                 Promise that returns nothing if successful or an error if unsuccessful.
    */

    return new Promise(function(resolve, reject) {
        try {
            chrome.action.setIcon(details, function() {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve()
                } // if
            })
        } catch (error) {
            reject(error)
        } // try
    }) // promise
} // action.setIcon

browser.storage.local.get = function browser_storage_local_get(keys) {
    /*
    Gets one or more items from local storage.

    @param   {*}  [keys]  Optional. Items to retrieve from local storage. String, array of strings, or NULL to retrieve all items. More info at https://developer.chrome.com/docs/extensions/reference/storage/#type-StorageArea
    @return  {*}          Promise that returns on object with any available items requested if successful, or an error if unsuccessful.
    */

    return new Promise(function(resolve, reject) {
        try {
            chrome.storage.local.get(keys, function(items) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve(items)
                } // if
            })
        } catch (error) {
            reject(error)
        } // try
    }) // promise
} // storage.local.get

browser.storage.local.remove = function browser_storage_local_remove(keys) {
    /*
    Remove one or more items from local storage.

    @param   {*}  keys  A single string like "option_one" or an array of strings like ["option_one","option_two"]
    @return  {*}        Promise that returns nothing if successful or an error if unsuccessful.
    */

    return new Promise(function(resolve, reject) {
        try {
            chrome.storage.local.remove(keys, function() {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve()
                } // if
            })
        } catch (error) {
            reject(error)
        } // try
    }) // promise
} // storage.local.remove

browser.storage.local.set = function browser_storage_local_set(items) {
    /*
    Save one or more items to local storage.

    @param   {Object}  items  Object with one or more key value pairs to save to local storage. More info at https://developer.chrome.com/docs/extensions/reference/storage/#type-StorageArea
    @return  {*}              Promise that returns nothing if successful or an error if unsuccessful.
    */

    return new Promise(function(resolve, reject) {
        try {
            chrome.storage.local.set(items, function() {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve()
                } // if
            })
        } catch (error) {
            reject(error)
        } // try
    }) // promise
} // storage.local.set