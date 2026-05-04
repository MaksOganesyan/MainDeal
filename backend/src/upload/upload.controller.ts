import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CookieAuthGuard } from '../auth/guards/cookie.guard';

const createMulterConfig = (destinationFolder: string) => ({
  storage: diskStorage({
    destination: `./uploads/${destinationFolder}`,
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return callback(
        new BadRequestException('Only image files are allowed!'),
        false
      );
    }
    callback(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

@Controller('upload')
@UseGuards(CookieAuthGuard)
export class UploadController {
  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', createMulterConfig('avatars'))
  )
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return {
      filename: file.filename,
      path: `/uploads/avatars/${file.filename}`,
      url: `/uploads/avatars/${file.filename}`,
    };
  }

  @Post('deal')
  @UseInterceptors(
    FilesInterceptor('files', 10, createMulterConfig('deals'))
  )
  uploadDealImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    return files.map((file) => ({
      filename: file.filename,
      path: `/uploads/deals/${file.filename}`,
      url: `/uploads/deals/${file.filename}`,
    }));
  }

  @Post('announcement')
  @UseInterceptors(
    FilesInterceptor('files', 10, createMulterConfig('announcements'))
  )
  uploadAnnouncementImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    return files.map((file) => ({
      filename: file.filename,
      path: `/uploads/announcements/${file.filename}`,
      url: `/uploads/announcements/${file.filename}`,
    }));
  }

  @Post('portfolio')
  @UseInterceptors(
    FilesInterceptor('files', 10, createMulterConfig('portfolio'))
  )
  uploadPortfolioImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    return files.map((file) => ({
      filename: file.filename,
      path: `/uploads/portfolio/${file.filename}`,
      url: `/uploads/portfolio/${file.filename}`,
    }));
  }

  @Post('equipment')
  @UseInterceptors(
    FilesInterceptor('files', 10, createMulterConfig('equipment'))
  )
  uploadEquipmentImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    return files.map((file) => ({
      filename: file.filename,
      path: `/uploads/equipment/${file.filename}`,
      url: `/uploads/equipment/${file.filename}`,
    }));
  }
}
