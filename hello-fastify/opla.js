// Accessibile solo a questo plugin e ai suoi children
async function opla (app, options) {
    app.decorate('foo', 'bar');
}

export default opla;