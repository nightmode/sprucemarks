<js>
    const theme = args[0]
    const icon  = args[1]
    const page  = 'preferences'
</js><!doctype html>
<html lang="en" class="<js>write(theme)</js>" id="html">
<head>
    <js>include('/page/include/-head.html')</js>
    <link rel="icon" href="/images/icon/icon-<js>write(icon)</js>-32.png?version=2025.6.26.0" type="image/png">
</head>
<body class="<js>write(theme)</js>">

    <div class="wrapper">
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
                <li>
                    <a class="page" href="/page/<js>write(theme)</js>/<js>write(icon)</js>/tools.html">
                        <span>Tools</span>
                    </a>
                </li>
                <li class="active">
                    <a class="page active" tabindex="-1">
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

            <h1>Preferences</h1>

            <div class="box">
                <div class="box-inner">
                    <h3 class="no-margin-bottom">
                        Theme
                    </h3>

                    <ol class="preference-row">
                        <li>
                            <input type="radio" is="custom-radio" data-preference="theme" name="theme" value="automatic" id="radio-theme-automatic">

                            <label for="radio-theme-automatic">
                                Automatic
                            </label>
                        </li>
                        <li>
                            <input type="radio" is="custom-radio" data-preference="theme" name="theme" value="light" id="radio-theme-light">

                            <label for="radio-theme-light">
                                Light
                            </label>
                        </li>
                        <li>
                            <input type="radio" is="custom-radio" data-preference="theme" name="theme" value="dark" id="radio-theme-dark">

                            <label for="radio-theme-dark">
                                Dark
                            </label>
                        </li>
                    </ol>
                </div><!-- box-inner -->
            </div><!-- box -->

            <div class="box">
                <div class="box-inner">
                    <h3 class="no-margin-bottom">
                        Icon Color
                    </h3>

                    <ol class="preference-row">
                        <li>
                            <input type="radio" is="custom-radio" data-preference="icon_color" name="icon_color" value="automatic" id="radio-icon-color-automatic">

                            <label for="radio-icon-color-automatic">
                                Automatic
                            </label>
                        </li>
                        <li>
                            <input type="radio" is="custom-radio" data-preference="icon_color" name="icon_color" value="light" id="radio-icon-color-light">

                            <label for="radio-icon-color-light">
                                Light
                            </label>
                        </li>
                        <li>
                            <input type="radio" is="custom-radio" data-preference="icon_color" name="icon_color" value="dark" id="radio-icon-color-dark">

                            <label for="radio-icon-color-dark">
                                Dark
                            </label>
                        </li>
                        <li>
                            <input type="radio" is="custom-radio" data-preference="icon_color" name="icon_color" value="green" id="radio-icon-color-green">

                            <label for="radio-icon-color-green">
                                Green
                            </label>
                        </li>
                    </ol>
                </div><!-- box-inner -->
            </div><!-- box -->

            <div class="box">
                <div class="box-inner">
                    <h3>Icon Action</h3>

                    <p>
                        The page the browser icon should open by default.
                    </p>

                    <ol class="preference-row">
                        <li>
                            <input type="radio" is="custom-radio" data-preference="icon_action" name="icon_action" value="options" id="radio-icon-action-options">

                            <label for="radio-icon-action-options">
                                Options
                            </label>
                        </li>
                        <li>
                            <input type="radio" is="custom-radio" data-preference="icon_action" name="icon_action" value="tools" id="radio-icon-action-tools">

                            <label for="radio-icon-action-tools">
                                Tools
                            </label>
                        </li>
                        <li>
                            <input type="radio" is="custom-radio" data-preference="icon_action" name="icon_action" value="preferences" id="radio-icon-action-preferences">

                            <label for="radio-icon-action-preferences">
                                Preferences
                            </label>
                        </li>
                    </ol>
                </div><!-- box-inner -->
            </div><!-- box -->
        </div><!-- content -->
    </div><!-- wrapper -->

    <js>include('/page/include/-scroll-nav.html')</js>

    <script src="/js/browser-polyfill.js?version=2025.6.26.0"></script>
    <script src="/js/shared.js?version=2025.6.26.0"></script>
    <script src="/js/page/preferences.js?version=2025.6.26.0"></script>

</body>
</html>