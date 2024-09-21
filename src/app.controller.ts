import { Controller, Get, HttpStatus, ParseFilePipeBuilder, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './upload/files',
      filename: (req, file, cb) => {
        cb(null, file.originalname)
      }
    })
  }))
  uploadFile(@UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: 'png'
      })
      .addMaxSizeValidator({
        maxSize: 1000
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
      })
  )
  file: Express.Multer.File) {
    console.log(file)
    return {
      message: 'file uploaded successfully'
    }
  }

  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './files',
  //       filename: (req, file, cb) => {
  //         const fileNameSplit = file.originalname.split('.');
  //         const fileExt = fileNameSplit[fileNameSplit.length - 1];
  //         cb(null, `${Date.now()}.${fileExt}`);
  //       },
  //     }),
  //   }),
  // )
  // @Post("/upload")
  // create(
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   console.log(file)
  // }

}
