import React, { useState, useRef, useEffect } from 'react';
import type { Block } from '../types/types';
import './Block.css';

interface BlockProps {
  block: Block;
  figureNumber?: number; 
  onUpdate: (updates: Partial<Block>) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const BlockComponent: React.FC<BlockProps> = ({ block, figureNumber, onUpdate, onMoveUp, onMoveDown }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(block.content);
  const [editCaption, setEditCaption] = useState<string>(block.caption || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(block.content);
    setEditCaption(block.caption || '');
  }, [block.content, block.caption]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [isEditing, block.type]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const selectedFile = files[0];
      const localImageUrl = URL.createObjectURL(selectedFile);
      setEditValue(localImageUrl);
    }
  };

  const handleSaveText = () => {
    setIsEditing(false);
    if (editValue.trim() !== block.content) {
      onUpdate({content: editValue});
    }
  };

  const handleSaveImage = () => {
    setIsEditing(false);
    if (editValue.trim() !== block.content || editCaption.trim() !== block.caption) {
      onUpdate({ content: editValue, caption: editCaption });
    }
  };

  const handleCancel = () => {
    setEditValue(block.content);
    setEditCaption(block.caption || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && block.type === 'heading') {
      e.preventDefault();
      handleSaveText();
    }
    if (e.key === 'Escape') {
      setEditValue(block.content);
      setIsEditing(false);
    }
  };

  if (isEditing && block.type === 'image') {
    return (
      <div className="text-block text-block--editing image-editor">
        
        <div className="image-editor-preview">
          <img 
            src={editValue} 
            alt="Предпросмотр" 
          />
        </div>
        
        <div className="image-editor-fields">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <button 
            type="button"
            className="btn-choose-file"
            onClick={() => fileInputRef.current?.click()}
          >
            Выбрать изображение
          </button>

          <input
            className="block-input"
            value={editCaption}
            onChange={(e) => setEditCaption(e.target.value)}
            placeholder="Подпись к рисунку"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveImage();
              if (e.key === 'Escape') handleCancel();
            }}
          />
        </div>
        
        <div className="image-editor-actions">
          <button className="btn-save" onClick={handleSaveImage}>Сохранить</button>
          <button className="btn-cancel" onClick={handleCancel}>Отмена</button>
        </div>
      </div>
    );
  }

  if (isEditing && block.type !== 'image') {
    return (
      <div className="text-block text-block--editing">
        <textarea
          ref={textareaRef}
          className={`block-input block-input--${block.type}`}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSaveText}
          onKeyDown={handleKeyDown}
          rows={block.type === 'heading' ? 2 : 10}
        />
        <div className="block-editing-tip">
          {block.type !== 'list' ? 'Enter для сохранения, Esc для отмены' : 'Esc для отмены'}
        </div>
      </div>
    );
  }

  return (
    <div
      id={block.id}
      className={`text-block text-block--view text-block--${block.type}`}
      onClick={() => setIsEditing(true)}
      title="Кликните для редактирования"
    >
      <div className="block-controls">
        <button 
          className="btn-move" 
          onClick={(e) => { e.stopPropagation(); onMoveUp?.(); }}
          disabled={!onMoveUp}
          title="Переместить вверх"
        >
          ↑
        </button>
        <button 
          className="btn-move" 
          onClick={(e) => { e.stopPropagation(); onMoveDown?.(); }}
          disabled={!onMoveDown}
          title="Переместить вниз"
        >
          ↓
        </button>
      </div>
      {block.type === 'heading' && <h1>{block.content}</h1>}
      {block.type === 'paragraph' && <p>{block.content}</p>}
      {block.type === 'list' && (
        <ul className="block-list">
          {block.content
            .split('\n')
            .filter(line => line.trim() !== '')
            .map((item, i) => (
              <li key={i}>{item}</li>
            ))
          }
        </ul>
      )}
      {block.type === 'image' && (
        <figure className="block-figure">
          <div className="block-image-wrapper">
            <img src={block.content} alt={block.caption || 'Технический рисунок'} />
          </div>
          <figcaption className="block-figcaption">
            Рисунок {figureNumber} — {block.caption || 'Без названия'}
          </figcaption>
        </figure>
      )}
    </div>
  );
};

export default BlockComponent;