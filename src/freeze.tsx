/* 
  Unless explicitly stated otherwise all files in this repository are licensed under the BSD 3-Clause License.
  This product includes software developed at Datadog (https://www.datadoghq.com/) Copyright 2023 Datadog, Inc.
*/

import { ISessionContext } from '@jupyterlab/apputils';
import { Cell, CodeCell, ICellModel, MarkdownCell } from '@jupyterlab/cells';
import { IChangedArgs } from '@jupyterlab/coreutils';
import { Notebook, NotebookPanel } from '@jupyterlab/notebook';
import { KernelMessage } from '@jupyterlab/services';
import { ReactWidget } from '@jupyterlab/ui-components';
import { JSONObject } from '@lumino/coreutils';
import React from 'react';
import { FaAsterisk, FaLock, FaLockOpen } from 'react-icons/fa';

type CellState = 'normal' | 'read_only' | 'frozen';

function getState(cell: Cell): CellState {
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

function isSupportedCellType(cell: Cell<ICellModel>): boolean {
  return cell.model.type === 'code' || cell.model.type === 'markdown';
}

function updateMetadata(state: CellState, cell: Cell<ICellModel>) {
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

export function changeState(state: CellState, notebookPanel: NotebookPanel) {
  const notebook = notebookPanel.content;
  notebook.selectedCells.forEach(currentCell => {
    const currentState = getState(currentCell);
    const newState: CellState = currentState === state ? 'normal' : state;
    updateMetadata(newState, currentCell);
  });
  notebookPanel.update();
}

const FreezeComponent = (props: {
  // Taking a NotebookPanel rather than an INotebookTracker here simplifies the necessary state management
  // since we're always operating in the context of this particular notebook
  notebook: NotebookPanel;
}): JSX.Element => {
  /**
   * Component for freezing cells in a notebook.
   *
   * @param props - The properties for the component.
   * @returns The rendered JSX element.
   */

  return (
    <>
      <div title="Lift restrictions from selected cells">
        <button
          className="jp-ToolbarButtonComponent jp-mod-minimal jp-Button"
          aria-pressed="false"
          aria-disabled="false"
          onClick={() => changeState('normal', props.notebook)}
        >
          <FaLockOpen />
        </button>
      </div>
      <div title="Make selected cells read-only">
        <button
          className="jp-ToolbarButtonComponent jp-mod-minimal jp-Button"
          aria-pressed="false"
          aria-disabled="false"
          onClick={() => changeState('read_only', props.notebook)}
        >
          <FaLock />
        </button>
      </div>
      <div title="Freeze selected cells">
        <button
          className="jp-ToolbarButtonComponent jp-mod-minimal jp-Button"
          aria-pressed="false"
          aria-disabled="false"
          onClick={() => changeState('frozen', props.notebook)}
        >
          <FaAsterisk />
        </button>
      </div>
    </>
  );
};

export class FreezeWidget extends ReactWidget {
  /**
   * A JupyterLab widget that allows users to freeze cells in a notebook.
   */

  notebook: NotebookPanel;
  private readonly _onDblClickCapture: (event: MouseEvent) => void;
  private readonly _onKeyDownCapture: (event: KeyboardEvent) => void;

  constructor(notebook: NotebookPanel) {
    /**
     * Construct a new FreezeWidget.
     *
     * @param notebook - The notebook to use.
     */
    super();
    this.notebook = notebook;
    this._onDblClickCapture = this._handleDblClickCapture.bind(this);
    this._onKeyDownCapture = this._handleKeyDownCapture.bind(this);
    this.notebook.content.node.addEventListener(
      'dblclick',
      this._onDblClickCapture,
      true
    );
    this.notebook.content.node.addEventListener(
      'keydown',
      this._onKeyDownCapture,
      true
    );
    this.notebook.content.activeCellChanged.connect(
      this._onActiveCellChanged,
      this
    );
    this.notebook.content.stateChanged.connect(this._onStateChanged, this);
    this.notebook.context.ready.then(() => {
      const content = this.notebook.content;
      const length: number = content.model?.cells.length || 0;
      // Loop through each cell in the notebook
      for (let i = 0; i < length; i++) {
        const cell = content.widgets[i];
        const state = getState(cell);
        updateMetadata(state, cell);
      }
      this.notebook.update();
    });
  }

  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    this.notebook.content.node.removeEventListener(
      'dblclick',
      this._onDblClickCapture,
      true
    );
    this.notebook.content.node.removeEventListener(
      'keydown',
      this._onKeyDownCapture,
      true
    );
    this.notebook.content.activeCellChanged.disconnect(
      this._onActiveCellChanged,
      this
    );
    this.notebook.content.stateChanged.disconnect(this._onStateChanged, this);
    super.dispose();
  }

  private _handleDblClickCapture(event: MouseEvent): void {
    const cell = this._findEventCell(event.target);
    if (!cell || cell.model.type !== 'markdown') {
      return;
    }

    if (cell.model.getMetadata('frozen') === true) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private _handleKeyDownCapture(event: KeyboardEvent): void {
    if (
      event.key !== 'Enter' ||
      event.shiftKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    ) {
      return;
    }

    const activeCell = this.notebook.content.activeCell;
    if (
      activeCell?.model.type === 'markdown' &&
      activeCell.model.getMetadata('frozen') === true
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  private _onActiveCellChanged(_: Notebook, __: Cell | null): void {
    // Notebook may unrender markdown later in the same event turn.
    queueMicrotask(() => this._enforceFrozenMarkdownView());
  }

  private _onStateChanged(
    _: Notebook,
    args: IChangedArgs<unknown, unknown, string>
  ): void {
    if (args.name === 'mode' && args.newValue === 'edit') {
      this._enforceFrozenMarkdownView();
    }
  }

  private _enforceFrozenMarkdownView(): void {
    const activeCell = this.notebook.content.activeCell;
    if (
      !activeCell ||
      activeCell.model.type !== 'markdown' ||
      activeCell.model.getMetadata('frozen') !== true
    ) {
      return;
    }

    (activeCell as MarkdownCell).rendered = true;
    if (this.notebook.content.mode === 'edit') {
      this.notebook.content.mode = 'command';
    }
  }

  private _findEventCell(target: EventTarget | null): Cell<ICellModel> | null {
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

  render(): React.JSX.Element {
    /**
     * Render the widget.
     *
     * @returns The rendered JSX element.
     */

    return <FreezeComponent notebook={this.notebook} />;
  }
}

// Create a copy of the original execute
const execute = CodeCell.execute;

// Overwrite the execute function to intercept executions using the old execute function
CodeCell.execute = async function (
  cell: CodeCell,
  sessionContext: ISessionContext,
  metadata?: JSONObject
): Promise<KernelMessage.IExecuteReplyMsg | void> {
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
