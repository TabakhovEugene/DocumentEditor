import React from 'react';
import type { Block } from '../types/types';
import './Navigator.css';

interface NavigatorProps {
  blocks: Block[];
}

const Navigator: React.FC<NavigatorProps> = ({ blocks }) => {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  let imageCounter = 0;

  const getBlockLabel = (block: Block): string => {
    switch (block.type) {
      case 'heading':
        return block.content || 'Пустой заголовок';
      case 'paragraph':
        return block.content ? `${block.content.substring(0, 30)}...` : 'Пустой абзац';
      case 'list':
        return block.content ? `${block.content.substring(0, 30)}...` : 'Пустой список';
      case 'image':
        imageCounter++;
        return `Рисунок ${imageCounter} — ${block.caption || 'Без названия'}`;
      default:
        return 'Другой элемент';
    }
  };

  return (
    <div className="navigator">
      <h3 className="navigator-title">Содержание</h3>
      <ul className="navigator-list">
        {blocks.map((block) => (
          <li key={block.id} className="navigator-item">
            <button
              onClick={() => handleScrollTo(block.id)}
              className={`navigator-link navigator-link--${block.type}`}
            >
              {getBlockLabel(block)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Navigator;