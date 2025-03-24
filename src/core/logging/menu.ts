const RESET = "\x1b[0m"
const SELECT = "\x1b[47m\x1b[30m"
const TITLE = "\x1b[1;4;36m"
const HIDDEN = "\x1b[2m"

class MenuItem{
	#name
	#handle
	constructor(name,handle){
		this.#name = name
		this.#handle = handle
	}
	click(){
		this.#handle?.()
	}
	#selected
	get selected(){
		return this.#selected
	}
	set selected(value){
		this.#selected = value
	}
	get formatedText():string{
		if(this.#selected){
			return `${SELECT}${this.#name}${RESET}`
		}
		return this.#name
	}
}
export class Menu{
	#items:Array<MenuItem> = []
	#selected
	#index = 0
	#name
	constructor(name=""){
		this.#name = name
	}
	setIndex(index){
		if(this.#items.length==0)return
		if(this.#selected)
			this.#selected.selected = false
		this.#index = (index + this.#items.length) % this.#items.length
		this.#selected = this.#items[this.#index]
		this.#selected.selected = true
	}
	addIndex(step=0){
		this.setIndex(this.#index+step||0)
	}
	createItem(name,handle){
		const item = new MenuItem(name,handle)
		this.#items.push(item)
		return this.#items.length
	}
	render(){
		console.clear()
		if(this.#name.length)
			console.log(`${TITLE}${this.#name}${RESET}\n`)
		this.#items.forEach(item=>console.log(item.formatedText))
		console.log(`\n\n ${HIDDEN}to exit : ^C (ctrl + C or cmd + C)${RESET}`)
	}
	click(){
		if(this.#selected)
			this.#selected.click()
	}
}
let MENU:Menu
export function setMenu(menu: Menu){
	MENU = menu;
}
function handleInput(key){
	if(!MENU)return
	key = key.toString("utf-8")
	let _key = key.charCodeAt()
	if(_key == 27){
		_key = _key*100 + key.charCodeAt(2)
	}
	switch(_key){
		case 2765:// ↑
		MENU.addIndex(-1);break;
		case 2766:// ↓
		MENU.addIndex(1);break;
		case 13:
			MENU.click();break;
		case 3: // Ctrl+C pour quitter
			process.exit();
	}
	MENU.render()
}

console.clear()
process.stdin.setRawMode(true)
process.stdin.resume()
process.stdin.on("data",handleInput)