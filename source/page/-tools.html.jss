<js>
    const theme = args[0]
    const icon  = args[1]
    const page  = 'tools'
</js><!doctype html>
<html lang="en" class="<js>write(theme)</js>" id="html">
<head>
    <js>include('/page/include/-head.html')</js>
    <link rel="icon" href="/images/icon/icon-<js>write(icon)</js>-32.png?version=2025.1.3.0" type="image/png">
</head>
<body class="<js>write(theme)</js> wide">

    <div id="wrapper" class="wrapper wide">
        <header>
            <js>include('/images/-logo.svg')</js>
            <h1>Sprucemarks</h1>
        </header>

        <nav>
            <ul>
                <li>
                    <a class="page" href="/page/<js>write(theme)</js>/<js>write(icon)</js>/options.html">
                        <span>Options</span>
                    </a>
                </li>
                <li class="active">
                    <a class="page active" tabindex="-1">
                        <span>Tools</span>
                    </a>
                </li>
                <li>
                    <a class="page" href="/page/<js>write(theme)</js>/<js>write(icon)</js>/preferences.html">
                        <span>Preferences</span>
                    </a>
                </li>
                <li>
                    <a class="page" href="/page/<js>write(theme)</js>/<js>write(icon)</js>/about.html">
                        <span>About</span>
                    </a>
                </li>
            </ul>
        </nav>

        <div id="loading" class="loading">
            <div>
                <js>include('/images/-loading.svg')</js>
                LOADING
            </div>
        </div><!-- loading -->

        <div id="content" class="content hidden">
            <js>include('/page/include/-show-message.html.jss')</js>

            <h1>Tools</h1>

            <div class="box">
                <div class="box-inner">
                    <p>
                        Tools for reviewing and improving your <span class="only-edge">favorites</span> <span class="only-non-edge">bookmarks</span> collection.
                    </p>

                    <ul>
                        <li>
                            Check for and optionally remove <a href="#empty-folders" class="scroll-to" data-scroll-to="empty-folders">empty folders</a>.
                        </li>
                        <li>
                            Check for and optionally remove <a href="#duplicate-favorites" class="only-edge scroll-to" data-scroll-to="duplicate-favorites">duplicate favorites</a><a href="#duplicate-bookmarks" class="only-non-edge scroll-to" data-scroll-to="duplicate-bookmarks">duplicate bookmarks</a>.
                        </li>
                        <li>
                            Check for and optionally remove <a href="#similar-favorites" class="only-edge scroll-to" data-scroll-to="similar-favorites">similar favorites</a><a href="#similar-bookmarks" class="only-non-edge scroll-to" data-scroll-to="similar-bookmarks">similar bookmarks</a>.
                        </li>
                        <li>
                            View and optionally clear your <a href="#bookmark-history" class="scroll-to" data-scroll-to="bookmark-history"><span class="only-edge">favorites</span><span class="only-non-edge">bookmark</span> history</a>.
                        </li>
                    </ul>
                </div><!-- box-inner -->
            </div><!-- box -->

            <h1 id="empty-folders" class="wide">
                Empty Folders
            </h1>

            <div class="box wide">
                <div class="box-inner">

                    <div id="tool-empty-folders">
                        <div class="loading hidden">
                            <div>
                                <js>include('/images/-loading.svg')</js>
                                LOADING
                            </div>
                        </div><!-- loading -->

                        <div class="tool-content">
                            <p class="no-margin-top">
                                Empty folders that contain no <span class="only-edge">favorites</span><span class="only-non-edge">bookmarks</span>.
                            </p>

                            <div class="grid-area visibility-hidden">
                                <div class="grid">
                                    <div class="grid-header">
                                        <div class="grid-item">
                                            Folder
                                        </div><!-- grid-item -->

                                        <div class="grid-item">
                                            Location
                                        </div><!-- grid-item -->

                                        <div class="grid-item">
                                            Select
                                        </div><!-- grid-item -->
                                    </div><!-- grid-header -->

                                    <div class="grid-rows">
                                        <!-- will be populated by javascript -->
                                    </div><!-- grid-rows -->
                                </div><!-- grid -->
                            </div><!-- grid-area -->

                            <div class="tool-control">
                                <p class="hidden-from-view viewing">
                                    <span class="viewing-text">
                                        <!-- will be populated by javascript -->
                                    </span>
                                    <a href class="viewing-show-all" data-show="empty-folders">Show All</a>
                                    <a href class="viewing-show-less" data-show="empty-folders">Show Less</a>
                                </p>

                                <div>
                                    <input id="button-remove-folders" type="button" value="Remove Folders" class="smaller" disabled><input id="button-remove-folders-busy" type="button" value="Processing" class="cursor-progress hidden smaller" disabled>
                                </div>
                            </div><!-- tool-control -->
                        </div><!-- tool-content -->
                    </div><!-- tool-empty-folders -->

                </div><!-- box-inner -->
            </div><!-- box -->

            <h1 id="duplicate-favorites" class="only-edge wide">
                Duplicate Favorites
            </h1>

            <h1 id="duplicate-bookmarks" class="only-non-edge wide">
                Duplicate Bookmarks
            </h1>

            <div class="box wide">
                <div class="box-inner">

                    <div id="tool-duplicate-bookmarks">
                        <div class="loading hidden">
                            <div>
                                <js>include('/images/-loading.svg')</js>
                                LOADING
                            </div>
                        </div><!-- loading -->

                        <div class="tool-content">
                            <p class="no-margin-top">
                                <span class="only-edge">Favorites</span><span class="only-non-edge">Bookmarks</span> that have the exact same URL.
                            </p>

                            <div class="grid-area visibility-hidden">
                                <div class="grid">
                                    <div class="grid-header">
                                        <div class="grid-item">
                                            Title
                                        </div><!-- grid-item -->

                                        <div class="grid-item">
                                            Location
                                        </div><!-- grid-item -->

                                        <div class="grid-item">
                                            URL
                                        </div><!-- grid-item -->

                                        <div class="grid-item">
                                            Select
                                        </div><!-- grid-item -->
                                    </div><!-- grid-header -->

                                    <div class="grid-rows">
                                        <!-- will be populated by javascript -->
                                    </div><!-- grid-rows -->
                                </div><!-- grid -->
                            </div><!-- grid-area -->

                            <div class="tool-control">
                                <p class="hidden-from-view viewing">
                                    <span class="viewing-text">
                                        <!-- will be populated by javascript -->
                                    </span>
                                    <a href class="viewing-show-all" data-show="duplicate-bookmarks">Show All</a>
                                    <a href class="viewing-show-less" data-show="duplicate-bookmarks">Show Less</a>
                                </p>

                                <div>
                                    <input id="button-remove-duplicates" type="button" value="Remove Duplicates" class="smaller" disabled><input id="button-remove-duplicates-busy" type="button" value="Processing" class="cursor-progress hidden smaller" disabled>
                                </div>
                            </div><!-- tool-control -->
                        </div><!-- tool-content -->
                    </div><!-- tool-duplicate-bookmarks -->

                </div><!-- box-inner -->
            </div><!-- box -->

            <h1 id="similar-favorites" class="only-edge wide">
                Similar Favorites
            </h1>

            <h1 id="similar-bookmarks" class="only-non-edge wide">
                Similar Bookmarks
            </h1>

            <div class="box wide">
                <div class="box-inner">

                    <div id="tool-similar-bookmarks">
                        <div class="loading hidden">
                            <div>
                                <js>include('/images/-loading.svg')</js>
                                LOADING
                            </div>
                        </div><!-- loading -->

                        <div class="tool-content">
                            <p class="no-margin-top">
                                <span class="only-edge">Favorites</span><span class="only-non-edge">Bookmarks</span> with similar URLs.
                            </p>

                            <div class="grid-area visibility-hidden">
                                <div class="grid">
                                    <div class="grid-header">
                                        <div class="grid-item">
                                            Title
                                        </div><!-- grid-item -->

                                        <div class="grid-item">
                                            Location
                                        </div><!-- grid-item -->

                                        <div class="grid-item">
                                            URL
                                        </div><!-- grid-item -->

                                        <div class="grid-item">
                                            Select
                                        </div><!-- grid-item -->
                                    </div><!-- grid-header -->

                                    <div class="grid-rows">
                                        <!-- will be populated by javascript -->
                                    </div><!-- grid-rows -->
                                </div><!-- grid -->
                            </div><!-- grid-area -->

                            <div class="tool-control">
                                <p class="hidden-from-view viewing">
                                    <span class="viewing-text">
                                        <!-- will be populated by javascript -->
                                    </span>
                                    <a href class="viewing-show-all" data-show="similar-bookmarks">Show All</a>
                                    <a href class="viewing-show-less" data-show="similar-bookmarks">Show Less</a>
                                </p>

                                <div>
                                    <input id="button-remove-bookmarks" type="button" value="Remove Bookmarks" class="smaller" disabled><input id="button-remove-bookmarks-busy" type="button" value="Processing" class="cursor-progress hidden smaller" disabled>
                                </div>
                            </div><!-- tool-control -->
                        </div><!-- tool-content -->
                    </div><!-- tool-similar-bookmarks -->

                </div><!-- box-inner -->
            </div><!-- box -->

            <h1 id="bookmark-history" class="wide">
                <span class="only-edge">Favorites</span> <span class="only-non-edge">Bookmark</span> History
            </h1>

            <div class="box wide">
                <div class="box-inner">

                    <div id="tool-bookmark-history">
                        <div class="loading hidden">
                            <div>
                                <js>include('/images/-loading.svg')</js>
                                LOADING
                            </div>
                        </div><!-- loading -->

                        <div class="tool-content">
                            <div class="show-recent-activity">
                                <div>
                                    Show Recent Activity:
                                </div>

                                <label>
                                    <input type="radio" name="bookmark-history-view" value="all" checked> <span>All</span>
                                </label>

                                <label>
                                    <input type="radio" name="bookmark-history-view" value="added"> <span>Added</span>
                                </label>

                                <label>
                                    <input type="radio" name="bookmark-history-view" value="modified"> <span>Modified</span>
                                </label>

                                <label>
                                    <input type="radio" name="bookmark-history-view" value="removed"> <span>Removed</span>
                                </label>
                            </div><!-- show-recent-activity -->

                            <div class="grid-area visibility-hidden">
                                <div class="grid">
                                    <div class="grid-header">
                                        <div class="grid-item">
                                            Title
                                        </div><!-- grid-item -->

                                        <div class="grid-item">
                                            Location
                                        </div><!-- grid-item -->

                                        <div class="grid-item">
                                            Activity
                                        </div><!-- grid-item -->

                                        <div class="grid-item grid-when">
                                            When
                                        </div><!-- grid-item -->
                                    </div><!-- grid-header-->

                                    <div id="tool-bookmark-history-rows" class="grid-rows">
                                        <!-- will be populated by javascript -->
                                    </div><!-- grid-rows -->
                                </div><!-- grid -->
                            </div><!-- grid-area -->

                            <div id="tool-bookmark-history-nav" class="tool-nav">
                                <div class="link">
                                    <a id="tool-bookmark-history-nav-first" href data-link="first">&lt;--</a>
                                </div>

                                <div class="link">
                                    <a id="tool-bookmark-history-nav-previous" href data-link="previous">&lt;-</a>
                                </div>

                                <div class="text">
                                    <span class="text-viewing">Viewing</span>
                                    <span id="tool-bookmark-history-nav-view">
                                        <!-- will be populated by javascript -->
                                    </span>
                                    <span id="tool-bookmark-history-nav-total">
                                        <!-- will be populated by javascript -->
                                    </span>
                                </div>

                                <div class="link">
                                    <a id="tool-bookmark-history-nav-next" href data-link="next">-&gt;</a>
                                </div>

                                <div class="link">
                                    <a id="tool-bookmark-history-nav-last" href data-link="last">--&gt;</a>
                                </div>
                            </div><!-- tool-nav -->

                            <div class="tool-control">
                                <p class="no-margin-top">
                                    Sprucemarks must be running when <span class="only-edge">favorites</span> <span class="only-non-edge">bookmarks</span> are added, modified, or removed in order to capture that activity.
                                </p>

                                <div>
                                    <input id="button-clear-history" type="button" value="Clear History" class="smaller" disabled><input id="button-clear-history-busy" type="button" value="Processing" class="cursor-progress hidden smaller" disabled>
                                </div>
                            </div><!-- tool-control -->

                        </div><!-- tool-content -->
                    </div><!-- tool-bookmark-history -->

                </div><!-- box-inner -->
            </div><!-- box -->

        </div><!-- content -->
    </div><!-- wrapper -->

    <div id="overlay" class="bookmark-viewer content">
        <div class="box no-margin">
            <div class="box-inner">
                <h1 id="bookmark-viewer-heading">
                    <!-- will be populated by javascript -->
                </h1>

                <table>
                    <tr>
                        <th>
                            Title
                        </th>
                        <td id="bookmark-viewer-title" class="overflow-wrap-anywhere">
                            <!-- will be populated by javascript -->
                        </td>
                    </tr>
                    <tr>
                        <th>
                            Location
                        </th>
                        <td id="bookmark-viewer-location" class="overflow-wrap-anywhere">
                            <!-- will be populated by javascript -->
                        </td>
                    </tr>
                    <tr id="bookmark-viewer-url-row">
                        <th>
                            URL
                        </th>
                        <td class="word-break-all">
                            <a id="bookmark-viewer-url" href rel="noopener noreferrer" target="_blank" tabIndex="-1">...</a><span id="bookmark-viewer-url-text"></span>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            ID
                        </th>
                        <td id="bookmark-viewer-id">
                            <!-- will be populated by javascript -->
                        </td>
                    </tr>
                    <tr>
                        <th id="bookmark-viewer-activity" class="text-capitalize">
                            <!-- will be populated by javascript -->
                        </th>
                        <td id="bookmark-viewer-when">
                            <!-- will be populated by javascript -->
                        </td>
                    </tr>
                </table>

                <p id="bookmark-viewer-info" class="info hidden">
                    <!-- will be populated by javascript -->
                </p>

                <p id="bookmark-viewer-info-extra" class="info hidden">
                    <!-- will be populated by javascript -->
                </p>

                <div class="control">
                    <input id="button-close" type="button" class="smaller" value="Close" tabIndex="-1">
                </div><!-- control -->
            </div><!-- box-inner -->
        </div><!-- box -->
    </div><!-- overlay -->

    <template id="template-bookmark-history-grid-row">
        <div class="grid-row">
            <div class="grid-item overflow-wrap-anywhere">
                <a href data-id="0-activity-123" class="bookmark">...</a>
            </div><!-- grid-item -->

            <div class="grid-item overflow-wrap-anywhere">
                <div class="location">...</div>
            </div><!-- grid-item -->

            <div class="grid-item">
                <div class="activity">...</div>
            </div><!-- grid-item -->

            <div class="grid-item grid-when">
                <div class="when" data-when="0">...</div>
            </div><!-- grid-item -->
        </div><!-- grid-row -->
    </template>

    <template id="template-bookmark-history-no-results">
        <div class="grid-row">
            <div class="grid-item grid-col-span-4">
                <div>
                    No <span class="bookmark-or-favorite">bookmark</span> history.
                </div>
            </div><!-- grid-item -->
        </div><!-- grid-row -->
    </template>

    <template id="template-duplicate-bookmarks-grid-row">
        <div class="grid-row">
            <div class="grid-item min-height overflow-wrap-anywhere">
                <a href data-id="0" class="bookmark">...</a>
            </div><!-- grid-item -->

            <div class="grid-item min-height overflow-wrap-anywhere">
                <div class="location">...</div>
            </div><!-- grid-item -->

            <div class="grid-item grid-url word-break-all">
                <a class="url" href rel="noopener noreferrer" target="_blank"></a><span class="url-text"></span>
            </div><!-- grid-item -->

            <div class="grid-item grid-checkbox">
                <input type="checkbox" is="custom-checkbox-duplicate-bookmarks" data-id="none">
            </div><!-- grid-item -->
        </div><!-- grid-row -->
    </template>

    <template id="template-duplicate-bookmarks-no-results">
        <div class="grid-row">
            <div class="grid-item grid-col-span-4">
                <div>
                    No duplicate <span class="bookmarks-or-favorites">bookmarks</span>.
                </div>
            </div><!-- grid-item -->
        </div><!-- grid-row -->
    </template>

    <template id="template-empty-folders-grid-row">
        <div class="grid-row">
            <div class="grid-item overflow-wrap-anywhere">
                <a href data-id="0" class="bookmark bookmark-folder">...</a>
            </div><!-- grid-item -->

            <div class="grid-item overflow-wrap-anywhere">
                <div class="location">...</div>
            </div><!-- grid-item -->

            <div class="grid-item grid-checkbox">
                <input type="checkbox" is="custom-checkbox-empty-folders" data-id="none">
            </div><!-- grid-item -->
        </div><!-- grid-row -->
    </template>

    <template id="template-empty-folders-no-results">
        <div class="grid-row">
            <div class="grid-item grid-col-span-3">
                <div>
                    No empty folders.
                </div>
            </div><!-- grid-item -->
        </div><!-- grid-row -->
    </template>

    <template id="template-similar-bookmarks-grid-row">
        <div class="grid-row">
            <div class="grid-item min-height overflow-wrap-anywhere">
                <a href data-id="0" class="bookmark">...</a>
            </div><!-- grid-item -->

            <div class="grid-item min-height overflow-wrap-anywhere">
                <div class="location">...</div>
            </div><!-- grid-item -->

            <div class="grid-item grid-url min-height word-break-all">
                <a class="url" href rel="noopener noreferrer" target="_blank"></a><span class="url-text"></span>
            </div><!-- grid-item -->

            <div class="grid-item grid-checkbox">
                <input type="checkbox" is="custom-checkbox-similar-bookmarks" data-id="none">
            </div><!-- grid-item -->
        </div><!-- grid-row -->
    </template>

    <template id="template-similar-bookmarks-no-results">
        <div class="grid-row">
            <div class="grid-item grid-col-span-4">
                <div>
                    No similar <span class="bookmarks-or-favorites">bookmarks</span>.
                </div>
            </div><!-- grid-item -->
        </div><!-- grid-row -->
    </template>

    <js>include('/page/include/-scroll-nav.html')</js>

    <script src="/js/browser-polyfill.js?version=2025.1.3.0"></script>
    <script src="/js/shared.js?version=2025.1.3.0"></script>
    <script src="/js/page/tools.js?version=2025.1.3.0"></script>

</body>
</html>