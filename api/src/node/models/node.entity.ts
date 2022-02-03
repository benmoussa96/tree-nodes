import {
    Entity,
    Tree,
    Column,
    PrimaryGeneratedColumn,
    TreeChildren,
    TreeParent,
    TreeLevelColumn,
} from 'typeorm';

@Entity()
@Tree('closure-table', {
    closureTableName: 'category_closure',
    ancestorColumnName: (column) => 'ancestor_' + column.propertyName,
    descendantColumnName: (column) => 'descendant_' + column.propertyName,
})
export class NodeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @TreeChildren()
    children: NodeEntity[];

    @TreeParent()
    parent: NodeEntity;
}
