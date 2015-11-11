module.exports.tasks = {
    
    eslint: {
        target: [
            '<%= settings.webSrc %>/**/*.js',
            '<%= settings.server %>/**/*.js'
        ]
    }
}