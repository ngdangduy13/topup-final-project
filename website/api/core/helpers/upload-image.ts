import * as multer from 'multer';
import * as path from 'path';
import * as crypto from 'crypto';

const tempFolder = path.join(__dirname, `../../../../../static/temps/images`);
const imageFilter = (_req: any, file: any, cb: any) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        cb(new Error('Images only'), false);
    }
    // tslint:disable-next-line:no-null-keyword
    return cb(null, true);
};

export const saveFile = () => {
    const storage = multer.diskStorage({
        destination: (_req: any, _file, cb) => {
            switch (_req.params.title) {
                default:
                    // tslint:disable-next-line:no-null-keyword
                    cb(null, tempFolder);
            }
        },
        filename: async (_req: any, file, cb) => {
            if (_req.params.id) {
                // tslint:disable-next-line:no-null-keyword
                cb(null, _req.params.id + '.' + file.mimetype.slice(6, 10));
            } else {
                // tslint:disable-next-line:no-null-keyword
                cb(null, `${await crypto.pseudoRandomBytes(16).toString('hex')}.${file.mimetype.slice(6, 10)}`);
            }
        },
    });
    const upload = multer({ storage, fileFilter: imageFilter });
    return upload;
};
