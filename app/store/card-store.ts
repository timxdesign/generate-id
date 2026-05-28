'use client';

import { create } from 'zustand';
import { type CardStyle, type StyleColors, getStyleById } from '../lib/styles';

export type Orientation = 'landscape' | 'portrait';

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

type TextFieldKey =
  | 'fullName'
  | 'title'
  | 'organization'
  | 'idNumber'
  | 'department'
  | 'contactEmail'
  | 'phone';

interface CardState {
  fullName: string;
  title: string;
  organization: string;
  idNumber: string;
  department: string;
  contactEmail: string;
  phone: string;
  photoUrl: string | null;
  style: CardStyle;
  orientation: Orientation;
  colors: StyleColors;
  customFields: CustomField[];
  previewStyle: CardStyle | null;
}

interface CardActions {
  setField: (field: TextFieldKey, value: string) => void;
  setPhoto: (url: string | null) => void;
  setStyle: (style: CardStyle) => void;
  setOrientation: (orientation: Orientation) => void;
  setColor: (key: keyof StyleColors, value: string) => void;
  resetColors: () => void;
  addCustomField: () => void;
  updateCustomField: (id: string, key: 'label' | 'value', value: string) => void;
  removeCustomField: (id: string) => void;
  setPreviewStyle: (style: CardStyle | null) => void;
}

const initialStyle = getStyleById('fancy');

export type CardStore = CardState & CardActions;

export const useCardStore = create<CardStore>((set, get) => ({
  fullName: 'Alex Morgan',
  title: 'Creative Director',
  organization: 'Studio Noir',
  idNumber: 'ID-2024-0471',
  department: 'Design',
  contactEmail: 'alex@studionoir.co',
  phone: '+1 (555) 042-8890',
  photoUrl: null,
  style: 'fancy',
  orientation: 'landscape',
  colors: { ...initialStyle.defaults },
  customFields: [],
  previewStyle: null,

  setField: (field, value) => set({ [field]: value }),
  setPhoto: (url) => set({ photoUrl: url }),
  setStyle: (style) => {
    const def = getStyleById(style);
    set({ style, colors: { ...def.defaults } });
  },
  setPreviewStyle: (style) => set({ previewStyle: style }),
  setOrientation: (orientation) => set({ orientation }),
  setColor: (key, value) =>
    set((s) => ({ colors: { ...s.colors, [key]: value } })),
  resetColors: () => {
    const def = getStyleById(get().style);
    set({ colors: { ...def.defaults } });
  },
  addCustomField: () =>
    set((s) => ({
      customFields: [
        ...s.customFields,
        { id: crypto.randomUUID(), label: '', value: '' },
      ],
    })),
  updateCustomField: (id, key, value) =>
    set((s) => ({
      customFields: s.customFields.map((f) =>
        f.id === id ? { ...f, [key]: value } : f,
      ),
    })),
  removeCustomField: (id) =>
    set((s) => ({
      customFields: s.customFields.filter((f) => f.id !== id),
    })),
}));