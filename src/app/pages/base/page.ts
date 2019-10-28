
export interface IOnLoadable {
	onLoad(): void;
	onFullLoad(): void;
}

export abstract class Page implements IOnLoadable {

	constructor() {
		console.log('ssss')
	}
	
	public onLoad() : void {}
	public onFullLoad() : void {}

	public testme(test:string){
		console.log(test);
	}

}