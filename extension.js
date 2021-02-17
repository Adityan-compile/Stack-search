const vscode = require('vscode');
const axios = require('axios');
const fastXml = require('fast-xml-parser');


/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    let url = "https://stackoverflow.com/feeds"; 

    let res = await axios.get(url);
	console.log(fastXml.parse(res.data));
    let questions = await fastXml.parse(res.data).feed.entry.map(entry =>{
		return{
			label: entry.title,
			link: entry.id
		}
	});
     
	console.log(questions);

	let disposable = vscode.commands.registerCommand('stack-search.stackSearch', async function () {
		let article = await vscode.window.showQuickPick(questions);
		if(article == null){
			return
		}else{
			vscode.env.openExternal(article.link);
		}
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
