module.exports.tasks = {
    
    sass: {
        options: {
            sourceMap: true
        },
        dist: {
            files: {
                '<%= settings.webDist %>/styles/main.css': '<%= settings.webAssets %>/index.scss'
            }
        }
    }
}