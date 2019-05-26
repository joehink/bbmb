module.exports = (app, gfs) => {
    app.get('/api/photos/:filename', async (req, res) => {
        const file = await gfs.files.findOne({ filename: req.params.filename });

        if (!file) {
            return res.status(404).json({ messsage: "No file exists." })
        }

        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
    })
}