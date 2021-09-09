import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SyncService {

    protected PROTOCOL;
    protected PATH_ENDPOINT;

  constructor(private httpClient: HttpClient) { }
}
