import {
    Body,
    Controller,
    Param,
    Get,
    Post,
    Put,
    Delete,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { NodeI } from '../models/node.interface';
import { NodeService } from '../service/node.service';

@Controller('node')
export class NodeController {
    constructor(private nodeService: NodeService) { }

    @Get()
    getAll() {
        return this.nodeService.findAllNodes();
    }

    @Post()
    create(@Body() node: NodeI) {
        return this.nodeService.createNode(node);
    }

    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.nodeService.findOneNode(id);
    }

    @Put()
    @ApiBody({ type: NodeI })
    update(@Body() node: NodeI) {
        return this.nodeService.updateNode(node);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        this.nodeService.removeNode(id);
    }
}
