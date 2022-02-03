import { Component, OnInit, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http'
import { Observable, BehaviorSubject, concat } from 'rxjs';

import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { NodeModel } from '../_models/node/node.model';
import { FlatNodeModel } from '../_models/node/flatNode.model';
import { NodeService } from '../_services/node/node.service';


@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss'],
  providers: [NodeService],
})
export class NodesComponent {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<FlatNodeModel, NodeModel>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<NodeModel, FlatNodeModel>();

  /** A selected parent node to be inserted */
  selectedParent: FlatNodeModel | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<FlatNodeModel>;

  treeFlattener: MatTreeFlattener<NodeModel, FlatNodeModel>;

  dataSource: MatTreeFlatDataSource<NodeModel, FlatNodeModel>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<FlatNodeModel>(true /* multiple */);

  constructor(private service: NodeService) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren,
    );

    this.treeControl = new FlatTreeControl<FlatNodeModel>(this.getLevel, this.isExpandable);
    
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.initialize();
  }

  async initialize() {
    await this.service.getAllNodes().subscribe(data => {
      this.updateDataSource(data);
    });
  }

  getLevel = (node: FlatNodeModel) => node.level;

  isExpandable = (node: FlatNodeModel) => node.expandable;

  getChildren = (node: NodeModel): NodeModel[] => node.children;

  hasChild = (_: number, _nodeData: FlatNodeModel) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: FlatNodeModel) => _nodeData.name === '';

  /** Method that updates the data source */
  public updateDataSource(dataObjects: NodeModel[]) {
    // save node's expanded state
    const expandedNodesIds: number[] = [];
    if (this.treeControl.dataNodes) {
      this.treeControl.dataNodes.forEach((node: FlatNodeModel) => {
        if (this.treeControl.isExpandable(node) && this.treeControl.isExpanded(node)) {
          const nestedNode = this.flatNodeMap.get(node);
          expandedNodesIds.push(nestedNode!.id);
        }
      });
    }
      
    // update data source
    this.dataSource.data = dataObjects;
      
    // restore node's expanded state
    this.treeControl.dataNodes
      .filter(node => {
        const nestedNode = this.flatNodeMap.get(node);
        return this.checklistSelection.isSelected(node) || expandedNodesIds.find(id => id === nestedNode!.id)
      })
      .forEach(nodeToExpand => this.treeControl.expand(nodeToExpand));
  }

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: NodeModel, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.name ? existingNode : new FlatNodeModel();
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: FlatNodeModel): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: FlatNodeModel): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: FlatNodeModel): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: FlatNodeModel): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: FlatNodeModel): void {
    let parent: FlatNodeModel | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: FlatNodeModel): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: FlatNodeModel): FlatNodeModel | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
  







  /** Select the category so we can insert the new item. */
  async addNewItem(node: FlatNodeModel | null, nodeName: string) {
    const parentNode = (node != null ? this.flatNodeMap.get(node) : null);
    
    await this.service.createNode(parentNode!, nodeName)
      .subscribe({
          next: data => console.log('data:', data),
          error: error => this.handleError(error)
      })
      .add(() => this.initialize());

    if (node != null) this.treeControl.expand(node);
  }

  /** Save the node to database */
  async saveNode(node: FlatNodeModel, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    
    await this.service.modifyNode(nestedNode!, itemValue)
      .subscribe({
          next: data => console.log('data:', data),
          error: error => this.handleError(error)
      })
      .add(() => this.initialize());
  }

  /** Sort selected nodes by level, then delete. */
  async deleteSelectedNodes() {
    const sortedNodes = this.checklistSelection.selected.sort((a,b) => (a.level > b.level) ? -1 : ((b.level > a.level) ? 1 : 0));

    const observables = sortedNodes.map(node => {
      const nestedNode = this.flatNodeMap.get(node);
      console.log(node);
      return this.service.deleteNode(nestedNode!.id)
    });

    await concat(...observables)
      .subscribe({
        next: data => console.log('data:', data),
        error: error => this.handleError(error)
      })
      .add(() => this.initialize());
  }

  handleError(error: HttpErrorResponse) {
    // this.errorMessage = error.message;
    console.error('There was an error!', error);
  }
}
