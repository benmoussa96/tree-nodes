import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { catchError, retry } from 'rxjs/operators';

import { NodeModel } from "src/app/_models/node/node.model";

@Injectable()
export class NodeService {
    static URL = '/api/node';

    constructor(public http: HttpClient) { }

    getAllNodes(): Observable<NodeModel[]> {
        return this.http.get<NodeModel[]>(NodeService.URL);
    }

    getOneNode(id: number): Observable<any> {
        return this.http.get(NodeService.URL + `/${id}`);
    }

    createNode(parentNode: NodeModel | null, newNodeName: string) {
        const newNode = { name: newNodeName, parent: parentNode };
        return this.http.post<NodeModel>(NodeService.URL, newNode);  
    }

    modifyNode(node: NodeModel, newNodeName: string) {
        node.name = newNodeName;
        return this.http.put<NodeModel>(NodeService.URL, node);
    }

    deleteNode(id: number) {
        return this.http.delete(NodeService.URL + `/${id}`);
    }
}