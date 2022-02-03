import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeService } from './service/node.service';
import { NodeController } from './controller/node.controller';
import { NodeEntity } from './models/node.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([NodeEntity])
    ],
    providers: [NodeService],
    controllers: [NodeController],
})
export class NodeModule { }
