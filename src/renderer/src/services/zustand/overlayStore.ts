import color from '@assets/styles/color';
import { CSSObject, Theme } from '@emotion/react';
import { ReactNode } from 'react';
import { create } from 'zustand';

interface ModalOptions {
  modalProps?: any;
  modalStyle?: CSSObject;
}
interface OverlayState {
  visible: boolean;
  options: ModalOptions;
  close: () => void;
  modal: (
    children: ReactNode,
    headerTitle: string,
    options?: ModalOptions,
  ) => { open: () => void; close: () => void };
  children?: ReactNode;
  headerTitle: string;
}
const defaultModalStyle: CSSObject = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75%',
  border: 'none',
  borderRadius: 20,
  overflow: 'hidden',
};
const defaultModalProps: any = {};

export const useOverlayStore = create<OverlayState>((set) => ({
  headerTitle: '',
  options: {
    modalProps: defaultModalProps,
    modalStyle: defaultModalStyle,
  },
  visible: false,
  close: () =>
    set(() => ({
      visible: false,
      options: {
        modalProps: defaultModalProps,
        modalStyle: defaultModalStyle,
      },
    })),
  modal: (children, headerTitle, options) => {
    set((state) => ({
      children,
      headerTitle,
      options: {
        modalProps: { ...state.options.modalProps, ...options?.modalProps },
        modalStyle: { ...state.options.modalStyle, ...options?.modalStyle },
      },
    }));
    return {
      open: () => set(() => ({ visible: true })),
      close: () => set(() => ({ visible: false })),
    };
  },
}));
