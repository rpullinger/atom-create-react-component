"use babel";

import { CompositeDisposable, File, TextEditor } from "atom";
import templates from "./templates";

var treeView;
atom.packages.serviceHub.consume("tree-view", "^1.0.0", t => {
  treeView = t;
});

class NewComponentView {
  constructor() {
    const rootPath = atom.project.getDirectories()[0].realPath;
    this.path = `${rootPath}/src/components`;

    this.miniEditor = new TextEditor({ mini: true });
    this.miniEditor.element.addEventListener("blur", this.close.bind(this));
    this.element = document.createElement("div");
    this.element.classList.add("new-component-input");
    this.element.appendChild(this.miniEditor.element);

    this.panel = atom.workspace.addModalPanel({
      item: this,
      visible: false
    });

    atom.commands.add(
      "atom-text-editor, .tree-view .selected.directory",
      "new-component:toggle",
      this.toggle.bind(this)
    );
    atom.commands.add(
      this.miniEditor.element,
      "core:confirm",
      this.save.bind(this)
    );
    atom.commands.add(
      this.miniEditor.element,
      "core:cancel",
      this.close.bind(this)
    );
  }

  toggle(e) {
    // Update path if opened from treeview – to create in current folder
    if (e.currentTarget.getPath) {
      const paths = treeView.selectedPaths();
      if (paths.length) {
        console.log(paths[0]);
        this.path = paths[0];
      }
    }

    this.panel.isVisible() ? this.close() : this.open();
  }

  close() {
    this.miniEditor.setText("");
    this.panel.hide();
  }

  save(path) {
    const name = this.miniEditor.getText();
    this.createComponent(name, path);
    this.close();
  }

  open() {
    this.panel.show();
    this.miniEditor.element.focus();
  }

  async createFile(path, text) {
    const file = new File(`${path}`);
    await file.create();
    return await file.write(text);
  }

  addName(template, name) {
    return template.replace(/\$NAME/g, name);
  }

  createComponent(name) {
    const js = this.addName(templates.js, name);
    const css = this.addName(templates.css, name);

    this.createFile(`${this.path}/${name}/index.js`, js).then(() => {
      this.createFile(`${this.path}/${name}/style.module.css`, css).then(() => {
        this.showFile(name);
      });
    });
  }

  showFile(name) {
    atom.workspace.open(`${this.path}/${name}/index.js`, {
      initialLine: 4,
      initialColumn: 2
    });
  }
}

export default {
  activate(e) {
    return new NewComponentView();
  }
};
