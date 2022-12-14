import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { AppController } from './app.controller';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { BoardController } from './board/board.controller';
import { BoardService } from './board/board.service';
import { BoardModule } from './board/board.module';
import { AlcoholController } from './alcohol/alcohol.controller';
import { AlcoholService } from './alcohol/alcohol.service';
import { AlcoholModule } from './alcohol/alcohol.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testEntity } from './movies/entities/test.entity';
import { ConfigModule } from '@nestjs/config';
import { env } from 'process';
import { UserEntity } from './entities/user.entity';
import { BoardEntity } from './entities/board.entity';
import { CommentEntity } from './entities/comment.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { WeatherService } from './weather/weather.service';
import { WeatherController } from './weather/weather.controller';
import { WeatherModule } from './weather/weather.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './user/jwt/jwt.strategy';
import { RecommandController } from './recommand/recommand.controller';
import { RecommandService } from './recommand/recommand.service';
import { RecommandModule } from './recommand/recommand.module';
import { dataEntity } from './entities/data.entity';
import { AlchoEntity } from './entities/alcho.entity';
import { FavoriteEntity } from './entities/favoritList.entity';
import { ImgEntity } from './entities/img.entity';
import { AlchoCommentEntity } from './entities/alchoComment.entity';
import { CocktailController } from './cocktail/cocktail.controller';
import { CocktailModule } from './cocktail/cocktail.module';
import { CocktailEntity } from './entities/cocktail.entity';
import { AlchoRecipeEntity } from './entities/alchoRecipe.entity';
import { JuiceEntity } from './entities/juice.entity';
import { JuiceRecipeEntity } from './entities/juiceRecipe.entity';
import { RatingEntity } from './entities/rating.entity';
import { BoardRecommandEntity } from './entities/boardRecommand.entity';
import { CocktailCommentEntity } from './entities/cocktailComment.entity';
import { AlchoCategoryEntity } from './entities/alchoCategory.entity';
import { AdminController } from './admin/admin.controller';
import { AdminService } from './admin/admin.service';
import { AdminModule } from './admin/admin.module';
import { UnitEntity } from './entities/unit.entity';

@Module({  //?????????????????? ???????????? ?????? ????????? ????????? ??? ??????
  
  imports: [MoviesModule, UserModule, BoardModule, AlcoholModule,WeatherModule, 
    RecommandModule, AlcoholModule, CocktailModule, AdminModule,

    JwtModule.register({
      secret : process.env.secretOrKey,
      signOptions : {expiresIn: '60s'},
    }),

    ConfigModule.forRoot({
      isGlobal:true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.RDS_HOST,
      port: 3306,
      username: process.env.RDS_USER,
      password: process.env.RDS_PSWORD,
      database: process.env.RDS_DATABASE,
      entities: [testEntity,UserEntity, BoardEntity,CommentEntity,
                 dataEntity, AlchoEntity,FavoriteEntity,ImgEntity,
                 AlchoCommentEntity, CocktailEntity, AlchoRecipeEntity,
                 JuiceEntity,JuiceRecipeEntity,RatingEntity,BoardRecommandEntity,
                 CocktailCommentEntity,AlchoCategoryEntity,UnitEntity
                ],
      synchronize: false,
      logging : true,
      
    }),
    
   
    ], 
  controllers: [AppController,], //??????????????? express??? ????????? ?????? ?????? url??? ???????????? ????????? ?????????
  providers: [JwtStrategy, ],
}) 
export class AppModule {}   

