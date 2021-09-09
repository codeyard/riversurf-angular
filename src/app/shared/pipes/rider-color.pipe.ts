import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'riderColor'
})
export class RiderColorPipe implements PipeTransform {

  transform(value: number): string {
      switch (value){
          default:
          case 0:
              return "yellow";
          case 1:
              return "red";
          case 2:
              return "blue";
          case 3:
              return "green";
      }
  }

}
