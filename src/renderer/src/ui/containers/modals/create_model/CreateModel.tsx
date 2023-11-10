import Modal from '@mui/material/Modal';
import './style/index.scss';
import { ReactNode } from 'react';
import Header from '@components/header';
import color from '@assets/styles/color';

interface ModelProps {
  title: string;
  open: boolean;
  children: ReactNode;
  controls?: ReactNode | ReactNode[];
  handleClose: () => void;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function CreateModel({
  open,
  handleClose,
  title,
  children,
  controls,
  width = 'fit-content',
  height = 'fit-content',
  className,
}: ModelProps) {
  return (
    <Modal open={open} onClose={handleClose} disableAutoFocus className="modal">
      <div
        css={{
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: width,
          height: height,
          border: 'none',
          borderRadius: 20,
          overflow: 'hidden',
        }}
        className={`modal-container-box`}
      >
        <Header
          title={{
            text: title,
            fontColor: color.white,
            fontSize: 22,
            fontWeight: 600,
          }}
          padding={'10px 20px'}
          backgroundColor={color.primary}
        />
        <div className={`modal-content ${className}`}>
          {children}
          {controls && (
            <div
              className="controls-container"
              css={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '10px 20px',
                flexDirection: 'row',
                gap: 10,
              }}
            >
              {controls}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
