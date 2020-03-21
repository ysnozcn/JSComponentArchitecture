import { Page } from 'Pages/base/page';
import { Button_1 } from 'Components/buttons/';

console.log(Button_1);
export class NewsDetailPage extends Page {

    public StringUpperCase(text:string){
         return text.toUpperCase();
    }

    constructor () {
        super();
        this.onLoad();
        this.onFullLoad();
    }

    onLoad(): void {
        const test:string = "asdadsas";
        const button = new Button_1;
        const button2 = button.Button2("deneme button2");
        console.log(this.StringUpperCase("testdeneme"));
    }

    onFullLoad(): void {
        console.log('test');
	}   
}