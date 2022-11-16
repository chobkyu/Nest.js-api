import { BoardEntity } from 'src/board/entities/board.entity';
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

enum userStatus{
    default="d",
    google="g",
    naver="n",
    kakao="k",
    normal="nor"
}
@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn('increment')
    id : number;

    @Column({length :30})
    name : string;

    @Column()
    age : number;

    @Column()
    birth : Date;

    @Column({length : 10})
    sex : string;

    @Column({length:30})
    nickname : string;

    @Column({length :30})
    userId : string;

    @Column({length:30})
    password : string;

    @Column({length:40})
    email : string;

    @Column({length:20})
    job : string;

    @Column({type :'enum', enum:userStatus})
    userLoginType : userStatus;

    @OneToMany((type)=>BoardEntity, (boardEntity)=> boardEntity.user)
    boardEntitys : BoardEntity[];

}