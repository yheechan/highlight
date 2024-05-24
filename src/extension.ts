import * as vscode from 'vscode';

function getColorForLine(length: number, minLength: number, maxLength: number): string {
    const greenComponent = Math.round(255 * (1 - (length - minLength) / (maxLength - minLength)));
    const redComponent = 255 - greenComponent;
    return `rgba(${redComponent}, ${greenComponent}, 0, 0.3)`; // Semi-transparent color
}

export function activate(context: vscode.ExtensionContext) {
    let decorationType = vscode.window.createTextEditorDecorationType({});

    let disposable = vscode.commands.registerCommand('extension.colorizeLines', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            // Clear previous decorations
            editor.setDecorations(decorationType, []); // Reset the decorations
            decorationType.dispose(); // Dispose the previous decoration type

            const text = editor.document.getText();
            const lines = text.split('\n');

            let maxLength = Math.max(...lines.map(line => line.length));
            let minLength = Math.min(...lines.map(line => line.length));

            lines.forEach((line, i) => {
                const range = new vscode.Range(i, 0, i, line.length);
                const color = getColorForLine(line.length, minLength, maxLength);

                // change the line
                // by giving a underline with this color and range
                editor.setDecorations(
                    vscode.window.createTextEditorDecorationType({
                        backgroundColor: color,
                        isWholeLine: true,
                    }),
                    [range]
                );
            });
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
}
