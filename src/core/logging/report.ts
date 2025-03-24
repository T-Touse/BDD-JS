const RESET = "\x1b[0m"
const HIDDEN = "\x1b[2m"
const SEPARATOR = `${HIDDEN} > ${RESET}`
const ERROR = "\x1b[1;31m" // Red bold
const TITLE = "\x1b[1;36m" // Cyan bold

const STATUSCOLORS = {
	PASSED: "\x1b[1;32m", // Green bold
	FAILED: "\x1b[1;31m", // Red bold
	ERROR: "\x1b[1;35m",  // Magenta bold
	UNKNOWN:RESET,
};

const STATUSICONS = {
	PASSED: "\u2714", // Checkmark
	FAILED: "\u2718", // Cross
	ERROR: "\u2BC5", // Triangle
	UNKNOWN:"",
};
export enum ReportStatus{
	PASSED,FAILED,ERROR,BEFORE
}
function getStatus(status:ReportStatus){
	switch(status){
		case ReportStatus.PASSED:return "PASSED";
		case ReportStatus.FAILED:return "FAILED";
		case ReportStatus.ERROR:return "ERROR";
		default:
			return "UNKNOWN"
	}
}
function formatPath(path:string[]){
	return path.join(SEPARATOR)
}
function formatName(path:string[]){
	path = path.slice()
	const name = path.pop()
	return [...path.map(x=>`\t`),name].join('')
}
function formatTest(path:string[],status:ReportStatus,message?:string){
	const _status = getStatus(status)
	const end = path.length==1?"\n":""
	return `${STATUSCOLORS[_status]}${STATUSICONS[_status]} ${formatName(path)}${SEPARATOR}${STATUSCOLORS[_status]}${_status}${RESET}${message?`: ${message}`:""}${end}`
}
function formatErrorName(error:Error){
	const line = (error.stack??"?").match(/\d*/)||"?"
	const shortMessage = error.message.slice(0,error.message.indexOf("("))
	return `${ERROR}${error.name} : ${shortMessage} (line ${line})${RESET}`
}
function formatGroup(path:string[]){
	return formatPath(path.map(n=>`${TITLE}${n}${RESET}`))
}
export function report(path:string[],status:ReportStatus,result_error?:any){
	let text
	if(status == ReportStatus.BEFORE){
		text = formatGroup(path)
	}else if(result_error instanceof Error){
		text = formatTest(path,status,formatErrorName(result_error))
	}else{
		text = formatTest(path,status)
	}
	console.log(text)
}