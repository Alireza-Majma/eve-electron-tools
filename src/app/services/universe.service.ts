import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Papa } from 'ngx-papaparse';
import { Subscription } from 'rxjs';
import { PapaParseResult } from 'ngx-papaparse/lib/interfaces/papa-parse-result';

@Injectable({
  providedIn: 'root'
})
export class UniverseService {
  private typeData = {};
  constructor(private http: HttpClient, private papa: Papa) {
    // Setup typeData
    this.initializeData('invTypes.csv', 'typeID', this.typeData).add(
      () => { // Hash-map validation function call-back
        if (this.getTypeName(670) === 'Capsule') {
          console.log('typeData initialized.');
        } else {
          throw new Error('typeData could not be parsed.');
        }
      }
    );
  }

  initializeData(fileName, key, store): Subscription {
    return this.http.get('./assets/' + fileName, { responseType: 'text' })
      .pipe(map((data: any) => data))
      .subscribe((data: any) => {
        this.papa.parse(data, {
          header: true,
          complete: (result: PapaParseResult) => {
            // Set the specified key to be the key in converting the csv array to a hash-map
            result.data.forEach(element => {
              store[element[key]] = element;
              delete store[element[key]][key];
            });
          }
        });
      }, error => console.error(error));
  }

  getTypeName(id: number): string {
    return this.typeData[id]['typeName'];
  }
}
