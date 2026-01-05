import React from "react";

interface ModalShellProps {
  isOpen?: boolean;
  overlayClassName: string;
  containerClassName: string;
  overlayStyle?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  onOverlayClick?: () => void;
  overlayExtras?: React.ReactNode;
  children: React.ReactNode;
}

const ModalShell: React.FC<ModalShellProps> = ({
  isOpen = true,
  overlayClassName,
  containerClassName,
  overlayStyle,
  containerStyle,
  onOverlayClick,
  overlayExtras,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={overlayClassName}
      style={overlayStyle}
      onClick={onOverlayClick}
    >
      {overlayExtras}
      <div
        className={containerClassName}
        style={containerStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalShell;
