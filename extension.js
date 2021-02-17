// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');
const fastXml = require('fast-xml-parser');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    let url = "https://stackoverflow.com/feeds"; 
	// Fetch Questions from stack overflow using axios and rss feeds
    let res = await axios.get(url);
	console.log(fastXml.parse(res.data));
    let questions = await fastXml.parse(res.data).feed.entry.map(entry =>{
		return{
			label: entry.title,
			detail: entry.summary,
			link: entry.id
		}
	});
	console.log(questions);
     

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('stack-search is Activated');
   

	let disposable = vscode.commands.registerCommand('stack-search.stackSearch', async function () {
		let article = await vscode.window.showQuickPick(questions,{
          matchOnDetail: true
		});
		console.log(article);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
