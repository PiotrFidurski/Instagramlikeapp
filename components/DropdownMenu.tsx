// @ts-nocheck
import { SerializedStyles } from "@emotion/react";
import { Menu } from "@headlessui/react";
import { menuCaret, menuItemsWrapper } from "@styled";

interface Props {
  isControlled: boolean;
  isLoading?: boolean;
  data?: any;
  closeMenu?: () => void;
  style?: { caret: SerializedStyles; menu: SerializedStyles };
}

export const DropdownMenu: React.FC<Props> = ({ ...props }) => {
  const { children, isControlled, closeMenu, style } = props;

  return (
    <>
      <div
        css={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 3,
        }}
        onClick={closeMenu!}
      />
      <Menu>
        <div css={{ position: "relative", top: "20px" }}>
          <Menu.Items
            css={[menuItemsWrapper, style?.menu]}
            static={isControlled}
          >
            <div css={[menuCaret, style?.caret!]} />
            <div
              css={{
                position: "relative",
                borderRadius: "3px",
                background: "var(--background-color)",
                overflowY: "auto",
              }}
            >
              <div
                css={{
                  padding: "10px 0",
                  display: "flex",
                  flexDirection: "column",
                  height: "auto",
                  flexGrow: 1,
                }}
              >
                {children}
              </div>
            </div>
          </Menu.Items>
        </div>
      </Menu>
    </>
  );
};
