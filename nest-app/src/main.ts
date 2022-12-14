import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
import cors from 'cors';
async function bootstrap() {
  
  const app = await NestFactory.create(AppModule, {cors:true});
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist : true,  //유효성이 안맞으면 접근이 안되게
      forbidNonWhitelisted : true, //이상한걸 보내면 아예 막아버림
      transform : true, //유저가 보낸 데이터를 우리가 원하는 타입으로 바꿔줌 개꿀임
      
    })  //유효성을 검사하기 위한 일종의 미들웨어 api에서 받은걸 타입을 맞춰줌
  );

  app.use(
    session({
      secret : "MY_SESSION_ID", //세션아이디
      resave: false, //세션이 수정되지 않아도 지속적으로 저장하게 하는 옵션
      saveUninitialized: false //초기화되지 않는 세션을 저장하게 함
    }),

  ) 

  app.enableCors({
    credentials: true, // << totally ruins it
  })

  /*Swagger 자동 api 문서 생성*/ 
  const config = new DocumentBuilder()
    .setTitle('칵테일 서버 API')
    .setDescription('칵테일 서버 API입니다')
    .setVersion('1.0')
    .addTag('alcohol')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(5000);
}
bootstrap();
