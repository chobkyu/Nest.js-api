import { Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserCreateDto } from './dto/userCreate.dto';
import { UserEntity } from './entities/user.entity';
import { userStatus } from './enumType/userStatus';
import { UserRepository } from './repository/user.repository';
import { JwtService } from '@nestjs/jwt';
import { FavoriteEntity } from './entities/favoritList.entity';

@Injectable()
export class UserService {
    //constructor 하면서 에러남
    constructor(private readonly repository : UserRepository, private jwtService: JwtService) {}
    private readonly logger = new Logger(UserService.name);

    getAll() : Promise<UserEntity[]>{
        return this.repository.find();
    }

    async insertUser(userData:UserCreateDto) :Promise<object> {
        /*Dto를 entitiy에 저장*/
        let user = new UserEntity();
        user.name = userData.name;
        user.age = parseInt(userData.age);
        user.birth = new Date(userData.birth);
        user.sex = userData.sex;
        user.nickname = userData.nickname;
        user.userId = userData.userId;
        user.password = userData.password;
        user.email = userData.email;
        user.job = userData.job;
        if(userData.loginType == 'g') {
            user.userLoginType = userStatus.google;
        }else {
            user.userLoginType = userStatus.default;
        }
        
        let favorite = new Array();
        let i = 0;
        for(i;i<userData.favorite.length;i++){
           favorite.push(userData.favorite);
        }
        console.log(favorite);
        console.log(user.userLoginType);
                
        try{
            this.logger.debug("save console log" + (await this.repository.save(user)).name);
            const res = await this.repository.save(user);
               
            const payload = { id:res.id, email: user.email, name: user.name, nickname : user.nickname , sub: '0' };
            const loginToken = this.jwtService.sign(payload); 

            return {success:true,token:loginToken}
        }catch(err){
            this.logger.error(err)
            return {success:false, msg : "회원 가입 중 에러발생"}
        }
    }

    async checkUser(userId : string) : Promise<object>{
         
        //console.log("res : "+res.);
        try{
            this.logger.log(userId);
            const res = await this.repository.createQueryBuilder('user')
            .where('userId = :id',{id :userId})
            .getOne();
            
            if(res==null){
                return {success:true}
            }else{
                return {success :false , msg : "이미 존재하는 아이디 입니다"}
            }
            
        }catch(err){
            this.logger.error(err)
            return {success:false, msg:"회원 조회 중 에러발생"};
        }
        
    }

    async chectEmail(email : string) : Promise<object>{  //token 
        try{
            const res = await this.repository.createQueryBuilder("user")
            .where('email = :email',{email:email})
            .getOne();

           
            if(res==null){
                return {success:true};
            }else{
                const payload = {id:res.id, email: email, name: res.name, nickname : res.nickname , sub: '0' };
                const loginToken = this.jwtService.sign(payload);

                console.log(loginToken);
                console.log(this.jwtService.decode(loginToken))// 토큰 디코딩하는 방법
                return {success:false, msg:'존재하는 사용자',token : loginToken};
            }
        }catch(err){
            this.logger.error(err);
            return {success:false, msg:"회원 조회 중 에러발생"};
        }
    }


    async checkNickName(nickname : string) : Promise<object>{
         
        //console.log("res : "+res.);
        try{
            this.logger.log(nickname);
            const res = await this.repository.createQueryBuilder('user')
                        .where('nickname = :nickname',{nickname :nickname})
                        .getOne();
            
            if(res==null){
                return {success:true, msg : "사용 가능한 닉네임 입니다"};
            }else{
                return {success :false , msg : "이미 존재하는 닉네임 입니다"};
            }
            
        }catch(err){
            this.logger.error(err)
            return {success:false, msg:"회원 조회 중 에러발생"};
        }
        
    }

    async selectUser(header) : Promise<UserCreateDto|object>{
        const head = header.split(' ');
        const token = this.jwtService.decode(head[1]);
        
        try{
            const res = await this.repository.createQueryBuilder('user')
                        .where('id=:id',{id:token['id']})
                        .getOne();
            return res;
        }catch(err){
            return {success:false}
        }
    }

}
