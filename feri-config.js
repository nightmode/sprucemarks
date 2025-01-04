module.exports = function(feri) {
    //---------
    // Aliases
    //---------
    const { config } = feri

    //----------------
    // Include Prefix
    //----------------
    config.includePrefix = '-'

    //----------------------
    // Source to Dest Tasks
    //----------------------
    config.map.sourceToDestTasks.css  = ['copy']
    config.map.sourceToDestTasks.html = ['copy']
    config.map.sourceToDestTasks.js   = ['copy']
    config.map.sourceToDestTasks.json = ['copy']
    config.map.sourceToDestTasks.png  = ['copy']
    config.map.sourceToDestTasks.svg  = ['copy']
    config.map.sourceToDestTasks.woff = ['copy']

    //---------
    // Options
    //---------
    config.option.clean      = true
    config.option.build      = true
    config.option.watch      = true
    config.option.extensions = false
    config.option.debug      = false

    //-------
    // Paths
    //-------
    config.path.source = './source'
    config.path.dest   = './deploy'
}