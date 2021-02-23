const vscode = require("vscode");
const axios = require("axios");

/**
 * @param {vscode.ExtensionContext} context
 */

var baseUrl =
  "https://api.stackexchange.com/search/advanced?answered=true&sort=votes&site=stackoverflow.com&q=";

async function activate(context) {
  let disposable = await vscode.commands.registerCommand(
    "stack-search.stackSearch",
    async function () {
      var query = await vscode.window.showInputBox({
        placeHolder: "Search Stackoverflow",
      });

      if (query === undefined || query === null) {
        return;
      } else {
        await axios.get(baseUrl + query).then(async (res) => {
          var question = await vscode.window.showQuickPick(
            res.data.items.map((entry) => {
              return {
                label: entry.title.replace("&#39;", "'").replace("&quot;", "\""),
                link: entry.link,
              };
            })
          );
          if (question === undefined) {
            vscode.window.showInformationMessage("No question selected");
            return;
          } else {
            vscode.env.openExternal(question.link);
          }
        });
      }
    }
  );
  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
