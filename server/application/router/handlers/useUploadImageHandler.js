const multer = require('multer');

const EXTENSIONS = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
};

module.exports = (answer, common, uploads) => {
    const upload = multer({
        storage: multer.diskStorage({
            destination: uploads.PATH,
            filename: (req, file, callback) => callback(null, `${common.guid()}${EXTENSIONS[file.mimetype]}`),
        }),
        limits: { fileSize: uploads.MAX_FILE_SIZE },
        fileFilter: (req, file, callback) => callback(null, file.mimetype in EXTENSIONS),
    }).single('image');

    return (req, res) => {
        upload(req, res, (error) => {
            if (error || !req.file) {
                return res.send(answer.bad(68));
            }
            return res.send(answer.good(`/${uploads.DIR}/${req.file.filename}`));
        });
    };
};
