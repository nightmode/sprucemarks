# Sprucemarks

A web browser extension that automatically sorts your bookmarks.

Available in Chrome, Edge, and Firefox.

## Navigation

* [Install](#install)
* [Development](#development)
* [Test](#test)
* [Deploy](#deploy)
* [License](#license)

## Install

For Chrome, install via the `Sprucemarks` page on the [Chrome Web Store](https://chrome.google.com/webstore/detail/sprucemarks/fakeocdnmmmnokabaiflppclocckihoj).

For Edge, install via the `Sprucemarks` page on the [Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/hkgmpcaalcjjihcdkbnlnnhkppibepoa) site.

For Firefox, install via the `Sprucemarks` page on the [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/sprucemarks/) site.

## Development

Use the `log` setting inside `source/js/shared.js` to enable or disable console logs for various events and operations.

Use [Feri](https://github.com/nightmode/feri) to continually publish from the `source` directory to the `deploy` directory.

### Development in Chrome

Navigate to `chrome://extensions` and enable `developer mode`.

Use `load unpacked` and select `deploy` as the extension folder.

### Development in Edge

Navigate to `edge://extensions/` and enable `developer mode`.

Use `load unpacked` and select `deploy` as the extension folder.

### Development in Firefox

Navigate to `about:debugging` and enable `add-on debugging`.

Use `load temporary add-on` and select the `manifest.json` file within the `deploy` folder.

## Test

From the background service worker, run `await test()` to use the test suite.

## Deploy

No matter which platform you are deploying on, make sure the `log` setting inside `source/js/shared.js` is set to `false`. If left on, the user's extension will spend time logging information they will never see.

Update the change log under `/source/page/-about.html.jss` with any major changes. Also update the `Upgrade Complete` message in `/source/page/include/-show-message.html.jss` based on the new change log entry.

Increment the version in `/source/manifest.json`.

Search for `?version=` using the previous version and replace all occurrences with a new `?version=` string.

Run Feri one last time to make sure any changed files are processed from the `source` directory to the `deploy` directory.

### Deploy for Chrome

Make sure the Feri build tool is not running.

Zip up everything in the `deploy` directory.

Upload the zip file to the Chrome Web Store via the [Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard).

### Deploy for Edge

Edit `source/_locales/en/messages.json` and temporarily change the `extensionDescription.message` string to use the word `favorites` instead of `bookmarks`.

Run Feri once to publish from the `source` directory to the `deploy` directory.

Make sure the Feri build tool is not running.

Zip up everything in the `deploy` directory and set the zip file aside for a moment.

Use GitHub Desktop to discard the changes to `source/_locales/en/messages.json`.

Run the Feri build tool once to publish from the `source` directory to the `deploy` directory.

Upload the zip file to the Microsoft Edge Add-ons site via the [Partner Center](https://partner.microsoft.com/en-us/dashboard/microsoftedge/overview).

### Deploy for Firefox

Make sure the Feri build tool is not running.

Edit `source/manifest.json` to make the following temporary changes.

Replace the `background` object with the following two objects.

```
"background": {
    "scripts": ["background.js"]
},
"browser_specific_settings": {
    "gecko": {
        "id": "sprucemarks@___.addons.mozilla.org",
        "strict_min_version": "119.0"
    }
},
```

Replace the underscores in the ID of the pasted object with your username or another unique string that you always publish your extensions with.

Run Feri once to publish from the `source` directory to the `deploy` directory.

Make sure the Feri build tool is not running.

Zip up everything in the `deploy` directory and set the zip file aside for a moment.

Use GitHub Desktop to discard the changes to `source/manifest.json`.

Run the Feri build tool once to publish from the `source` directory to the `deploy` directory.

Upload the zip file to the Firefox Add-ons site via the [Developer Hub](https://addons.mozilla.org/en-US/developers/addons).

## License

[CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)

This work has been marked as dedicated to the public domain.