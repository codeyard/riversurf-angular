import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'prependUrlProtocol'
})
export class PrependUrlProtocolPipe implements PipeTransform {

    transform(value: string): string {
        return (value.startsWith('http://') || value.startsWith('https://'))
            ? value
            : 'https://' + value;
    }
}
