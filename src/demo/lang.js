const { Feature, Scenario } = require("./feature")
const { Logger } = require("./logger")

const CONFIG = {
	feature:"FEATURE",
	scenario:"SCENARIO",
	given:"GIVEN",
	when:"WHEN",
	then:"THEN",
	caseSensitive:true,
}

/**
 * parse Features with config 
 * @param {String} code 
 * @returns {Array<Feature>}
 */
function parse(code){
	Logger.warn("parse is not fully implemented")
	const rexRules = [
		`(${CONFIG.feature})`+"\\s+(.*?)\\n",
		"\\s+("+CONFIG.scenario+")\\s+(.*?)\\n",
		"\\s+("+CONFIG.given+")\\s+(.*?)\\n",
		"\\s+("+CONFIG.when+")\\s+(.*?)\\n",
		"\\s+("+CONFIG.then+")\\s+(.*?)\\n",
	]
	const rexFlags = ["g",CONFIG.caseSensitive?"i":""]
	const rex = new RegExp(rexRules.join('|'),rexFlags.join(''))
	const matches = (code.matchAll(rex)||[])
	const features = []
	const lasts = {
		feature:null,
		scenario:null,
	}
	const CValues = Object.values(CONFIG)
	const CKeys = Object.keys(CONFIG)
	function getFunction(){
		return ()=>{}
	}
	for(const match of matches){
		const values = match.filter(Boolean)
		const type = CKeys[CValues.indexOf(values[1])]
		const name = values[2]
		switch(type){
			case "feature":
				lasts.feature = new Feature(name);
				features.push(lasts.feature);
				break;
			case "scenario":
				lasts.scenario = new Scenario()
				lasts.feature.addScenraio(lasts.scenario)
			case "given":
				lasts.scenario.given(getFunction(name))
				break;
			case "when":
				lasts.scenario.when(getFunction(name))
				break;
			case "then":
				lasts.scenario.then(getFunction(name))
				break;
		}
	}
	return features
}

module.exports = {CONFIG,parse}