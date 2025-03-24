function assertType(value,type=null){
	let passed = false
	if(typeof type === "string"){
		if(typeof value === type.toLowerCase())return
	}
	if(value instanceof type)return
	throw `invalid type ...`
}

module.exports = {
	assertType
}