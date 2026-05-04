import { diskStorage } from 'multer';
import { extname } from 'path';

export const uploadConfig = {
    storage: diskStorage({
        destination: './uploads/orders',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        }
    }),
    fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
}; 