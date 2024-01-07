import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(
    text: any,
    length: number = 20,
    showAll: boolean = false,
    suffix: string = '...'
  ): any {
    if (showAll || typeof text !== 'string') {
      return text;
    }

    if (text.length > length) {
      const truncatedText = text.substring(0, length).trim();
      return truncatedText + suffix;
    }

    return text;
  }
}
