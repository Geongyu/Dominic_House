module.exports = (function () {
    return {
        local: { // localhost
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '111111',
            database: 'board'
        },
        real: { // real server db info
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '111111',
            database: 'board'
        },
        dev: { // dev server db info
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '111111',
            database: 'board'
        }
    }
})();