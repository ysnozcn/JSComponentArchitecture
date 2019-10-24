import { Page } from "../base/page";
import { Button_1 } from "../../components/buttons/buttons";
import "./styles/test.scss";

export class NewsDetailPage extends Page {

    private StringUpperCase(text:string){
         return text.toUpperCase();
    }

    constructor () {
        super();
        this.onLoad();
        this.onFullLoad();
    }

    onLoad(): void {
        const test:string = "asdadsas";
        const button = new Button_1("deneme5");
        console.log(this.StringUpperCase("testdeneme"));
    }

    onFullLoad(): void {
        console.log('test');
	}   
}

new NewsDetailPage;