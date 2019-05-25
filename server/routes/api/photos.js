module.exports = (app, gfs) => {
    app.get('/api/photos/:filename', async (req, res) => {
        const file = await gfs.files.findOne({ filename: req.params.filename });

        if (!file || file.length === 0) {
            return res.status(404).json({ messsage: "No file exists." })
        }

        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
    })

    // app.delete('/api/photos/:filename', async (req, res) => {
    //     try {
    //         await gfs.remove({ filename: req.params.filename, root: "photos" });
    //         res.status(200).json({ deleted: true })
    //     } catch(err) {
    //         res.status(500).json(err);
    //     }
    // })
}