import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { alchoRepository } from 'src/alcohol/repository/alcho.repository';
import { AlchoRecipteRepository } from 'src/cocktail/repository/AlchoRecipe.repository';
import { CocktailRepository } from 'src/cocktail/repository/Cocktail.repository';
import { JuiceRepository } from 'src/cocktail/repository/Juice.repository';
import { JuiceRecipeRepository } from 'src/cocktail/repository/JuiceRecipe.repository';
import { AlchoEntity } from 'src/entities/alcho.entity';
import { AlchoCategoryEntity } from 'src/entities/alchoCategory.entity';
import { JuiceEntity } from 'src/entities/juice.entity';
import { UnitEntity } from 'src/entities/unit.entity';
import { userStatus } from 'src/user/enumType/userStatus';
import { UserRepository } from 'src/user/repository/user.repository';
import { AlchoCategoryRepository } from './repository/alchoCategory.repository';
import { UnitRepository } from './repository/unit.repository';

@Injectable()
export class AdminService {
    private readonly logger = new Logger(AdminService.name);
    constructor(
        private jwtService :JwtService,
        private readonly cockRepository : CocktailRepository,
        private readonly alchoRepository : alchoRepository,
        private readonly juiceRepository : JuiceRepository,
        private readonly alchoRecipeRepository : AlchoRecipteRepository,
        private readonly juiceRecipeRepository : JuiceRecipeRepository,
        private readonly unitRepository : UnitRepository,
        private readonly alchoCategoryRepository : AlchoCategoryRepository,
        private readonly userRepository :UserRepository
    ){}

    async newCocktail(header){
        try{
            const token = this.jwtService.decode(header);

            const checkUser = await this.checkUser(token['id']);
            if(checkUser['success']){
                const alchoCategory = await this.alchoCategory();
                const unitCategory = await this.unitCategory();
                const juiceCategory = await this.juiceCategory();
    
                const res = {
                    alchoCategory,
                    unitCategory,
                    juiceCategory,
                }
    
                return res;
            }else{
                return {success:false, msg:"????????? ????????????"};
            }
            
        }catch(err){
            this.logger.error(err);
            return {success:false, msg:"????????? ?????? ????????? ?????? ??????"};
        }
    }

    async alchoCategory():Promise<AlchoEntity[]|object>{
        try{
            const res = await this.alchoRepository.find();
            return res; 
        }catch(err){
            this.logger.error(err);
            return {success: false , msg :"alchoCategory ?????? ??? ??????"};
        }
    }

    async unitCategory():Promise<UnitEntity[]|object>{
        try{
            const res = await this.unitRepository.find();
            return res;
        }catch(err){
            this.logger.error(err);
            return {success:false, msg : "unitCategory ?????? ??? ??????"};
        }
    }

    async juiceCategory():Promise<JuiceEntity[]|object>{
        try{
            const res = await this.juiceRepository.find();
            return res;
        }catch(err){
            this.logger.error(err);
            return {success:false, msg: "alcho ?????? ??? ??????"};
        }
    }

    async checkUser(id:number):Promise<object>{
        
        try{
            const res = await this.userRepository.createQueryBuilder('user')
                        .where("id=:id",{id:id})
                        .getOne();
            console.log(res);
            console.log(userStatus)
            if(res['userLoginType']===userStatus['admin']){
                return {success:true};
            }else{
                return {success:false};
            }
        }catch(err){
            this.logger.error(err);
            return {success:false ,msg:err};
        }
    }
}
