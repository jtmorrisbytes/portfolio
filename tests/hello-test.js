module.exports = {
    "hello-world": function(browser) {
        browser.url("http://localhost:3000")
        browser.pause(5000)
        browser.end()
    }
}