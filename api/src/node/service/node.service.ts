import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NodeEntity } from '../models/node.entity';
import { NodeI } from '../models/node.interface';
import { TreeRepository } from 'typeorm';

@Injectable()
export class NodeService {
    constructor(
        @InjectRepository(NodeEntity)
        private nodeRepository: TreeRepository<NodeEntity>
    ) { }

    findAllNodes() {
        return this.nodeRepository.findTrees();
    }

    createNode(node: NodeI) {
        return this.nodeRepository.save(node);
    }

    findOneNode(id: string) {
        return this.nodeRepository.findOne(id);
    }

    updateNode(node: NodeI) {
        return this.nodeRepository.save(node);
    }

    removeNode(id: number) {
        this.nodeRepository.delete(id);
    }
}
