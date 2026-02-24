"use strict";
(self["webpackChunkjupyterlab_freeze_improved"] = self["webpackChunkjupyterlab_freeze_improved"] || []).push([["lib_index_js"],{

/***/ "./lib/freeze.js"
/*!***********************!*\
  !*** ./lib/freeze.js ***!
  \***********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FreezeWidget: () => (/* binding */ FreezeWidget),
/* harmony export */   changeState: () => (/* binding */ changeState)
/* harmony export */ });
/* harmony import */ var _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/cells */ "webpack/sharing/consume/default/@jupyterlab/cells");
/* harmony import */ var _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_cells__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_icons_fa__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-icons/fa */ "./node_modules/react-icons/fa/index.mjs");
/*
 * Licensed under the BSD 3-Clause License.
 *
 * Original work Copyright (c) 2023 Datadog, Inc.
 * Modifications Copyright (c) 2026 Marcus D. Bloice.
 */




function getState(cell) {
    /**
     * Get the state of a cell based on its metadata.
     *
     * @param cell - The cell to get the state of.
     * @returns The state of the cell.
     */
    if (!isSupportedCellType(cell)) {
        return 'normal';
    }
    if (cell.model.getMetadata('frozen') === true) {
        return 'frozen';
    }
    if (cell.model.getMetadata('editable') === false) {
        return 'read_only';
    }
    return 'normal';
}
function isSupportedCellType(cell) {
    return cell.model.type === 'code' || cell.model.type === 'markdown';
}
function updateMetadata(state, cell) {
    /**
     * Update the cell metadata & CSS classes. You must call `props.notebook.update`
     * after you're done updating cells to ensure the changes are immediately reflected.
     *
     * @param state - The state to set the cell to.
     * @param cell - The cell to set the state of.
     */
    // If the cell is not code or markdown, ignore it
    if (!isSupportedCellType(cell)) {
        return;
    }
    switch (state) {
        case 'normal':
            cell.model.setMetadata('editable', true);
            cell.model.setMetadata('deletable', true);
            cell.model.setMetadata('frozen', false);
            cell.removeClass('jp-mod-frozen');
            cell.removeClass('jp-mod-frozen-readonly');
            break;
        case 'read_only':
            cell.model.setMetadata('editable', false);
            cell.model.setMetadata('deletable', false);
            cell.model.setMetadata('frozen', false);
            cell.removeClass('jp-mod-frozen');
            cell.addClass('jp-mod-frozen-readonly');
            break;
        case 'frozen':
            cell.model.setMetadata('editable', false);
            cell.model.setMetadata('deletable', false);
            cell.model.setMetadata('frozen', true);
            cell.addClass('jp-mod-frozen');
            cell.removeClass('jp-mod-frozen-readonly');
            break;
    }
    cell.update();
}
function changeState(state, notebookPanel) {
    const notebook = notebookPanel.content;
    notebook.selectedCells.forEach(currentCell => {
        const currentState = getState(currentCell);
        const newState = currentState === state ? 'normal' : state;
        updateMetadata(newState, currentCell);
    });
    notebookPanel.update();
}
const FreezeComponent = (props) => {
    /**
     * Component for freezing cells in a notebook.
     *
     * @param props - The properties for the component.
     * @returns The rendered JSX element.
     */
    return (react__WEBPACK_IMPORTED_MODULE_2___default().createElement((react__WEBPACK_IMPORTED_MODULE_2___default().Fragment), null,
        react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", { title: "Lift restrictions from selected cells" },
            react__WEBPACK_IMPORTED_MODULE_2___default().createElement("button", { className: "jp-ToolbarButtonComponent jp-mod-minimal jp-Button", "aria-pressed": "false", "aria-disabled": "false", onClick: () => changeState('normal', props.notebook) },
                react__WEBPACK_IMPORTED_MODULE_2___default().createElement(react_icons_fa__WEBPACK_IMPORTED_MODULE_3__.FaLockOpen, null))),
        react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", { title: "Make selected cells read-only" },
            react__WEBPACK_IMPORTED_MODULE_2___default().createElement("button", { className: "jp-ToolbarButtonComponent jp-mod-minimal jp-Button", "aria-pressed": "false", "aria-disabled": "false", onClick: () => changeState('read_only', props.notebook) },
                react__WEBPACK_IMPORTED_MODULE_2___default().createElement(react_icons_fa__WEBPACK_IMPORTED_MODULE_3__.FaLock, null))),
        react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", { title: "Freeze selected cells" },
            react__WEBPACK_IMPORTED_MODULE_2___default().createElement("button", { className: "jp-ToolbarButtonComponent jp-mod-minimal jp-Button", "aria-pressed": "false", "aria-disabled": "false", onClick: () => changeState('frozen', props.notebook) },
                react__WEBPACK_IMPORTED_MODULE_2___default().createElement(react_icons_fa__WEBPACK_IMPORTED_MODULE_3__.FaAsterisk, null)))));
};
class FreezeWidget extends _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__.ReactWidget {
    constructor(notebook) {
        /**
         * Construct a new FreezeWidget.
         *
         * @param notebook - The notebook to use.
         */
        super();
        this.notebook = notebook;
        this._onDblClickCapture = this._handleDblClickCapture.bind(this);
        this._onKeyDownCapture = this._handleKeyDownCapture.bind(this);
        this.notebook.content.node.addEventListener('dblclick', this._onDblClickCapture, true);
        this.notebook.content.node.addEventListener('keydown', this._onKeyDownCapture, true);
        this.notebook.content.activeCellChanged.connect(this._onActiveCellChanged, this);
        this.notebook.content.stateChanged.connect(this._onStateChanged, this);
        this.notebook.context.ready.then(() => {
            var _a;
            const content = this.notebook.content;
            const length = ((_a = content.model) === null || _a === void 0 ? void 0 : _a.cells.length) || 0;
            // Loop through each cell in the notebook
            for (let i = 0; i < length; i++) {
                const cell = content.widgets[i];
                const state = getState(cell);
                updateMetadata(state, cell);
            }
            this.notebook.update();
        });
    }
    dispose() {
        if (this.isDisposed) {
            return;
        }
        this.notebook.content.node.removeEventListener('dblclick', this._onDblClickCapture, true);
        this.notebook.content.node.removeEventListener('keydown', this._onKeyDownCapture, true);
        this.notebook.content.activeCellChanged.disconnect(this._onActiveCellChanged, this);
        this.notebook.content.stateChanged.disconnect(this._onStateChanged, this);
        super.dispose();
    }
    _handleDblClickCapture(event) {
        const cell = this._findEventCell(event.target);
        if (!cell || cell.model.type !== 'markdown') {
            return;
        }
        if (cell.model.getMetadata('frozen') === true) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
    _handleKeyDownCapture(event) {
        if (event.key !== 'Enter' ||
            event.shiftKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.altKey) {
            return;
        }
        const activeCell = this.notebook.content.activeCell;
        if ((activeCell === null || activeCell === void 0 ? void 0 : activeCell.model.type) === 'markdown' &&
            activeCell.model.getMetadata('frozen') === true) {
            event.preventDefault();
            event.stopPropagation();
        }
    }
    _onActiveCellChanged(_, __) {
        // Notebook may unrender markdown later in the same event turn.
        queueMicrotask(() => this._enforceFrozenMarkdownView());
    }
    _onStateChanged(_, args) {
        if (args.name === 'mode' && args.newValue === 'edit') {
            this._enforceFrozenMarkdownView();
        }
    }
    _enforceFrozenMarkdownView() {
        const activeCell = this.notebook.content.activeCell;
        if (!activeCell ||
            activeCell.model.type !== 'markdown' ||
            activeCell.model.getMetadata('frozen') !== true) {
            return;
        }
        activeCell.rendered = true;
        if (this.notebook.content.mode === 'edit') {
            this.notebook.content.mode = 'command';
        }
    }
    _findEventCell(target) {
        if (!(target instanceof Node)) {
            return null;
        }
        for (const cell of this.notebook.content.widgets) {
            if (cell.node.contains(target)) {
                return cell;
            }
        }
        return null;
    }
    render() {
        /**
         * Render the widget.
         *
         * @returns The rendered JSX element.
         */
        return react__WEBPACK_IMPORTED_MODULE_2___default().createElement(FreezeComponent, { notebook: this.notebook });
    }
}
// Create a copy of the original execute
const execute = _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_0__.CodeCell.execute;
// Overwrite the execute function to intercept executions using the old execute function
_jupyterlab_cells__WEBPACK_IMPORTED_MODULE_0__.CodeCell.execute = async function (cell, sessionContext, metadata) {
    /**
     * Execute a code cell, intercepting the execution if the cell is frozen.
     *
     * @param cell - The code cell to execute.
     * @param sessionContext - The session context to execute the cell in.
     * @param metadata - The metadata for the cell.
     * @returns A promise that resolves with the execution reply message, or void if the cell is frozen.
     */
    if (cell.model.getMetadata('frozen')) {
        return;
    }
    return execute(cell, sessionContext, metadata);
};


/***/ },

/***/ "./lib/index.js"
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/settingregistry */ "webpack/sharing/consume/default/@jupyterlab/settingregistry");
/* harmony import */ var _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _freeze__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./freeze */ "./lib/freeze.js");
/*
 * Licensed under the BSD 3-Clause License.
 *
 * Original work Copyright (c) 2023 Datadog, Inc.
 * Modifications Copyright (c) 2026 Marcus D. Bloice.
 */



const PLUGIN_ID = 'jupyterlab_freeze:plugin';
const FREEZE_KEY = '--jp-freeze-frozen-bg';
const READONLY_KEY = '--jp-freeze-readonly-bg';
/**
 * Initialization data for the jupyterlab-freeze extension.
 */
const plugin = {
    id: PLUGIN_ID,
    description: 'Jupyterlab version of freeze extension',
    autoStart: true,
    requires: [_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_1__.INotebookTracker, _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_0__.ISettingRegistry],
    activate: (app, notebookTracker, settingRegistry) => {
        console.log('JupyterLab extension jupyterlab_freeze is activated!');
        let frozen_bg = null;
        let readonly_bg = null;
        /**
         * Load the settings for this extension
         *
         * @param setting Extension settings
         */
        function loadSetting(setting) {
            frozen_bg = setting.get(FREEZE_KEY).composite;
            readonly_bg = setting.get(READONLY_KEY).composite;
            document.documentElement.style.setProperty(FREEZE_KEY, frozen_bg);
            document.documentElement.style.setProperty(READONLY_KEY, readonly_bg);
        }
        Promise.all([app.restored, settingRegistry.load(PLUGIN_ID)])
            .then(([, setting]) => {
            loadSetting(setting);
            setting.changed.connect(loadSetting);
        })
            .catch(reason => {
            console.error(`jupyterlab_freeze: Something went wrong when reading the settings.\n${reason}`);
        });
        notebookTracker.widgetAdded.connect((_, notebookPanel) => {
            // Retrieve notebook toolbar
            const notebookToolbar = notebookPanel.toolbar;
            // Create the widget
            const freezeWidget = new _freeze__WEBPACK_IMPORTED_MODULE_2__.FreezeWidget(notebookPanel);
            // Add the widget to the toolbar
            notebookToolbar.addItem('freeze', freezeWidget);
            notebookPanel.disposed.connect(() => {
                freezeWidget.dispose();
            });
        });
        // Add command for freezing/unfreezing cells for keyboard shortcut
        app.commands.addCommand('notebook:toggle-cell-freeze', {
            label: 'Freeze/Unfreeze Cell',
            execute: () => {
                const notebookPanel = notebookTracker.currentWidget;
                if (notebookPanel) {
                    (0,_freeze__WEBPACK_IMPORTED_MODULE_2__.changeState)('frozen', notebookPanel);
                }
            },
            isEnabled: () => !!notebookTracker.currentWidget
        });
        // Add command for setting cells to read-only for keyboard shortcut
        app.commands.addCommand('notebook:toggle-cell-read-only', {
            label: 'Set Cell to Read-Only or Back to Editable',
            execute: () => {
                const notebookPanel = notebookTracker.currentWidget;
                if (notebookPanel) {
                    (0,_freeze__WEBPACK_IMPORTED_MODULE_2__.changeState)('read_only', notebookPanel);
                }
            },
            isEnabled: () => !!notebookTracker.currentWidget
        });
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (plugin);


/***/ }

}]);
//# sourceMappingURL=lib_index_js.93e1146bc28714789c87.js.map