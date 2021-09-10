import {Pipe, PipeTransform} from '@angular/core';
import {Division} from "../../core/models/division.type";
import {ThemePalette} from "@angular/material/core";

@Pipe({
    name: 'divisionColor'
})
export class DivisionColorPipe implements PipeTransform {

    transform(value: Division): ThemePalette {
        switch (value) {
            case "male":
                return "primary";
            case "female":
                return "accent";
            case "kid":
                return "warn";
        }
    }
}
