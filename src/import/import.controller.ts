import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';

//https://docs.nestjs.com/techniques/file-upload
//https://github.com/expressjs/multer
import {FileInterceptor} from '@nestjs/platform-express'


import {Dto} from './dto'


//https://docs.nestjs.com/techniques/validation
//https://github.com/typestack/class-validator
import {validate, validateSync} from 'class-validator'

//https://nodejs.org/api/fs.html
import fs = require('fs');

//https://github.com/SheetJS/sheetjs
//https://github.com/SheetJS/sheetjs/tree/master/demos/typescript
import * as XLSX from 'xlsx'

@Controller('import')
export class ImportController {

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file) {

      //salvar arquivo
      fs.writeFileSync('src/arquivos/teste.xlsx', file.buffer);

      let workbook = XLSX.read(file.buffer);
      let worksheet = workbook.Sheets[workbook.SheetNames[0]];
      let arJSON  = XLSX.utils.sheet_to_json(worksheet);
      

      let rs = this.validateDTO(arJSON)

      let ocurrences = rs.filter(d =>{return d.ocurrence == true});

      
        return {rs}
    }


 validateDTO(req){

  for(let i of req){
    let rs = new Dto;

    i.ocurrence = false;
    i.msgOcurrence = ''

    rs.nome = i.nome;
    rs.idade = i.idade;
    rs.email = i.email;

    let ocurrence = validateSync(rs);

    if(ocurrence.length > 0){
      i.ocurrence = true;
      i.idOcurrence = i.id;
      i.msgOcurrence = Object.values(ocurrence[0].constraints).join();

    }
  }
  return req;

}

@Post('add')
create(@Body() createUserDto: Dto) {
  return 'This action adds a new user';
}
    
}
