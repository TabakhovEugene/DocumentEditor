import React from 'react';
import type { Block } from '../types/types';
import BlockComponent from './Block';
import './Editor.css';

interface EditorProps {
  blocks: Block[];
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onMoveBlock: (index: number, direction: 'up' | 'down') => void;
}

const Editor: React.FC<EditorProps> = ({ blocks, onUpdateBlock, onMoveBlock }) => {
  let imageCounter = 0;

  return (
  <div className="editor-workspace">
    {blocks.map((block, index) => {
      if (block.type === 'image') {
        imageCounter++;
      }
      return (
        <BlockComponent
          key={block.id}
          block={block}
          figureNumber={block.type === 'image' ? imageCounter : undefined}
          onUpdate={(updates) => onUpdateBlock(block.id, updates)}
          onMoveUp={index > 0 ? () => onMoveBlock(index, 'up') : undefined}
          onMoveDown={index < blocks.length - 1 ? () => onMoveBlock(index, 'down') : undefined}
        />
      );
    })}
  </div>
  );
};

export default Editor;